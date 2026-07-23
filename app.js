import { getRandomWordPair, ROLE_PRESETS, SCORE } from "./words.js";

/* ═══════════════════════════════════════════════════════════
   Undercover — game engine
   Aligned with classic Undercover / Who is the Spy rules.
   ═══════════════════════════════════════════════════════════ */

const ROLES = {
  CIVILIAN: "Civilian",
  UNDERCOVER: "Undercover",
  MR_WHITE: "Mr. White",
};

const AVATAR_COLORS = [
  "#FF453A", "#FF9F0A", "#FFD60A", "#30D158",
  "#64D2FF", "#0A84FF", "#5E5CE6", "#BF5AF2",
  "#FF375F", "#AC8E68",
];

const VIEW_ORDER = ["setup", "players", "reveal", "game", "voting", "gameover"];

const state = {
  config: { civilians: 3, undercovers: 1, mrWhite: 0 },
  totalPlayers: 4,
  difficulty: "All",
  players: [], // { id, name, role, word, status }
  words: { civilian: "", undercover: "", genre: "" },
  revealIndex: 0,
  revealOrder: [],
  turnOrder: [],
  currentTurnIndex: 0,
  roundsElapsed: 0,
  winner: null,
  mrWhiteGuessing: null,
  scores: loadScores(),
  currentView: "setup",
  timerInterval: null,
  turnTime: 0,
  recordedTimes: {},
  savedNames: [],
};

/* ── Persistence ────────────────────────────────────────── */
function loadScores() {
  try {
    return JSON.parse(localStorage.getItem("uc_scores") || "{}");
  } catch {
    return {};
  }
}
function saveScores() {
  localStorage.setItem("uc_scores", JSON.stringify(state.scores));
}

/* ── Utils ──────────────────────────────────────────────── */
function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c])
  );
}
/* ── Cryptographic Randomness (CSPRNG) & Fair Role Distribution ── */
function secureRandomInt(max) {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(array);
  } else {
    array[0] = Math.floor(Math.random() * max);
  }
  return array[0] % max;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const STORAGE_KEY_ROLE_HISTORY = "undercover_role_history_v2";

function loadRoleHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROLE_HISTORY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveRoleHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY_ROLE_HISTORY, JSON.stringify(history));
  } catch (e) {}
}

function clearRoleHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY_ROLE_HISTORY);
  } catch (e) {}
}

/**
 * Robust Cryptographic Random Role Allocation with Light Anti-Loop Guard.
 * Uses Web Crypto API (CSPRNG) Fisher-Yates shuffle.
 * Allows pure random back-to-back role repeats (e.g. 2x in a row for fun),
 * but prevents a player from getting stuck in a 3+ game loop.
 */
function allocateFairRoles(playerNames, config) {
  const history = loadRoleHistory();

  // Create base role deck
  const deck = [];
  for (let i = 0; i < config.civilians; i++) deck.push(ROLES.CIVILIAN);
  for (let i = 0; i < config.undercovers; i++) deck.push(ROLES.UNDERCOVER);
  for (let i = 0; i < config.mrWhite; i++) deck.push(ROLES.MR_WHITE);

  // Pure Cryptographic Fisher-Yates Shuffle using Web Crypto API
  shuffle(deck);

  // Light Anti-Loop Guard: Prevent 3+ consecutive games as Undercover/Mr.White for the same player
  playerNames.forEach((name, idx) => {
    const key = name.trim().toLowerCase();
    const stats = history[key] || { streak: 0 };
    const isAssignedSpecial = deck[idx] !== ROLES.CIVILIAN;

    // If player has already been special 2 games in a row, and is assigned special again (3rd time)
    if (stats.streak >= 2 && isAssignedSpecial) {
      // Find a civilian slot to swap with
      const swapIdx = deck.findIndex((role, i) => {
        if (role !== ROLES.CIVILIAN) return false;
        const otherKey = playerNames[i].trim().toLowerCase();
        const otherStats = history[otherKey] || { streak: 0 };
        return (otherStats.streak || 0) < 2;
      });

      if (swapIdx !== -1) {
        [deck[idx], deck[swapIdx]] = [deck[swapIdx], deck[idx]];
      }
    }
  });

  // Update history streak count
  playerNames.forEach((name, idx) => {
    const key = name.trim().toLowerCase();
    const stats = history[key] || { streak: 0 };
    if (deck[idx] !== ROLES.CIVILIAN) {
      stats.streak = (stats.streak || 0) + 1;
    } else {
      stats.streak = 0; // reset streak when player gets Civilian
    }
    history[key] = stats;
  });

  saveRoleHistory(history);
  return deck;
}
function colorFor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}
function initial(name) {
  return (name || "?").charAt(0).toUpperCase();
}
function $(id) {
  return document.getElementById(id);
}
function avatarHTML(id, name, sizeClass = "") {
  return `<div class="${sizeClass}" style="background:${colorFor(id)}">${escapeHTML(initial(name))}</div>`;
}

