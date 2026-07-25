// Tile-based house data for Potty Champ.
// Grid is 22 x 14 tiles, TILE = 24px. Rooms are additive across levels
// (each level unlocks more of the house). Coordinates are in tiles.

const TILE = 24;
const GRID_COLS = 22;
const GRID_ROWS = 14;

// Each room carries its own floor, so the house reads as a house instead of
// one endless wood plane. `floor` falls back to the scene/default if omitted.
const ROOMS = {
  livingRoom: { x: 1, y: 1, w: 8, h: 6, floor: 'floor_wood' },
  kitchen: { x: 12, y: 1, w: 8, h: 6, floor: 'floor_lino' },
  hallway: { x: 1, y: 7, w: 19, h: 2, floor: 'floor_wood' },
  bathroom1: { x: 1, y: 9, w: 5, h: 4, floor: 'floor_tile' },
  bedroom: { x: 7, y: 9, w: 8, h: 4, floor: 'floor_carpet' },
  mudroom: { x: 16, y: 9, w: 5, h: 4, floor: 'floor_tile' },
};

// ---- Home character: wall art, windows, ceiling fan, warm light pools ----
// Wall decor only renders on tiles that are actually drawn walls, so pieces
// tied to rooms that haven't opened yet simply don't appear.
const HOME_DECOR = [
  { type: 'decor_photo', x: 3, y: 0 },
  { type: 'decor_clock', x: 15, y: 0 },
  { type: 'decor_scribble', x: 6, y: 10 },   // toddler art on the hall wall
  { type: 'decor_chart', x: 15, y: 10 },     // growth chart by the bedroom
];
const HOME_WINDOWS = [
  { x: 6, y: 0 },
  { x: 18, y: 0 },
];
const HOME_FANS = [
  { x: 4.5, y: 2.5 },
];
const HOME_LIGHTS = [
  { x: 4.5, y: 3, r: 78, warm: true },
  { x: 16, y: 3, r: 74, warm: true },
  { x: 10, y: 8, r: 62, warm: true },
  { x: 3, y: 11, r: 54, warm: true },
  { x: 11, y: 11, r: 64, warm: true },
  { x: 18, y: 11, r: 54, warm: true },
];
// The cat patrols the hallway — pure ambience, no collision.
const HOME_CAT = { y: 7.6, xMin: 3, xMax: 17 };

