import { getRandomWordPair } from './words.js';

// --- State ---
let state = {
  config: {
    civilians: 3,
    undercovers: 1,
    mrWhite: 0
  },
  players: [], // { name: string, role: string, word: string, status: 'alive' | 'eliminated' }
  words: {
    civilian: '',
    undercover: ''
  },
  revealIndex: 0,
  turnOrder: [],
  winner: null,
  mrWhiteGuessing: null, // Player object
  scores: {}, // { 'player name': score }
  roundsElapsed: 0,
  currentView: 'setup',
  revealOrder: [],
  timerInterval: null,
  turnTime: 0
};

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

const avatarColors = ['#ff7675', '#0984e3', '#00b894', '#e17055', '#6c5ce7', '#fdcb6e', '#e84393'];

const ROLES = {
  CIVILIAN: 'Civilian',
  UNDERCOVER: 'Undercover',
  MR_WHITE: 'Mr. White'
};

// --- DOM Elements ---
const views = {
  setup: document.getElementById('view-setup'),
  players: document.getElementById('view-players'),
  reveal: document.getElementById('view-reveal'),
  game: document.getElementById('view-game'),
  voting: document.getElementById('view-voting'),
  gameover: document.getElementById('view-gameover')
};

// Setup Elements
const elCivCount = document.getElementById('civilians-display');
const elUndCount = document.getElementById('undercovers-display');
const elMwCount = document.getElementById('mrwhite-display');
const elTotalPlayers = document.getElementById('total-players');
const elSetupWarning = document.getElementById('setup-warning');

// Setup Buttons
document.getElementById('civilians-minus').addEventListener('click', () => updateConfig('civilians', -1));
document.getElementById('civilians-plus').addEventListener('click', () => updateConfig('civilians', 1));
document.getElementById('undercovers-minus').addEventListener('click', () => updateConfig('undercovers', -1));
document.getElementById('undercovers-plus').addEventListener('click', () => updateConfig('undercovers', 1));
document.getElementById('mrwhite-minus').addEventListener('click', () => updateConfig('mrwhite', -1));
document.getElementById('mrwhite-plus').addEventListener('click', () => updateConfig('mrwhite', 1));

document.getElementById('btn-next-players').addEventListener('click', goToPlayersView);

// Players Elements
const elPlayerInputsContainer = document.getElementById('player-inputs-container');
document.getElementById('btn-back-setup').addEventListener('click', () => switchView('setup'));
document.getElementById('btn-start-game').addEventListener('click', startGame);

// Reveal Elements
const elRevealPlayerName = document.getElementById('reveal-player-name');
const elRevealPlayerNameInline = document.getElementById('reveal-player-name-inline');
const elRevealCard = document.getElementById('reveal-card');
const elRevealRoleTitle = document.getElementById('reveal-role-title');
const elRevealWord = document.getElementById('reveal-word');
const btnNextReveal = document.getElementById('btn-next-reveal');

elRevealCard.addEventListener('click', revealCard);
btnNextReveal.addEventListener('click', () => {
  elRevealCard.classList.remove('flipped');
  btnNextReveal.classList.add('invisible');
  setTimeout(() => {
    nextReveal();
  }, 600);
});

// Game Elements
const elCurrentPlayerTurn = document.getElementById('current-player-turn');
const elLivingPlayersList = document.getElementById('living-players-list');
document.getElementById('btn-next-turn').addEventListener('click', nextTurn);
document.getElementById('btn-start-voting').addEventListener('click', goToVoting);
document.getElementById('btn-new-game-top').addEventListener('click', resetToSetup);

// Voting Elements
const elVotingList = document.getElementById('voting-list');
document.getElementById('btn-confirm-votes').addEventListener('click', confirmVotes);

// Modals
const modalMrWhite = document.getElementById('modal-mrwhite');
const modalEliminated = document.getElementById('modal-eliminated');
document.getElementById('btn-mrwhite-submit').addEventListener('click', submitMrWhiteGuess);
document.getElementById('btn-continue-game').addEventListener('click', () => {
  modalEliminated.classList.add('hidden');
  checkWinCondition();
});

// Game Over Elements
document.getElementById('btn-rematch').addEventListener('click', rematch);
document.getElementById('btn-new-game-bottom').addEventListener('click', resetToSetup);


// --- Functions ---

