/**
 * Creative & Fun Word Pair Suggestions for Undercover Game.
 * 
 * Design Principles for these pairs:
 * 1. Simple, Everyday Language: Zero obscure or "bhari bharkam" dictionary words.
 * 2. High Undercover Playability: Overlapping clues that require subtle distinction.
 * 3. Modern & Fun Genres: Apps, Gaming, Pop Culture, Everyday Habits, Food, Travel, etc.
 * 4. Balanced Difficulties:
 *    - Easy: Familiar cousins (clear once specific clues are dropped).
 *    - Medium: Subtle overlap (takes 1-2 turns to catch).
 *    - Hard: Sneaky twins (requires sharp attention to subtle details).
 */

export const WORD_SUGGESTIONS = [
  // ── 📱 Apps & Social Media ──────────────────────────────────
  { genre: "Apps & Social", difficulty: "Easy", wordA: "WhatsApp", wordB: "Telegram" },
  { genre: "Apps & Social", difficulty: "Easy", wordA: "YouTube", wordB: "Netflix" },
  { genre: "Apps & Social", difficulty: "Easy", wordA: "Instagram", wordB: "TikTok" },
  { genre: "Apps & Social", difficulty: "Medium", wordA: "Spotify", wordB: "Apple Music" },
  // ── 🎬 Pop Culture & Superheroes ─────────────────────────────
  { genre: "Pop Culture", difficulty: "Easy", wordA: "Harry Potter", wordB: "Percy Jackson" },
  { genre: "Pop Culture", difficulty: "Easy", wordA: "Marvel", wordB: "DC" },
  { genre: "Pop Culture", difficulty: "Medium", wordA: "Superman", wordB: "Thor" },
  { genre: "Pop Culture", difficulty: "Medium", wordA: "Barbie", wordB: "Bratz" },
  { genre: "Pop Culture", difficulty: "Hard", wordA: "Joker", wordB: "Green Goblin" },
  { genre: "Pop Culture", difficulty: "Hard", wordA: "Sherlock Holmes", wordB: "Hercule Poirot" },

  // ── 🎮 Gaming & Fun ──────────────────────────────────────────
  { genre: "Gaming", difficulty: "Easy", wordA: "PlayStation", wordB: "Xbox" },
  { genre: "Gaming", difficulty: "Medium", wordA: "Chess", wordB: "Checkers" },

  // ── 🍕 Food & Movie Snacks ──────────────────────────────────
  { genre: "Food & Drinks", difficulty: "Easy", wordA: "French Fries", wordB: "Potato Chips" },
  { genre: "Food & Drinks", difficulty: "Easy", wordA: "Popcorn", wordB: "Nachos" },
  { genre: "Food & Drinks", difficulty: "Easy", wordA: "Hot Chocolate", wordB: "Cold Coffee" },
  { genre: "Food & Drinks", difficulty: "Medium", wordA: "Milkshake", wordB: "Smoothie" },

  // ── 🛌 Everyday Life & Quirky Habits ─────────────────────────
  { genre: "Everyday Life", difficulty: "Easy", wordA: "Alarm", wordB: "Clock" },
  { genre: "Everyday Life", difficulty: "Easy", wordA: "Selfie", wordB: "Photo" },
  { genre: "Everyday Life", difficulty: "Medium", wordA: "Wi-Fi", wordB: "Mobile Data" },

  // ── 🎓 School, College & Office ──────────────────────────────
  { genre: "School & Work", difficulty: "Easy", wordA: "Exam", wordB: "Test" },
  { genre: "School & Work", difficulty: "Easy", wordA: "Homework", wordB: "Assignment" },
  { genre: "School & Work", difficulty: "Easy", wordA: "Teacher", wordB: "Principal" },
  { genre: "School & Work", difficulty: "Medium", wordA: "Compass", wordB: "Ruler" },
  { genre: "School & Work", difficulty: "Medium", wordA: "Backpack", wordB: "Handbag" },
  { genre: "School & Work", difficulty: "Hard", wordA: "Presentation", wordB: "Viva" },
  { genre: "School & Work", difficulty: "Hard", wordA: "Internship", wordB: "Job" },

  // ── 🧟 Spooky & Fantasy Monsters ────────────────────────────
  { genre: "Fantasy & Spooky", difficulty: "Easy", wordA: "Ghost", wordB: "Vampire" },
  { genre: "Fantasy & Spooky", difficulty: "Easy", wordA: "Dragon", wordB: "Dinosaur" },
  { genre: "Fantasy & Spooky", difficulty: "Medium", wordA: "Zombie", wordB: "Mummy" },
  { genre: "Fantasy & Spooky", difficulty: "Medium", wordA: "Witch", wordB: "Wizard" },
  { genre: "Fantasy & Spooky", difficulty: "Hard", wordA: "Alien", wordB: "Astronaut" },
  { genre: "Fantasy & Spooky", difficulty: "Hard", wordA: "Werewolf", wordB: "Bigfoot" },

  // ── 🎡 Hangouts, Places & Travel ────────────────────────────
  { genre: "Places & Travel", difficulty: "Easy", wordA: "Mall", wordB: "Supermarket" },
  { genre: "Places & Travel", difficulty: "Easy", wordA: "Swimming Pool", wordB: "Water Park" },
  { genre: "Places & Travel", difficulty: "Medium", wordA: "Picnic", wordB: "Camping" },
  { genre: "Places & Travel", difficulty: "Hard", wordA: "Hotel", wordB: "Resort" },

  // ── 🕶️ Fashion & Cool Gadgets ───────────────────────────────
  { genre: "Fashion & Gadgets", difficulty: "Easy", wordA: "Power Bank", wordB: "Charger" },
  { genre: "Fashion & Gadgets", difficulty: "Medium", wordA: "Hoodie", wordB: "Jacket" },
  { genre: "Fashion & Gadgets", difficulty: "Medium", wordA: "Raincoat", wordB: "Umbrella" },
  { genre: "Fashion & Gadgets", difficulty: "Hard", wordA: "Shampoo", wordB: "Body Wash" },

  // ── 💡 Fun Social Concepts & Vibe ────────────────────────────
  { genre: "Social & Party", difficulty: "Medium", wordA: "Lie", wordB: "Secret" },
  { genre: "Social & Party", difficulty: "Medium", wordA: "Prank", wordB: "Surprise" },

  // ── 🎯 User Requested Addition Pairs ─────────────────────────
  { genre: "Arts", difficulty: "Easy", wordA: "Guitar", wordB: "Violin" },
  { genre: "Technology", difficulty: "Medium", wordA: "Earbuds", wordB: "Earphones" },
  { genre: "Nature", difficulty: "Medium", wordA: "Lake", wordB: "Pond" },
  { genre: "Transport", difficulty: "Easy", wordA: "Bike", wordB: "Scooter" },
  { genre: "Jobs", difficulty: "Medium", wordA: "Policeman", wordB: "Soldier" },
  { genre: "Objects", difficulty: "Hard", wordA: "Glue", wordB: "Paste" }
];
