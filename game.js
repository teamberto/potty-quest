(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const timerEl = document.getElementById('timer');
  const starsEl = document.getElementById('stars');
  const scoreEl = document.getElementById('score');
  const heartsEl = document.getElementById('hearts');
  const heartImgs = heartsEl.querySelectorAll('img.heart');
  const turboFillEl = document.getElementById('turbo-fill');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayMessage = document.getElementById('overlay-message');
  const overlayButton = document.getElementById('overlay-button');
  const menuEl = document.getElementById('menu');
  const menuStartBtn = document.getElementById('menu-start');
  const menuIntroBtn = document.getElementById('menu-intro');
  const menuHowToPlayBtn = document.getElementById('menu-howtoplay');
  const menuHighscoreEl = document.getElementById('menu-highscore');
  const pauseBtn = document.getElementById('btn-pause');
  const howToPlayEl = document.getElementById('howtoplay');
  const htpStartBtn = document.getElementById('htp-start');
  const bonusHowtoEl = document.getElementById('bonus-howto');
  const bonusHowtoStartBtn = document.getElementById('bonus-howto-start');
  const menuLevelsBtn = document.getElementById('menu-levels');
  const levelSelectEl = document.getElementById('level-select');
  const lsWorldsEl = document.getElementById('ls-worlds');
  const lsLevelsEl = document.getElementById('ls-levels');
  const lsHintEl = document.getElementById('ls-hint');
  const lsBackBtn = document.getElementById('ls-back');
  const menuEndlessBtn = document.getElementById('menu-endless');
  const menuDashBtn = document.getElementById('menu-dash');
  const menuMayhemBtn = document.getElementById('menu-mayhem');
  const menuStickersBtn = document.getElementById('menu-stickers');
  const stickerBookEl = document.getElementById('sticker-book');
  const sbGridEl = document.getElementById('sb-grid');
  const sbCountEl = document.getElementById('sb-count');
  const sbBackBtn = document.getElementById('sb-back');
  const stickerToastEl = document.getElementById('sticker-toast');

  // ---------- Asset loading ----------
  const SPRITE_NAMES = [
    'big_down_0', 'big_down_1', 'big_up_0', 'big_up_1', 'big_side_0', 'big_side_1',
    'little_down_0', 'little_down_1', 'little_up_0', 'little_up_1', 'little_side_0', 'little_side_1',
    'mom', 'mom_alt', 'floor_wood', 'rug', 'wall', 'door',
    'couch', 'oven', 'oven_cake', 'table', 'tv', 'potty',
    'crib', 'toybox', 'laundry',
    'icon_pee', 'icon_poop', 'icon_star', 'heart_full', 'heart_empty',
    'stain_pee', 'stain_poop', 'cake_whole',
    'turbo_shoe', 'plant', 'bookshelf',
    'client', 'nail_table', 'mop',
    'icon_trophy',
    'toy_baseball', 'toy_football', 'toy_soccerball', 'toy_poolring',
    'grass', 'fence', 'pool', 'hot_tub', 'sandbox', 'swingset',
    'candy', 'tree', 'bench', 'porta_potty', 'shelf', 'cart', 'floor_store', 'desk', 'chalkboard',
  ];
  const images = {};
  let assetsLoaded = 0;
  function loadAssets(cb) {
    const total = SPRITE_NAMES.length;
    SPRITE_NAMES.forEach((name) => {
      const img = new Image();
      img.onload = () => { assetsLoaded++; if (assetsLoaded === total) cb(); };
      img.onerror = () => { assetsLoaded++; if (assetsLoaded === total) cb(); };
      img.src = `assets/${name}.png`;
      images[name] = img;
    });
  }

  // ---------- Canvas sizing ----------
  const WORLD_W = GRID_COLS * TILE;
  const WORLD_H = GRID_ROWS * TILE;
  let scale = 1, offsetX = 0, offsetY = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    scale = Math.max(1, Math.min(cw / WORLD_W, ch / WORLD_H));
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    offsetX = (cw - WORLD_W * scale) / 2;
    offsetY = (ch - WORLD_H * scale) / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);

  // ---------- Input ----------
  const input = { up: false, down: false, left: false, right: false, turbo: false };
  function bindHold(el, key) {
    const down = (e) => { e.preventDefault(); input[key] = true; };
    const up = (e) => { e.preventDefault(); input[key] = false; };
    el.addEventListener('touchstart', down, { passive: false });
    el.addEventListener('touchend', up, { passive: false });
    el.addEventListener('touchcancel', up, { passive: false });
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseup', up);
    el.addEventListener('mouseleave', up);
  }
  bindHold(document.getElementById('btn-turbo'), 'turbo');
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') input.up = true;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = true;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = true;
    if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      e.preventDefault();
      input.turbo = true;
    }
    if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') input.up = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = false;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = false;
    if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.turbo = false;
  });

  // ---------- Virtual joystick (bottom-left circular stick, touch + mouse) ----------
  (function initJoystick() {
    const base = document.getElementById('joystick-base');
    const knob = document.getElementById('joystick-knob');
    if (!base || !knob) return;

    const MAX_RADIUS = 46;  // px the knob can travel from center
    const DEADZONE = 10;    // px before a direction registers
    let pointerId = null;   // null = mouse drag, otherwise a touch identifier

    function baseCenter() {
      const r = base.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function setKnob(dx, dy) {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    function updateDirection(dx, dy) {
      input.up = input.down = input.left = input.right = false;
      if (Math.hypot(dx, dy) < DEADZONE) return;
      if (Math.abs(dx) > 0.5 * Math.abs(dy)) {
        if (dx > 0) input.right = true; else input.left = true;
      }
      if (Math.abs(dy) > 0.5 * Math.abs(dx)) {
        if (dy > 0) input.down = true; else input.up = true;
      }
    }

    function move(x, y) {
      const c = baseCenter();
      let dx = x - c.x, dy = y - c.y;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX_RADIUS) {
        const k = MAX_RADIUS / dist;
        dx *= k; dy *= k;
      }
      setKnob(dx, dy);
      updateDirection(dx, dy);
    }

    function release() {
      pointerId = null;
      base.classList.remove('active');
      setKnob(0, 0);
      input.up = input.down = input.left = input.right = false;
    }

    base.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      pointerId = t.identifier;
      base.classList.add('active');
      move(t.clientX, t.clientY);
    }, { passive: false });

    base.addEventListener('touchmove', (e) => {
      if (pointerId === null) return;
      for (const t of e.changedTouches) {
        if (t.identifier !== pointerId) continue;
        move(t.clientX, t.clientY);
      }
      e.preventDefault();
    }, { passive: false });

    const touchEnd = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === pointerId) release();
      }
    };
    base.addEventListener('touchend', touchEnd);
    base.addEventListener('touchcancel', touchEnd);

    base.addEventListener('mousedown', (e) => {
      e.preventDefault();
      base.classList.add('active');
      move(e.clientX, e.clientY);
      const onMove = (e2) => move(e2.clientX, e2.clientY);
      const onUp = () => {
        release();
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
  })();

  // ---------- Sound (WebAudio synth, no asset files) ----------
  const AudioFX = (() => {
    let actx = null;
    const live = [];
    const MUSIC_VOL = 0.05;
    const MUSIC_DUCK_VOL = 0.015;
    let musicGain = null;
    let musicPlaying = false;
    let musicTimer = null;
    function ensure() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!actx) {
        actx = new AC();
        musicGain = actx.createGain();
        musicGain.gain.value = 0;
        musicGain.connect(actx.destination);
      }
      if (actx.state === 'suspended') actx.resume();
      return actx;
    }
    function tone(freq, dur, opts = {}) {
      const c = ensure();
      if (!c) return;
      const { type = 'square', vol = 0.12, delay = 0, slide = 0, dest } = opts;
      const t0 = c.currentTime + delay;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slide) osc.frequency.linearRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(gain).connect(dest || c.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
      live.push(osc);
      if (live.length > 80) live.splice(0, 40);
    }
    // Soft looping backyard/house ambience, kept in a low register so it never
    // competes with the potty alert's 660/880Hz square-wave beep.
    const MUSIC_LOOP_SEC = 9.6;
    function scheduleMusicLoop() {
      const c = ensure();
      if (!c || !musicPlaying) return;
      const bass = [130.81, 130.81, 164.81, 196.00, 130.81, 130.81, 174.61, 196.00];
      const arp = [392.00, 523.25, 392.00, 493.88, 392.00, 523.25, 349.23, 440.00];
      const step = 1.2;
      bass.forEach((f, i) => tone(f, 1.1, { type: 'triangle', vol: 0.05, delay: i * step, dest: musicGain }));
      arp.forEach((f, i) => tone(f, 0.5, { type: 'triangle', vol: 0.03, delay: i * step + 0.15, dest: musicGain }));
      musicTimer = setTimeout(scheduleMusicLoop, MUSIC_LOOP_SEC * 1000);
    }
    function noise(dur, opts = {}) {
      const c = ensure();
      if (!c) return;
      const { vol = 0.08, delay = 0 } = opts;
      const t0 = c.currentTime + delay;
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      const gain = c.createGain();
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      src.connect(gain).connect(c.destination);
      src.start(t0);
    }
    return {
      unlock: ensure,
      stopAll() {
        for (const o of live) { try { o.stop(); } catch (e) {} }
        live.length = 0;
        musicPlaying = false;
        if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
        if (actx && musicGain) musicGain.gain.setValueAtTime(0, actx.currentTime);
      },
      introMusic() {
        const melody = [523, 659, 784, 659, 523, 659, 880, 784, 659, 784, 1047, 880, 784, 880, 1047, 1319];
        melody.forEach((f, i) => tone(f, 0.18, { type: 'square', vol: 0.09, delay: 0.35 + i * 0.42 }));
        const bass = [131, 165, 196, 165];
        for (let i = 0; i < 16; i++) {
          tone(bass[Math.floor(i / 4) % 4], 0.3, { type: 'triangle', vol: 0.07, delay: 0.35 + i * 0.42 });
        }
        tone(1568, 0.6, { type: 'square', vol: 0.1, delay: 7.2 });
      },
      startMusic() {
        const c = ensure();
        if (!c || musicPlaying) return;
        musicPlaying = true;
        musicGain.gain.cancelScheduledValues(c.currentTime);
        musicGain.gain.setValueAtTime(MUSIC_VOL, c.currentTime);
        scheduleMusicLoop();
      },
      stopMusic() {
        musicPlaying = false;
        if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
        if (actx && musicGain) musicGain.gain.setValueAtTime(0, actx.currentTime);
      },
      alert() {
        const c = ensure();
        if (c && musicGain) {
          const t0 = c.currentTime;
          musicGain.gain.cancelScheduledValues(t0);
          musicGain.gain.setValueAtTime(musicGain.gain.value, t0);
          musicGain.gain.linearRampToValueAtTime(MUSIC_DUCK_VOL, t0 + 0.05);
          musicGain.gain.linearRampToValueAtTime(musicPlaying ? MUSIC_VOL : 0, t0 + 0.6);
        }
        tone(660, 0.09); tone(880, 0.12, { delay: 0.09 });
      },
      catch() { tone(520, 0.07, { type: 'triangle', vol: 0.15 }); tone(700, 0.09, { type: 'triangle', vol: 0.15, delay: 0.06 }); },
      success() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, { type: 'triangle', vol: 0.14, delay: i * 0.09 })); },
      accident() { tone(220, 0.3, { type: 'sawtooth', vol: 0.12, slide: -130 }); noise(0.22, { vol: 0.05 }); },
      fanfare() { [523, 523, 659, 784, 659, 1047].forEach((f, i) => tone(f, 0.14, { vol: 0.1, delay: i * 0.11 })); },
      scrub() { noise(0.07, { vol: 0.05 }); },
      clean() { tone(784, 0.1, { type: 'triangle', vol: 0.13 }); tone(1175, 0.14, { type: 'triangle', vol: 0.13, delay: 0.08 }); },
      powerup() { [440, 660, 880].forEach((f, i) => tone(f, 0.08, { vol: 0.12, delay: i * 0.06 })); },
    };
  })();
  window.addEventListener('pointerdown', () => AudioFX.unlock());
  window.addEventListener('keydown', () => AudioFX.unlock());

  // ---------- Particles & screen shake ----------
  const particles = [];
  const GOLD_SPARK = ['#ffd23f', '#fff1b8', '#ffffff'];
  const PUFF_WHITE = ['#ffffff', '#e8e8e8', '#c9c9c9'];
  const SAD_BLUE = ['#6fb3ff', '#a8d0ff', '#ffffff'];
  const COOKIE_CRUMB = ['#dea85c', '#ffd23f', '#ffffff'];
  function spawnBurst(x, y, colors, count = 12, speed = 60) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.4 + Math.random() * 0.8);
      particles.push({
        x, y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 20,
        life: 0.5 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.floor(Math.random() * 2),
      });
    }
  }
  let shakeTime = 0, shakeMag = 0;
  function shake(mag, dur) { shakeMag = mag; shakeTime = dur; }
  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 90 * dt;
    }
    if (shakeTime > 0) shakeTime -= dt;
  }
  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 0.4));
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- Floating score popups ----------
  const floatingTexts = [];
  function spawnFloatText(x, y, text, color = '#ffe27a') {
    floatingTexts.push({ x, y, text, color, life: 1.1 });
  }
  function updateFloatingTexts(dt) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const f = floatingTexts[i];
      f.life -= dt;
      f.y -= 26 * dt;
      if (f.life <= 0) floatingTexts.splice(i, 1);
    }
  }
  function drawFloatingTexts() {
    ctx.textAlign = 'center';
    ctx.font = '800 13px -apple-system, "Helvetica Neue", sans-serif';
    for (const f of floatingTexts) {
      ctx.globalAlpha = Math.max(0, Math.min(1, f.life / 0.4));
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, Math.round(f.x), Math.round(f.y));
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // ---------- Collision helpers ----------
  function pointInRooms(px, py, rooms) {
    const tx = px / TILE, ty = py / TILE;
    for (const r of rooms) {
      if (tx >= r.x && tx <= r.x + r.w && ty >= r.y && ty <= r.y + r.h) return true;
    }
    return false;
  }

  function aabbOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function furniturePixelRect(f) {
    return { x: f.x * TILE, y: f.y * TILE, w: f.wTiles * TILE, h: f.hTiles * TILE };
  }

  // Collision box: a small "feet" box near the bottom-center of the sprite.
  function collBox(entity) {
    const cw = 14, ch = 9;
    return { x: entity.x + (entity.w - cw) / 2, y: entity.y + entity.h - ch - 2, w: cw, h: ch };
  }

  function canOccupy(entity, nx, ny, level) {
    const box = collBox({ x: nx, y: ny, w: entity.w, h: entity.h });
    const corners = [
      [box.x, box.y], [box.x + box.w, box.y],
      [box.x, box.y + box.h], [box.x + box.w, box.y + box.h],
    ];
    for (const [cx, cy] of corners) {
      if (!pointInRooms(cx, cy, level.rooms)) return false;
    }
    for (const f of level.furniture) {
      if (!f.blocking) continue;
      if (aabbOverlap(box, furniturePixelRect(f))) return false;
    }
    return true;
  }

  function moveWithCollision(entity, dx, dy, level) {
    if (dx !== 0) {
      const nx = entity.x + dx;
      if (canOccupy(entity, nx, entity.y, level)) entity.x = nx;
    }
    if (dy !== 0) {
      const ny = entity.y + dy;
      if (canOccupy(entity, entity.x, ny, level)) entity.y = ny;
    }
  }

  // ---------- Game state ----------
  const SPRITE_SIZE = 24;
  const PLAYER_SPEED = 128;
  const CATCH_RADIUS = 20;
  const POTTY_RADIUS = 22;
  const FOLLOW_OFFSET = 14; // how far behind the big brother the toddler tucks in
  const SPEED_ESCALATION_STEP = 3;   // every N successful saves this level...
  const SPEED_ESCALATION_MULT = 0.08; // ...the toddler gets this much faster (cumulative)
  const POOP_SPEED_MULT = 1.35;       // poop alerts flee faster than pee alerts (harder to catch)
  const POOP_EXTRA_TIME = 5;          // poop alerts give this many more seconds than pee (offsets the harder chase)
  const POOP_JUKE_MAX_ANGLE = 1.2;    // radians (~69°): how sharply a poop-toddler can dart sideways to juke you
  const POOP_JUKE_MIN_INTERVAL = 0.4; // seconds between juke direction changes (min)
  const POOP_JUKE_MAX_INTERVAL = 0.9; // seconds between juke direction changes (max)

  // Candy turbo (Park onward): if the toddler reaches a candy before you do,
  // he goes turbo. Grab it first to bank points instead.
  const CANDY_TURBO_MULT = 1.6;
  const CANDY_TURBO_TIME = 6;      // seconds of toddler turbo
  const CANDY_LIFE = 8;            // seconds a candy sits on the floor
  const CANDY_RADIUS = 15;
  const CANDY_PLAYER_POINTS = 75;  // reward for snatching it before him

  // Escape jolt: the instant an alert starts, the toddler bursts straight away
  // from the player for a beat — so you can't just ride his hip and wait.
  const ALERT_JOLT_TIME = 0.45;    // seconds of burst
  const ALERT_JOLT_MULT = 2.4;     // speed multiplier during the burst

  // Twins levels are the hardest in the game, so the player gets help there:
  const TWINS_ALERT_TIME_BONUS = 2;   // extra seconds on every alert countdown
  const TWINS_TURBO_BONUS = 2.5;      // extra seconds of sprint in the power bar

  const PEE_POINTS = 100;
  const POOP_POINTS = 160;
  const TIME_BONUS_PER_SEC = 12;   // x seconds left on the alert clock at delivery
  const TROPHY_POINTS = 300;
  const TOY_POINTS = 60;           // bonus round, per toy delivered

  // Level goal: rescue this many of each before the level is complete. No timer
  // — you finish by hitting the quota, and it's game over if you run out of hearts.
  const PEE_QUOTA = 6;
  const POOP_QUOTA = 7;

  let worldIndex = 0;
  let levelIndex = 0;
  let level = WORLDS[0].levels[0];
  let endlessMode = false;
  let endlessDay = 1;
  let endlessWorldIdx = 0;
  let mayhemMode = false;
  let mayhemSaves = 0;
  let mayhemAlertTimer = 2;
  function worldNow() { return WORLDS[endlessMode ? endlessWorldIdx : worldIndex]; }
  let timeRemaining = 0;
  let starsThisLevel = 0;
  let peesFixedThisLevel = 0;
  let poopsFixedThisLevel = 0;
  let trophyGrabbedThisLevel = false;
  let savesStreakThisLevel = 0;
  let starsTotal = 0;
  let accidentsThisLevel = 0;
  let accidentsTotal = 0;
  let scoreThisLevel = 0;
  let scoreTotal = 0;
  let hearts = 3;
  let stains = [];
  let gameState = 'splash'; // splash | intro | menu | playing | paused | levelComplete | bonusRound | bonusComplete | ending
  let animClock = 0;
  let introTime = 0;
  let introSavedBurst = false;
  let introSparkTimer = 0;
  let peeSavedRun = 0;
  let poopSavedRun = 0;

  function loadBest() {
    try {
      const b = JSON.parse(localStorage.getItem('pottychamp_best')) || {};
      return { pee: b.pee || 0, poop: b.poop || 0, total: b.total || 0, score: b.score || 0 };
    } catch (e) { return { pee: 0, poop: 0, total: 0, score: 0 }; }
  }
  function saveBest(b) {
    try { localStorage.setItem('pottychamp_best', JSON.stringify(b)); } catch (e) {}
  }
  function hasSeenTutorial() {
    try { return localStorage.getItem('pottychamp_seen_tutorial') === '1'; } catch (e) { return false; }
  }
  function markTutorialSeen() {
    try { localStorage.setItem('pottychamp_seen_tutorial', '1'); } catch (e) {}
  }
  function hasSeenBonusHowto() {
    try { return localStorage.getItem('pottychamp_seen_bonus_howto') === '1'; } catch (e) { return false; }
  }
  function markBonusHowtoSeen() {
    try { localStorage.setItem('pottychamp_seen_bonus_howto', '1'); } catch (e) {}
  }

  // ---------- World progress (stars + unlocks) ----------
  const PROGRESS_KEY = 'pottychamp_progress_v1';
  function loadProgress() {
    try {
      const p = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
      p.stars = p.stars || {};
      p.unlocked = p.unlocked || { home: true };
      p.unlocked.home = true; // home is always open
      p.stickers = p.stickers || {};
      p.counters = Object.assign({ trophies: 0, candies: 0 }, p.counters || {});
      p.endlessBest = p.endlessBest || 0;
      p.dashBest = p.dashBest || 0;
      p.mayhemBest = p.mayhemBest || 0;
      return p;
    } catch (e) {
      return { stars: {}, unlocked: { home: true }, stickers: {}, counters: { trophies: 0, candies: 0 }, endlessBest: 0, dashBest: 0, mayhemBest: 0 };
    }
  }
  const progress = loadProgress();
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) {}
  }
  function starsFor(worldId, idx) {
    const a = progress.stars[worldId] || [];
    return a[idx] || 0;
  }
  function recordStars(worldId, idx, s) {
    const a = progress.stars[worldId] || (progress.stars[worldId] = []);
    if ((a[idx] || 0) < s) { a[idx] = s; saveProgress(); }
  }
  function isWorldUnlocked(w) { return !!progress.unlocked[w.id]; }
  function isWorldComplete(w) { return w.levels.every((_, i) => starsFor(w.id, i) > 0); }
  function isWorldPerfect(w) { return w.levels.every((_, i) => starsFor(w.id, i) >= 3); }
  function isLevelPlayable(w, idx) { return idx === 0 || starsFor(w.id, idx - 1) > 0; }
  function starString(n) { return '★'.repeat(n) + '☆'.repeat(Math.max(0, 3 - n)); }

  // ---------- Sticker book ----------
  const STICKERS = [
    { id: 'first_pee', name: 'First Splash', icon: 'icon_pee', hint: 'Save your first pee.' },
    { id: 'first_poop', name: 'Code Brown Hero', icon: 'icon_poop', hint: 'Save your first poop.' },
    { id: 'combo_5', name: 'Hot Streak', icon: 'icon_star', hint: '5 saves in a row in one level.' },
    { id: 'clean_level', name: 'Squeaky Clean', icon: 'mop', hint: 'Finish a level with zero accidents.' },
    { id: 'three_star', name: 'Perfectionist', icon: 'icon_trophy', hint: 'Earn ★★★ on any level.' },
    { id: 'star_student', name: 'Star Student', icon: 'icon_star', hint: '★★★ every level in a world.' },
    { id: 'trophy_5', name: 'Trophy Hunter', icon: 'icon_trophy', hint: 'Grab 5 trophies.' },
    { id: 'candy_10', name: 'Candy Guardian', icon: 'candy', hint: 'Snatch 10 candies before Champ.' },
    { id: 'turbo_tamer', name: 'Zoomies Wrangler', icon: 'turbo_shoe', hint: 'Catch Champ mid sugar rush.' },
    { id: 'toy_8', name: 'Toy Tornado', icon: 'toybox', hint: 'Stash 8 toys in one bonus round.' },
    { id: 'world_home', name: 'Home Hero', icon: 'potty', hint: 'Clear every Home level.' },
    { id: 'world_park', name: 'Park Ranger', icon: 'tree', hint: 'Clear every Park level.' },
    { id: 'world_store', name: 'Aisle Boss', icon: 'cart', hint: 'Clear every Grocery Store level.' },
    { id: 'world_school', name: 'Hall Monitor', icon: 'chalkboard', hint: 'Clear every School level.' },
    { id: 'endless_10', name: 'Marathon Champ', icon: 'cake_whole', hint: 'Reach Day 10 in Endless Mode.' },
    { id: 'dash_500', name: 'Road Runner', icon: 'little_up_0', hint: 'Dash 500 m in Potty Dash.' },
    { id: 'mayhem_15', name: 'Crowd Control', icon: 'little_down_0', hint: 'Save 15 kids in one Potty Mayhem.' },
  ];
  function stickerCount() { return STICKERS.filter((s) => progress.stickers[s.id]).length; }

  const toastQueue = [];
  let toastShowing = false;
  function showNextToast() {
    if (toastShowing || toastQueue.length === 0) return;
    const st = toastQueue.shift();
    toastShowing = true;
    stickerToastEl.innerHTML =
      `<img src="assets/${st.icon}.png" alt=""><div><strong>Sticker earned!</strong><br>${st.name}</div>`;
    stickerToastEl.classList.add('show');
    setTimeout(() => {
      stickerToastEl.classList.remove('show');
      setTimeout(() => { toastShowing = false; showNextToast(); }, 350);
    }, 2600);
  }
  function awardSticker(id) {
    if (progress.stickers[id]) return;
    const st = STICKERS.find((s) => s.id === id);
    if (!st) return;
    progress.stickers[id] = true;
    saveProgress();
    toastQueue.push(st);
    showNextToast();
  }
  const TURBO_MAX = 5;      // seconds of turbo in a full power bar
  function maxTurbo() { return TURBO_MAX + (worldNow().twins ? TWINS_TURBO_BONUS : 0); }
  const TURBO_MULT = 1.6;
  let turboMeter = maxTurbo();
  let turboSparkTimer = 0;
  const shoePickup = { active: false, x: 0, y: 0, life: 0, respawnIn: 8 };
  const candyPickup = { active: false, x: 0, y: 0, life: 0, respawnIn: 10 };
  const SCRUB_TIME = 1.3;
  const SCRUB_RADIUS = 26;
  const MOP_RESPAWN = 4;
  let hasMop = false;
  let mopAvailable = true;
  let mopRespawnTimer = 0;

  // ---------- Backyard bonus round ----------
  const BONUS_DURATION = 60;
  const TOY_PICKUP_RADIUS = 14;
  const CHEST_RADIUS = 20;
  const MAX_GROUND_TOYS = 5;
  let bonusTimeRemaining = 0;
  let bonusScore = 0;
  let toysCollected = 0;
  let carriedToy = null;
  let bonusToys = [];
  let bonusSpawnTimer = 0;

  const player = { x: 0, y: 0, w: SPRITE_SIZE, h: SPRITE_SIZE, facing: 'down', moving: false, animFrame: 0 };
  function makeToddler() {
    return {
      x: 0, y: 0, w: SPRITE_SIZE, h: SPRITE_SIZE, facing: 'down', moving: false, animFrame: 0,
      state: 'wander', wanderTarget: null, stuckTimer: 0,
      alertActive: false, alertType: null, alertTimeRemaining: 0, nextAlertIn: 0,
      relieveTimer: 0, jukeTimer: 0, jukeAngle: 0,
      turboTimer: 0, sparkTimer: 0, isTwin: false, joltTimer: 0,
    };
  }
  let toddlers = [makeToddler()];
  let playerCurrentSpeed = 0;

  const TROPHY_RADIUS = 18;
  const trophy = { active: false, x: 0, y: 0, life: 0, spawnedThisLevel: false, spawnOnAlertIndex: 0 };
  let alertCount = 0;

  function tileToPx(t) { return { x: t.x * TILE, y: t.y * TILE }; }

  {
    const bp = tileToPx(level.bigStart);
    player.x = bp.x; player.y = bp.y;
    const lp = tileToPx(level.littleStart);
    toddlers[0].x = lp.x; toddlers[0].y = lp.y;
  }

  function randRange(a, b) { return a + Math.random() * (b - a); }

  function pickRandomRoomPoint(rooms) {
    const r = rooms[Math.floor(Math.random() * rooms.length)];
    const margin = 0.6;
    const rx = randRange(r.x + margin, r.x + r.w - margin);
    const ry = randRange(r.y + margin, r.y + r.h - margin);
    return { x: rx * TILE, y: ry * TILE };
  }

  // Like pickRandomRoomPoint, but retries a few times to avoid landing on
  // top of blocking furniture (pool, sandbox, etc.) in scenes that are mostly one big room.
  function pickRandomOpenPoint(scene) {
    let p = pickRandomRoomPoint(scene.rooms);
    for (let tries = 0; tries < 8; tries++) {
      const box = { x: p.x - 4, y: p.y - 4, w: 8, h: 8 };
      const blocked = scene.furniture.some((f) => f.blocking && aabbOverlap(box, furniturePixelRect(f)));
      if (!blocked) break;
      p = pickRandomRoomPoint(scene.rooms);
    }
    return p;
  }

  function startLevel(idx) {
    levelIndex = idx;
    level = worldNow().levels[idx];
    initLevelState();
  }

  // Endless mode: rotates through the four locations, one "day" each, and the
  // tuning tightens a little every day. How far can you go?
  function startEndlessDay(n) {
    endlessMode = true;
    endlessDay = n;
    endlessWorldIdx = (n - 1) % WORLDS.length;
    const base = WORLDS[endlessWorldIdx].levels[WORLDS[endlessWorldIdx].levels.length - 1];
    const k = n - 1;
    level = Object.assign({}, base, {
      label: `Day ${n}`,
      alertMin: Math.max(2.2, base.alertMin - 0.12 * k),
      alertMax: Math.max(3.4, base.alertMax - 0.16 * k),
      wanderSpeed: Math.min(95, base.wanderSpeed + 1.5 * k),
      fleeSpeed: Math.min(185, base.fleeSpeed + 2.5 * k),
      alertTimeLimit: Math.max(6, base.alertTimeLimit - 0.08 * k),
    });
    levelIndex = WORLDS[endlessWorldIdx].levels.length - 1;
    initLevelState();
  }

  function startEndlessRun() {
    hideMenu();
    mayhemMode = false;
    starsTotal = 0;
    accidentsTotal = 0;
    scoreTotal = 0;
    peeSavedRun = 0;
    poopSavedRun = 0;
    startEndlessDay(1);
  }

  function initLevelState() {
    timeRemaining = level.duration;
    starsThisLevel = 0;
    peesFixedThisLevel = 0;
    poopsFixedThisLevel = 0;
    accidentsThisLevel = 0;
    scoreThisLevel = 0;
    savesStreakThisLevel = 0;
    trophyGrabbedThisLevel = false;
    candyPickup.active = false;
    candyPickup.respawnIn = randRange(7, 12);
    trophy.active = false;
    trophy.spawnedThisLevel = false;
    trophy.spawnOnAlertIndex = 2 + Math.floor(Math.random() * 3); // spawns with the level's 2nd-4th alert
    alertCount = 0;
    hearts = 3;
    stains = [];
    particles.length = 0;
    turboMeter = maxTurbo();
    shoePickup.active = false;
    shoePickup.respawnIn = randRange(6, 10);
    hasMop = false;
    mopAvailable = true;
    mopRespawnTimer = 0;

    const bp = tileToPx(level.bigStart);
    player.x = bp.x; player.y = bp.y; player.facing = 'down'; player.moving = false;

    // Spawn the toddler — and his twin, in worlds marked twins (School!).
    toddlers = [makeToddler()];
    if (worldNow().twins) {
      const twin = makeToddler();
      twin.isTwin = true;
      toddlers.push(twin);
    }
    toddlers.forEach((t, i) => {
      const lp = tileToPx(level.littleStart);
      t.x = lp.x + i * TILE; t.y = lp.y;
      t.wanderTarget = pickRandomRoomPoint(level.rooms);
      // stagger the twin's first alert so they don't both scream at once (at first)
      t.nextAlertIn = randRange(level.alertMin, level.alertMax) + i * 3;
    });

    updateHud();
    gameState = 'playing';
    hideOverlay();
    AudioFX.startMusic();
  }

  function showOverlay(title, message, buttonText, extraHtml) {
    overlayTitle.textContent = title;
    overlayMessage.innerHTML = message + (extraHtml || '');
    overlayButton.textContent = buttonText;
    overlay.classList.remove('hidden');
  }
  function hideOverlay() { overlay.classList.add('hidden'); }

  function updateHud() {
    if (mayhemMode) {
      const m = Math.floor(Math.max(0, timeRemaining) / 60);
      const s = Math.floor(Math.max(0, timeRemaining) % 60);
      timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
      starsEl.textContent = `Saved: ${mayhemSaves}`;
      scoreEl.textContent = `${scoreThisLevel} pts`;
      return;
    }
    // Goal progress replaces the old countdown clock.
    timerEl.textContent = `\u{1F4A7} ${peesFixedThisLevel}/${PEE_QUOTA}  \u{1F4A9} ${poopsFixedThisLevel}/${POOP_QUOTA}`;
    starsEl.textContent = `★ ${starsThisLevel}`;
    scoreEl.textContent = `${scoreThisLevel} pts`;
    heartImgs.forEach((img, i) => {
      img.src = i < hearts ? 'assets/heart_full.png' : 'assets/heart_empty.png';
    });
    turboFillEl.style.width = `${(turboMeter / maxTurbo()) * 100}%`;
  }

  function updateBonusHud() {
    const m = Math.floor(Math.max(0, bonusTimeRemaining) / 60);
    const s = Math.floor(Math.max(0, bonusTimeRemaining) % 60);
    timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    starsEl.textContent = `\u{1F9F8} ${toysCollected}`;
    scoreEl.textContent = `${bonusScore} pts`;
    turboFillEl.style.width = `${(turboMeter / maxTurbo()) * 100}%`;
  }

  // ---------- Menu / intro / pause flow ----------
  function showMenu() {
    gameState = 'menu';
    AudioFX.stopMusic();
    hideOverlay();
    const b = loadBest();
    menuHighscoreEl.textContent = b.score > 0
      ? `\u{1F3C6} Best run: ${b.score} pts (${b.total} saves — ${b.pee} pees, ${b.poop} poops)`
      : 'No high score yet — be the first Potty Champ!';
    // Endless mode opens once School is fully cleared.
    if (menuEndlessBtn) {
      const schoolDone = isWorldComplete(WORLDS[WORLDS.length - 1]);
      menuEndlessBtn.classList.toggle('hidden', !schoolDone);
      menuEndlessBtn.innerHTML = progress.endlessBest > 0
        ? `\u{267E}\u{FE0F} Endless — Best: Day ${progress.endlessBest}`
        : '\u{267E}\u{FE0F} Endless Mode';
    }
    // Potty Dash + Potty Mayhem: always playable from the menu.
    if (menuDashBtn) {
      menuDashBtn.innerHTML = progress.dashBest > 0
        ? `\u{1F3C3} Potty Dash — Best: ${progress.dashBest} m`
        : '\u{1F3C3} Potty Dash';
    }
    if (menuMayhemBtn) {
      menuMayhemBtn.innerHTML = progress.mayhemBest > 0
        ? `\u{1F579} Potty Mayhem — Best: ${progress.mayhemBest} pts`
        : '\u{1F579} Potty Mayhem';
    }
    if (menuStickersBtn) {
      menuStickersBtn.innerHTML = `\u{1F4D6} Sticker Book (${stickerCount()}/${STICKERS.length})`;
    }
    menuEl.classList.remove('hidden');
  }

  function openStickerBook() {
    hideMenu();
    sbGridEl.innerHTML = '';
    for (const st of STICKERS) {
      const earned = !!progress.stickers[st.id];
      const card = document.createElement('div');
      card.className = 'sb-card' + (earned ? ' earned' : '');
      card.innerHTML = earned
        ? `<img src="assets/${st.icon}.png" alt=""><span class="sb-name">${st.name}</span><span class="sb-hint">${st.hint}</span>`
        : `<span class="sb-mystery">?</span><span class="sb-name">???</span><span class="sb-hint">${st.hint}</span>`;
      sbGridEl.appendChild(card);
    }
    sbCountEl.textContent = `${stickerCount()} / ${STICKERS.length} collected`;
    stickerBookEl.classList.remove('hidden');
  }
  function hideMenu() { menuEl.classList.add('hidden'); }

  function startIntro() {
    hideOverlay();
    hideMenu();
    AudioFX.unlock();
    AudioFX.stopAll();
    gameState = 'intro';
    introTime = 0;
    introSavedBurst = false;
    introSparkTimer = 0;
    particles.length = 0;
    AudioFX.introMusic();
  }
  function finishIntro() {
    AudioFX.stopAll();
    particles.length = 0;
    showMenu();
  }

  let pausedFrom = 'playing';
  function togglePause() {
    if (gameState === 'playing' || gameState === 'bonusRound') {
      pausedFrom = gameState;
      gameState = 'paused';
      AudioFX.stopMusic();
      showOverlay('Paused', 'Take a breather — your brother can hold it. Probably.', 'Resume');
    } else if (gameState === 'paused') {
      gameState = pausedFrom;
      hideOverlay();
      AudioFX.startMusic();
    }
  }

  function startBonusRound() {
    gameState = 'bonusRound';
    bonusTimeRemaining = BONUS_DURATION;
    bonusScore = 0;
    toysCollected = 0;
    carriedToy = null;
    bonusToys = BONUS_SCENE.presetToys.map((t) => ({ ...t }));
    bonusSpawnTimer = randRange(4, 7);
    turboMeter = maxTurbo();
    particles.length = 0;
    const sp = BONUS_SCENE.playerStart;
    player.x = sp.x * TILE; player.y = sp.y * TILE; player.facing = 'down'; player.moving = false;
    heartsEl.style.display = 'none';
    updateBonusHud();
    hideOverlay();
    AudioFX.startMusic();
  }

  function endBonusRound() {
    gameState = 'bonusComplete';
    heartsEl.style.display = '';
    scoreTotal += bonusScore;
    AudioFX.stopMusic();
    AudioFX.fanfare();
    if (toysCollected >= 8) awardSticker('toy_8');
    const isLast = !endlessMode && levelIndex + 1 >= worldNow().levels.length;
    showOverlay(
      'Yard Cleanup complete!',
      `Toys collected: ${toysCollected} &nbsp;|&nbsp; +${bonusScore} pts`,
      isLast ? 'See Results' : (endlessMode ? `On to Day ${endlessDay + 1}!` : 'Next Level')
    );
  }

  // ---------- Potty Mayhem (arcade mode: one house, one potty, LOTS of kids) ----------
  // ~24 Champs wander the whole house. The director picks who suddenly has to
  // go — figure out who's alerting, grab them, deliver. 2 minutes, high score.
  const MAYHEM_TIME = 120;
  const MAYHEM_KIDS = 24;
  const MAYHEM_MISS_PENALTY = 100;
  const MAYHEM_MAX_ALERTS_CAP = 4;

  function mayhemMaxAlerts() {
    return Math.min(MAYHEM_MAX_ALERTS_CAP, 1 + Math.floor((MAYHEM_TIME - timeRemaining) / 25));
  }
  function mayhemActiveAlerts() {
    return toddlers.reduce((n, t) => n + (t.alertActive ? 1 : 0), 0);
  }

  function startMayhem() {
    hideMenu();
    endlessMode = false;
    worldIndex = 0;             // home flags (mom's salon says hi)
    mayhemMode = true;
    mayhemSaves = 0;
    mayhemAlertTimer = 2.5;
    level = Object.assign({}, WORLDS[0].levels[4], {
      label: 'Potty Mayhem',
      alertTimeLimit: 11,
      fleeSpeed: 88,
      wanderSpeed: 40,
    });
    levelIndex = 4;
    initLevelState();
    timeRemaining = MAYHEM_TIME;
    // replace the standard toddler spawn with the crowd
    toddlers = [];
    for (let i = 0; i < MAYHEM_KIDS; i++) {
      const t = makeToddler();
      const p = pickRandomOpenPoint(level);
      t.x = p.x - t.w / 2; t.y = p.y - t.h / 2;
      t.wanderTarget = pickRandomRoomPoint(level.rooms);
      t.nextAlertIn = Infinity;  // the director decides who alerts, not the kids
      toddlers.push(t);
    }
    trophy.active = false;
    trophy.spawnedThisLevel = true; // no trophies in the chaos
    heartsEl.style.display = 'none';
    updateHud();
  }

  // Called every frame while mayhem runs: paces the alert chaos.
  function updateMayhemDirector(dt) {
    mayhemAlertTimer -= dt;
    if (mayhemAlertTimer > 0) return;
    const elapsed = MAYHEM_TIME - timeRemaining;
    mayhemAlertTimer = randRange(Math.max(1.6, 4.5 - elapsed / 45), Math.max(2.6, 6 - elapsed / 45));
    if (mayhemActiveAlerts() >= mayhemMaxAlerts()) return;
    const calm = toddlers.filter((t) => !t.alertActive && t.state === 'wander');
    if (calm.length === 0) return;
    const t = calm[Math.floor(Math.random() * calm.length)];
    t.alertActive = true;
    t.alertType = Math.random() < 0.55 ? 'pee' : 'poop';
    t.alertTimeRemaining = level.alertTimeLimit + (t.alertType === 'poop' ? POOP_EXTRA_TIME : 0);
    t.jukeTimer = 0;
    t.jukeAngle = 0;
    t.joltTimer = ALERT_JOLT_TIME;
    t.state = 'fleeing';
    const tc = centerOf(t);
    spawnBurst(tc.x, tc.y + 8, PUFF_WHITE, 6, 55);
    AudioFX.alert();
  }

  function endMayhem() {
    mayhemMode = false;
    gameState = 'mayhemOver';
    AudioFX.stopMusic();
    AudioFX.fanfare();
    heartsEl.style.display = '';
    if (scoreThisLevel > progress.mayhemBest) { progress.mayhemBest = scoreThisLevel; saveProgress(); }
    if (mayhemSaves >= 15) awardSticker('mayhem_15');
    showOverlay(
      'MAYHEM over!',
      `Kids saved: <strong>${mayhemSaves}</strong> &nbsp;|&nbsp; Score: ${scoreThisLevel} pts` +
      `<br><small>Best mayhem: ${progress.mayhemBest} pts</small>`,
      'Back to Menu'
    );
  }

  // ---------- Potty Dash (lane-runner mode, unlocked after the Park) ----------
  // Champ REALLY has to go and he's sprinting down the street to the potty.
  // Swipe (or arrow keys) to change lanes, grab candy and toys, dodge the mess.
  // Characters are drawn extra-big here for that arcade feel.
  const DASH_LANES = 3;
  const DASH_LANE_W = 64;
  const DASH_START_SPEED = 210;    // px/s scroll at the start
  const DASH_MAX_SPEED = 520;
  const DASH_ACCEL = 7;            // px/s gained per second
  const DASH_MAX_HITS = 3;         // boo-boos before the run ends
  const DASH_CHAR_SCALE = 2;       // 2x sprites — big chunky runners
  const DASH_STICKER_M = 500;      // Road Runner sticker distance

  let dashScroll = 0;
  let dashSpeed = DASH_START_SPEED;
  let dashScore = 0;
  let dashHits = 0;
  let dashLane = 1;
  let dashChampLane = 1;
  let dashChampLaneDelay = 0;
  let dashObjs = [];
  let dashSpawnGap = 0;
  let dashInvincible = 0;
  let dashPrevLeft = false, dashPrevRight = false;
  let dashSwipeX = null;

  function dashLaneX(lane) {
    return WORLD_W / 2 + (lane - 1) * DASH_LANE_W;
  }

  function startDash() {
    hideMenu();
    mayhemMode = false;
    gameState = 'dash';
    dashScroll = 0;
    dashSpeed = DASH_START_SPEED;
    dashScore = 0;
    dashHits = 0;
    dashLane = 1;
    dashChampLane = 1;
    dashChampLaneDelay = 0;
    dashObjs = [];
    dashSpawnGap = 140;
    dashInvincible = 0;
    particles.length = 0;
    heartsEl.style.display = '';
    hearts = DASH_MAX_HITS;
    updateDashHud();
    hideOverlay();
    AudioFX.startMusic();
  }

  function dashMeters() { return Math.floor(dashScroll / TILE); }

  function updateDashHud() {
    timerEl.textContent = `${dashMeters()} m`;
    scoreEl.textContent = `${dashScore} pts`;
    starsEl.textContent = progress.dashBest > 0 ? `Best ${progress.dashBest}m` : '';
    heartImgs.forEach((img, i) => {
      img.src = i < hearts ? 'assets/heart_full.png' : 'assets/heart_empty.png';
    });
  }

  function dashChangeLane(dir) {
    const next = Math.max(0, Math.min(DASH_LANES - 1, dashLane + dir));
    if (next !== dashLane) {
      dashLane = next;
      dashChampLaneDelay = 0.16; // Champ follows your lane a beat later
      AudioFX.catch();
    }
  }

  function endDash() {
    gameState = 'dashOver';
    AudioFX.stopMusic();
    AudioFX.accident();
    const m = dashMeters();
    if (m > progress.dashBest) { progress.dashBest = m; saveProgress(); }
    if (m >= DASH_STICKER_M) awardSticker('dash_500');
    showOverlay(
      'Ouch! Too many boo-boos!',
      `You dashed <strong>${m} m</strong> and scored ${dashScore} pts.` +
      `<br><small>Best dash: ${progress.dashBest} m</small>`,
      'Back to Menu'
    );
  }

  function updateDash(dt) {
    dashSpeed = Math.min(DASH_MAX_SPEED, dashSpeed + DASH_ACCEL * dt);
    dashScroll += dashSpeed * dt;
    dashScore += Math.round(dashSpeed * dt * 0.02); // trickle points for distance

    // lane input: keyboard edges
    if (input.left && !dashPrevLeft) dashChangeLane(-1);
    if (input.right && !dashPrevRight) dashChangeLane(1);
    dashPrevLeft = input.left; dashPrevRight = input.right;

    // Champ mirrors your lane with a little lag
    if (dashChampLaneDelay > 0) {
      dashChampLaneDelay -= dt;
      if (dashChampLaneDelay <= 0) dashChampLane = dashLane;
    }

    if (dashInvincible > 0) dashInvincible -= dt;

    // spawn rows by distance traveled
    dashSpawnGap -= dashSpeed * dt;
    if (dashSpawnGap <= 0) {
      dashSpawnGap = randRange(105, 150);
      const lanes = [0, 1, 2];
      const firstLane = lanes.splice(Math.floor(Math.random() * lanes.length), 1)[0];
      if (Math.random() < 0.62) {
        const r = Math.random();
        dashObjs.push({ kind: 'obstacle', type: r < 0.4 ? 'stain_poop' : (r < 0.8 ? 'stain_pee' : 'cart'), lane: firstLane, y: -40 });
        // sometimes a second obstacle — but never all three lanes
        if (Math.random() < 0.22 + Math.min(0.2, dashScroll / 30000)) {
          const secondLane = lanes.splice(Math.floor(Math.random() * lanes.length), 1)[0];
          dashObjs.push({ kind: 'obstacle', type: Math.random() < 0.7 ? 'stain_pee' : 'stain_poop', lane: secondLane, y: -40 });
        }
      } else {
        const isCandy = Math.random() < 0.55;
        const toyType = TOY_TYPES[Math.floor(Math.random() * TOY_TYPES.length)];
        dashObjs.push({ kind: 'pickup', type: isCandy ? 'candy' : toyType, lane: firstLane, y: -40 });
      }
    }

    // move + collide
    const playerY = WORLD_H - 64;
    for (let i = dashObjs.length - 1; i >= 0; i--) {
      const o = dashObjs[i];
      o.y += dashSpeed * dt;
      if (o.y > WORLD_H + 48) { dashObjs.splice(i, 1); continue; }
      if (o.lane !== dashLane) continue;
      if (Math.abs(o.y - playerY) > 26) continue;
      if (o.kind === 'pickup') {
        const pts = o.type === 'candy' ? 50 : 25;
        dashScore += pts;
        AudioFX.powerup();
        spawnFloatText(dashLaneX(o.lane), o.y - 20, `+${pts}`, '#ffe27a');
        spawnBurst(dashLaneX(o.lane), o.y, GOLD_SPARK, 8, 50);
        dashObjs.splice(i, 1);
      } else if (dashInvincible <= 0) {
        dashHits++;
        hearts = DASH_MAX_HITS - dashHits;
        dashInvincible = 1.2;
        AudioFX.accident();
        shake(3, 0.3);
        spawnBurst(dashLaneX(o.lane), o.y, SAD_BLUE, 10, 55);
        dashObjs.splice(i, 1);
        if (dashHits >= DASH_MAX_HITS) { updateDashHud(); endDash(); return; }
      }
    }

    updateParticles(dt);
    updateFloatingTexts(dt);
    updateDashHud();
  }

  function drawDash() {
    ctx.imageSmoothingEnabled = false;
    // grass field
    const off = Math.floor(dashScroll % TILE);
    for (let ty = -1; ty < GRID_ROWS + 1; ty++) {
      for (let tx = 0; tx < GRID_COLS; tx++) {
        ctx.drawImage(images.grass, tx * TILE, ty * TILE + off);
      }
    }
    // road
    const roadX = WORLD_W / 2 - (DASH_LANE_W * DASH_LANES) / 2;
    const roadW = DASH_LANE_W * DASH_LANES;
    ctx.fillStyle = '#8d939c';
    ctx.fillRect(roadX, 0, roadW, WORLD_H);
    ctx.fillStyle = '#f2f4f6';
    ctx.fillRect(roadX - 3, 0, 3, WORLD_H);
    ctx.fillRect(roadX + roadW, 0, 3, WORLD_H);
    // dashed lane lines scrolling with the road
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    const dashLen = 16, gapLen = 20, seg = dashLen + gapLen;
    const lineOff = (dashScroll % seg);
    for (let li = 1; li < DASH_LANES; li++) {
      const lx = roadX + li * DASH_LANE_W - 2;
      for (let y = -seg + lineOff; y < WORLD_H; y += seg) {
        ctx.fillRect(lx, y, 4, dashLen);
      }
    }
    // roadside trees, marching down
    const treeSeg = 96;
    const treeOff = dashScroll % treeSeg;
    for (let y = -treeSeg + treeOff - 48; y < WORLD_H + 48; y += treeSeg) {
      ctx.drawImage(images.tree, roadX - 42, y);
      ctx.drawImage(images.tree, roadX + roadW + 18, y + 44);
    }

    // objects
    for (const o of dashObjs) {
      const ox = dashLaneX(o.lane);
      if (o.kind === 'obstacle') {
        const size = o.type === 'cart' ? 34 : 28;
        ctx.drawImage(images[o.type], ox - size / 2, o.y - size / 2, size, size);
      } else {
        const bob = Math.sin((performance.now() + o.y) / 160) * 2;
        ctx.drawImage(images[o.type], ox - 11, o.y - 11 + bob, 22, 22);
      }
    }

    // Champ sprinting ahead of you (drawn big)
    const frame = Math.floor(performance.now() / 110) % 2;
    const champSize = SPRITE_SIZE * DASH_CHAR_SCALE * 0.9;
    ctx.drawImage(
      images[`little_up_${frame}`],
      dashLaneX(dashChampLane) - champSize / 2,
      WORLD_H - 148,
      champSize, champSize
    );
    // you, pounding pavement (blink while invincible)
    const blink = dashInvincible > 0 && Math.floor(performance.now() / 120) % 2 === 0;
    if (!blink) {
      const meSize = SPRITE_SIZE * DASH_CHAR_SCALE;
      ctx.drawImage(
        images[`big_up_${frame}`],
        dashLaneX(dashLane) - meSize / 2,
        WORLD_H - 84,
        meSize, meSize
      );
    }

    drawParticles();
    drawFloatingTexts();
    ctx.imageSmoothingEnabled = true;
  }

  // swipe to change lanes (pointer events cover touch + mouse)
  canvas.addEventListener('pointerdown', (e) => {
    if (gameState === 'dash') dashSwipeX = e.clientX;
  });
  canvas.addEventListener('pointerup', (e) => {
    if (gameState !== 'dash' || dashSwipeX === null) return;
    const dx = e.clientX - dashSwipeX;
    dashSwipeX = null;
    if (dx > 24) dashChangeLane(1);
    else if (dx < -24) dashChangeLane(-1);
    else {
      // simple tap: left half = left, right half = right (little-kid friendly)
      const rect = canvas.getBoundingClientRect();
      dashChangeLane(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
    }
  });

  overlayButton.addEventListener('click', () => {
    if (gameState === 'splash') {
      startIntro();
    } else if (gameState === 'paused') {
      togglePause();
    } else if (gameState === 'levelComplete') {
      // First time reaching a bonus round, show the how-to screen. After that
      // it goes straight into the round.
      if (!hasSeenBonusHowto()) {
        hideOverlay();
        bonusHowtoEl.classList.remove('hidden');
      } else {
        startBonusRound();
      }
    } else if (gameState === 'bonusComplete') {
      if (endlessMode) {
        startEndlessDay(endlessDay + 1);
        return;
      }
      const completedIdx = levelIndex;
      if (completedIdx + 1 < worldNow().levels.length) {
        startLevel(completedIdx + 1);
      } else {
        gameState = 'ending';
        showEnding();
      }
    } else if (gameState === 'gameOver') {
      if (endlessMode) {
        endlessMode = false;
        showMenu();
      } else {
        startLevel(levelIndex); // retry the same level from the start
      }
    } else if (gameState === 'dashOver') {
      showMenu();
    } else if (gameState === 'mayhemOver') {
      showMenu();
    } else if (gameState === 'ending') {
      showMenu();
    }
  });

  function startRunAt(wIdx, lIdx) {
    endlessMode = false;
    mayhemMode = false;
    worldIndex = wIdx;
    hideMenu();
    levelSelectEl.classList.add('hidden');
    starsTotal = 0;
    accidentsTotal = 0;
    scoreTotal = 0;
    peeSavedRun = 0;
    poopSavedRun = 0;
    startLevel(lIdx);
  }

  // "Start Play" = continue: first un-starred level in the furthest unlocked world.
  function beginRun() {
    for (let wi = 0; wi < WORLDS.length; wi++) {
      const w = WORLDS[wi];
      if (!isWorldUnlocked(w)) break;
      for (let li = 0; li < w.levels.length; li++) {
        if (starsFor(w.id, li) === 0) { startRunAt(wi, li); return; }
      }
    }
    // Everything cleared — replay the last unlocked world from the top.
    let lastUnlocked = 0;
    WORLDS.forEach((w, i) => { if (isWorldUnlocked(w)) lastUnlocked = i; });
    startRunAt(lastUnlocked, 0);
  }

  // ---------- World / level select ----------
  let lsWorldIdx = 0;
  function openLevelSelect() {
    hideMenu();
    // default tab: furthest unlocked world
    lsWorldIdx = 0;
    WORLDS.forEach((w, i) => { if (isWorldUnlocked(w)) lsWorldIdx = i; });
    renderLevelSelect();
    levelSelectEl.classList.remove('hidden');
  }
  function renderLevelSelect() {
    lsWorldsEl.innerHTML = '';
    lsLevelsEl.innerHTML = '';
    WORLDS.forEach((w, wi) => {
      const b = document.createElement('button');
      const unlocked = isWorldUnlocked(w);
      b.className = 'ls-world' + (wi === lsWorldIdx ? ' active' : '') + (unlocked ? '' : ' locked');
      b.textContent = unlocked ? w.label : `\u{1F512} ${w.label}`;
      if (unlocked) b.addEventListener('click', () => { lsWorldIdx = wi; renderLevelSelect(); });
      lsWorldsEl.appendChild(b);
    });
    const w = WORLDS[lsWorldIdx];
    if (!isWorldUnlocked(w)) return;
    w.levels.forEach((lv, li) => {
      const b = document.createElement('button');
      const earned = starsFor(w.id, li);
      const playable = isLevelPlayable(w, li);
      b.className = 'ls-level' + (playable ? '' : ' locked');
      b.innerHTML = playable
        ? `<span class="ls-num">${li + 1}</span><span class="ls-stars">${starString(earned)}</span>`
        : `<span class="ls-num">\u{1F512}</span><span class="ls-stars">&nbsp;</span>`;
      if (playable) b.addEventListener('click', () => startRunAt(lsWorldIdx, li));
      lsLevelsEl.appendChild(b);
    });
    const prev = lsWorldIdx > 0 ? WORLDS[lsWorldIdx - 1] : null;
    lsHintEl.textContent = isWorldUnlocked(w)
      ? (lsWorldIdx + 1 < WORLDS.length && !isWorldUnlocked(WORLDS[lsWorldIdx + 1])
        ? `Clear all 5 levels to unlock ${WORLDS[lsWorldIdx + 1].label}!`
        : '')
      : `Clear ${prev ? prev.label : 'the previous world'} to unlock!`;
  }
  let tutorialOpenedFromMenu = false;
  menuStartBtn.addEventListener('click', () => {
    if (!hasSeenTutorial()) {
      tutorialOpenedFromMenu = false;
      htpStartBtn.textContent = '▶ Let\'s Go!';
      hideMenu();
      howToPlayEl.classList.remove('hidden');
    } else {
      beginRun();
    }
  });
  menuHowToPlayBtn.addEventListener('click', () => {
    tutorialOpenedFromMenu = true;
    htpStartBtn.textContent = '◀ Back to Menu';
    hideMenu();
    howToPlayEl.classList.remove('hidden');
  });
  htpStartBtn.addEventListener('click', () => {
    markTutorialSeen();
    howToPlayEl.classList.add('hidden');
    if (tutorialOpenedFromMenu) {
      showMenu();
    } else {
      beginRun();
    }
  });
  bonusHowtoStartBtn.addEventListener('click', () => {
    markBonusHowtoSeen();
    bonusHowtoEl.classList.add('hidden');
    startBonusRound();
  });
  menuIntroBtn.addEventListener('click', startIntro);
  if (menuLevelsBtn) menuLevelsBtn.addEventListener('click', openLevelSelect);
  if (menuEndlessBtn) menuEndlessBtn.addEventListener('click', startEndlessRun);
  if (menuDashBtn) menuDashBtn.addEventListener('click', startDash);
  if (menuMayhemBtn) menuMayhemBtn.addEventListener('click', startMayhem);
  if (menuStickersBtn) menuStickersBtn.addEventListener('click', openStickerBook);
  if (sbBackBtn) sbBackBtn.addEventListener('click', () => {
    stickerBookEl.classList.add('hidden');
    showMenu();
  });
  if (lsBackBtn) lsBackBtn.addEventListener('click', () => {
    levelSelectEl.classList.add('hidden');
    showMenu();
  });
  pauseBtn.addEventListener('click', togglePause);
  canvas.addEventListener('pointerdown', () => {
    if (gameState === 'intro') finishIntro();
  });

  function showEnding() {
    const totalSaves = peeSavedRun + poopSavedRun;
    const best = loadBest();
    let scoreHtml = `<br><br><strong>${scoreTotal} pts</strong> &nbsp;|&nbsp; ${totalSaves} saves (${peeSavedRun} pees, ${poopSavedRun} poops)`;
    if (scoreTotal > best.score) {
      saveBest({ pee: peeSavedRun, poop: poopSavedRun, total: totalSaves, score: scoreTotal });
      scoreHtml += '<br>\u{1F3C6} NEW HIGH SCORE!';
    }

    // Unlock the next world if this one is now fully cleared.
    let unlockHtml = '';
    if (isWorldComplete(worldNow())) {
      awardSticker('world_' + worldNow().id);
      const ni = worldIndex + 1;
      if (ni < WORLDS.length) {
        const next = WORLDS[ni];
        if (!progress.unlocked[next.id]) {
          progress.unlocked[next.id] = true;
          saveProgress();
        }
        unlockHtml = `<br>\u{1F513} <strong>NEW LOCATION UNLOCKED: ${next.label}!</strong>`;
      } else if (worldNow().id === 'school') {
        unlockHtml = `<br>\u{267E}\u{FE0F} <strong>ENDLESS MODE UNLOCKED!</strong>`;
      }
    }

    const w = worldNow();
    const perfect = accidentsTotal === 0;
    if (w.id === 'home' && perfect) {
      showOverlay(
        'Cake Time!',
        `You kept the whole house clean and dry! Mom pulls the cake out of the oven and your little brother gets the first slice, all because of you.${unlockHtml}${scoreHtml}`,
        'Back to Menu',
        '<br><img class="cake" src="assets/cake_whole.png">'
      );
    } else if (w.id === 'school' && isWorldComplete(w)) {
      showOverlay(
        'POTTY CHAMPION!',
        `Home, park, store, AND school — your little brother stayed clean and dry everywhere. You are the ultimate Potty Champ!${scoreHtml}`,
        'Back to Menu',
        '<br><img class="cake" src="assets/cake_whole.png">'
      );
    } else {
      showOverlay(
        `${w.label} cleared!`,
        (perfect
          ? `A perfectly clean trip — not a single accident!`
          : `You made it through with ${accidentsTotal} accident${accidentsTotal === 1 ? '' : 's'}. Try again for a spotless run!`)
          + `${unlockHtml}${scoreHtml}`,
        'Back to Menu'
      );
    }
  }

  function gameOver() {
    gameState = 'gameOver';
    AudioFX.stopMusic();
    AudioFX.accident();
    if (endlessMode) {
      const survived = endlessDay - 1;
      if (survived > progress.endlessBest) { progress.endlessBest = survived; saveProgress(); }
      showOverlay(
        'The streak ends!',
        `You survived ${survived} day${survived === 1 ? '' : 's'} of endless potty chaos.` +
        `<br><small>Best streak: Day ${progress.endlessBest}</small>`,
        'Back to Menu'
      );
      return;
    }
    showOverlay(
      'Too many accidents!',
      `You ran out of hearts on ${level.label}. Give it another try — you've got this!`,
      'Try Again'
    );
  }

  function endLevel() {
    gameState = 'levelComplete';
    AudioFX.stopMusic();
    AudioFX.fanfare();
    starsTotal += starsThisLevel;
    accidentsTotal += accidentsThisLevel;
    scoreTotal += scoreThisLevel;

    if (accidentsThisLevel === 0) {
      awardSticker('clean_level');
      if (worldNow().twins) awardSticker('twin_tamer');
    }

    if (endlessMode) {
      if (endlessDay > progress.endlessBest) { progress.endlessBest = endlessDay; saveProgress(); }
      if (endlessDay >= 10) awardSticker('endless_10');
      showOverlay(
        `Day ${endlessDay} survived!`,
        `Score: ${scoreThisLevel} pts &nbsp;|&nbsp; Accidents: ${accidentsThisLevel}` +
        `<br><small>Best streak: Day ${progress.endlessBest}</small>`,
        'Clean Up the Yard!'
      );
      return;
    }

    // Rating: 1 = finished, 2 = no accidents, 3 = no accidents + trophy grabbed.
    const rating = 1
      + (accidentsThisLevel === 0 ? 1 : 0)
      + (accidentsThisLevel === 0 && trophyGrabbedThisLevel ? 1 : 0);
    recordStars(worldNow().id, levelIndex, rating);
    if (rating === 3) awardSticker('three_star');
    if (isWorldPerfect(worldNow())) awardSticker('star_student');
    showOverlay(
      `${level.label} complete!`,
      `<span class="rating-stars">${starString(rating)}</span><br>` +
      `Score: ${scoreThisLevel} pts &nbsp;|&nbsp; Accidents: ${accidentsThisLevel}` +
      (rating < 3 ? '<br><small>No accidents + grab the trophy for ★★★</small>' : '<br><small>PERFECT!</small>'),
      'Clean Up the Yard!'
    );
  }

  // ---------- Update ----------
  function updatePlayer(dt, scene = level) {
    let dx = 0, dy = 0;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;
    player.moving = dx !== 0 || dy !== 0;
    const turboActive = input.turbo && turboMeter > 0 && player.moving;
    if (player.moving) {
      const speed = PLAYER_SPEED * (turboActive ? TURBO_MULT : 1);
      playerCurrentSpeed = speed;
      const len = Math.hypot(dx, dy) || 1;
      dx = (dx / len) * speed * dt;
      dy = (dy / len) * speed * dt;
      if (Math.abs(dx) > Math.abs(dy)) player.facing = dx > 0 ? 'right' : 'left';
      else if (dy !== 0) player.facing = dy > 0 ? 'down' : 'up';
      moveWithCollision(player, dx, dy, scene);
    } else {
      playerCurrentSpeed = 0;
    }
    if (turboActive) {
      turboMeter = Math.max(0, turboMeter - dt);
      turboSparkTimer -= dt;
      if (turboSparkTimer <= 0) {
        turboSparkTimer = 0.06;
        spawnBurst(player.x + player.w / 2, player.y + player.h - 4, GOLD_SPARK, 2, 30);
      }
    }
  }

  function updateShoePickup(dt) {
    if (!shoePickup.active) {
      shoePickup.respawnIn -= dt;
      if (shoePickup.respawnIn <= 0 && turboMeter < maxTurbo()) {
        const p = pickRandomRoomPoint(level.rooms);
        shoePickup.x = p.x;
        shoePickup.y = p.y;
        shoePickup.active = true;
        shoePickup.life = 10;
      }
    } else {
      shoePickup.life -= dt;
      if (shoePickup.life <= 0) {
        shoePickup.active = false;
        shoePickup.respawnIn = randRange(8, 14);
        return;
      }
      const pc = centerOf(player);
      if (Math.hypot(pc.x - shoePickup.x, pc.y - shoePickup.y) < 18) {
        shoePickup.active = false;
        shoePickup.respawnIn = randRange(10, 16);
        turboMeter = maxTurbo();
        AudioFX.powerup();
        spawnBurst(shoePickup.x, shoePickup.y, GOLD_SPARK, 12, 60);
      }
    }
  }

  function updateMop(dt) {
    if (!mopAvailable && !hasMop) {
      mopRespawnTimer -= dt;
      if (mopRespawnTimer <= 0) mopAvailable = true;
    }
    if (mopAvailable && !hasMop && level.mopSpot) {
      const pc = centerOf(player);
      const mx = level.mopSpot.x * TILE, my = level.mopSpot.y * TILE;
      if (Math.hypot(pc.x - mx, pc.y - my) < 18) {
        hasMop = true;
        mopAvailable = false;
        AudioFX.catch();
        spawnBurst(mx, my, PUFF_WHITE, 8, 40);
      }
    }
  }

  function updateCleanup(dt) {
    if (!hasMop) return;
    const pc = centerOf(player);
    for (let i = stains.length - 1; i >= 0; i--) {
      const s = stains[i];
      const sx = s.x + 12, sy = s.y + 12;
      if (!player.moving && Math.hypot(pc.x - sx, pc.y - sy) < SCRUB_RADIUS) {
        s.progress = (s.progress || 0) + dt;
        s.scrubTick = (s.scrubTick || 0) - dt;
        if (s.scrubTick <= 0) { AudioFX.scrub(); s.scrubTick = 0.22; }
        if (s.progress >= SCRUB_TIME) {
          stains.splice(i, 1);
          if (mayhemMode) {
            scoreThisLevel += 50;
            spawnFloatText(sx, sy - 12, '+50', '#9fe8a9');
          } else if (hearts < 3) hearts++;
          hasMop = false;               // mop is used up, heads back to its bucket
          mopRespawnTimer = MOP_RESPAWN;
          AudioFX.clean();
          spawnBurst(sx, sy, PUFF_WHITE, 10, 50);
          updateHud();
        }
      } else if (s.progress) {
        s.progress = Math.max(0, s.progress - dt * 2);
      }
    }
  }

  function centerOf(e) { return { x: e.x + e.w / 2, y: e.y + e.h / 2 }; }

  function speedEscalationMult() {
    return 1 + Math.floor(starsThisLevel / SPEED_ESCALATION_STEP) * SPEED_ESCALATION_MULT;
  }
  function candyTurboMult(t) { return t.turboTimer > 0 ? CANDY_TURBO_MULT : 1; }
  function toddlerFleeSpeed(t) {
    const base = level.fleeSpeed * speedEscalationMult() * candyTurboMult(t);
    return t.alertType === 'poop' ? base * POOP_SPEED_MULT : base;
  }
  function toddlerWanderSpeed(t) {
    return level.wanderSpeed * speedEscalationMult() * candyTurboMult(t);
  }

  // ---------- Candy turbo (Park onward) ----------
  function updateCandy(dt) {
    // per-toddler sugar-rush timers + sparkle trails
    for (const t of toddlers) {
      if (t.turboTimer > 0) {
        t.turboTimer -= dt;
        t.sparkTimer -= dt;
        if (t.sparkTimer <= 0) {
          t.sparkTimer = 0.12;
          const tc = centerOf(t);
          spawnBurst(tc.x, tc.y + 6, GOLD_SPARK, 2, 30);
        }
      }
    }
    if (!worldNow().candy) return;
    if (!candyPickup.active) {
      candyPickup.respawnIn -= dt;
      if (candyPickup.respawnIn <= 0) {
        const p = pickRandomRoomPoint(level.rooms);
        candyPickup.x = p.x;
        candyPickup.y = p.y;
        candyPickup.active = true;
        candyPickup.life = CANDY_LIFE;
      }
      return;
    }
    candyPickup.life -= dt;
    if (candyPickup.life <= 0) {
      candyPickup.active = false;
      candyPickup.respawnIn = randRange(8, 13);
      return;
    }
    // The race: whoever reaches the candy first wins it.
    for (const t of toddlers) {
      const tc = centerOf(t);
      if (Math.hypot(tc.x - candyPickup.x, tc.y - candyPickup.y) < CANDY_RADIUS) {
        candyPickup.active = false;
        candyPickup.respawnIn = randRange(9, 14);
        t.turboTimer = CANDY_TURBO_TIME;
        AudioFX.alert();
        spawnBurst(candyPickup.x, candyPickup.y, GOLD_SPARK, 14, 70);
        spawnFloatText(candyPickup.x, candyPickup.y - 18, 'SUGAR RUSH!', '#ff7ab5');
        return;
      }
    }
    const pc = centerOf(player);
    if (Math.hypot(pc.x - candyPickup.x, pc.y - candyPickup.y) < CANDY_RADIUS) {
      candyPickup.active = false;
      candyPickup.respawnIn = randRange(9, 14);
      scoreThisLevel += CANDY_PLAYER_POINTS;
      progress.counters.candies++;
      saveProgress();
      if (progress.counters.candies >= 10) awardSticker('candy_10');
      AudioFX.powerup();
      spawnBurst(candyPickup.x, candyPickup.y, PUFF_WHITE, 10, 50);
      spawnFloatText(candyPickup.x, candyPickup.y - 18, `+${CANDY_PLAYER_POINTS}`, '#ff7ab5');
      updateHud();
    }
  }

  function spawnTrophy() {
    const p = pickRandomRoomPoint(level.rooms);
    trophy.x = p.x;
    trophy.y = p.y;
    trophy.life = level.alertTimeLimit + 3; // tight against the potty countdown - a real gamble
    trophy.active = true;
  }

  function updateTrophy(dt) {
    if (!trophy.active) return;
    trophy.life -= dt;
    if (trophy.life <= 0) {
      trophy.active = false;
      return;
    }
    const pc = centerOf(player);
    if (Math.hypot(pc.x - trophy.x, pc.y - trophy.y) < TROPHY_RADIUS) {
      trophy.active = false;
      trophyGrabbedThisLevel = true;
      scoreThisLevel += TROPHY_POINTS;
      progress.counters.trophies++;
      saveProgress();
      if (progress.counters.trophies >= 5) awardSticker('trophy_5');
      AudioFX.powerup();
      spawnBurst(trophy.x, trophy.y, GOLD_SPARK, 16, 80);
      spawnFloatText(trophy.x, trophy.y - 18, `+${TROPHY_POINTS} \u{1F3C6}`, '#ffd23f');
      updateHud();
    }
  }

  function updateToddlerAI(dt) {
    for (const t of toddlers) {
      updateOneToddler(t, dt);
      if (gameState !== 'playing') return; // game over / level end mid-loop
    }
  }

  function updateOneToddler(t, dt) {
    if (!t.alertActive && gameState === 'playing') {
      t.nextAlertIn -= dt;
      if (t.nextAlertIn <= 0) {
        t.alertActive = true;
        t.alertType = Math.random() < 0.55 ? 'pee' : 'poop';
        t.alertTimeRemaining = level.alertTimeLimit
          + (t.alertType === 'poop' ? POOP_EXTRA_TIME : 0)
          + (worldNow().twins ? TWINS_ALERT_TIME_BONUS : 0);
        t.jukeTimer = 0;
        t.jukeAngle = 0;
        t.joltTimer = ALERT_JOLT_TIME; // burst away from whoever's tailgating him
        t.state = 'fleeing';
        {
          const tc0 = centerOf(t);
          spawnBurst(tc0.x, tc0.y + 8, PUFF_WHITE, 6, 55);
        }
        AudioFX.alert();
        alertCount++;
        if (!trophy.spawnedThisLevel && alertCount === trophy.spawnOnAlertIndex) {
          trophy.spawnedThisLevel = true;
          spawnTrophy();
        }
      }
    }

    if (t.alertActive) {
      t.alertTimeRemaining -= dt;
      if (t.alertTimeRemaining <= 0) {
        stains.push({ type: t.alertType, x: t.x, y: t.y });
        accidentsThisLevel++;
        savesStreakThisLevel = 0;
        AudioFX.accident();
        shake(3, 0.35);
        spawnBurst(t.x + t.w / 2, t.y + t.h / 2, SAD_BLUE, 10, 50);
        t.alertActive = false;
        t.state = 'wander';
        t.wanderTarget = pickRandomRoomPoint(level.rooms);
        t.nextAlertIn = mayhemMode ? Infinity : randRange(level.alertMin, level.alertMax);
        if (mayhemMode) {
          // mayhem: misses cost points, not hearts
          scoreThisLevel = Math.max(0, scoreThisLevel - MAYHEM_MISS_PENALTY);
          spawnFloatText(t.x + t.w / 2, t.y - 14, `-${MAYHEM_MISS_PENALTY}`, '#6fb3ff');
          updateHud();
        } else {
          hearts = Math.max(0, hearts - 1);
          updateHud();
          if (hearts <= 0) { gameOver(); return; }
        }
      }
    }

    if (t.state === 'fleeing') {
      const pc = centerOf(player), tc = centerOf(t);
      const dist = Math.hypot(tc.x - pc.x, tc.y - pc.y);
      if (dist < CATCH_RADIUS) {
        t.state = 'following';
        AudioFX.catch();
        spawnBurst(tc.x, tc.y, PUFF_WHITE, 8, 40);
        if (t.turboTimer > 0) awardSticker('turbo_tamer');
      } else {
        let vx = tc.x - pc.x, vy = tc.y - pc.y;
        const len = Math.hypot(vx, vy) || 1;
        vx /= len; vy /= len;
        const jolting = t.joltTimer > 0;
        if (jolting) t.joltTimer -= dt;
        // Poop jukes: every so often the toddler darts sideways off the straight
        // "run away" line to shake you off. Pee-toddlers run straight (angle 0).
        // (No jukes during the jolt — he books it directly away from you.)
        if (!jolting && t.alertType === 'poop') {
          t.jukeTimer -= dt;
          if (t.jukeTimer <= 0) {
            t.jukeTimer = randRange(POOP_JUKE_MIN_INTERVAL, POOP_JUKE_MAX_INTERVAL);
            t.jukeAngle = (Math.random() * 2 - 1) * POOP_JUKE_MAX_ANGLE;
          }
          const ca = Math.cos(t.jukeAngle), sa = Math.sin(t.jukeAngle);
          const rx = vx * ca - vy * sa, ry = vx * sa + vy * ca;
          vx = rx; vy = ry;
        }
        const fleeSpeed = toddlerFleeSpeed(t) * (jolting ? ALERT_JOLT_MULT : 1);
        const dx = vx * fleeSpeed * dt, dy = vy * fleeSpeed * dt;
        t.moving = true;
        if (Math.abs(dx) > Math.abs(dy)) t.facing = dx > 0 ? 'right' : 'left';
        else t.facing = dy > 0 ? 'down' : 'up';
        moveWithCollision(t, dx, dy, level);
      }
    } else if (t.state === 'following') {
      const pc = centerOf(player);
      let ox = 0, oy = 0;
      if (player.facing === 'left') ox = FOLLOW_OFFSET;
      else if (player.facing === 'right') ox = -FOLLOW_OFFSET;
      else if (player.facing === 'up') oy = FOLLOW_OFFSET;
      else if (player.facing === 'down') oy = -FOLLOW_OFFSET;
      const targetX = pc.x + ox - t.w / 2;
      const targetY = pc.y + oy - t.h / 2;
      const dx0 = targetX - t.x, dy0 = targetY - t.y;
      const dist = Math.hypot(dx0, dy0);
      t.moving = dist > 2;
      if (t.moving) {
        // Match the big brother's current pace (turbo included), with a
        // small catch-up boost so the toddler snaps in tight instead of trailing.
        const speed = Math.max(playerCurrentSpeed, toddlerFleeSpeed(t)) * 1.2;
        const step = Math.min(dist, speed * dt);
        const dx = (dx0 / dist) * step, dy = (dy0 / dist) * step;
        if (Math.abs(dx0) > Math.abs(dy0)) t.facing = dx0 > 0 ? 'right' : 'left';
        else t.facing = dy0 > 0 ? 'down' : 'up';
        moveWithCollision(t, dx, dy, level);
      }

      for (const spot of level.pottySpots) {
        const sx = spot.x * TILE, sy = spot.y * TILE;
        const tc = centerOf(t);
        if (Math.hypot(tc.x - sx, tc.y - sy) < POTTY_RADIUS) {
          starsThisLevel++;
          savesStreakThisLevel++;
          if (savesStreakThisLevel >= 5) awardSticker('combo_5');
          const isPoop = t.alertType === 'poop';
          if (isPoop) {
            poopSavedRun++;
            poopsFixedThisLevel = Math.min(POOP_QUOTA, poopsFixedThisLevel + 1);
            awardSticker('first_poop');
          } else {
            peeSavedRun++;
            peesFixedThisLevel = Math.min(PEE_QUOTA, peesFixedThisLevel + 1);
            awardSticker('first_pee');
          }
          const timeBonus = Math.round(Math.max(0, t.alertTimeRemaining) * TIME_BONUS_PER_SEC);
          const earned = (isPoop ? POOP_POINTS : PEE_POINTS) + timeBonus;
          scoreThisLevel += earned;
          t.alertActive = false;
          t.state = 'relieved';
          t.relieveTimer = 1.0;
          AudioFX.success();
          spawnBurst(sx, sy, GOLD_SPARK, 14, 70);
          spawnFloatText(sx, sy - 18, `+${earned}`, isPoop ? '#ffb37a' : '#ffe27a');
          t.nextAlertIn = mayhemMode ? Infinity : randRange(level.alertMin, level.alertMax);
          if (mayhemMode) mayhemSaves++;
          updateHud();
          // Level is complete once both goals are met (story/endless only).
          if (!mayhemMode && peesFixedThisLevel >= PEE_QUOTA && poopsFixedThisLevel >= POOP_QUOTA) {
            endLevel();
          }
          break;
        }
      }
    } else if (t.state === 'relieved') {
      t.moving = false;
      t.relieveTimer -= dt;
      if (t.relieveTimer <= 0) {
        t.state = 'wander';
        t.wanderTarget = pickRandomRoomPoint(level.rooms);
      }
    } else if (t.state === 'wander') {
      if (!t.wanderTarget) t.wanderTarget = pickRandomRoomPoint(level.rooms);
      const tc = centerOf(t);
      const dx0 = t.wanderTarget.x - tc.x, dy0 = t.wanderTarget.y - tc.y;
      const dist = Math.hypot(dx0, dy0);
      t.stuckTimer += dt;
      if (dist < 5 || t.stuckTimer > 3.5) {
        t.wanderTarget = pickRandomRoomPoint(level.rooms);
        t.stuckTimer = 0;
        t.moving = false;
      } else {
        const step = Math.min(dist, toddlerWanderSpeed(t) * dt);
        const dx = (dx0 / dist) * step, dy = (dy0 / dist) * step;
        t.moving = true;
        if (Math.abs(dx0) > Math.abs(dy0)) t.facing = dx0 > 0 ? 'right' : 'left';
        else t.facing = dy0 > 0 ? 'down' : 'up';
        const before = { x: t.x, y: t.y };
        moveWithCollision(t, dx, dy, level);
        if (Math.hypot(t.x - before.x, t.y - before.y) < 0.5) t.stuckTimer += dt;
      }
    }
  }

  // ---------- Intro "commercial" (8s scripted sequence) ----------
  const INTRO_LENGTH = 8;
  function introDemoPos(t) {
    const p = Math.min(1, (t - 3.2) / 2.2);
    const potX = 10.5 * TILE;
    const startX = 30;
    const y = 7.4 * TILE;
    const todX = startX + (potX - 30 - startX) * p;
    return { tod: { x: todX, y }, bro: { x: todX - 34, y }, done: p >= 1 };
  }

  function updateIntro(dt) {
    const t = introTime;
    if (t > 3.2 && t < 6.2) {
      const d = introDemoPos(t);
      if (!d.done) {
        introSparkTimer -= dt;
        if (introSparkTimer <= 0) {
          introSparkTimer = 0.08;
          spawnBurst(d.bro.x + 12, d.bro.y + 20, GOLD_SPARK, 2, 25);
        }
      } else if (!introSavedBurst) {
        introSavedBurst = true;
        spawnBurst(10.5 * TILE, 8 * TILE, GOLD_SPARK, 16, 70);
        AudioFX.success();
      }
    }
  }

  function fadeAlpha(t, start, end) {
    const F = 0.35;
    if (t < start + F) return Math.max(0, (t - start) / F);
    if (t > end - F) return Math.max(0, (end - t) / F);
    return 1;
  }

  function drawIntro() {
    const t = introTime;
    ctx.fillStyle = '#0b0c12';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (t < 3.2) {
      ctx.fillStyle = '#fff';
      ctx.font = '700 26px -apple-system, "Helvetica Neue", sans-serif';
      if (t < 1.6) {
        ctx.globalAlpha = fadeAlpha(t, 0, 1.6);
        ctx.fillText('THIS SUMMER…', WORLD_W / 2, WORLD_H / 2);
      } else {
        ctx.globalAlpha = fadeAlpha(t, 1.6, 3.2);
        ctx.fillText('ONE BIG BROTHER.', WORLD_W / 2, WORLD_H / 2 - 18);
        ctx.fillText('ONE TINY BLADDER.', WORLD_W / 2, WORLD_H / 2 + 18);
      }
      ctx.globalAlpha = 1;
    } else if (t < 6.2) {
      drawTilemap();
      drawPottySpots();
      const d = introDemoPos(t);
      if (!d.done) {
        const frame = Math.floor(t * 8) % 2;
        ctx.drawImage(images[`big_side_${frame}`], d.bro.x, d.bro.y);
        ctx.drawImage(images[`little_side_${frame}`], d.tod.x, d.tod.y);
        const bob = Math.sin(t * 18) * 3;
        ctx.drawImage(images.icon_pee, d.tod.x + 4, d.tod.y - 20 + bob, 16, 16);
      } else {
        ctx.drawImage(images.little_down_0, 10.5 * TILE - 34, 8 * TILE - 12);
        ctx.drawImage(images.big_down_0, 10.5 * TILE + 12, 8 * TILE - 12);
        ctx.font = '800 30px -apple-system, "Helvetica Neue", sans-serif';
        ctx.fillStyle = '#ffd23f';
        ctx.fillText('SAVED! ★', WORLD_W / 2, WORLD_H / 2 - 60);
      }
      drawParticles();
    } else {
      const k = Math.min(1, (t - 6.2) / 0.5);
      ctx.fillStyle = '#ffc400';
      ctx.font = `900 ${Math.round(22 + 38 * k)}px -apple-system, "Helvetica Neue", sans-serif`;
      ctx.fillText('POTTY CHAMP', WORLD_W / 2, WORLD_H / 2 - 10);
      ctx.globalAlpha = k;
      ctx.fillStyle = '#fff';
      ctx.font = '600 16px -apple-system, "Helvetica Neue", sans-serif';
      ctx.fillText('Can you save the day… and the floors?', WORLD_W / 2, WORLD_H / 2 + 30);
      ctx.globalAlpha = 1;
    }
    ctx.font = '600 11px -apple-system, "Helvetica Neue", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('tap to skip', WORLD_W / 2, WORLD_H - 14);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  function updateBonusRound(dt) {
    updatePlayer(dt, BONUS_SCENE);
    const pc = centerOf(player);

    if (!carriedToy) {
      for (let i = bonusToys.length - 1; i >= 0; i--) {
        const t = bonusToys[i];
        if (Math.hypot(pc.x - t.x, pc.y - t.y) < TOY_PICKUP_RADIUS) {
          carriedToy = t.type;
          bonusToys.splice(i, 1);
          AudioFX.catch();
          spawnBurst(t.x, t.y, PUFF_WHITE, 8, 40);
          break;
        }
      }
    } else {
      // Drop the toy when the player touches the chest from ANY side. The chest
      // is a solid object you can't stand on, so we treat its whole footprint
      // (plus a small reach margin) as the active drop zone — not just its
      // exact center point.
      const chest = BONUS_SCENE.furniture.find((f) => f.type === 'toybox');
      const cr = furniturePixelRect(chest);
      const CHEST_REACH = 16;
      const dropZone = {
        x: cr.x - CHEST_REACH,
        y: cr.y - CHEST_REACH,
        w: cr.w + CHEST_REACH * 2,
        h: cr.h + CHEST_REACH * 2,
      };
      if (aabbOverlap(collBox(player), dropZone)) {
        const cs = BONUS_SCENE.chestSpot;
        bonusScore += TOY_POINTS;
        toysCollected++;
        carriedToy = null;
        AudioFX.success();
        spawnBurst(cs.x, cs.y, GOLD_SPARK, 12, 60);
        spawnFloatText(cs.x, cs.y - 18, `+${TOY_POINTS}`, '#ffe27a');
      }
    }

    if (bonusTimeRemaining > 5 && bonusToys.length < MAX_GROUND_TOYS) {
      bonusSpawnTimer -= dt;
      if (bonusSpawnTimer <= 0) {
        bonusSpawnTimer = randRange(4, 7);
        const p = pickRandomOpenPoint(BONUS_SCENE);
        const type = TOY_TYPES[Math.floor(Math.random() * TOY_TYPES.length)];
        bonusToys.push({ x: p.x, y: p.y, type });
      }
    }

    updateParticles(dt);
    updateFloatingTexts(dt);

    bonusTimeRemaining -= dt;
    if (bonusTimeRemaining <= 0) {
      bonusTimeRemaining = 0;
      endBonusRound();
      return;
    }
    updateBonusHud();
  }

  function update(dt) {
    if (gameState === 'intro') {
      introTime += dt;
      updateIntro(dt);
      updateParticles(dt);
      if (introTime >= INTRO_LENGTH) finishIntro();
      return;
    }
    if (gameState === 'dash') { updateDash(dt); return; }
    if (gameState === 'bonusRound') { updateBonusRound(dt); return; }
    if (gameState !== 'playing') { updateParticles(dt); updateFloatingTexts(dt); return; }
    updatePlayer(dt);
    if (mayhemMode) {
      updateMayhemDirector(dt);
      timeRemaining -= dt;
      if (timeRemaining <= 0) {
        timeRemaining = 0;
        endMayhem();
        return;
      }
    }
    updateToddlerAI(dt);
    if (!mayhemMode) updateTrophy(dt);
    updateShoePickup(dt);
    updateCandy(dt);
    updateMop(dt);
    updateCleanup(dt);
    updateParticles(dt);
    updateFloatingTexts(dt);

    updateHud();
  }

  // ---------- Rendering ----------
  function isWalkableTile(tx, ty, scene = level) {
    const cx = tx + 0.5, cy = ty + 0.5;
    for (const r of scene.rooms) {
      if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) return true;
    }
    return false;
  }

  function drawTilemap(scene = level) {
    const floorImg = images[scene.floorTile || 'floor_wood'];
    const wallImg = images[scene.wallTile || 'wall'];
    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    for (let ty = 0; ty < GRID_ROWS; ty++) {
      for (let tx = 0; tx < GRID_COLS; tx++) {
        if (isWalkableTile(tx, ty, scene)) {
          ctx.drawImage(floorImg, tx * TILE, ty * TILE);
        } else {
          const n = isWalkableTile(tx - 1, ty, scene) || isWalkableTile(tx + 1, ty, scene) ||
                    isWalkableTile(tx, ty - 1, scene) || isWalkableTile(tx, ty + 1, scene);
          if (n) ctx.drawImage(wallImg, tx * TILE, ty * TILE);
        }
      }
    }
  }

  function drawStains() {
    for (const s of stains) {
      const img = s.type === 'pee' ? images.stain_pee : images.stain_poop;
      ctx.drawImage(img, s.x, s.y);
    }
  }

  function drawPottySpots() {
    for (const spot of level.pottySpots) {
      ctx.drawImage(images[level.pottyImg || 'potty'], spot.x * TILE - SPRITE_SIZE / 2, spot.y * TILE - SPRITE_SIZE / 2);
    }
  }

  function drawCharacter(entity, prefix) {
    const moving = entity.moving;
    const frame = moving ? (Math.floor(performance.now() / 180) % 2) : 0;
    let img;
    if (entity.facing === 'left' || entity.facing === 'right') {
      img = images[`${prefix}_side_${frame}`];
    } else {
      img = images[`${prefix}_${entity.facing}_${frame}`];
    }
    ctx.save();
    if (entity.facing === 'left') {
      ctx.translate(entity.x + entity.w, entity.y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
    } else {
      ctx.drawImage(img, entity.x, entity.y);
    }
    ctx.restore();
  }

  function drawShoePickup() {
    if (!shoePickup.active) return;
    const blink = shoePickup.life < 3 && Math.floor(performance.now() / 150) % 2 === 0;
    if (blink) return;
    const bob = Math.sin(performance.now() / 200) * 2;
    ctx.drawImage(images.turbo_shoe, shoePickup.x - 8, shoePickup.y - 8 + bob, 16, 16);
  }

  function drawCandy() {
    if (!candyPickup.active) return;
    const blink = candyPickup.life < 3 && Math.floor(performance.now() / 150) % 2 === 0;
    if (blink) return;
    const bob = Math.sin(performance.now() / 180) * 2;
    ctx.drawImage(images.candy, candyPickup.x - 8, candyPickup.y - 8 + bob, 16, 16);
  }

  function drawTrophy() {
    if (!trophy.active) return;
    const blink = trophy.life < 3 && Math.floor(performance.now() / 150) % 2 === 0;
    if (blink) return;
    const bob = Math.sin(performance.now() / 220) * 2;
    ctx.drawImage(images.icon_trophy, trophy.x - 8, trophy.y - 8 + bob, 16, 16);
  }

  function drawMopSpot() {
    if (!mopAvailable || !level.mopSpot) return;
    const bob = Math.sin(performance.now() / 300) * 1.5;
    ctx.drawImage(images.mop, level.mopSpot.x * TILE - 12, level.mopSpot.y * TILE - 12 + bob);
  }

  function drawCarriedMop() {
    if (!hasMop) return;
    const bob = Math.sin(performance.now() / 250) * 1.5;
    ctx.drawImage(images.mop, player.x + player.w - 8, player.y - 12 + bob, 14, 14);
  }

  function drawScrubBars() {
    for (const s of stains) {
      if (!s.progress) continue;
      const pct = Math.min(1, s.progress / SCRUB_TIME);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(s.x, s.y - 6, 24, 3);
      ctx.fillStyle = '#6fd878';
      ctx.fillRect(s.x, s.y - 6, Math.round(24 * pct), 3);
    }
  }

  function drawAlertIcon() {
    for (const t of toddlers) {
      if (!t.alertActive) continue;
      const icon = t.alertType === 'pee' ? images.icon_pee : images.icon_poop;
      const bob = Math.sin(performance.now() / 180) * 3;
      ctx.drawImage(icon, t.x + t.w / 2 - 8, t.y - 20 + bob, 16, 16);
    }
  }

  function draw() {
    drawTilemap();
    drawStains();
    drawScrubBars();
    drawPottySpots();
    drawShoePickup();
    drawCandy();
    drawTrophy();
    drawMopSpot();

    // depth-sorted furniture + characters
    const drawables = [];
    for (const f of level.furniture) {
      const img = images[f.type];
      if (!img) continue;
      const px = f.x * TILE, py = f.y * TILE;
      drawables.push({ img, x: px, y: py, sortY: py + f.hTiles * TILE });
    }
    // nail salon: mom files away at the client's nails (Home world only)
    if (worldNow().momSalon) {
      drawables.push({
        img: images[Math.floor(performance.now() / 500) % 2 === 0 ? 'mom' : 'mom_alt'],
        x: MOM_POS.x * TILE, y: MOM_POS.y * TILE, sortY: MOM_POS.y * TILE + TILE,
      });
      drawables.push({
        img: images.client,
        x: CLIENT_POS.x * TILE, y: CLIENT_POS.y * TILE, sortY: CLIENT_POS.y * TILE + TILE,
      });
    }
    drawables.push({ custom: 'player', sortY: player.y + player.h });
    toddlers.forEach((t) => {
      drawables.push({ custom: 'toddler', toddlerRef: t, sortY: t.y + t.h });
    });

    drawables.sort((a, b) => a.sortY - b.sortY);
    for (const d of drawables) {
      if (d.custom === 'player') drawCharacter(player, 'big');
      else if (d.custom === 'toddler') {
        drawCharacter(d.toddlerRef, 'little');
        if (d.toddlerRef.isTwin) {
          // little green cap band so you can tell the twins apart
          ctx.fillStyle = '#3fae5a';
          ctx.fillRect(d.toddlerRef.x + 7, d.toddlerRef.y + 3, 10, 3);
        }
      }
      else ctx.drawImage(d.img, d.x, d.y);
    }

    drawCarriedMop();
    drawParticles();
    drawFloatingTexts();
    drawAlertIcon();
  }

  function drawBonusRound() {
    drawTilemap(BONUS_SCENE);

    const drawables = [];
    for (const f of BONUS_SCENE.furniture) {
      const img = images[f.type];
      if (!img) continue;
      const px = f.x * TILE, py = f.y * TILE;
      drawables.push({ img, x: px, y: py, sortY: py + f.hTiles * TILE });
    }
    drawables.push({ custom: 'player', sortY: player.y + player.h });

    drawables.sort((a, b) => a.sortY - b.sortY);
    for (const d of drawables) {
      if (d.custom === 'player') drawCharacter(player, 'big');
      else ctx.drawImage(d.img, d.x, d.y);
    }

    for (const t of bonusToys) {
      const bob = Math.sin(performance.now() / 220 + t.x) * 2;
      ctx.drawImage(images[t.type], t.x - 8, t.y - 8 + bob, 16, 16);
    }

    if (carriedToy) {
      const bob = Math.sin(performance.now() / 250) * 1.5;
      ctx.drawImage(images[carriedToy], player.x + player.w - 8, player.y - 12 + bob, 14, 14);
    }

    drawParticles();
    drawFloatingTexts();
  }

  // ---------- Main loop ----------
  let lastTime = 0;
  function loop(ts) {
    if (!lastTime) lastTime = ts;
    let dt = (ts - lastTime) / 1000;
    dt = Math.min(dt, 1 / 30);
    lastTime = ts;

    update(dt);

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0b0c12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let shX = 0, shY = 0;
    if (shakeTime > 0) {
      shX = (Math.random() * 2 - 1) * shakeMag;
      shY = (Math.random() * 2 - 1) * shakeMag;
    }
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, (offsetX + shX) * dpr, (offsetY + shY) * dpr);
    if (gameState === 'intro') drawIntro();
    else if (gameState === 'dash' || gameState === 'dashOver') drawDash();
    else if (gameState === 'bonusRound' || gameState === 'bonusComplete') drawBonusRound();
    else draw();

    pauseBtn.style.display = (gameState === 'playing' || gameState === 'bonusRound') ? 'flex' : 'none';

    requestAnimationFrame(loop);
  }

  // Potty Champ ships completely free — no ads, no in-app purchases, no
  // tracking. Monetization can be added back in a future update.

  resize();
  loadAssets(() => {
    showOverlay('Potty Champ', 'The ultimate potty-training rescue mission.', 'Tap to Begin');
    requestAnimationFrame(loop);
  });
})();