function getTotalPlayers() {
  return state.config.civilians + state.config.undercovers + state.config.mrWhite;
}

function updateConfig(role, change) {
  if (role === 'civilians') {
    state.config.civilians = Math.max(1, state.config.civilians + change);
  } else if (role === 'undercovers') {
    state.config.undercovers = Math.max(0, state.config.undercovers + change);
  } else if (role === 'mrwhite') {
    state.config.mrWhite = Math.max(0, state.config.mrWhite + change);
  }
  
  elCivCount.textContent = state.config.civilians;
  elUndCount.textContent = state.config.undercovers;
  elMwCount.textContent = state.config.mrWhite;
  
  const total = getTotalPlayers();
  elTotalPlayers.textContent = total;

  // Validation
  let isValid = true;
  let warning = "";
  if (total < 3) {
    isValid = false;
    warning = "Minimum 3 players required.";
  } else if (state.config.civilians <= state.config.undercovers + state.config.mrWhite) {
    isValid = false;
    warning = "Civilians must outnumber special roles for balance.";
  }

  if (!isValid) {
    elSetupWarning.textContent = warning;
    elSetupWarning.classList.remove('hidden');
    document.getElementById('btn-next-players').disabled = true;
    document.getElementById('btn-next-players').style.opacity = '0.5';
  } else {
    elSetupWarning.classList.add('hidden');
    document.getElementById('btn-next-players').disabled = false;
    document.getElementById('btn-next-players').style.opacity = '1';
  }
}

const VIEW_ORDER = ['setup', 'players', 'reveal', 'game', 'voting', 'gameover'];

function switchView(viewName) {
  const currentViewName = state.currentView;
  if (currentViewName === viewName) return;

  const currentViewEl = views[currentViewName];
  const newViewEl = views[viewName];

  const currentIdx = VIEW_ORDER.indexOf(currentViewName);
  const newIdx = VIEW_ORDER.indexOf(viewName);
  const isForward = newIdx > currentIdx;

  // Position the new view offscreen before animating
  newViewEl.classList.remove('hidden');
  newViewEl.classList.remove('active');
  if (isForward) {
    newViewEl.classList.add('slide-right');
    newViewEl.classList.remove('slide-left');
  } else {
    newViewEl.classList.add('slide-left');
    newViewEl.classList.remove('slide-right');
  }

  // Use requestAnimationFrame to ensure initial position is rendered before animating
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Slide views in/out
      if (isForward) {
        currentViewEl.classList.remove('active');
        currentViewEl.classList.add('slide-left');
      } else {
        currentViewEl.classList.remove('active');
        currentViewEl.classList.add('slide-right');
      }
      
      newViewEl.classList.remove('slide-left');
      newViewEl.classList.remove('slide-right');
      newViewEl.classList.add('active');
    });
  });

  const previousViewName = currentViewName;
  setTimeout(() => {
    if (state.currentView === viewName) {
      const prevEl = views[previousViewName];
      prevEl.classList.add('hidden');
      prevEl.classList.remove('slide-left');
      prevEl.classList.remove('slide-right');
    }
  }, 450);

  state.currentView = viewName;

  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  if (btnThemeToggle) {
    if (viewName === 'setup') {
      btnThemeToggle.classList.remove('hidden');
    } else {
      btnThemeToggle.classList.add('hidden');
    }
  }
}

function goToPlayersView() {
  const total = getTotalPlayers();
  document.getElementById('player-count-display').textContent = total;
  
  elPlayerInputsContainer.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const customName = state.players[i] && !state.players[i].name.match(/^Player \d+$/) ? state.players[i].name : '';
    elPlayerInputsContainer.innerHTML += `
      <div class="name-input-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="font-weight: 700; color: var(--color-text-muted); width: 24px; text-align: right; font-size: 1.125rem;">${i + 1}.</span>
        <input type="text" class="player-name-input" value="${customName}" placeholder="Player ${i + 1}" style="flex: 1;">
      </div>
    `;
  }
  
  switchView('players');
}