/* ── Views ──────────────────────────────────────────────── */
const views = {
  setup: $("view-setup"),
  players: $("view-players"),
  reveal: $("view-reveal"),
  game: $("view-game"),
  voting: $("view-voting"),
  gameover: $("view-gameover"),
};

function switchView(name) {
  if (state.currentView === name) return;
  const prev = state.currentView;
  const prevEl = views[prev];
  const nextEl = views[name];

  nextEl.hidden = false;
  nextEl.classList.remove("active", "exit-left");
  // force reflow for enter animation
  void nextEl.offsetWidth;
  nextEl.classList.add("active");

  if (prevEl) {
    prevEl.classList.remove("active");
    prevEl.classList.add("exit-left");
    setTimeout(() => {
      if (state.currentView === name) {
        prevEl.hidden = true;
        prevEl.classList.remove("exit-left");
      }
    }, 450);
  }

  state.currentView = name;
}

/* ── Setup ──────────────────────────────────────────────── */
function syncSetupUI() {
  $("civilians-display").textContent = state.config.civilians;
  $("undercovers-display").textContent = state.config.undercovers;
  $("mrwhite-display").textContent = state.config.mrWhite;
  state.totalPlayers =
    state.config.civilians + state.config.undercovers + state.config.mrWhite;
  $("total-players").textContent = state.totalPlayers;
  validateSetup();
}

function validateSetup() {
  const total = state.totalPlayers;
  const specials = state.config.undercovers + state.config.mrWhite;
  const warn = $("setup-warning");
  const btn = $("btn-next-players");
  let msg = "";

  if (total < 3) msg = "Need at least 3 players.";
  else if (total > 12) msg = "Maximum 12 players for a single device.";
  else if (state.config.undercovers + state.config.mrWhite < 1)
    msg = "Add at least one Undercover or Mr. White.";
  else if (state.config.civilians <= specials)
    msg = "Civilians must outnumber special roles (classic balance).";

  if (msg) {
    warn.textContent = msg;
    warn.classList.remove("hidden");
    btn.disabled = true;
  } else {
    warn.classList.add("hidden");
    btn.disabled = false;
  }
}

function updateRole(role, delta) {
  if (role === "civilians")
    state.config.civilians = Math.max(1, state.config.civilians + delta);
  else if (role === "undercovers")
    state.config.undercovers = Math.max(0, state.config.undercovers + delta);
  else if (role === "mrwhite")
    state.config.mrWhite = Math.max(0, state.config.mrWhite + delta);
  syncSetupUI();
}

function changeTotalPlayers(delta) {
  const next = Math.min(12, Math.max(3, state.totalPlayers + delta));
  if (next === state.totalPlayers) return;
  // Prefer balanced preset when available
  const preset = ROLE_PRESETS[next];
  if (preset) {
    state.config = { ...preset };
  } else {
    // Adjust civilians to match delta
    state.config.civilians = Math.max(
      1,
      state.config.civilians + (next - state.totalPlayers)
    );
  }
  syncSetupUI();
}

function applyPreset() {
  const preset = ROLE_PRESETS[state.totalPlayers];
  if (preset) {
    state.config = { ...preset };
    syncSetupUI();
  }
}

/* ── Players ────────────────────────────────────────────── */
function goToPlayers() {
  const total = state.totalPlayers;
  $("player-count-display").textContent = total;
  const container = $("player-inputs-container");
  container.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const saved = state.savedNames[i] || "";
    const row = document.createElement("div");
    row.className = "name-row";
    row.innerHTML = `
      <span class="name-idx">${i + 1}</span>
      <div class="name-avatar" style="background:${colorFor(i)}">${escapeHTML(
      (saved || `P`).charAt(0).toUpperCase()
    )}</div>
      <input type="text" class="name-input player-name-input" value="${escapeHTML(
        saved
      )}" placeholder="Player ${i + 1}" maxlength="20" autocomplete="off" data-idx="${i}">
    `;
    container.appendChild(row);
  }

  container.querySelectorAll(".name-input").forEach((input) => {
    input.addEventListener("input", () => {
      const av = input.parentElement.querySelector(".name-avatar");
      const v = input.value.trim();
      av.textContent = (v || "P").charAt(0).toUpperCase();
    });
  });

  $("players-warning").classList.add("hidden");
  switchView("players");
}

