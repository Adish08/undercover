# Undercover 🕵️‍♂️💬

An elegant, mobile-first social deduction party game built with vanilla web technologies. Playable offline as a Progressive Web App (PWA), it features rich aesthetics, fluid animations, dynamic dark/light theme support, and a local leaderboard to keep track of scores across rounds.

Check it out on [GitHub Pages](https://github.com/adish/Undercover) (replace with your deployment link).

---

## 🎮 Game Rules & Roles

In **Undercover**, players are secretly assigned roles. The goal of the game is to identify who is out of place before it's too late!

| Role | Description | Scoring |
| :--- | :--- | :--- |
| **Civilians** 🟩 | Receive the secret **Civilian Word** (e.g., *Lemon*). They must describe it and vote out all imposters. | **+2 pts** on a win |
| **Undercovers** 🟧 | Receive a closely related **Undercover Word** (e.g., *Lime*). They must blend in and survive. | **+10 pts** on a win |
| **Mr. White** 🟩 | Receives **no word**. They must guess the civilian word based on clues, and can win by guessing it correctly if voted out. | **+6 pts** on a win |

### Flow of Play
1. **Setup:** Choose the number of Civilians, Undercovers, and Mr. Whites. Enter player names.
2. **Reveal:** Players secretly tap the screen to view their word or role.
3. **Clue Phase:** Players take turns giving a one-word or short-phrase clue describing their word.
4. **Voting Phase:** Discuss clues, cast votes, and confirm the majority choice.
5. **Outcome:** If Mr. White is voted out, they get one final chance to guess the Civilian Word. The game ends when all special roles are eliminated (Civilian Win) or when the imposters match the number of surviving Civilians (Imposter Win).

---

## ✨ Features

- **📱 Mobile-First Design & PWA:** Fully responsive layout with touch-friendly elements. It installs directly to Android or iOS home screens and works 100% offline.
- **✨ Fluid View Transitions:** Animated screen transitions utilizing double-reflow scheduling (`requestAnimationFrame`) for native-app-like sliding feel.
- **🌓 Adaptive Theme Engine:** Auto-syncs with the operating system's light/dark system settings, with a manual quick-toggle option.
- **📊 Interactive Leaderboard & Recap:** Tracks scores locally across multiple rounds. At the end of the round, see the full recap of who had which word.
- **🙅‍♂️ Smart Validation:** Automatically catches duplicate player names and warns about unbalanced role counts to ensure fair play.
- **⚡ No Build Tools:** Written entirely in vanilla HTML, JavaScript (ES Modules), and pure CSS—no heavy frameworks required.

---

## 🛠️ Project Structure

```bash
├── index.html        # Main app UI structure & meta tags (SEO, OpenGraph, PWA)
├── styles.css        # Premium custom CSS (gradients, animations, responsive grid)
├── app.js            # Core SPA router, game state machine, and voting logic
├── words.js          # Extensible categories & difficulty-sorted word database
├── manifest.json     # PWA manifest detailing icons, theme color, and standalone orientation
└── sw.js             # Service Worker caching assets for offline resilience
```

---

## 🚀 Running Locally

Since this app uses native ES Modules (`import/export`), running it directly from the local file system (`file://` protocol) will trigger CORS restrictions in modern browsers. You need a local development server:

### Option A: VS Code Live Server (Easiest)
1. Install the **Live Server** extension in VS Code.
2. Click **Go Live** in the bottom-right status bar.

### Option B: Node.js (http-server / vite)
If you have Node.js installed, run this in your terminal:
```bash
npx http-server
```
or 
```bash
npx vite
```
Open the local URL in your browser.

---

## 📦 Publishing & Deployment

1. **GitHub Pages:** Go to your repository settings -> **Pages**, set the source branch to `main`, and select the `/root` folder.
2. **Icons:** The app is configured with high-quality splash and launcher PNG icons (`icon-192.png` and `icon-512.png`). Ensure these are in the root directory for PWA installation to work.

---

## 📝 Customizing the Word List

To add your own word pairs, simply open [words.js](file:///Users/adish/Documents/GitHub/Undercover/words.js) and append them to the `WORD_DATABASE` array following this format:
```javascript
{ genre: "Your Category", difficulty: "Easy|Medium|Hard", wordA: "CivilianWord", wordB: "UndercoverWord" }
```
When you update the word database, the service worker will automatically detect changes, invalidate the cache, and update players' apps on their next reload.