// Furniture: blocking = collidable obstacle. Position is top-left tile.
const FURNITURE_BASE = [
  { type: "couch", x: 2, y: 1, wTiles: 3, hTiles: 1, blocking: true },
  { type: "tv", x: 7, y: 2, wTiles: 1, hTiles: 1, blocking: true },
  { type: "rug", x: 3, y: 4, wTiles: 2, hTiles: 2, blocking: false },
  { type: "oven_cake", x: 13, y: 1, wTiles: 1, hTiles: 1, blocking: true },
  { type: "table", x: 17, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "nail_table", x: 6, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  // lived-in clutter — never blocks, just makes the house feel real
  { type: "prop_cup", x: 6, y: 2, wTiles: 1, hTiles: 1, blocking: false },
  { type: "prop_bowl", x: 14, y: 4, wTiles: 1, hTiles: 1, blocking: false },
];

const FURNITURE_L2 = [
  { type: "crib", x: 8, y: 9, wTiles: 1, hTiles: 1, blocking: true },
  { type: "toybox", x: 13, y: 11, wTiles: 1, hTiles: 1, blocking: true },
  { type: "prop_blocks", x: 12, y: 11, wTiles: 1, hTiles: 1, blocking: false },
];

const FURNITURE_L3 = [
  { type: "laundry", x: 17, y: 9, wTiles: 1, hTiles: 1, blocking: true },
  { type: "prop_socks", x: 18, y: 10, wTiles: 1, hTiles: 1, blocking: false },
  { type: "prop_slippers", x: 17, y: 12, wTiles: 1, hTiles: 1, blocking: false },
];

const FURNITURE_L4 = [
  { type: "plant", x: 14, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "bookshelf", x: 8, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "plant", x: 12, y: 11, wTiles: 1, hTiles: 1, blocking: true },
];

// Nail salon scene: mom does the client's nails across the nail table.
// Both are decorative (no collision of their own); the table blocks.
const MOM_POS = { x: 5, y: 4 };
const CLIENT_POS = { x: 7, y: 4 };

// ---------- World 1: Home — 15 levels, gentle on-ramp ----------
// Difficulty rebases at ~2/10 on level 1 and slides to ~5.5/10 by level 15.
// Goals ramp 1+1 -> 4+4 (cap). Playdate levels bring a second kid to visit;
// from level 13 on, the playdate friend stays for good.
const HOME_NAMES = [
  'First Steps', 'Playdate!', 'The Bedroom Opens Up', 'Getting Busy',
  'The Whole House!', 'Poop Patrol', 'Full House Hustle', 'Playdate Returns!',
  'Speedy Toddler', 'Halfway Hero', 'No More Naps', 'Busy Busy House',
  'Playdate Party', 'Almost a Champ', 'Cake Day Chaos',
];
const HOME_GOALS = [
  [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4],
  [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4],
];

function homeLevel(n) {
  const t = (n - 1) / 14; // 0 at level 1 -> 1 at level 15
  // Rooms + furniture open up as the levels go on.
  let rooms, furniture, littleStart;
  if (n === 1) {
    rooms = [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1];
    furniture = [...FURNITURE_BASE];
    littleStart = { x: 5, y: 3 };
  } else if (n <= 3) {
    rooms = [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1, ROOMS.bedroom];
    furniture = [...FURNITURE_BASE, ...FURNITURE_L2];
    littleStart = { x: 9, y: 10 };
  } else if (n <= 6) {
    rooms = [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1, ROOMS.bedroom, ROOMS.mudroom];
    furniture = [...FURNITURE_BASE, ...FURNITURE_L2, ...FURNITURE_L3];
    littleStart = { x: 18, y: 10 };
  } else {
    rooms = [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1, ROOMS.bedroom, ROOMS.mudroom];
    furniture = [...FURNITURE_BASE, ...FURNITURE_L2, ...FURNITURE_L3, ...FURNITURE_L4];
    littleStart = n % 2 ? { x: 18, y: 10 } : { x: 9, y: 10 };
  }
  const playdate = n === 2 || n === 8 || n >= 13;   // 2-kid levels
  const extraEasy = n === 2 || n === 8;             // cameo playdates get training wheels
  const ease = extraEasy ? 1 : 0;
  return {
    label: `Level ${n} \u2013 ${HOME_NAMES[n - 1]}`,
    duration: 165,
    rooms, furniture,
    pottySpots: [{ x: 10.5, y: 8 }],
    mopSpot: { x: 5, y: 12 },
    bigStart: { x: 3, y: 5 },
    littleStart,
    peeGoal: HOME_GOALS[n - 1][0],
    poopGoal: HOME_GOALS[n - 1][1],
    kids: playdate ? 2 : 1,
    playdate,
    bonusAfter: n % 2 === 0 || n === 15,
    alertMin: +(9 - 5.5 * t + ease * 2).toFixed(2),
    alertMax: +(13 - 7.5 * t + ease * 3).toFixed(2),
    wanderSpeed: Math.round((34 + 32 * t) * (extraEasy ? 0.85 : 1)),
    fleeSpeed: Math.round((58 + 50 * t) * (extraEasy ? 0.85 : 1)),
    alertTimeLimit: +((14 - 6.5 * t) * (extraEasy ? 1.4 : 1)).toFixed(2),
  };
}

const LEVELS = Array.from({ length: 15 }, (_, i) => homeLevel(i + 1));

// ---------- World 2: The Park (open space — hard to corner him) ----------
const PARK_FURNITURE = [
  { type: "slide", x: 2, y: 2, wTiles: 4, hTiles: 3, blocking: true },      // the big slide
  { type: "swingset", x: 10, y: 2, wTiles: 4, hTiles: 3, blocking: true },
  { type: "sandbox", x: 16, y: 3, wTiles: 3, hTiles: 2, blocking: true },
  { type: "tree", x: 3, y: 8, wTiles: 1, hTiles: 2, blocking: true },
  { type: "tree", x: 12, y: 7, wTiles: 1, hTiles: 2, blocking: true },
  { type: "tree", x: 17, y: 6, wTiles: 1, hTiles: 2, blocking: true },
  { type: "bench", x: 6, y: 10, wTiles: 2, hTiles: 1, blocking: true },
  { type: "bench", x: 14, y: 10, wTiles: 2, hTiles: 1, blocking: true },
];

function parkLevel(n, tuning) {
  return Object.assign({
    label: `Park ${n}`,
    bonusAfter: n % 2 === 0 || n === 5,
    duration: 165,
    floorTile: 'grass',
    wallTile: 'fence',
    pottyImg: 'porta_potty',
    rooms: [{ x: 1, y: 1, w: 19, h: 12 }],
    furniture: PARK_FURNITURE,
    pottySpots: [{ x: 19.5, y: 11.5 }],   // far corner porta-potty — a real run
    mopSpot: { x: 2, y: 12 },
    bigStart: { x: 9, y: 11 },
    littleStart: { x: 11, y: 5 },
  }, tuning);
}

const LEVELS_PARK = [
  parkLevel(1, { alertMin: 6, alertMax: 9.5, wanderSpeed: 50, fleeSpeed: 88, alertTimeLimit: 11 }),
  parkLevel(2, { alertMin: 5.5, alertMax: 8.5, wanderSpeed: 54, fleeSpeed: 94, alertTimeLimit: 10 }),
  parkLevel(3, { alertMin: 5, alertMax: 7.5, wanderSpeed: 58, fleeSpeed: 100, alertTimeLimit: 9.5 }),
  parkLevel(4, { alertMin: 4.5, alertMax: 6.5, wanderSpeed: 62, fleeSpeed: 108, alertTimeLimit: 9 }),
  parkLevel(5, { alertMin: 3.5, alertMax: 5.5, wanderSpeed: 68, fleeSpeed: 114, alertTimeLimit: 8.5 }),
];

// ---------- World 3: Grocery Store (aisle maze — he vanishes around corners) ----------
const STORE_FURNITURE = [
  // aisle rows (each shelf is 2x1)
  { type: "shelf", x: 3, y: 3, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 5, y: 3, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 7, y: 3, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 12, y: 3, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 14, y: 3, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 16, y: 3, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 3, y: 6, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 5, y: 6, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 7, y: 6, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 12, y: 6, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 14, y: 6, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 16, y: 6, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 3, y: 9, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 5, y: 9, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 12, y: 9, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 14, y: 9, wTiles: 2, hTiles: 1, blocking: true },
  { type: "shelf", x: 16, y: 9, wTiles: 2, hTiles: 1, blocking: true },
  // stray carts + checkout
  { type: "cart", x: 10, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "cart", x: 9, y: 10, wTiles: 1, hTiles: 1, blocking: true },
  { type: "table", x: 4, y: 11, wTiles: 1, hTiles: 1, blocking: true },   // checkout counter
];

function storeLevel(n, tuning) {
  return Object.assign({
    label: `Store ${n}`,
    bonusAfter: n % 2 === 0 || n === 5,
    duration: 165,
    floorTile: 'floor_store',
    rooms: [{ x: 1, y: 1, w: 19, h: 12 }],
    furniture: STORE_FURNITURE,
    pottySpots: [{ x: 19.5, y: 1.5 }],    // restroom at the very back, of course
    mopSpot: { x: 2, y: 12 },             // "cleanup on aisle 4"
    bigStart: { x: 10, y: 12 },
    littleStart: { x: 10, y: 2 },
  }, tuning);
}

const LEVELS_STORE = [
  storeLevel(1, { alertMin: 5.5, alertMax: 8.5, wanderSpeed: 54, fleeSpeed: 96, alertTimeLimit: 10 }),
  storeLevel(2, { alertMin: 5, alertMax: 7.5, wanderSpeed: 58, fleeSpeed: 102, alertTimeLimit: 9.5 }),
  storeLevel(3, { alertMin: 4.5, alertMax: 7, wanderSpeed: 62, fleeSpeed: 110, alertTimeLimit: 9 }),
  storeLevel(4, { alertMin: 4, alertMax: 6, wanderSpeed: 66, fleeSpeed: 118, alertTimeLimit: 8.5 }),
  storeLevel(5, { alertMin: 3.2, alertMax: 5, wanderSpeed: 72, fleeSpeed: 124, alertTimeLimit: 8 }),
];

// ---------- World 4: School (many rooms — the final exam) ----------
const SCHOOL_ROOMS = {
  classA: { x: 1, y: 1, w: 9, h: 5, floor: 'floor_wood' },
  classB: { x: 12, y: 1, w: 8, h: 5, floor: 'floor_wood' },
  hallway: { x: 1, y: 6, w: 19, h: 3, floor: 'floor_lino_school' },
  cafeteria: { x: 4, y: 9, w: 13, h: 4, floor: 'floor_lino_school' },
};

const SCHOOL_FURNITURE = [
  // Classroom A — three rows of desks (aisles stay open between them)
  { type: "chalkboard", x: 2, y: 1, wTiles: 2, hTiles: 1, blocking: true },
  { type: "desk", x: 2, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 4, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 6, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 8, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 2, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 4, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 6, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 8, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 2, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 4, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 6, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 8, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  // Classroom B — three rows as well
  { type: "chalkboard", x: 14, y: 1, wTiles: 2, hTiles: 1, blocking: true },
  { type: "desk", x: 13, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 15, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 17, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 19, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 13, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 15, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 17, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 19, y: 4, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 13, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 15, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 17, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "desk", x: 19, y: 5, wTiles: 1, hTiles: 1, blocking: true },
  { type: "bookshelf", x: 10, y: 7, wTiles: 1, hTiles: 1, blocking: true },
  { type: "table", x: 6, y: 10, wTiles: 1, hTiles: 1, blocking: true },
  { type: "table", x: 10, y: 10, wTiles: 1, hTiles: 1, blocking: true },
  { type: "table", x: 13, y: 11, wTiles: 1, hTiles: 1, blocking: true },
  { type: "rug", x: 8, y: 12, wTiles: 1, hTiles: 1, blocking: false },
];

function schoolLevel(n, tuning) {
  return Object.assign({
    label: `School ${n}`,
    bonusAfter: n % 2 === 0 || n === 5,
    duration: 165,
    rooms: [SCHOOL_ROOMS.classA, SCHOOL_ROOMS.classB, SCHOOL_ROOMS.hallway, SCHOOL_ROOMS.cafeteria],
    furniture: SCHOOL_FURNITURE,
    pottySpots: [{ x: 19.5, y: 7.5 }],    // bathroom at the far end of the hall
    mopSpot: { x: 2, y: 7 },
    bigStart: { x: 3, y: 7 },
    littleStart: { x: 16, y: 3 },
  }, tuning);
}

const LEVELS_SCHOOL = [
  schoolLevel(1, { alertMin: 5, alertMax: 7.5, wanderSpeed: 58, fleeSpeed: 104, alertTimeLimit: 9.5 }),
  schoolLevel(2, { alertMin: 4.5, alertMax: 7, wanderSpeed: 62, fleeSpeed: 112, alertTimeLimit: 9 }),
  schoolLevel(3, { alertMin: 4, alertMax: 6, wanderSpeed: 66, fleeSpeed: 120, alertTimeLimit: 8.5 }),
  schoolLevel(4, { alertMin: 3.5, alertMax: 5.5, wanderSpeed: 70, fleeSpeed: 128, alertTimeLimit: 8 }),
  schoolLevel(5, { alertMin: 3, alertMax: 4.5, wanderSpeed: 76, fleeSpeed: 134, alertTimeLimit: 7.5 }),
];

// ---------- Worlds (unlocked in order; beat all 5 levels to open the next) ----------
const WORLDS = [
  { id: 'home', label: 'Home', icon: 'potty', momSalon: true, candy: false, levels: LEVELS },
  { id: 'park', label: 'The Park', icon: 'tree', momSalon: false, candy: true, levels: LEVELS_PARK },
  { id: 'store', label: 'Grocery Store', icon: 'cart', momSalon: false, candy: true, levels: LEVELS_STORE },
  { id: 'school', label: 'School', icon: 'chalkboard', momSalon: false, candy: true, twins: true, levels: LEVELS_SCHOOL },
];

// ---------- Backyard bonus round (runs after every 2nd level) ----------
const TOY_TYPES = ['toy_baseball', 'toy_football', 'toy_soccerball', 'toy_poolring'];

const BONUS_SCENE = {
  label: "Backyard Cleanup",
  floorTile: 'grass',
  wallTile: 'fence',
  rooms: [{ x: 1, y: 1, w: 19, h: 12 }],
  furniture: [
    { type: "pool", x: 2, y: 2, wTiles: 6, hTiles: 4, blocking: true },
    { type: "hot_tub", x: 8, y: 3, wTiles: 2, hTiles: 2, blocking: true },
    { type: "sandbox", x: 2, y: 8, wTiles: 3, hTiles: 2, blocking: true },
    { type: "swingset", x: 13, y: 2, wTiles: 4, hTiles: 3, blocking: true },
    { type: "toybox", x: 17, y: 9, wTiles: 1, hTiles: 1, blocking: true },
  ],
  chestSpot: { x: 17.5 * TILE, y: 9.5 * TILE },
  playerStart: { x: 10, y: 11 },
  presetToys: [
    { x: 5 * TILE, y: 11 * TILE, type: 'toy_baseball' },
    { x: 11 * TILE, y: 8 * TILE, type: 'toy_soccerball' },
    { x: 15 * TILE, y: 9 * TILE, type: 'toy_football' },
    { x: 6 * TILE, y: 7 * TILE, type: 'toy_poolring' },
  ],
};