/* ── Start game ─────────────────────────────────────────── */
function startGame(useSavedNames = false) {
  let names;

  if (useSavedNames && state.savedNames.length === state.totalPlayers) {
    names = [...state.savedNames];
  } else {
    const inputs = document.querySelectorAll(".player-name-input");
    if (!inputs.length && state.savedNames.length) {
      names = [...state.savedNames];
      // pad / trim
      while (names.length < state.totalPlayers) names.push(`Player ${names.length + 1}`);
      names = names.slice(0, state.totalPlayers);
    } else {
      names = Array.from(inputs).map(
        (el, i) => el.value.trim() || `Player ${i + 1}`
      );
    }
  }

  // Duplicate check
  const seen = new Set();
  for (const n of names) {
    const key = n.toLowerCase();
    if (seen.has(key)) {
      const w = $("players-warning");
      if (w) {
        w.textContent = "Each player needs a unique name.";
        w.classList.remove("hidden");
      }
      if (state.currentView !== "players") switchView("players");
      return;
    }
    seen.add(key);
  }

  state.savedNames = [...names];

  // Science-Backed Fair Role Assignment (CSPRNG + Anti-Streak Balance)
  const assignedRoles = allocateFairRoles(names, state.config);

  const pair = getRandomWordPair(state.difficulty);
  state.words = {
    civilian: pair.wordA,
    undercover: pair.wordB,
    genre: pair.genre,
  };

  state.players = names.map((name, index) => {
    const role = assignedRoles[index];
    let word = "";
    if (role === ROLES.CIVILIAN) word = state.words.civilian;
    else if (role === ROLES.UNDERCOVER) word = state.words.undercover;
    else word = "—"; // Mr. White sees blank

    return { id: index, name, role, word, status: "alive" };
  });

  // Ensure scores keys exist
  names.forEach((n) => {
    if (state.scores[n] === undefined) state.scores[n] = 0;
  });

  state.roundsElapsed = 0;
  state.revealIndex = 0;
  state.revealOrder = shuffle(state.players.map((p) => p.id));
  state.winner = null;
  state.mrWhiteGuessing = null;
  state.recordedTimes = {};

  setupReveal();
  switchView("reveal");
}

/* ── Reveal ─────────────────────────────────────────────── */
function setupReveal() {
  const card = $("reveal-card");
  card.classList.remove("flipped");
  $("btn-next-reveal").classList.add("invisible");

  const pid = state.revealOrder[state.revealIndex];
  const player = state.players.find((p) => p.id === pid);

  $("reveal-player-name").textContent = player.name;

  // Progress pips
  const prog = $("reveal-progress");
  prog.innerHTML = state.players
    .map(
      (_, i) =>
        `<span class="pip ${
          i < state.revealIndex ? "done" : i === state.revealIndex ? "current" : ""
        }"></span>`
    )
    .join("");

  const chip = $("reveal-role-chip");
  const genreEl = $("reveal-genre");
  if (genreEl) {
    genreEl.textContent = state.words.genre ? `Category: ${state.words.genre}` : "";
  }

  if (player.role === ROLES.MR_WHITE) {
    $("reveal-role-title").textContent = "Your role";
    $("reveal-word").textContent = "Mr. White";
    chip.textContent = "No word — listen carefully";
    chip.className = "secret-chip role-mrwhite";
  } else {
    $("reveal-role-title").textContent = "Your word";
    $("reveal-word").textContent = player.word;
    // Intentionally do NOT show "Civilian" vs "Undercover" — classic rule:
    // players only see their word, not their team label.
    chip.textContent = "Memorize, then hide";
    chip.className = "secret-chip";
  }
}

function revealCard() {
  const card = $("reveal-card");
  if (card.classList.contains("flipped")) return;
  card.classList.add("flipped");
  setTimeout(() => $("btn-next-reveal").classList.remove("invisible"), 550);
}

function nextReveal() {
  $("reveal-card").classList.remove("flipped");
  $("btn-next-reveal").classList.add("invisible");
  setTimeout(() => {
    state.revealIndex++;
    if (state.revealIndex < state.players.length) setupReveal();
    else startCluePhase();
  }, 280);
}

