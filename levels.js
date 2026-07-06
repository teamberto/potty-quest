// Tile-based house data for Potty Champ.
// Grid is 22 x 14 tiles, TILE = 24px. Rooms are additive across levels
// (each level unlocks more of the house). Coordinates are in tiles.

const TILE = 24;
const GRID_COLS = 22;
const GRID_ROWS = 14;

const ROOMS = {
  livingRoom: { x: 1, y: 1, w: 8, h: 6 },
  kitchen: { x: 12, y: 1, w: 8, h: 6 },
  hallway: { x: 1, y: 7, w: 19, h: 2 },
  bathroom1: { x: 1, y: 9, w: 5, h: 4 },
  bedroom: { x: 7, y: 9, w: 8, h: 4 },
  mudroom: { x: 16, y: 9, w: 5, h: 4 },
};

// Furniture: blocking = collidable obstacle. Position is top-left tile.
const FURNITURE_BASE = [
  { type: "couch", x: 2, y: 1, wTiles: 3, hTiles: 1, blocking: true },
  { type: "tv", x: 7, y: 2, wTiles: 1, hTiles: 1, blocking: true },
  { type: "rug", x: 3, y: 4, wTiles: 2, hTiles: 2, blocking: false },
  { type: "oven_cake", x: 13, y: 1, wTiles: 1, hTiles: 1, blocking: true },
  { type: "table", x: 17, y: 3, wTiles: 1, hTiles: 1, blocking: true },
  { type: "nail_table", x: 6, y: 4, wTiles: 1, hTiles: 1, blocking: true },
];

const FURNITURE_L2 = [
  { type: "crib", x: 8, y: 9, wTiles: 1, hTiles: 1, blocking: true },
  { type: "toybox", x: 13, y: 11, wTiles: 1, hTiles: 1, blocking: true },
];

const FURNITURE_L3 = [
  { type: "laundry", x: 17, y: 9, wTiles: 1, hTiles: 1, blocking: true },
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

const LEVELS = [
  {
    label: "Level 1 – Downstairs",
    duration: 60,
    rooms: [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1],
    furniture: [...FURNITURE_BASE],
    pottySpots: [{ x: 10.5, y: 8 }],
    mopSpot: { x: 5, y: 12 },
    bigStart: { x: 3, y: 5 },
    littleStart: { x: 5, y: 3 },
    alertMin: 6.5, alertMax: 10,
    wanderSpeed: 44, fleeSpeed: 78,
    alertTimeLimit: 11,
  },
  {
    label: "Level 2 – The Bedroom Opens Up",
    duration: 60,
    rooms: [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1, ROOMS.bedroom],
    furniture: [...FURNITURE_BASE, ...FURNITURE_L2],
    pottySpots: [{ x: 10.5, y: 8 }],
    mopSpot: { x: 5, y: 12 },
    bigStart: { x: 3, y: 5 },
    littleStart: { x: 9, y: 10 },
    alertMin: 5.5, alertMax: 9,
    wanderSpeed: 50, fleeSpeed: 86,
    alertTimeLimit: 10,
  },
  {
    label: "Level 3 – The Whole House!",
    duration: 60,
    rooms: [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1, ROOMS.bedroom, ROOMS.mudroom],
    furniture: [...FURNITURE_BASE, ...FURNITURE_L2, ...FURNITURE_L3],
    pottySpots: [{ x: 10.5, y: 8 }],
    mopSpot: { x: 5, y: 12 },
    bigStart: { x: 3, y: 5 },
    littleStart: { x: 18, y: 10 },
    alertMin: 5, alertMax: 8,
    wanderSpeed: 56, fleeSpeed: 94,
    alertTimeLimit: 9,
  },
  {
    label: "Level 4 – Busy House",
    duration: 75,
    rooms: [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1, ROOMS.bedroom, ROOMS.mudroom],
    furniture: [...FURNITURE_BASE, ...FURNITURE_L2, ...FURNITURE_L3, ...FURNITURE_L4],
    pottySpots: [{ x: 10.5, y: 8 }],
    mopSpot: { x: 5, y: 12 },
    bigStart: { x: 3, y: 5 },
    littleStart: { x: 9, y: 10 },
    alertMin: 4, alertMax: 6.5,
    wanderSpeed: 60, fleeSpeed: 100,
    alertTimeLimit: 8.5,
  },
  {
    label: "Level 5 – Cake Day Chaos",
    duration: 90,
    rooms: [ROOMS.livingRoom, ROOMS.kitchen, ROOMS.hallway, ROOMS.bathroom1, ROOMS.bedroom, ROOMS.mudroom],
    furniture: [...FURNITURE_BASE, ...FURNITURE_L2, ...FURNITURE_L3, ...FURNITURE_L4],
    pottySpots: [{ x: 10.5, y: 8 }],
    mopSpot: { x: 5, y: 12 },
    bigStart: { x: 3, y: 5 },
    littleStart: { x: 18, y: 10 },
    alertMin: 3.5, alertMax: 5.5,
    wanderSpeed: 66, fleeSpeed: 108,
    alertTimeLimit: 7.5,
  },
];