function startGame() {
  const inputs = document.querySelectorAll('.player-name-input');
  const names = Array.from(inputs).map((input, idx) => input.value.trim() || `Player ${idx + 1}`);
  
  // Validate duplicate names
  const nameSet = new Set();
  let hasDuplicates = false;
  for (let name of names) {
    const normalized = name.toLowerCase();
    if (nameSet.has(normalized)) {
      hasDuplicates = true;
      break;
    }
    nameSet.add(normalized);
  }

  const warningEl = document.getElementById('players-warning');
  if (hasDuplicates) {
    if (warningEl) {
      warningEl.textContent = "Each player must have a unique name!";
      warningEl.classList.remove('hidden');
    }
    return;
  } else {
    if (warningEl) {
      warningEl.classList.add('hidden');
    }
  }
  
  // Create deck
  const deck = [];
  for(let i=0; i<state.config.civilians; i++) deck.push(ROLES.CIVILIAN);
  for(let i=0; i<state.config.undercovers; i++) deck.push(ROLES.UNDERCOVER);
  for(let i=0; i<state.config.mrWhite; i++) deck.push(ROLES.MR_WHITE);
  
  shuffleArray(deck);
  
  const wordPair = getRandomWordPair();
  state.words.civilian = wordPair.wordA;
  state.words.undercover = wordPair.wordB;

  state.players = names.map((name, index) => {
    const role = deck[index];
    let word = '';
    if (role === ROLES.CIVILIAN) word = state.words.civilian;
    else if (role === ROLES.UNDERCOVER) word = state.words.undercover;
    else word = 'You are Mr. White';

    return {
      id: index,
      name,
      role,
      word,
      status: 'alive'
    };
  });
  state.roundsElapsed = 0;
  state.revealIndex = 0;
  state.revealOrder = state.players.map(p => p.id);
  shuffleArray(state.revealOrder);
  setupReveal();
  switchView('reveal');
}

function setupReveal() {
  elRevealCard.classList.remove('flipped');
  btnNextReveal.classList.add('invisible');
  
  const currentRevealId = state.revealOrder[state.revealIndex];
  const player = state.players.find(p => p.id === currentRevealId);
  elRevealPlayerName.textContent = player.name;
  elRevealPlayerNameInline.textContent = player.name;
  
  if (player.role === ROLES.MR_WHITE) {
    elRevealRoleTitle.textContent = "Your Role";
  } else {
    elRevealRoleTitle.textContent = "Your Word";
  }
  elRevealWord.textContent = player.word;
}

function revealCard() {
  if (!elRevealCard.classList.contains('flipped')) {
    elRevealCard.classList.add('flipped');
    setTimeout(() => {
      btnNextReveal.classList.remove('invisible');
    }, 600);
  }
}

function nextReveal() {
  state.revealIndex++;
  if (state.revealIndex < state.players.length) {
    setupReveal();
  } else {
    startCluePhase();
  }
}

function startCluePhase() {
  state.roundsElapsed++;
  const living = state.players.filter(p => p.status === 'alive');
  state.turnOrder = living.map(p => p.id);
  shuffleArray(state.turnOrder);
  state.currentTurnIndex = 0;
  
  updateGameView();
  switchView('game');
}

function updateGameView() {
  const currentId = state.turnOrder[state.currentTurnIndex];
  const currentPlayer = state.players.find(p => p.id === currentId);
  elCurrentPlayerTurn.textContent = currentPlayer.name;

  // Timer logic
  clearInterval(state.timerInterval);
  state.turnTime = 0;
  const elTimer = document.getElementById('turn-timer');
  if (elTimer) elTimer.textContent = '00:00';
  state.timerInterval = setInterval(() => {
    state.turnTime++;
    if (elTimer) {
      const mins = Math.floor(state.turnTime / 60).toString().padStart(2, '0');
      const secs = (state.turnTime % 60).toString().padStart(2, '0');
      elTimer.textContent = `${mins}:${secs}`;
    }
  }, 1000);

  const living = state.players.filter(p => p.status === 'alive');
  elLivingPlayersList.innerHTML = living.map(p => {
    const color = avatarColors[p.id % avatarColors.length];
    const initial = p.name.charAt(0).toUpperCase();
    return `
    <li style="padding: 16px 20px; margin-bottom: 12px; display: flex; align-items: center; gap: 16px; border-radius: var(--radius-md); background: var(--color-bg); border: 1px solid var(--color-border);">
       <div style="width: 40px; height: 40px; border-radius: 50%; background: ${color}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem;">${escapeHTML(initial)}</div>
       <span style="font-size: 1.125rem; font-weight: 600;">${escapeHTML(p.name)}</span>
    </li>
  `}).join('');
  
  const eliminated = state.players.filter(p => p.status === 'eliminated');
  const elEliminatedCard = document.getElementById('eliminated-players-card');
  const elEliminatedList = document.getElementById('eliminated-players-list');
  if (elEliminatedCard && elEliminatedList) {
    if (eliminated.length > 0) {
      elEliminatedCard.style.display = 'block';
      elEliminatedList.innerHTML = eliminated.map(p => {
        const color = avatarColors[p.id % avatarColors.length];
        const initial = p.name.charAt(0).toUpperCase();
        return `
        <li style="padding: 16px 20px; margin-bottom: 12px; display: flex; align-items: center; gap: 16px; border-radius: var(--radius-md); background: var(--color-bg); border: 1px solid var(--color-border);">
           <div style="width: 40px; height: 40px; border-radius: 50%; background: ${color}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem;">${escapeHTML(initial)}</div>
           <span style="font-size: 1.125rem; font-weight: 600; text-decoration: line-through; opacity: 0.7;">${escapeHTML(p.name)}</span>
        </li>
      `}).join('');
    } else {
      elEliminatedCard.style.display = 'none';
    }
  }
  
  const isLast = state.currentTurnIndex === state.turnOrder.length - 1;
  document.getElementById('btn-next-turn').classList.toggle('hidden', isLast);
  document.getElementById('btn-start-voting').classList.toggle('hidden', !isLast);
}

