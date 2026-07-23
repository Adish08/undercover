# Undercover 🕵️‍♂️

A production-ready, mobile-first **social deduction** party game — pass one device around the table, give clever clues, and vote out the impostors.

> Play: [adish08.github.io/undercover](https://adish08.github.io/undercover)

---

## Classic rules (aligned)

| Role | What they know | How they win |
| :--- | :--- | :--- |
| **Civilians** | Same secret word | Eliminate every Undercover & Mr. White |
| **Undercovers** | A *similar* word | Survive until specials ≥ civilians |
| **Mr. White** | No word | Guess the civilian word when voted out (instant win), or survive an Undercover victory for partial credit |

### Flow

1. **Setup** — pick player count (balanced presets), role mix, word difficulty  
2. **Reveal** — each player privately sees their word (or Mr. White blank)  
3. **Clues** — randomized speaking order; short clues only  
4. **Vote** — one vote per living player; highest is eliminated  
5. **Resolve** — roles revealed on elimination; Mr. White may guess  

Scoring (multi-round table play):

- Civilian win: **+2** (+1 survival bonus if still alive)  
- Undercover win: **+10**  
- Mr. White correct guess: **+6**  
- Mr. White survives an Undercover win: **+4**  

Scores persist in `localStorage` across sessions.

---

## What was improved from the original build

| Area | Before | Now |
| :--- | :--- | :--- |
| **UI** | Flat Inter cards | Apple-like glass, SF system type, ambient orbs, spring motion |
| **Now Playing** | Simple name list | Spotlight speaker, timer ring, turn strip, live roster |
| **Leaderboard** | Flat list + emoji | Podium (gold/silver/bronze) + ranked list, persistent scores |
| **Word pairs** | ~100, some too distant (Bird/Fish) | 160+ curated cousins by difficulty |
| **Balance** | Manual only | Smart presets by player count (3–12) |
| **Voting** | ± with negative votes | Classic non-negative tallies + progress meter + leader highlight |
| **Mr. White guess** | Exact / substring only | Normalized + fuzzy edit distance |
| **Reveal** | Showed role labels | Civilians/Undercovers only see the **word** (classic secrecy) |
| **PWA** | Cache-first v3 | Network refresh + offline fallback v4 |

---

## Stack

Vanilla HTML / CSS / ES modules — no build step. Installable PWA.

```
index.html   UI shell
styles.css   Design system
app.js       State machine & rules
words.js     Word pairs + presets + scoring constants
manifest.json / sw.js   PWA
```

## Local run

```bash
# any static server
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080` (modules require HTTP, not `file://`).

## License

MIT — see `LICENSE`.
