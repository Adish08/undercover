/**
 * Curated word pairs for Undercover.
 * Principle: pairs must be close enough that clues overlap,
 * but distinct enough that careful listening reveals the impostor.
 * Difficulty: Easy = obvious cousins · Medium = subtle · Hard = almost twins
 */
export const WORD_DATABASE = [
  // ── Food & Drink ──────────────────────────────────────────
  { genre: "Food", difficulty: "Easy", wordA: "Coffee", wordB: "Tea" },
  { genre: "Food", difficulty: "Easy", wordA: "Pav Bhaji", wordB: "Misal Pav" },
  { genre: "Food", difficulty: "Easy", wordA: "Pizza", wordB: "Pasta" },
  { genre: "Food", difficulty: "Easy", wordA: "Apple", wordB: "Pear" },
  { genre: "Food", difficulty: "Easy", wordA: "Ice Cream", wordB: "Yogurt" },
  { genre: "Food", difficulty: "Easy", wordA: "Bread", wordB: "Toast" },
  { genre: "Food", difficulty: "Easy", wordA: "Chocolate", wordB: "Candy" },
  { genre: "Food", difficulty: "Medium", wordA: "Pancake", wordB: "Waffle" },
  { genre: "Food", difficulty: "Medium", wordA: "Ice Cream", wordB: "Gelato" },
  { genre: "Food", difficulty: "Medium", wordA: "Lemon", wordB: "Lime" },
  { genre: "Food", difficulty: "Medium", wordA: "Cookie", wordB: "Biscuit" },
  { genre: "Food", difficulty: "Medium", wordA: "Butter", wordB: "Margarine" },
  { genre: "Food", difficulty: "Medium", wordA: "Salsa", wordB: "Guacamole" },
  { genre: "Food", difficulty: "Medium", wordA: "Croissant", wordB: "Bagel" },
  { genre: "Food", difficulty: "Medium", wordA: "Momos", wordB: "Dumplings" },
  { genre: "Food", difficulty: "Hard", wordA: "Jam", wordB: "Jelly" },
  { genre: "Food", difficulty: "Hard", wordA: "Syrup", wordB: "Sauce" },
  { genre: "Food", difficulty: "Hard", wordA: "Cinnamon", wordB: "Nutmeg" },
  { genre: "Food", difficulty: "Hard", wordA: "Macaron", wordB: "Macaroon" },
  { genre: "Food", difficulty: "Hard", wordA: "Baking Soda", wordB: "Baking Powder" },
  { genre: "Food", difficulty: "Hard", wordA: "Cappuccino", wordB: "Latte" },
  { genre: "Food", difficulty: "Hard", wordA: "Muffin", wordB: "Cupcake" },
  { genre: "Food", difficulty: "Hard", wordA: "Sorbet", wordB: "Sherbet" },

  // ── Animals ───────────────────────────────────────────────
  { genre: "Animals", difficulty: "Easy", wordA: "Lion", wordB: "Tiger" },
  { genre: "Animals", difficulty: "Easy", wordA: "Dog", wordB: "Wolf" },
  { genre: "Animals", difficulty: "Easy", wordA: "Cat", wordB: "Lynx" },
  { genre: "Animals", difficulty: "Easy", wordA: "Horse", wordB: "Donkey" },
  { genre: "Animals", difficulty: "Easy", wordA: "Cow", wordB: "Buffalo" },
  { genre: "Animals", difficulty: "Easy", wordA: "Rabbit", wordB: "Hare" },
  { genre: "Animals", difficulty: "Medium", wordA: "Eagle", wordB: "Falcon" },
  { genre: "Animals", difficulty: "Medium", wordA: "Dolphin", wordB: "Porpoise" },
  { genre: "Animals", difficulty: "Medium", wordA: "Crocodile", wordB: "Alligator" },
  { genre: "Animals", difficulty: "Medium", wordA: "Bee", wordB: "Wasp" },
  { genre: "Animals", difficulty: "Medium", wordA: "Frog", wordB: "Toad" },
  { genre: "Animals", difficulty: "Medium", wordA: "Seal", wordB: "Sea Lion" },
  { genre: "Animals", difficulty: "Hard", wordA: "Turtle", wordB: "Tortoise" },
  { genre: "Animals", difficulty: "Hard", wordA: "Butterfly", wordB: "Moth" },
  { genre: "Animals", difficulty: "Hard", wordA: "Crow", wordB: "Raven" },
  { genre: "Animals", difficulty: "Hard", wordA: "Alpaca", wordB: "Llama" },
  { genre: "Animals", difficulty: "Hard", wordA: "Crab", wordB: "Lobster" },
  { genre: "Animals", difficulty: "Hard", wordA: "Gecko", wordB: "Iguana" },

  // ── Nature ────────────────────────────────────────────────
  { genre: "Nature", difficulty: "Easy", wordA: "Ocean", wordB: "Sea" },
  { genre: "Nature", difficulty: "Easy", wordA: "Rain", wordB: "Drizzle" },
  { genre: "Nature", difficulty: "Easy", wordA: "Mountain", wordB: "Hill" },
  { genre: "Nature", difficulty: "Easy", wordA: "Sun", wordB: "Star" },
  { genre: "Nature", difficulty: "Easy", wordA: "Flower", wordB: "Rose" },
  { genre: "Nature", difficulty: "Easy", wordA: "Tree", wordB: "Bush" },
  { genre: "Nature", difficulty: "Medium", wordA: "River", wordB: "Stream" },
  { genre: "Nature", difficulty: "Medium", wordA: "Lake", wordB: "Pond" },
  { genre: "Nature", difficulty: "Medium", wordA: "Cloud", wordB: "Fog" },
  { genre: "Nature", difficulty: "Medium", wordA: "Island", wordB: "Peninsula" },
  { genre: "Nature", difficulty: "Medium", wordA: "Desert", wordB: "Dune" },
  { genre: "Nature", difficulty: "Medium", wordA: "Volcano", wordB: "Mountain" },
  { genre: "Nature", difficulty: "Medium", wordA: "Rainbow", wordB: "Aurora" },
  { genre: "Nature", difficulty: "Hard", wordA: "Tornado", wordB: "Hurricane" },
  { genre: "Nature", difficulty: "Hard", wordA: "Comet", wordB: "Asteroid" },
  { genre: "Nature", difficulty: "Hard", wordA: "Stalactite", wordB: "Stalagmite" },
  { genre: "Nature", difficulty: "Hard", wordA: "Marsh", wordB: "Swamp" },
  { genre: "Nature", difficulty: "Hard", wordA: "Glacier", wordB: "Iceberg" },
  { genre: "Nature", difficulty: "Hard", wordA: "Canyon", wordB: "Gorge" },

  // ── Objects ───────────────────────────────────────────────
  { genre: "Objects", difficulty: "Easy", wordA: "Watch", wordB: "Clock" },
  { genre: "Objects", difficulty: "Easy", wordA: "Pen", wordB: "Pencil" },
  { genre: "Objects", difficulty: "Easy", wordA: "Chair", wordB: "Stool" },
  { genre: "Objects", difficulty: "Easy", wordA: "Book", wordB: "Magazine" },
  { genre: "Objects", difficulty: "Easy", wordA: "Cup", wordB: "Mug" },
  { genre: "Objects", difficulty: "Easy", wordA: "Phone", wordB: "Tablet" },
  { genre: "Objects", difficulty: "Medium", wordA: "Mirror", wordB: "Window" },
  { genre: "Fashion & Gadgets", difficulty: "Easy", wordA: "Sunglasses", wordB: "Eyeglasses" },
  { genre: "Objects", difficulty: "Medium", wordA: "Umbrella", wordB: "Parasol" },
  { genre: "Objects", difficulty: "Medium", wordA: "Wallet", wordB: "Purse" },
  { genre: "Objects", difficulty: "Medium", wordA: "Candle", wordB: "Lantern" },
  { genre: "Objects", difficulty: "Medium", wordA: "Pillow", wordB: "Cushion" },
  { genre: "Objects", difficulty: "Hard", wordA: "Pill", wordB: "Capsule" },
  { genre: "Objects", difficulty: "Hard", wordA: "Perfume", wordB: "Cologne" },
  { genre: "Objects", difficulty: "Hard", wordA: "Stapler", wordB: "Hole Punch" },
  { genre: "Objects", difficulty: "Hard", wordA: "Compass", wordB: "Protractor" },
  { genre: "Objects", difficulty: "Hard", wordA: "Thermos", wordB: "Flask" },
  { genre: "Objects", difficulty: "Hard", wordA: "Glue", wordB: "Paste" },
  { genre: "Objects", difficulty: "Hard", wordA: "Eraser", wordB: "Correction Tape" },

  // ── Technology ────────────────────────────────────────────
  { genre: "Technology", difficulty: "Easy", wordA: "Laptop", wordB: "Desktop" },
  { genre: "Technology", difficulty: "Easy", wordA: "Keyboard", wordB: "Touchscreen" },
  { genre: "Technology", difficulty: "Easy", wordA: "Battery", wordB: "Charger" },
  { genre: "Technology", difficulty: "Easy", wordA: "Camera", wordB: "Webcam" },
  { genre: "Technology", difficulty: "Medium", wordA: "Wi-Fi", wordB: "Bluetooth" },
  { genre: "Technology", difficulty: "Medium", wordA: "Robot", wordB: "Drone" },
  { genre: "Technology", difficulty: "Medium", wordA: "Password", wordB: "PIN Code" },
  { genre: "Technology", difficulty: "Medium", wordA: "Email", wordB: "Text Message" },
  { genre: "Technology", difficulty: "Medium", wordA: "Headphones", wordB: "Earbuds" },
  { genre: "Technology", difficulty: "Medium", wordA: "Earbuds", wordB: "Earphones" },
  { genre: "Technology", difficulty: "Hard", wordA: "Virtual Reality", wordB: "Augmented Reality" },
  { genre: "Technology", difficulty: "Hard", wordA: "Algorithm", wordB: "Formula" },
  { genre: "Technology", difficulty: "Hard", wordA: "Database", wordB: "Spreadsheet" },
  { genre: "Technology", difficulty: "Hard", wordA: "Processor", wordB: "Graphics Card" },
  { genre: "Technology", difficulty: "Hard", wordA: "Firewall", wordB: "Antivirus" },

  // ── Places ────────────────────────────────────────────────
  { genre: "Places", difficulty: "Easy", wordA: "Library", wordB: "Bookstore" },
  { genre: "Places", difficulty: "Easy", wordA: "Park", wordB: "Garden" },
  { genre: "Places", difficulty: "Easy", wordA: "Hotel", wordB: "Motel" },
  { genre: "Places", difficulty: "Easy", wordA: "School", wordB: "College" },
  { genre: "Places", difficulty: "Easy", wordA: "Beach", wordB: "Pool" },
  { genre: "Places", difficulty: "Medium", wordA: "Museum", wordB: "Art Gallery" },
  { genre: "Places", difficulty: "Medium", wordA: "Airport", wordB: "Train Station" },
  { genre: "Places", difficulty: "Medium", wordA: "Cinema", wordB: "Theater" },
  { genre: "Places", difficulty: "Medium", wordA: "Cafe", wordB: "Restaurant" },
  { genre: "Places", difficulty: "Medium", wordA: "Gym", wordB: "Yoga Studio" },
  { genre: "Places", difficulty: "Hard", wordA: "Balcony", wordB: "Terrace" },
  { genre: "Places", difficulty: "Hard", wordA: "Maze", wordB: "Labyrinth" },
  { genre: "Places", difficulty: "Hard", wordA: "Mansion", wordB: "Villa" },
  { genre: "Places", difficulty: "Hard", wordA: "Attic", wordB: "Basement" },
  { genre: "Places", difficulty: "Hard", wordA: "Harbor", wordB: "Marina" },

  // ── Transport ─────────────────────────────────────────────
  { genre: "Transport", difficulty: "Easy", wordA: "Car", wordB: "Van" },
  { genre: "Transport", difficulty: "Easy", wordA: "Bike", wordB: "Scooter" },
  { genre: "Transport", difficulty: "Easy", wordA: "Bicycle", wordB: "Scooter" },
  { genre: "Transport", difficulty: "Easy", wordA: "Boat", wordB: "Ship" },
  { genre: "Transport", difficulty: "Easy", wordA: "Bus", wordB: "Tram" },
  { genre: "Transport", difficulty: "Medium", wordA: "Train", wordB: "Subway" },
  { genre: "Transport", difficulty: "Medium", wordA: "Helicopter", wordB: "Airplane" },
  { genre: "Transport", difficulty: "Medium", wordA: "Taxi", wordB: "Rideshare" },
  { genre: "Transport", difficulty: "Medium", wordA: "Skateboard", wordB: "Rollerblades" },
  { genre: "Transport", difficulty: "Hard", wordA: "Canoe", wordB: "Kayak" },
  { genre: "Transport", difficulty: "Hard", wordA: "Ferry", wordB: "Cruise Ship" },
  { genre: "Transport", difficulty: "Hard", wordA: "Monorail", wordB: "Cable Car" },
  { genre: "Transport", difficulty: "Hard", wordA: "Glider", wordB: "Hang Glider" },

  // ── Fashion ───────────────────────────────────────────────
  { genre: "Fashion", difficulty: "Easy", wordA: "Jacket", wordB: "Coat" },
  { genre: "Fashion", difficulty: "Easy", wordA: "Sneakers", wordB: "Boots" },
  { genre: "Fashion", difficulty: "Easy", wordA: "Hat", wordB: "Cap" },
  { genre: "Fashion", difficulty: "Medium", wordA: "Scarf", wordB: "Shawl" },
  { genre: "Fashion", difficulty: "Medium", wordA: "Belt", wordB: "Suspenders" },
  { genre: "Fashion", difficulty: "Medium", wordA: "Gloves", wordB: "Mittens" },
  { genre: "Fashion", difficulty: "Medium", wordA: "Hoodie", wordB: "Sweater" },
  { genre: "Fashion", difficulty: "Hard", wordA: "Blazer", wordB: "Suit Jacket" },
  { genre: "Fashion", difficulty: "Hard", wordA: "Loafers", wordB: "Oxfords" },
  { genre: "Fashion", difficulty: "Hard", wordA: "Tunic", wordB: "Kaftan" },

  // ── Sports & Hobbies ──────────────────────────────────────
  { genre: "Sports", difficulty: "Easy", wordA: "Soccer", wordB: "Rugby" },
  { genre: "Sports", difficulty: "Easy", wordA: "Tennis", wordB: "Badminton" },
  { genre: "Sports", difficulty: "Easy", wordA: "Swimming", wordB: "Diving" },
  { genre: "Sports", difficulty: "Medium", wordA: "Skiing", wordB: "Snowboarding" },
  { genre: "Sports", difficulty: "Medium", wordA: "Boxing", wordB: "Wrestling" },
  { genre: "Sports", difficulty: "Hard", wordA: "Fencing", wordB: "Kendo" },
  { genre: "Sports", difficulty: "Hard", wordA: "Archery", wordB: "Shooting" },
  { genre: "Sports", difficulty: "Hard", wordA: "Surfing", wordB: "Windsurfing" },

  // ── Arts & Entertainment ──────────────────────────────────
  { genre: "Arts", difficulty: "Easy", wordA: "Guitar", wordB: "Violin" },
  { genre: "Arts", difficulty: "Easy", wordA: "Movie", wordB: "Series" },
  { genre: "Arts", difficulty: "Easy", wordA: "Painting", wordB: "Drawing" },
  { genre: "Arts", difficulty: "Medium", wordA: "Singing", wordB: "Rapping" },
  { genre: "Arts", difficulty: "Medium", wordA: "Novel", wordB: "Short Story" },
  { genre: "Arts", difficulty: "Medium", wordA: "Comedy", wordB: "Drama" },
  { genre: "Arts", difficulty: "Hard", wordA: "Symphony", wordB: "Concerto" },
  { genre: "Arts", difficulty: "Hard", wordA: "Ballet", wordB: "Contemporary Dance" },
  { genre: "Arts", difficulty: "Hard", wordA: "Haiku", wordB: "Sonnet" },

  // ── Science & School ──────────────────────────────────────
  { genre: "Science", difficulty: "Easy", wordA: "Telescope", wordB: "Binoculars" },
  { genre: "Science", difficulty: "Easy", wordA: "Magnet", wordB: "Compass" },
  { genre: "Science", difficulty: "Medium", wordA: "Atom", wordB: "Molecule" },
  { genre: "Science", difficulty: "Medium", wordA: "Planet", wordB: "Moon" },
  { genre: "Science", difficulty: "Hard", wordA: "Gravity", wordB: "Magnetism" },
  { genre: "Science", difficulty: "Hard", wordA: "Virus", wordB: "Bacteria" },
  { genre: "Science", difficulty: "Hard", wordA: "Hypothesis", wordB: "Theory" },

  // ── Jobs & Everyday ───────────────────────────────────────
  { genre: "Jobs", difficulty: "Easy", wordA: "Doctor", wordB: "Nurse" },
  { genre: "Jobs", difficulty: "Easy", wordA: "Teacher", wordB: "Professor" },
  { genre: "Jobs", difficulty: "Easy", wordA: "Chef", wordB: "Baker" },
  { genre: "Jobs", difficulty: "Medium", wordA: "Pilot", wordB: "Astronaut" },
  { genre: "Jobs", difficulty: "Medium", wordA: "Detective", wordB: "Spy" },
  { genre: "Jobs", difficulty: "Medium", wordA: "Policeman", wordB: "Soldier" },
  { genre: "Jobs", difficulty: "Medium", wordA: "Journalist", wordB: "Blogger" },
  { genre: "Jobs", difficulty: "Hard", wordA: "Architect", wordB: "Interior Designer" },
  { genre: "Jobs", difficulty: "Hard", wordA: "Pharmacist", wordB: "Chemist" },

  // ── Emotions & Abstract (Harder, more party fun) ──────────
  { genre: "Abstract", difficulty: "Medium", wordA: "Dream", wordB: "Nightmare" },
  { genre: "Abstract", difficulty: "Medium", wordA: "Secret", wordB: "Rumor" },
  { genre: "Abstract", difficulty: "Hard", wordA: "Courage", wordB: "Confidence" },
  { genre: "Abstract", difficulty: "Hard", wordA: "Memory", wordB: "Nostalgia" },
  { genre: "Abstract", difficulty: "Hard", wordA: "Silence", wordB: "Whisper" },

  // ── Modern & Social (Curated Suggestions) ───────────────────
  { genre: "Apps & Social", difficulty: "Easy", wordA: "WhatsApp", wordB: "Telegram" },
  { genre: "Apps & Social", difficulty: "Easy", wordA: "YouTube", wordB: "Netflix" },
  { genre: "Apps & Social", difficulty: "Easy", wordA: "Instagram", wordB: "TikTok" },
  { genre: "Apps & Social", difficulty: "Medium", wordA: "Spotify", wordB: "Apple Music" },
  { genre: "Pop Culture", difficulty: "Easy", wordA: "Harry Potter", wordB: "Percy Jackson" },
  { genre: "Pop Culture", difficulty: "Easy", wordA: "Marvel", wordB: "DC" },
  { genre: "Pop Culture", difficulty: "Medium", wordA: "Superman", wordB: "Thor" },
  { genre: "Pop Culture", difficulty: "Medium", wordA: "Barbie", wordB: "Bratz" },
  { genre: "Pop Culture", difficulty: "Hard", wordA: "Joker", wordB: "Green Goblin" },
  { genre: "Pop Culture", difficulty: "Hard", wordA: "Sherlock Holmes", wordB: "Hercule Poirot" },
  { genre: "Gaming", difficulty: "Easy", wordA: "PlayStation", wordB: "Xbox" },
  { genre: "Gaming", difficulty: "Medium", wordA: "Chess", wordB: "Checkers" },
  { genre: "Food & Drinks", difficulty: "Easy", wordA: "French Fries", wordB: "Potato Chips" },
  { genre: "Food & Drinks", difficulty: "Easy", wordA: "Popcorn", wordB: "Nachos" },
  { genre: "Food & Drinks", difficulty: "Easy", wordA: "Hot Chocolate", wordB: "Cold Coffee" },
  { genre: "Food & Drinks", difficulty: "Medium", wordA: "Milkshake", wordB: "Smoothie" },
  { genre: "Everyday Life", difficulty: "Easy", wordA: "Alarm", wordB: "Clock" },
  { genre: "Everyday Life", difficulty: "Easy", wordA: "Selfie", wordB: "Photo" },
  { genre: "Everyday Life", difficulty: "Medium", wordA: "Wi-Fi", wordB: "Mobile Data" },
  { genre: "School & Work", difficulty: "Easy", wordA: "Exam", wordB: "Test" },
  { genre: "School & Work", difficulty: "Easy", wordA: "Homework", wordB: "Assignment" },
  { genre: "School & Work", difficulty: "Easy", wordA: "Teacher", wordB: "Principal" },
  { genre: "School & Work", difficulty: "Medium", wordA: "Compass", wordB: "Ruler" },
  { genre: "School & Work", difficulty: "Medium", wordA: "Backpack", wordB: "Handbag" },
  { genre: "School & Work", difficulty: "Hard", wordA: "Presentation", wordB: "Viva" },
  { genre: "School & Work", difficulty: "Hard", wordA: "Internship", wordB: "Job" },
  { genre: "Fantasy & Spooky", difficulty: "Easy", wordA: "Ghost", wordB: "Vampire" },
  { genre: "Fantasy & Spooky", difficulty: "Easy", wordA: "Dragon", wordB: "Dinosaur" },
  { genre: "Fantasy & Spooky", difficulty: "Medium", wordA: "Zombie", wordB: "Mummy" },
  { genre: "Fantasy & Spooky", difficulty: "Medium", wordA: "Witch", wordB: "Wizard" },
  { genre: "Fantasy & Spooky", difficulty: "Hard", wordA: "Alien", wordB: "Astronaut" },
  { genre: "Fantasy & Spooky", difficulty: "Hard", wordA: "Werewolf", wordB: "Bigfoot" },
  { genre: "Places & Travel", difficulty: "Easy", wordA: "Mall", wordB: "Supermarket" },
  { genre: "Places & Travel", difficulty: "Easy", wordA: "Swimming Pool", wordB: "Water Park" },
  { genre: "Places & Travel", difficulty: "Medium", wordA: "Picnic", wordB: "Camping" },
  { genre: "Places & Travel", difficulty: "Hard", wordA: "Hotel", wordB: "Resort" },
  { genre: "Fashion & Gadgets", difficulty: "Easy", wordA: "Power Bank", wordB: "Charger" },
  { genre: "Fashion & Gadgets", difficulty: "Medium", wordA: "Hoodie", wordB: "Jacket" },
  { genre: "Fashion & Gadgets", difficulty: "Medium", wordA: "Raincoat", wordB: "Umbrella" },
  { genre: "Fashion & Gadgets", difficulty: "Hard", wordA: "Shampoo", wordB: "Body Wash" },
  { genre: "Social & Party", difficulty: "Medium", wordA: "Lie", wordB: "Secret" },
  { genre: "Social & Party", difficulty: "Medium", wordA: "Prank", wordB: "Surprise" },

  // ── 🎬 Indian & Bollywood Movies ───────────────────────────
  { genre: "Indian Movies", difficulty: "Easy", wordA: "Baahubali", wordB: "RRR" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "KGF", wordB: "Pushpa" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "Pathaan", wordB: "Jawan" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Vikram", wordB: "Jailer" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Dhoom", wordB: "Race" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "DDLJ", wordB: "Kuch Kuch Hota Hai" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "Jab We Met", wordB: "Yeh Jawaani Hai Deewani" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Zindagi Na Milegi Dobara", wordB: "Dil Chahta Hai" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Devdas", wordB: "Bajirao Mastani" },
  { genre: "Indian Movies", difficulty: "Hard", wordA: "Om Shanti Om", wordB: "Main Hoon Na" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "Hera Pheri", wordB: "Welcome" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "Golmaal", wordB: "Housefull" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Bhool Bhulaiyaa", wordB: "Stree" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Hungama", wordB: "Hulchul" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "3 Idiots", wordB: "Chhichhore" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Lagaan", wordB: "Dangal" },
  { genre: "Indian Movies", difficulty: "Hard", wordA: "Munna Bhai M.B.B.S.", wordB: "PK" },
  { genre: "Indian Movies", difficulty: "Easy", wordA: "Drishyam", wordB: "Special 26" },
  { genre: "Indian Movies", difficulty: "Medium", wordA: "Singham", wordB: "Simmba" },
  { genre: "Indian Movies", difficulty: "Hard", wordA: "Tiger Zinda Hai", wordB: "War" },
  { genre: "Indian Movies", difficulty: "Hard", wordA: "Kantara", wordB: "Tumbbad" },

  // ── 🏡 Food, Home & Everyday Commute ───────────────────────
  { genre: "Food", difficulty: "Easy", wordA: "Samosa", wordB: "Aloo-Bada" },
  { genre: "Food", difficulty: "Easy", wordA: "Pani Puri", wordB: "Bhel Puri" },
  { genre: "Food", difficulty: "Medium", wordA: "Rasgulla", wordB: "Gulab Jamun" },
  { genre: "Food", difficulty: "Hard", wordA: "Chai", wordB: "Coffee" },
  { genre: "Home & Room", difficulty: "Medium", wordA: "Curtain", wordB: "Blinds" },
  { genre: "Home & Room", difficulty: "Medium", wordA: "Broom", wordB: "Vacuum Cleaner" },
  { genre: "Home & Room", difficulty: "Hard", wordA: "Balcony", wordB: "Veranda" },
  { genre: "Commute", difficulty: "Medium", wordA: "Helmet", wordB: "Seatbelt" },
];

/** Recommended role split by total player count (classic Undercover balance). */
export const ROLE_PRESETS = {
  3: { civilians: 2, undercovers: 1, mrWhite: 0 },
  4: { civilians: 3, undercovers: 1, mrWhite: 0 },
  5: { civilians: 3, undercovers: 1, mrWhite: 1 },
  6: { civilians: 4, undercovers: 1, mrWhite: 1 },
  7: { civilians: 4, undercovers: 2, mrWhite: 1 },
  8: { civilians: 5, undercovers: 2, mrWhite: 1 },
  9: { civilians: 5, undercovers: 2, mrWhite: 2 },
  10: { civilians: 6, undercovers: 2, mrWhite: 2 },
  11: { civilians: 6, undercovers: 3, mrWhite: 2 },
  12: { civilians: 7, undercovers: 3, mrWhite: 2 },
};

const SCORE = {
  CIVILIAN_WIN: 2,
  UNDERCOVER_WIN: 10,
  MR_WHITE_WIN: 6,
  MR_WHITE_SURVIVE_WITH_UC: 4, // survived while undercovers took over
  SURVIVAL_BONUS: 1,
};

export { SCORE };

const STORAGE_KEY_PLAYED_WORDS = "undercover_played_word_keys";

function loadPlayedKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLAYED_WORDS);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function savePlayedKeys(keysSet) {
  try {
    localStorage.setItem(STORAGE_KEY_PLAYED_WORDS, JSON.stringify([...keysSet]));
  } catch (e) {}
}

