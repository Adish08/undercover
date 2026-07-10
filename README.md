# Undercover 🕵️‍♂️💬

An elegant, mobile-first social deduction party game built with vanilla web technologies. Playable offline as a Progressive Web App (PWA), it features rich aesthetics, fluid animations, dynamic dark/light theme support, and a local leaderboard to keep track of scores across rounds.

> [!NOTE]
> Check it out on [GitHub Pages](https://adish08.github.io/undercover)

---

## 🎮 Game Rules & Roles

In **Undercover**, players are secretly assigned roles. The goal of the game is to identify who is out of place before it's too late!

| Role | Description | Scoring |
| :--- | :--- | :--- |
| **Civilians** | Receive the secret **Civilian Word** (e.g., *Lemon*). They must describe it and vote out all imposters. | **+2 pts** on a win |
| **Undercovers**  | Receive a closely related **Undercover Word** (e.g., *Lime*). They must blend in and survive. | **+10 pts** on a win |
| **Mr. White** | Receives **no word**. They must guess the civilian word based on clues, and can win by guessing it correctly if voted out. | **+6 pts** on a win |

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

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the Project.
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the Branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

Feel free to [open an issue](https://github.com/adish08/Undercover/issues) to report bugs or suggest new features!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