function nextTurn() {
  state.currentTurnIndex++;
  updateGameView();
}

function goToVoting() {
  clearInterval(state.timerInterval);
  const living = state.players.filter(p => p.status === 'alive');
  
  const maxVotesDisplay = document.getElementById('max-votes-display');
  if (maxVotesDisplay) maxVotesDisplay.textContent = living.length - 1;

  elVotingList.innerHTML = living.map(p => `
    <div class="voting-item">
      <span class="voting-name">${escapeHTML(p.name)}</span>
      <div class="counter">
        <button class="btn-icon vote-minus" data-id="${p.id}">-</button>
        <span class="vote-count" id="vote-${p.id}">0</span>
        <button class="btn-icon vote-plus" data-id="${p.id}">+</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.vote-minus').forEach(btn => {
    btn.addEventListener('click', () => updateVote(btn.dataset.id, -1));
  });
  document.querySelectorAll('.vote-plus').forEach(btn => {
    btn.addEventListener('click', () => updateVote(btn.dataset.id, 1));
  });

  const callout = document.getElementById('voting-callout');
  if (callout) {
    callout.classList.add('hidden');
    callout.className = 'callout hidden';
  }

  switchView('voting');
}

function updateVote(id, change) {
  const el = document.getElementById(`vote-${id}`);
  let val = parseInt(el.textContent);
  val = Math.max(-1, val + change);
  el.textContent = val;
}

function confirmVotes() {
  const living = state.players.filter(p => p.status === 'alive');
  let maxVotes = -Infinity;
  let candidates = [];
  let totalAbsoluteVotes = 0;
  
  living.forEach(p => {
    const votes = parseInt(document.getElementById(`vote-${p.id}`).textContent);
    totalAbsoluteVotes += Math.abs(votes);
    if (votes > maxVotes) {
      maxVotes = votes;
      candidates = [p];
    } else if (votes === maxVotes) {
      candidates.push(p);
    }
  });

  const callout = document.getElementById('voting-callout');
  if (callout) {
    callout.classList.add('hidden');
    callout.className = 'callout hidden'; // reset class
  }
  
  if (maxVotes > living.length - 1) {
    if (callout) {
      callout.className = 'callout callout-warning';
      callout.innerHTML = `No single player can receive more than <strong>${living.length - 1}</strong> votes!`;
      callout.classList.remove('hidden');
    }
    return;
  }

  if (totalAbsoluteVotes !== living.length) {
    if (callout) {
      callout.className = 'callout callout-warning';
      callout.innerHTML = `Please make sure everyone has voted!<br>Expected <strong>${living.length}</strong> total absolute votes, but counted <strong>${totalAbsoluteVotes}</strong>.`;
      callout.classList.remove('hidden');
    }
    return;
  }

  // Deduct negative votes from total score
  living.forEach(p => {
    const votes = parseInt(document.getElementById(`vote-${p.id}`).textContent);
    if (votes < 0) {
      state.scores[p.name] = (state.scores[p.name] || 0) + votes;
    }
  });

  if (candidates.length > 1) {
    const names = candidates.map(c => escapeHTML(c.name)).join(', ');
    if (callout) {
      callout.className = 'callout callout-danger';
      callout.innerHTML = `It's a tie between: <strong>${names}</strong>!<br>The tied players must each give one more clue. Then, please adjust your votes and confirm again.`;
    }
    return;
  }

  const eliminatedPlayer = candidates[0];
  eliminatedPlayer.status = 'eliminated';

  if (eliminatedPlayer.role === ROLES.MR_WHITE) {
    // Mr White guessing logic
    state.mrWhiteGuessing = eliminatedPlayer;
    document.getElementById('mrwhite-player-name').textContent = eliminatedPlayer.name;
    document.getElementById('mrwhite-guess-input').value = '';
    document.getElementById('mrwhite-feedback').textContent = '';
    modalMrWhite.classList.remove('hidden');
  } else {
    // Regular elimination
    document.getElementById('eliminated-title').textContent = `${eliminatedPlayer.name} is Voted Out!`;
    document.getElementById('eliminated-role-info').textContent = `They were a ${eliminatedPlayer.role}.`;
    modalEliminated.classList.remove('hidden');
  }
}