function getPairKey(pair) {
  return [pair.wordA, pair.wordB].map((w) => w.trim().toLowerCase()).sort().join("|");
}

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

/**
 * Pick a random unused pair, optionally filtered by difficulty.
 * Uses Web Crypto API (CSPRNG) and persistent localStorage history across games.
 * @param {'All'|'Easy'|'Medium'|'Hard'} difficulty
 */
export function getRandomWordPair(difficulty = "All") {
  let pool = WORD_DATABASE;
  if (difficulty && difficulty !== "All") {
    pool = WORD_DATABASE.filter((p) => p.difficulty === difficulty);
    if (pool.length === 0) pool = WORD_DATABASE;
  }

  const playedKeys = loadPlayedKeys();
  let available = pool.filter((p) => !playedKeys.has(getPairKey(p)));

  if (available.length === 0) {
    // Reset keys for this pool when all pairs have been played once
    pool.forEach((p) => playedKeys.delete(getPairKey(p)));
    savePlayedKeys(playedKeys);
    available = pool;
  }

  const idx = secureRandomInt(available.length);
  const pair = available[idx];
  playedKeys.add(getPairKey(pair));
  savePlayedKeys(playedKeys);

  // Randomly swap which side is civilian vs undercover using CSPRNG
  if (secureRandomInt(2) === 1) {
    return { genre: pair.genre, difficulty: pair.difficulty, wordA: pair.wordB, wordB: pair.wordA };
  }
  return { ...pair };
}