/* ── Clue / Now Playing ─────────────────────────────────── */
function startCluePhase() {
  state.roundsElapsed++;
  const living = state.players.filter((p) => p.status === "alive");
  state.turnOrder = shuffle(living.map((p) => p.id));
  state.currentTurnIndex = 0;
  state.recordedTimes = {};
  updateGameView();
  switchView("game");
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function updateGameView() {
  const currentId = state.turnOrder[state.currentTurnIndex];
  const current = state.players.find((p) => p.id === currentId);
  const living = state.players.filter((p) => p.status === "alive");
  const eliminated = state.players.filter((p) => p.status === "eliminated");

  $("round-number").textContent = state.roundsElapsed;
  $("current-player-turn").textContent = current.name;

  const av = $("current-avatar");
  av.textContent = initial(current.name);
  av.style.background = colorFor(current.id);
  // re-trigger animation
  av.style.animation = "none";
  void av.offsetWidth;
  av.style.animation = "";

  // Timer
  clearInterval(state.timerInterval);
  state.turnTime = 0;
  const updateTimerDisplays = () => {
    const timeStr = formatTime(state.turnTime);
    const liveRosterTimer = $("roster-live-timer");
    if (liveRosterTimer) liveRosterTimer.textContent = timeStr;
  };
  updateTimerDisplays();
  state.timerInterval = setInterval(() => {
    state.turnTime++;
    updateTimerDisplays();
  }, 1000);

  // Turn strip
  const strip = $("turn-strip");
  strip.innerHTML = state.turnOrder
    .map((id, idx) => {
      const p = state.players.find((x) => x.id === id);
      let cls = "turn-chip";
      if (idx < state.currentTurnIndex) cls += " done";
      if (idx === state.currentTurnIndex) cls += " active";
      const recTime = state.recordedTimes[p.id];
      const timeDisplay =
        recTime !== undefined
          ? `<span class="tc-time">${formatTime(recTime)}</span>`
          : idx === state.currentTurnIndex
          ? `<span class="tc-time">Speaking</span>`
          : "";
      return `
        <div class="${cls}" role="listitem">
          <div class="tc-avatar" style="background:${colorFor(p.id)}">${escapeHTML(
            initial(p.name)
          )}</div>
          <span class="tc-name">${escapeHTML(p.name)}</span>
          ${timeDisplay}
        </div>`;
    })
    .join("");

  // Living roster
  $("alive-count").textContent = `${living.length} alive`;
  $("living-players-list").innerHTML = living
    .map((p) => {
      const speaking = p.id === currentId;
      const recTime = state.recordedTimes[p.id];
      let badgeHTML = "";
      if (speaking) {
        badgeHTML = `<span class="ri-badge"><span class="ri-dot"></span> NOW <span id="roster-live-timer" class="ri-timer">0:00</span></span>`;
      } else if (recTime !== undefined) {
        badgeHTML = `<span class="ri-time-record">⏱️ ${formatTime(recTime)}</span>`;
      }
      return `
      <li class="roster-item ${speaking ? "speaking" : ""}">
        <div class="ri-avatar" style="background:${colorFor(p.id)}">${escapeHTML(
          initial(p.name)
        )}</div>
        <span class="ri-name">${escapeHTML(p.name)}</span>
        ${badgeHTML}
      </li>`;
    })
    .join("");

  // Eliminated
  const block = $("eliminated-block");
  if (eliminated.length) {
    block.classList.remove("hidden");
    $("eliminated-players-list").innerHTML = eliminated
      .map(
        (p) => `
      <li class="roster-item">
        <div class="ri-avatar" style="background:${colorFor(p.id)}">${escapeHTML(
          initial(p.name)
        )}</div>
        <span class="ri-name">${escapeHTML(p.name)}</span>
        <span class="role-tag ${roleClass(p.role)}">${escapeHTML(p.role)}</span>
      </li>`
      )
      .join("");
  } else {
    block.classList.add("hidden");
  }

  const isLast = state.currentTurnIndex >= state.turnOrder.length - 1;
  $("btn-next-turn").classList.toggle("hidden", isLast);
  $("btn-start-voting").classList.toggle("hidden", !isLast);
}

function roleClass(role) {
  if (role === ROLES.CIVILIAN) return "civilian";
  if (role === ROLES.UNDERCOVER) return "undercover";
  return "mrwhite";
}

function nextTurn() {
  const currentId = state.turnOrder[state.currentTurnIndex];
  if (currentId !== undefined) {
    state.recordedTimes[currentId] = state.turnTime;
  }
  if (state.currentTurnIndex < state.turnOrder.length - 1) {
    state.currentTurnIndex++;
    updateGameView();
  }
}

/* ── Voting ─────────────────────────────────────────────── */
function goToVoting() {
  clearInterval(state.timerInterval);
  const currentId = state.turnOrder[state.currentTurnIndex];
  if (currentId !== undefined && state.turnTime > 0) {
    state.recordedTimes[currentId] = state.turnTime;
  }
  const living = state.players.filter((p) => p.status === "alive");
  $("vote-round-number").textContent = state.roundsElapsed;
  $("votes-needed").textContent = living.length;
  $("votes-cast").textContent = "0";
  $("vote-meter-fill").style.width = "0%";

  const list = $("voting-list");
  list.innerHTML = living
    .map(
      (p) => `
    <div class="vote-row" data-id="${p.id}">
      <div class="vr-avatar" style="background:${colorFor(p.id)}">${escapeHTML(
        initial(p.name)
      )}</div>
      <span class="vr-name">${escapeHTML(p.name)}</span>
      <div class="vote-controls">
        <button type="button" class="vote-minus" data-id="${p.id}" aria-label="Remove vote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg>
        </button>
        <span class="vote-count" id="vote-${p.id}">0</span>
        <button type="button" class="vote-plus" data-id="${p.id}" aria-label="Add vote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>`
    )
    .join("");

  list.querySelectorAll(".vote-minus").forEach((btn) =>
    btn.addEventListener("click", () => changeVote(btn.dataset.id, -1))
  );
  list.querySelectorAll(".vote-plus").forEach((btn) =>
    btn.addEventListener("click", () => changeVote(btn.dataset.id, 1))
  );

  const callout = $("voting-callout");
  callout.classList.add("hidden");
  callout.className = "inline-alert hidden";

  switchView("voting");
}

function changeVote(id, delta) {
  const el = $(`vote-${id}`);
  if (!el) return;
  const living = state.players.filter((p) => p.status === "alive").length;
  let val = parseInt(el.textContent, 10) || 0;
  let newTargetVal = val + delta;

  // Calculate current total votes cast excluding this player's target
  const map = getVoteMap();
  let currentTotalOtherVotes = 0;
  Object.keys(map).forEach((pId) => {
    if (String(pId) !== String(id)) {
      currentTotalOtherVotes += Math.abs(map[pId]);
    }
  });

  const potentialTotal = currentTotalOtherVotes + Math.abs(newTargetVal);

  if (delta > 0 && potentialTotal > living) {
    showVoteAlert(
      `Cannot cast ${potentialTotal} votes. Total votes cannot exceed the number of living players (${living}).`,
      "warn"
    );
    return;
  }

  if (newTargetVal > living - 1) {
    showVoteAlert(`A player can receive at most ${living - 1} votes.`, "warn");
    newTargetVal = living - 1;
  } else if (newTargetVal < -1) {
    showVoteAlert("A player can receive at most -1 negative vote.", "warn");
    newTargetVal = -1;
  } else {
    if (currentTotalOtherVotes + Math.abs(newTargetVal) <= living) {
      $("voting-callout").classList.add("hidden");
    }
  }

  el.textContent = newTargetVal;
  el.classList.toggle("hot", newTargetVal > 0);
  refreshVoteMeter();
  highlightLeader();
}

function getVoteMap() {
  const living = state.players.filter((p) => p.status === "alive");
  const map = {};
  living.forEach((p) => {
    map[p.id] = parseInt($(`vote-${p.id}`).textContent, 10) || 0;
  });
  return map;
}

function refreshVoteMeter() {
  const living = state.players.filter((p) => p.status === "alive").length;
  const map = getVoteMap();
  const cast = Object.values(map).reduce((a, b) => a + Math.abs(b), 0);
  $("votes-cast").textContent = cast;
  $("votes-needed").textContent = living;
  const fill = $("vote-meter-fill");
  const label = document.querySelector(".vote-meter-label");
  const pct = living ? Math.min(100, (cast / living) * 100) : 0;
  fill.style.width = `${pct}%`;

  if (cast > living) {
    if (fill) fill.classList.add("over-budget");
    if (label) label.classList.add("over-budget");
    showVoteAlert(
      `Warning: ${cast} votes cast exceeds total living players (${living}). Excess votes cannot be cast.`,
      "warn"
    );
  } else {
    if (fill) fill.classList.remove("over-budget");
    if (label) label.classList.remove("over-budget");
  }
}

function highlightLeader() {
  const map = getVoteMap();
  let max = -1;
  Object.values(map).forEach((v) => {
    if (v > max) max = v;
  });
  document.querySelectorAll(".vote-row").forEach((row) => {
    const id = row.dataset.id;
    const v = map[id] || 0;
    row.classList.toggle("leading", max > 0 && v === max);
  });
}

function showVoteAlert(msg, type = "") {
  const el = $("voting-callout");
  el.textContent = msg;
  el.className = `inline-alert ${type}`.trim();
  el.classList.remove("hidden");
}

function confirmVotes() {
  const living = state.players.filter((p) => p.status === "alive");
  const map = getVoteMap();
  const totalVotes = Object.values(map).reduce((a, b) => a + Math.abs(b), 0);

  if (totalVotes > living.length) {
    showVoteAlert(
      `Cannot confirm: ${totalVotes} votes cast exceeds total living players (${living.length}). Please adjust votes.`,
      "warn"
    );
    return;
  }

  if (totalVotes !== living.length) {
    showVoteAlert(
      `Cast exactly ${living.length} vote${living.length === 1 ? "" : "s"} (one per living player). Currently ${totalVotes}.`,
      "warn"
    );
    return;
  }

  let maxVotes = -Infinity;
  let candidates = [];
  living.forEach((p) => {
    const v = map[p.id];
    if (v > maxVotes) {
      maxVotes = v;
      candidates = [p];
    } else if (v === maxVotes) {
      candidates.push(p);
    }
  });

  if (maxVotes <= 0) {
    showVoteAlert("Someone must receive at least one positive vote to be eliminated.", "warn");
    return;
  }

  if (candidates.length > 1) {
    const names = candidates.map((c) => c.name).join(", ");
    showVoteAlert(
      `Tie between ${names}. They each give one more clue, then re-vote.`,
      "info"
    );
    return;
  }

  eliminatePlayer(candidates[0]);
}

function eliminatePlayer(player) {
  player.status = "eliminated";

  if (player.role === ROLES.MR_WHITE) {
    state.mrWhiteGuessing = player;
    $("mrwhite-player-name").textContent = player.name;
    $("mrwhite-guess-input").value = "";
    $("mrwhite-feedback").textContent = "";
    openModal("modal-mrwhite");
    setTimeout(() => $("mrwhite-guess-input").focus(), 300);
  } else {
    $("eliminated-title").textContent = `${player.name} is out`;
    $("eliminated-role-info").textContent = `They were a ${player.role}.`;
    $("elim-icon").textContent = player.role === ROLES.UNDERCOVER ? "🕵️" : "✕";
    openModal("modal-eliminated");
  }
}

/* ── Mr. White guess ────────────────────────────────────── */
function normalizeWord(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

/** Simple Levenshtein for near-miss tolerance (1 edit for short words). */
function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function isCorrectGuess(guess, target) {
  const g = normalizeWord(guess);
  const t = normalizeWord(target);
  if (!g) return false;
  if (g === t) return true;
  // Allow singular/plural-ish & small typos
  if (t.startsWith(g) || g.startsWith(t)) {
    if (Math.abs(t.length - g.length) <= 2) return true;
  }
  const maxDist = t.length <= 4 ? 0 : t.length <= 7 ? 1 : 2;
  return editDistance(g, t) <= maxDist;
}

function submitMrWhiteGuess() {
  const guess = $("mrwhite-guess-input").value;
  if (!normalizeWord(guess)) {
    $("mrwhite-feedback").textContent = "Enter a guess.";
    return;
  }

  closeModal("modal-mrwhite");

  if (isCorrectGuess(guess, state.words.civilian)) {
    endGame(ROLES.MR_WHITE, "Mr. White guessed the civilian word.");
  } else {
    $("eliminated-title").textContent = `${state.mrWhiteGuessing.name} guessed wrong`;
    $("eliminated-role-info").textContent = `They were Mr. White. The word was “${state.words.civilian}”.`;
    $("elim-icon").textContent = "✗";
    openModal("modal-eliminated");
  }
}

/* ── Win checks ─────────────────────────────────────────── */
/**
 * Classic rules:
 * - Civilians win when no Undercovers and no Mr. White remain.
 * - Impostors win when living specials >= living civilians
 *   (Undercovers + surviving Mr. White count as specials).
 * - Mr. White solo win only via correct word guess on elimination.
 */
function checkWinCondition() {
  const living = state.players.filter((p) => p.status === "alive");
  const civs = living.filter((p) => p.role === ROLES.CIVILIAN).length;
  const unders = living.filter((p) => p.role === ROLES.UNDERCOVER).length;
  const whites = living.filter((p) => p.role === ROLES.MR_WHITE).length;
  const specials = unders + whites;

  if (specials === 0) {
    endGame(ROLES.CIVILIAN, "All impostors were eliminated.");
  } else if (specials >= civs) {
    // Undercovers take over; surviving Mr. White shares the win thematically
    if (unders > 0) {
      endGame(
        ROLES.UNDERCOVER,
        whites > 0
          ? "Impostors equaled civilians — Undercovers win (Mr. White survived)."
          : "Undercovers equaled or outnumbered the civilians."
      );
    } else {
      // Only Mr. White left as special and matched civs — rare edge
      endGame(
        ROLES.UNDERCOVER,
        "Mr. White survived until the impostors matched the town."
      );
    }
  } else {
    startCluePhase();
  }
}

/* ── End game / Leaderboard ─────────────────────────────── */
function addScore(name, pts) {
  state.scores[name] = (state.scores[name] || 0) + pts;
}

function endGame(winnerRole, reason) {
  clearInterval(state.timerInterval);
  state.winner = winnerRole;

  const badge = $("go-badge");
  const title = $("gameover-winner");
  const reasonEl = $("gameover-reason");

  if (winnerRole === ROLES.CIVILIAN) {
    badge.textContent = "Civilian victory";
    badge.className = "go-badge civilian";
    title.textContent = "Civilians win";
    reasonEl.textContent = reason;
    state.players
      .filter((p) => p.role === ROLES.CIVILIAN)
      .forEach((p) => {
        addScore(p.name, SCORE.CIVILIAN_WIN);
        if (p.status === "alive") addScore(p.name, SCORE.SURVIVAL_BONUS);
      });
  } else if (winnerRole === ROLES.UNDERCOVER) {
    badge.textContent = "Undercover victory";
    badge.className = "go-badge undercover";
    title.textContent = "Undercovers win";
    reasonEl.textContent = reason;
    state.players
      .filter((p) => p.role === ROLES.UNDERCOVER)
      .forEach((p) => addScore(p.name, SCORE.UNDERCOVER_WIN));
    // Surviving Mr. White gets partial credit (aligned with shared impostor win)
    state.players
      .filter((p) => p.role === ROLES.MR_WHITE && p.status === "alive")
      .forEach((p) => addScore(p.name, SCORE.MR_WHITE_SURVIVE_WITH_UC));
  } else if (winnerRole === ROLES.MR_WHITE) {
    badge.textContent = "Mr. White victory";
    badge.className = "go-badge mrwhite";
    title.textContent = "Mr. White wins";
    reasonEl.textContent = reason;
    state.players
      .filter((p) => p.role === ROLES.MR_WHITE)
      .forEach((p) => addScore(p.name, SCORE.MR_WHITE_WIN));
  }

  state.players.forEach((p) => {
    if (state.scores[p.name] === undefined) state.scores[p.name] = 0;
  });
  saveScores();

  $("go-rounds").textContent = state.roundsElapsed;
  $("go-pair").textContent = `${state.words.civilian} / ${state.words.undercover}`;

  renderLeaderboard();
  renderRecap();
  switchView("gameover");
}

function renderLeaderboard() {
  const sorted = state.players
    .map((p) => [p.name, state.scores[p.name] || 0])
    .sort((a, b) => b[1] - a[1]);

  const podium = $("podium");
  const top3 = sorted.slice(0, 3);
  const slots = [];
  if (top3[0]) slots.push({ entry: top3[0], rank: 1, cls: "gold", medal: "🥇" });
  if (top3[1]) slots.push({ entry: top3[1], rank: 2, cls: "silver", medal: "🥈" });
  if (top3[2]) slots.push({ entry: top3[2], rank: 3, cls: "bronze", medal: "🥉" });

  // DOM order: silver | gold | bronze for classic podium
  const visual = [
    slots.find((s) => s.rank === 2),
    slots.find((s) => s.rank === 1),
    slots.find((s) => s.rank === 3),
  ].filter(Boolean);

  podium.innerHTML = visual
    .map((s) => {
      const [name, pts] = s.entry;
      const p = state.players.find((x) => x.name === name);
      const id = p ? p.id : 0;
      return `
        <div class="podium-slot ${s.cls}">
          <div class="p-avatar-wrap">
            <div class="p-avatar" style="background:${colorFor(id)}">${escapeHTML(
              initial(name)
            )}</div>
            <span class="p-badge">${s.medal}</span>
          </div>
          <span class="p-name">${escapeHTML(name)}</span>
          <span class="p-pts">${pts} pts</span>
          <div class="p-pedestal">
            <span class="p-rank">${s.rank}</span>
          </div>
        </div>`;
    })
    .join("");

  // Full list (everyone)
  const lb = $("leaderboard-list");
  lb.innerHTML = sorted
    .map(([name, score], index) => {
      const p = state.players.find((x) => x.name === name);
      const id = p ? p.id : index;
      const rankClass = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "";
      return `
        <div class="lb-row ${rankClass}">
          <span class="lb-rank">${index + 1}</span>
          <div class="lb-avatar" style="background:${colorFor(id)}">${escapeHTML(
            initial(name)
          )}</div>
          <span class="lb-name">${escapeHTML(name)}</span>
          <span class="lb-pts">${score} pts</span>
        </div>`;
    })
    .join("");
}

function renderRecap() {
  $("recap-list").innerHTML = state.players
    .map((p) => {
      const alive = p.status === "alive";
      const wordDisplay =
        p.role === ROLES.MR_WHITE ? "no word" : p.word;
      return `
      <div class="recap-row ${alive ? "" : "out"}">
        <div class="recap-avatar" style="background:${colorFor(p.id)}">${escapeHTML(
          initial(p.name)
        )}</div>
        <div class="recap-info">
          <span class="ri-name">${escapeHTML(p.name)}</span>
          <span class="ri-detail">
            <span class="role-tag ${roleClass(p.role)}">${escapeHTML(p.role)}</span>
            · <strong>${escapeHTML(wordDisplay)}</strong>
          </span>
        </div>
        <span class="status-pill ${alive ? "alive" : "dead"}">${
          alive ? "Alive" : "Out"
        }</span>
      </div>`;
    })
    .join("");
}

/* ── Modals ─────────────────────────────────────────────── */
function openModal(id) {
  $(id).hidden = false;
}
function closeModal(id) {
  $(id).hidden = true;
}

/* ── Reset / rematch ────────────────────────────────────── */
function rematch() {
  // Keep names, config, scores — new roles & words
  startGame(true);
}

function resetToSetup(clearScores = false) {
  clearInterval(state.timerInterval);
  if (clearScores) {
    state.scores = {};
    saveScores();
  }
  clearRoleHistory(); // Clear role streak history when creating a new game
  state.players = [];
  state.words = { civilian: "", undercover: "", genre: "" };
  state.revealIndex = 0;
  state.turnOrder = [];
  state.winner = null;
  state.mrWhiteGuessing = null;
  state.roundsElapsed = 0;
  // Keep config & saved names for convenience
  syncSetupUI();
  switchView("setup");
}

/* ── Theme ──────────────────────────────────────────────── */
function initTheme() {
  clearRoleHistory(); // Clear role streak history on page refresh/boot
  let theme = localStorage.getItem("uc_theme");
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeColor(theme);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("uc_theme", next);
  updateThemeColor(next);
}

function updateThemeColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#F2F2F7" : "#0A0A0C");
}

/* ── Wire events ────────────────────────────────────────── */
function bind() {
  // Setup counters
  $("players-minus").addEventListener("click", () => changeTotalPlayers(-1));
  $("players-plus").addEventListener("click", () => changeTotalPlayers(1));
  $("btn-apply-preset").addEventListener("click", applyPreset);

  $("civilians-minus").addEventListener("click", () => updateRole("civilians", -1));
  $("civilians-plus").addEventListener("click", () => updateRole("civilians", 1));
  $("undercovers-minus").addEventListener("click", () => updateRole("undercovers", -1));
  $("undercovers-plus").addEventListener("click", () => updateRole("undercovers", 1));
  $("mrwhite-minus").addEventListener("click", () => updateRole("mrwhite", -1));
  $("mrwhite-plus").addEventListener("click", () => updateRole("mrwhite", 1));

  $("btn-next-players").addEventListener("click", goToPlayers);
  $("btn-back-setup").addEventListener("click", () => switchView("setup"));
  $("btn-start-game").addEventListener("click", () => startGame(false));

  $("reveal-card").addEventListener("click", revealCard);
  $("btn-next-reveal").addEventListener("click", nextReveal);

  $("btn-next-turn").addEventListener("click", nextTurn);
  $("btn-start-voting").addEventListener("click", goToVoting);
  $("btn-back-clues").addEventListener("click", () => {
    updateGameView();
    switchView("game");
  });
  $("btn-confirm-votes").addEventListener("click", confirmVotes);

  $("btn-finish-game").addEventListener("click", () => openModal("modal-confirm-end"));
  $("btn-cancel-end").addEventListener("click", () => closeModal("modal-confirm-end"));
  const btnNewDeal = $("btn-new-words-deal");
  if (btnNewDeal) {
    btnNewDeal.addEventListener("click", () => {
      closeModal("modal-confirm-end");
      rematch();
    });
  }
  const btnConfirmEnd = $("btn-confirm-end");
  if (btnConfirmEnd) {
    btnConfirmEnd.addEventListener("click", () => {
      closeModal("modal-confirm-end");
      resetToSetup(false);
    });
  }

  $("btn-mrwhite-submit").addEventListener("click", submitMrWhiteGuess);
  $("mrwhite-guess-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitMrWhiteGuess();
  });
  $("btn-continue-game").addEventListener("click", () => {
    closeModal("modal-eliminated");
    checkWinCondition();
  });

  $("btn-rematch").addEventListener("click", rematch);
  $("btn-new-game").addEventListener("click", () => resetToSetup(false));
  $("btn-reset-scores").addEventListener("click", () => {
    if (confirm("Reset all saved scores?")) {
      state.scores = {};
      state.players.forEach((p) => (state.scores[p.name] = 0));
      saveScores();
      renderLeaderboard();
    }
  });

  $("btn-theme").addEventListener("click", toggleTheme);

  // Difficulty
  $("difficulty-picker").addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    $("difficulty-picker").querySelectorAll(".seg-btn").forEach((b) =>
      b.classList.remove("active")
    );
    btn.classList.add("active");
    state.difficulty = btn.dataset.diff;
  });
}

/* ── PWA ────────────────────────────────────────────────── */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

/* ── Boot ───────────────────────────────────────────────── */
initTheme();
bind();
// Default 4-player balanced: 3 civ, 1 und, 0 white
state.config = { ...ROLE_PRESETS[4] };
syncSetupUI();