function submitMrWhiteGuess() {
  const guess = document.getElementById('mrwhite-guess-input').value.trim().toLowerCase();
  if (!guess) return;
  
  const civilianWord = state.words.civilian.toLowerCase();
  
  modalMrWhite.classList.add('hidden');
  
  // Very basic string matching (can be improved with distance algo if needed)
  if (civilianWord === guess || civilianWord.includes(guess) || guess.includes(civilianWord)) {
    endGame(ROLES.MR_WHITE);
  } else {
    document.getElementById('eliminated-title').textContent = `${state.mrWhiteGuessing.name} Guessed Wrong!`;
    document.getElementById('eliminated-role-info').textContent = `They were Mr. White.`;
    modalEliminated.classList.remove('hidden');
  }
}

function checkWinCondition() {
  const living = state.players.filter(p => p.status === 'alive');
  const livingCivilians = living.filter(p => p.role === ROLES.CIVILIAN).length;
  const livingOthers = living.length - livingCivilians;
  
  if (livingOthers === 0) {
    endGame(ROLES.CIVILIAN);
  } else if (livingOthers >= livingCivilians) {
    endGame(ROLES.UNDERCOVER);
  } else {
    // Game continues
    startCluePhase();
  }
}

function endGame(winnerRole) {
  state.winner = winnerRole;
  
  const title = document.getElementById('gameover-winner');
  const reason = document.getElementById('gameover-reason');
  
  if (winnerRole === ROLES.CIVILIAN) {
    title.textContent = "Civilians Win!";
    reason.textContent = "All imposters were eliminated.";
    state.players.filter(p => p.role === ROLES.CIVILIAN).forEach(p => {
      state.scores[p.name] = (state.scores[p.name] || 0) + 2;
    });
  } else if (winnerRole === ROLES.UNDERCOVER) {
    title.textContent = "Undercovers Win!";
    reason.textContent = "The Undercovers took over.";
    state.players.filter(p => p.role === ROLES.UNDERCOVER).forEach(p => {
      state.scores[p.name] = (state.scores[p.name] || 0) + 10;
    });
  } else if (winnerRole === ROLES.MR_WHITE) {
    title.textContent = "Mr. White Wins!";
    reason.textContent = "Mr. White guessed the word correctly.";
    state.players.filter(p => p.role === ROLES.MR_WHITE).forEach(p => {
      state.scores[p.name] = (state.scores[p.name] || 0) + 6;
    });
  }

  // Ensure all players have at least 0 score in the state
  state.players.forEach(p => {
    if (state.scores[p.name] === undefined) {
      state.scores[p.name] = 0;
    }
  });

  const recapList = document.getElementById('recap-list');
  recapList.innerHTML = state.players.map(p => {
    const isAlive = p.status === 'alive';
    const color = avatarColors[p.id % avatarColors.length];
    const initial = p.name.charAt(0).toUpperCase();
    return `
    <div class="recap-row ${isAlive ? '' : 'eliminated'}">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: ${color}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem;">${escapeHTML(initial)}</div>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span style="font-weight: 700; font-size: 1.125rem;">${escapeHTML(p.name)}</span>
          <span style="font-size: 0.9rem; color: var(--color-text-muted);">${escapeHTML(p.role)} &bull; <strong>${escapeHTML(p.word)}</strong></span>
        </div>
      </div>
      <span class="recap-status-badge ${isAlive ? 'alive' : 'dead'}">${escapeHTML(p.status.toUpperCase())}</span>
    </div>
  `}).join('');

  const statsContainer = document.getElementById('gameover-stats');
  if (statsContainer) {
    statsContainer.innerHTML = `<p style="font-weight: 600; text-align: center; margin-bottom: 24px; font-size: 1rem; color: var(--color-text-muted);">It took <span style="color: var(--color-danger); font-weight: 800; font-size: 1.125rem; margin: 0 4px;">${state.roundsElapsed}</span> voting cycles to complete the game.</p>`;
  }

  const leaderboardList = document.getElementById('leaderboard-list');
  if (leaderboardList) {
    const sortedScores = Object.entries(state.scores).sort((a, b) => b[1] - a[1]);
    leaderboardList.innerHTML = sortedScores.map(([name, score], index) => {
      let medal = '';
      if (index === 0) medal = '🥇';
      else if (index === 1) medal = '🥈';
      else if (index === 2) medal = '🥉';
      const p = state.players.find(pl => pl.name === name) || state.players[0]; // fallback
      const color = avatarColors[p.id % avatarColors.length];
      
      const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
      const rankBadgeHtml = medal 
        ? `<span class="rank-badge">${medal}</span>` 
        : `<span class="rank-num">${index + 1}</span>`;
      const initial = name.charAt(0).toUpperCase();

      return `
        <div class="leaderboard-row ${rankClass}">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="rank-badge-wrapper">${rankBadgeHtml}</div>
            <div style="width: 44px; height: 44px; border-radius: 50%; background: ${color}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem;">${escapeHTML(initial)}</div>
            <span style="font-weight: 700; font-size: 1.125rem;">${escapeHTML(name)}</span>
          </div>
          <span class="points-badge">${score} pts</span>
        </div>
      `;
    }).join('');
  }

  switchView('gameover');
}

function rematch() {
  // Reset statuses
  startGame(); // Generates new roles and words, keeps names
}

// Utility
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Init
updateConfig('none', 0);

// Accordion Toggle
const accordionCard = document.getElementById('how-to-play-card');
const accordionToggle = document.getElementById('how-to-play-toggle');
if (accordionToggle && accordionCard) {
  accordionToggle.addEventListener('click', () => {
    accordionCard.classList.toggle('expanded');
  });
}

// Theme Toggle Logic
const btnThemeToggle = document.getElementById('btn-theme-toggle');

// Determine initial theme: check localStorage, fallback to OS system preferences
let initialTheme = localStorage.getItem('theme');
if (!initialTheme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  initialTheme = prefersDark ? 'dark' : 'light';
}
document.documentElement.setAttribute('data-theme', initialTheme);

if (btnThemeToggle) {
  btnThemeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Live listener: sync theme automatically if user hasn't explicitly set a custom preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  }
});

// Service Worker Registration for PWA Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

function resetToSetup() {
  // 1. Reset state
  state.config.civilians = 3;
  state.config.undercovers = 1;
  state.config.mrWhite = 0;
  state.players = [];
  state.words = { civilian: '', undercover: '' };
  state.revealIndex = 0;
  state.turnOrder = [];
  state.winner = null;
  state.mrWhiteGuessing = null;
  state.scores = {};
  state.roundsElapsed = 0;
  state.revealOrder = [];
  clearInterval(state.timerInterval);
  state.turnTime = 0;

  // 2. Sync setup view counters
  elCivCount.textContent = state.config.civilians;
  elUndCount.textContent = state.config.undercovers;
  elMwCount.textContent = state.config.mrWhite;
  elTotalPlayers.textContent = '4';
  
  const setupWarning = document.getElementById('setup-warning');
  if (setupWarning) {
    setupWarning.textContent = '';
    setupWarning.classList.add('hidden');
  }

  const btnNextPlayers = document.getElementById('btn-next-players');
  if (btnNextPlayers) {
    btnNextPlayers.disabled = false;
    btnNextPlayers.style.opacity = '1';
  }

  // 3. Smooth transition slide (backward)
  switchView('setup');
}
