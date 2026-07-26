(() => {
  const canvas = document.getElementById('game');
  const gameContainerEl = document.getElementById('game-container');
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
  const overlayQuitBtn = document.getElementById('overlay-quit');
  const menuEl = document.getElementById('menu');
  const menuStartBtn = document.getElementById('menu-start');
  const menuIntroBtn = document.getElementById('menu-intro');
  const menuHowToPlayBtn = document.getElementById('menu-howtoplay');
  const menuHighscoreEl = document.getElementById('menu-highscore');
  const menuRankChipEl = document.getElementById('menu-rank-chip');
  const menuStatStarsEl = document.getElementById('menu-stat-stars');
  const menuStatStickersEl = document.getElementById('menu-stat-stickers');
  const menuCardRankEl = document.getElementById('menu-card-rank');
  const menuCardFillEl = document.getElementById('menu-card-fill');
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
  const menuDailyBtn = document.getElementById('menu-daily');
  const menuStickersBtn = document.getElementById('menu-stickers');
  const stickerBookEl = document.getElementById('sticker-book');
  const sbGridEl = document.getElementById('sb-grid');
  const sbCountEl = document.getElementById('sb-count');
  const sbBackBtn = document.getElementById('sb-back');
  const stickerToastEl = document.getElementById('sticker-toast');
  const menuUnlockBtn = document.getElementById('menu-unlock');
  const menuGiftBtn = document.getElementById('menu-gift');
  const menuCapBtn = document.getElementById('menu-cap');
  const dashHowtoEl = document.getElementById('dash-howto');
  const dashHowtoStartBtn = document.getElementById('dash-howto-start');
  const menuBuildBtn = document.getElementById('menu-build');
  const myLevelsEl = document.getElementById('my-levels');
  const mlGridEl = document.getElementById('ml-grid');
  const mlBackBtn = document.getElementById('ml-back');
  const editorEl = document.getElementById('editor');
  const edNameEl = document.getElementById('ed-name');
  const edBackBtn = document.getElementById('ed-back');
  const edSaveBtn = document.getElementById('ed-save');
  const edToolsEl = document.getElementById('ed-tools');
  const edDrawerEl = document.getElementById('ed-drawer');
  const edHintEl = document.getElementById('ed-hint');
  const edHelpBtn = document.getElementById('ed-help');
  const buildHowtoEl = document.getElementById('build-howto');
  const buildHowtoStartBtn = document.getElementById('build-howto-start');
  const paywallEl = document.getElementById('paywall');
  const pwBuyBtn = document.getElementById('pw-buy');
  const pwRestoreBtn = document.getElementById('pw-restore');
  const pwCloseBtn = document.getElementById('pw-close');
  const parentGateEl = document.getElementById('parent-gate');
  const pgQuestionEl = document.getElementById('pg-question');
  const pgAnswersEl = document.getElementById('pg-answers');
  const pgCancelBtn = document.getElementById('pg-cancel');

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
    'grass', 'fence', 'pool', 'hot_tub', 'sandbox', 'swingset', 'slide',
    'floor_tile', 'floor_lino', 'floor_carpet', 'floor_lino_school',
    'decor_photo', 'decor_clock', 'decor_scribble', 'decor_chart', 'decor_window',
    'prop_bowl', 'prop_blocks', 'prop_cup', 'prop_socks', 'prop_slippers',
    'fan', 'curtain', 'cat_0', 'cat_1',
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
      // combo jingle: pitch climbs with the streak — each save sounds bigger
      combo(n) {
        const base = 440 + Math.min(6, n) * 70;
        [base, base * 1.25, base * 1.5].forEach((f, i) => tone(f, 0.09, { type: 'square', vol: 0.09, delay: i * 0.05 }));
      },
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
  const TWINS_TURBO_BONUS = 2.5;      // extra seconds of sprint in the power bar

  const PEE_POINTS = 100;
  const POOP_POINTS = 160;
  const TIME_BONUS_PER_SEC = 12;   // x seconds left on the alert clock at delivery
  const TROPHY_POINTS = 300;
  const TOY_POINTS = 60;           // bonus round, per toy delivered

  // Level goal: rescue this many of each before the level is complete. No timer
  // — you finish by hitting the quota, and it's game over if you run out of hearts.
  // Each level sets its own peeGoal/poopGoal (Home ramps 1+1 up to 4+4);
  // anything without explicit goals (endless, daily, later worlds) uses 4+4.
  const DEFAULT_PEE_GOAL = 4;
  const DEFAULT_POOP_GOAL = 4;
  function peeQuota() { return (level && level.peeGoal) || DEFAULT_PEE_GOAL; }
  function poopQuota() { return (level && level.poopGoal) || DEFAULT_POOP_GOAL; }
  // Fairness kit for levels with more than one kid: every alert clock runs
  // longer and alerts are spaced further apart, so two kids never overwhelm.
  const MULTIKID_TIME_SCALE = 1.45;
  const MULTIKID_SPACING_SCALE = 1.35;

  let worldIndex = 0;
  let levelIndex = 0;
  let level = WORLDS[0].levels[0];
  let endlessMode = false;
  let endlessDay = 1;
  let endlessWorldIdx = 0;
  let mayhemMode = false;
  let mayhemSaves = 0;
  let mayhemAlertTimer = 2;
  let customMode = false;   // playing a player-built stage
  function worldNow() {
    if (customMode) return CUSTOM_WORLD;
    return WORLDS[endlessMode ? endlessWorldIdx : worldIndex];
  }
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
  let celebrateTimer = 0;   // level-complete confetti shower
  let celebrateTick = 0;
  const POTTY_GLOW_TIME = 1.4;
  let pottyGlowTimer = 0;   // potty sparkles right after a rescue
  const MOM_LOOKUP_TIME = 2.2;
  let momLookupTimer = 0;   // mom glances up when there's an accident
  let gameState = 'splash'; // splash | intro | menu | playing | paused | levelComplete | bonusRound | bonusComplete | gift | giftOpen | ending
  let animClock = 0;
  let introTime = 0;
  let introSavedBurst = false;
  let introTitleBurst = false;
  let introSparkTimer = 0;

  // ---------- Juice: combo banners + clutch slow-mo ----------
  let bannerText = '';
  let bannerColor = '#ffd23f';
  let bannerTimer = 0;
  const BANNER_DUR = 1.3;
  let slowmoTimer = 0;

  function showBanner(text, color) {
    bannerText = text;
    bannerColor = color || '#ffd23f';
    bannerTimer = BANNER_DUR;
  }

  function drawBanner() {
    if (bannerTimer <= 0) return;
    const shown = BANNER_DUR - bannerTimer;
    const s = shown < 0.35 ? easeOutBack(shown / 0.35) : 1;
    const alpha = bannerTimer < 0.3 ? bannerTimer / 0.3 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(WORLD_W / 2, 64);
    ctx.scale(s, s);
    ctx.font = '900 26px -apple-system, "Helvetica Neue", sans-serif';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(10,8,4,0.9)';
    ctx.strokeText(bannerText, 0, 0);
    ctx.fillStyle = bannerColor;
    ctx.fillText(bannerText, 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
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
  function hasSeenBuildHowto() {
    try { return localStorage.getItem('pottychamp_build_howto') === '1'; } catch (e) { return false; }
  }
  function markBuildHowtoSeen() {
    try { localStorage.setItem('pottychamp_build_howto', '1'); } catch (e) {}
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
      p.dailyDone = p.dailyDone || '';
      p.dailyTotal = p.dailyTotal || 0;
      p.premium = !!p.premium;
      p.capColor = p.capColor || 'red';
      p.caps = Object.assign({ red: true }, p.caps || {});
      p.giftDay = p.giftDay || '';
      return p;
    } catch (e) {
      return { stars: {}, unlocked: { home: true }, stickers: {}, counters: { trophies: 0, candies: 0 }, endlessBest: 0, dashBest: 0, mayhemBest: 0, dailyDone: '', dailyTotal: 0, capColor: 'red', caps: { red: true }, giftDay: '' };
    }
  }
  const progress = loadProgress();
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) {}
  }

  // ---------- Characters have names — kids bond with names ----------
  const KID_NAME = 'Champ';     // little bro — the one who needs the potty
  const BIG_NAME = 'Captain';   // big brother — the one doing the chasing
  // (the playdate friend has no name — just the teal cap)

  // ---------- Cap colors (cosmetics — unlocked via the Daily Surprise) ----------
  // Baby Champ's backwards cap can be recolored. The playdate friend always
  // wears teal so you can tell the kids apart at a glance.
  const CAP_SRC = [[224, 49, 49], [245, 95, 85], [168, 30, 30]]; // red art: dome, highlight, brim
  const CAP_COLORS = {
    red:    null, // original art, no tint pass needed
    blue:   [[52, 120, 246], [110, 165, 255], [30, 80, 190]],
    green:  [[46, 160, 67], [96, 200, 110], [25, 110, 45]],
    purple: [[150, 70, 220], [185, 120, 245], [105, 40, 165]],
    gold:   [[255, 180, 20], [255, 220, 90], [200, 130, 10]],
    teal:   [[24, 170, 170], [80, 210, 205], [12, 120, 120]], // playdate friend only
  };
  const CAP_LABELS = { red: 'Red', blue: 'Blue', green: 'Green', purple: 'Purple', gold: 'GOLD ⭐' };
  const capCache = {};
  function capSprite(key, color) {
    if (!CAP_COLORS[color]) return images[key]; // red = untouched art
    const ck = key + '_' + color;
    if (capCache[ck]) return capCache[ck];
    const src = images[key];
    if (!src) return src;
    const cv = document.createElement('canvas');
    cv.width = src.width; cv.height = src.height;
    const c2 = cv.getContext('2d');
    c2.drawImage(src, 0, 0);
    const id = c2.getImageData(0, 0, cv.width, cv.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      for (let s = 0; s < 3; s++) {
        if (d[i] === CAP_SRC[s][0] && d[i + 1] === CAP_SRC[s][1] && d[i + 2] === CAP_SRC[s][2]) {
          const t = CAP_COLORS[color][s];
          d[i] = t[0]; d[i + 1] = t[1]; d[i + 2] = t[2];
          break;
        }
      }
    }
    c2.putImageData(id, 0, 0);
    capCache[ck] = cv;
    return cv;
  }
  function ownedCaps() {
    return Object.keys(CAP_LABELS).filter((c) => progress.caps[c]);
  }

  // ---------- Daily Surprise (one present a day — ritual, not pressure) ----------
  function giftOpenedToday() { return progress.giftDay === todayKey(); }
  function openDailyGift() {
    progress.giftDay = todayKey();
    const locked = Object.keys(CAP_LABELS).filter((c) => !progress.caps[c]);
    let msg;
    if (locked.length) {
      const c = locked[Math.floor(Math.random() * locked.length)];
      progress.caps[c] = true;
      progress.capColor = c;
      msg = `A new cap color: <strong>${CAP_LABELS[c]}</strong>! \u{1F9E2}<br><small>${KID_NAME} is wearing it right now!</small>`;
    } else {
      progress.counters.candies += 3;
      msg = `3 candies for the candy jar! \u{1F36C}<br><small>Candy total: ${progress.counters.candies}</small>`;
    }
    saveProgress();
    AudioFX.fanfare();
    gameState = 'giftOpen';
    showOverlay('\u{1F389} TA-DA!', msg, 'Awesome!');
  }
  function starsFor(worldId, idx) {
    const a = progress.stars[worldId] || [];
    return a[idx] || 0;
  }
  // Every star ever earned, across every world — drives the menu rank badge.
  function totalStars() {
    let n = 0;
    for (const k in progress.stars) {
      const a = progress.stars[k] || [];
      for (let i = 0; i < a.length; i++) n += a[i] || 0;
    }
    return n;
  }
  const STARS_PER_RANK = 6;
  function champRank() { return Math.floor(totalStars() / STARS_PER_RANK) + 1; }
  function rankProgress() { return totalStars() % STARS_PER_RANK; }
  function recordStars(worldId, idx, s) {
    const a = progress.stars[worldId] || (progress.stars[worldId] = []);
    if ((a[idx] || 0) < s) { a[idx] = s; saveProgress(); }
  }
  function isWorldUnlocked(w) { return !!progress.unlocked[w.id]; }
  function isPremium() { return !!progress.premium; }
  // A world is playable when you've EARNED it (beat the one before) AND —
  // beyond Home — the one-time unlock has been purchased.
  function canPlayWorld(w) { return isWorldUnlocked(w) && (w.id === 'home' || isPremium()); }
  function isWorldComplete(w) { return w.levels.every((_, i) => starsFor(w.id, i) > 0); }
  function isWorldPerfect(w) { return w.levels.every((_, i) => starsFor(w.id, i) >= 3); }
  function isLevelPlayable(w, idx) { return idx === 0 || starsFor(w.id, idx - 1) > 0; }
  function starString(n) { return '★'.repeat(n) + '☆'.repeat(Math.max(0, 3 - n)); }

  // ================= LEVEL BUILDER =================
  // Building is free (first FREE_STAGES stages). Playing a custom stage needs
  // the Unlock Everything purchase — you design for free, you pay to press ▶.
  const CUSTOM_KEY = 'pottychamp_custom_v1';
  const FREE_STAGES = 1;    // one slot to build in for free — the rest are a purchase
  const SLOT_BATCH = 6;     // how many slots we show at a time
  const MAX_STAGES = 24;

  function loadCustom() {
    try {
      const a = JSON.parse(localStorage.getItem(CUSTOM_KEY));
      return Array.isArray(a) ? a.map((st) => (st ? migrateStage(st) : st)) : [];
    } catch (e) { return []; }
  }
  let customLevels = loadCustom();
  function saveCustom() {
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(customLevels)); } catch (e) {}
  }
  function stageCap() { return isPremium() ? MAX_STAGES : FREE_STAGES; }

  // Slots are revealed a batch at a time: show 6, and once all 6 are built,
  // the next 6 appear. Keeps the screen from looking like homework on day one.
  function visibleSlots() {
    const filled = customLevels.length;
    const batches = Math.floor(filled / SLOT_BATCH) + 1;
    return Math.min(MAX_STAGES, batches * SLOT_BATCH);
  }

  function blankStage(n) {
    return {
      name: `Stage ${n}`,
      floors: {},          // room index -> floor id
      rooms: [Object.assign({}, BUILD_STARTER_ROOM)],
      items: [],           // { type, x, y }
      potty: { x: 11.5, y: 6 },
      bigStart: { x: 8, y: 8 },
      littleStart: { x: 14, y: 5 },
    };
  }

  // Stages saved by older builds carry plan/kids/diff/goal. Fold the plan's
  // rooms into the drawn-room list once, then those fields stop mattering.
  function migrateStage(st) {
    if (!Array.isArray(st.rooms)) st.rooms = [];
    if (st.plan !== undefined) {
      const planRooms = (BUILD_PLANS[st.plan] || BUILD_PLANS[0]).rooms.map((r) => Object.assign({}, r));
      st.rooms = planRooms.concat(st.rooms);
      delete st.plan;
    }
    delete st.kids; delete st.diff; delete st.goal;
    if (!st.rooms.length) st.rooms = [Object.assign({}, BUILD_STARTER_ROOM)];
    return st;
  }

  // How far into Story Mode is this player? 0 for a beginner, 1 once Home is
  // cleared. Custom stages ride this same curve, so nobody has to pick a
  // difficulty and nobody's first build is brutal.
  function storyProgressT() {
    const home = WORLDS[0];
    if (!home || !home.levels.length) return 0;
    let cleared = 0;
    for (let i = 0; i < home.levels.length; i++) if (starsFor(home.id, i) > 0) cleared++;
    return Math.max(0, Math.min(1, cleared / (home.levels.length - 1)));
  }

  // Turn a saved stage into a level object the existing engine understands.
  // Every room is player-drawn now, so every room can be deleted again.
  function allStageRooms(st) {
    return st.rooms || [];
  }

  function stageToLevel(st) {
    const rooms = allStageRooms(st).map((r, i) => Object.assign({}, r, { floor: st.floors[i] || 'floor_wood' }));
    const furniture = st.items.map((it) => {
      const sz = BUILD_SIZES[it.type] || [1, 1];
      return {
        type: it.type, x: it.x, y: it.y,
        wTiles: sz[0], hTiles: sz[1],
        blocking: BUILD_BLOCKING.indexOf(it.type) !== -1,
      };
    });
    // a light in the middle of every room so custom stages look finished too
    const lights = rooms.map((r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2, r: 70, warm: true }));
    return Object.assign({
      label: st.name || 'My Stage',
      rooms, furniture, lights,
      pottySpots: [st.potty || { x: 11.5, y: 6 }],
      mopSpot: null,
      bigStart: st.bigStart || { x: 8, y: 8 },
      littleStart: st.littleStart || { x: 14, y: 5 },
      custom: true,
    }, buildTuning(storyProgressT()));
  }

  // ---- validation: can Captain actually reach the potty and the kids? ----
  function validateStage(st) {
    const lv = stageToLevel(st);
    const grid = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_COLS; x++) grid[y][x] = isWalkableTile(x, y, lv) ? 0 : 1;
    }
    for (const f of lv.furniture) {
      if (!f.blocking) continue;
      for (let dy = 0; dy < f.hTiles; dy++) {
        for (let dx = 0; dx < f.wTiles; dx++) {
          const x = f.x + dx, y = f.y + dy;
          if (grid[y] && grid[y][x] !== undefined) grid[y][x] = 1;
        }
      }
    }
    const sx = Math.floor(lv.bigStart.x), sy = Math.floor(lv.bigStart.y);
    if (!grid[sy] || grid[sy][sx] === 1) return { ok: false, msg: 'Captain is stuck in a wall! Move his start spot.' };
    const seen = new Set([sx + ',' + sy]);
    const q = [[sx, sy]];
    while (q.length) {
      const [cx, cy] = q.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= GRID_COLS || ny >= GRID_ROWS) continue;
        if (grid[ny][nx] === 1 || seen.has(nx + ',' + ny)) continue;
        seen.add(nx + ',' + ny);
        q.push([nx, ny]);
      }
    }
    const pk = Math.floor(lv.pottySpots[0].x) + ',' + Math.floor(lv.pottySpots[0].y);
    const pk2 = (Math.floor(lv.pottySpots[0].x) - 1) + ',' + Math.floor(lv.pottySpots[0].y);
    if (!seen.has(pk) && !seen.has(pk2)) return { ok: false, msg: "Champ can't reach the potty! Move it or clear a path." };
    const lk = Math.floor(lv.littleStart.x) + ',' + Math.floor(lv.littleStart.y);
    if (!seen.has(lk)) return { ok: false, msg: "Champ is stuck! Move where he starts." };
    return { ok: true };
  }

  // ---- thumbnails for the My Levels cards ----
  // Returns a <canvas> to drop straight into the card. Deliberately NOT
  // toDataURL() — exporting taints under file:// and some WebViews, and one
  // SecurityError used to take the whole My Levels screen down with it.
  function stageThumb(st) {
    const lv = stageToLevel(st);
    const cv = document.createElement('canvas');
    cv.width = GRID_COLS * TILE; cv.height = GRID_ROWS * TILE;
    cv.className = 'ml-thumb';
    const c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.fillStyle = '#12141c';
    c.fillRect(0, 0, cv.width, cv.height);
    for (let ty = 0; ty < GRID_ROWS; ty++) {
      for (let tx = 0; tx < GRID_COLS; tx++) {
        if (!isWalkableTile(tx, ty, lv)) continue;
        const r = roomAt(tx, ty, lv);
        const f = images[(r && r.floor) || 'floor_wood'];
        if (f) c.drawImage(f, tx * TILE, ty * TILE);
      }
    }
    for (const f of lv.furniture) {
      const img = images[f.type];
      if (img) c.drawImage(img, f.x * TILE, f.y * TILE);
    }
    const spot = lv.pottySpots && lv.pottySpots[0];
    const p = images['potty'];
    if (p && spot) c.drawImage(p, spot.x * TILE - 12, spot.y * TILE - 12);
    const bi = images.big_down_0;
    if (bi && lv.bigStart) c.drawImage(bi, lv.bigStart.x * TILE, lv.bigStart.y * TILE);
    const li = capSprite('little_down_0', progress.capColor || 'red');
    if (li && lv.littleStart) c.drawImage(li, lv.littleStart.x * TILE, lv.littleStart.y * TILE);
    return cv;
  }

  function roomAt(tx, ty, scene) {
    const cx = tx + 0.5, cy = ty + 0.5;
    for (const r of scene.rooms) {
      if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) return r;
    }
    return null;
  }

  // ---------- My Levels screen ----------
  function openMyLevels() {
    hideMenu();
    hideOverlay();
    editorEl.classList.add('hidden');
    if (buildHowtoEl) buildHowtoEl.classList.add('hidden');
    gameState = 'myLevels';
    // Show the panel BEFORE drawing the cards. If a card ever blows up, the
    // player still has a screen with a Back button instead of a frozen game.
    myLevelsEl.classList.remove('hidden');
    try {
      renderMyLevels();
    } catch (e) {
      mlGridEl.innerHTML = '';
      showBanner('Could not draw your levels — tap Back.', '#ff9d3f');
    }
  }

  function renderMyLevels() {
    mlGridEl.innerHTML = '';
    const cap = stageCap();
    const slots = visibleSlots();
    for (let i = 0; i < slots; i++) {
      // One broken stage must never cost the player the whole screen.
      try {
        mlGridEl.appendChild(buildLevelCard(i, cap));
      } catch (e) {
        mlGridEl.appendChild(brokenCard(i));
      }
    }
  }

  function cardButton(cls, label, onClick) {
    const b = document.createElement('button');
    if (cls) b.className = cls;
    b.innerHTML = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function buildLevelCard(i, cap) {
    const st = customLevels[i];
    const card = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'ml-row';

    if (st) {
      card.className = 'ml-card';
      let thumb = null;
      try { thumb = stageThumb(st); } catch (e) { thumb = null; }
      if (thumb) {
        card.appendChild(thumb);
      } else {
        const ph = document.createElement('div');
        ph.className = 'ml-empty-thumb';
        ph.innerHTML = '\u{1F3E0}';
        card.appendChild(ph);
      }
      const name = document.createElement('span');
      name.className = 'ml-name';
      name.textContent = st.name || 'My Stage';
      card.appendChild(name);
      const meta = document.createElement('span');
      meta.className = 'ml-meta';
      const rc = (st.rooms || []).length;
      meta.textContent = `${rc} room${rc === 1 ? '' : 's'} \u00B7 ${(st.items || []).length} things`;
      card.appendChild(meta);

      row.appendChild(cardButton('ml-play', isPremium() ? '\u25B6 Play' : '\u{1F512} Play', () => playStage(i)));
      row.appendChild(cardButton('', '\u270F\u{FE0F} Edit', () => openEditor(i)));
    } else if (i < cap) {
      card.className = 'ml-card empty';
      card.innerHTML =
        `<div class="ml-empty-thumb">\u2795</div>` +
        `<span class="ml-name">New Stage</span>` +
        `<span class="ml-meta">Build it your way</span>`;
      row.appendChild(cardButton('ml-play', '\u{1F528} Build', () => openEditor(i)));
    } else {
      card.className = 'ml-card locked';
      card.innerHTML =
        `<div class="ml-empty-thumb">\u{1F512}</div>` +
        `<span class="ml-name">Stage ${i + 1}</span>` +
        `<span class="ml-meta">Unlock to build more</span>`;
      row.appendChild(cardButton('ml-play', '\u{1F513} Unlock', () => askToUnlock()));
    }
    card.appendChild(row);
    return card;
  }

  // Last resort so a corrupt save is recoverable instead of fatal.
  function brokenCard(i) {
    const card = document.createElement('div');
    card.className = 'ml-card empty';
    card.innerHTML =
      `<div class="ml-empty-thumb">\u26A0\u{FE0F}</div>` +
      `<span class="ml-name">Stage ${i + 1}</span>` +
      `<span class="ml-meta">Something went wrong</span>`;
    const row = document.createElement('div');
    row.className = 'ml-row';
    row.appendChild(cardButton('ml-play', '\u{1F504} Start Over', () => {
      customLevels[i] = undefined;
      saveCustom();
      renderMyLevels();
    }));
    card.appendChild(row);
    return card;
  }

  // ---------- The editor ----------
  const ed = { idx: 0, st: null, tool: 'room', sel: null, floor: 'floor_wood', drag: null };

  // ---- drawing rooms ----
  const MIN_ROOM = 3;       // no rooms too small to walk through
  const MAX_ROOMS = 10;     // player-drawn rooms on top of the starter plan

  // A room {x,y,w,h} covers tiles x..x+w-1 and y..y+h-1.
  // Two rooms only count as joined if they share an EDGE — corner-to-corner
  // looks connected but Captain can't walk through a diagonal.
  function roomsJoined(a, b) {
    const ax1 = a.x + a.w - 1, ay1 = a.y + a.h - 1;
    const bx1 = b.x + b.w - 1, by1 = b.y + b.h - 1;
    const xOverlap = a.x <= bx1 && b.x <= ax1;
    const yOverlap = a.y <= by1 && b.y <= ay1;
    if (xOverlap && yOverlap) return true;                              // overlapping
    if (xOverlap && (ay1 + 1 === b.y || by1 + 1 === a.y)) return true;  // stacked
    if (yOverlap && (ax1 + 1 === b.x || bx1 + 1 === a.x)) return true;  // side by side
    return false;
  }

  // A new room that floats off on its own gets a corridor back to the nearest
  // existing room, so a kid can never strand a piece of their own level.
  function connectRoom(st, r) {
    const others = allStageRooms(st).filter((o) => o !== r);
    if (!others.length) return;
    if (others.some((o) => roomsJoined(r, o))) return;

    const cx = Math.floor(r.x + r.w / 2), cy = Math.floor(r.y + r.h / 2);
    let best = others[0], bestD = Infinity;
    for (const o of others) {
      const d = Math.abs(o.x + o.w / 2 - cx) + Math.abs(o.y + o.h / 2 - cy);
      if (d < bestD) { bestD = d; best = o; }
    }
    const tx = Math.floor(best.x + best.w / 2), ty = Math.floor(best.y + best.h / 2);
    const clampR = (x, y, w, h) => {
      const cxp = Math.max(0, Math.min(GRID_COLS - 1, x));
      const cyp = Math.max(0, Math.min(GRID_ROWS - 1, y));
      return { x: cxp, y: cyp, w: Math.min(w, GRID_COLS - cxp), h: Math.min(h, GRID_ROWS - cyp) };
    };
    // L-shaped hall, 2 tiles wide so Captain and Champ can pass each other.
    // Runs the full span in each direction plus one tile of overlap at each
    // end, so the corridor genuinely bites into both rooms.
    const hx = Math.min(cx, tx), hw = Math.abs(tx - cx) + 2;
    st.rooms.push(clampR(hx, cy, hw, 2));
    const vy = Math.min(cy, ty), vh = Math.abs(ty - cy) + 2;
    st.rooms.push(clampR(tx, vy, 2, vh));
  }

  function addDrawnRoom(st, x0, y0, x1, y1) {
    const x = Math.max(0, Math.min(x0, x1));
    const y = Math.max(0, Math.min(y0, y1));
    const w = Math.min(GRID_COLS - 1, Math.max(x0, x1)) - x + 1;   // tile count
    const h = Math.min(GRID_ROWS - 1, Math.max(y0, y1)) - y + 1;
    if (w < MIN_ROOM || h < MIN_ROOM) {
      showBanner('Drag a bigger room!', '#ff9d3f');
      return false;
    }
    if ((st.rooms || []).length >= MAX_ROOMS) {
      showBanner("That's plenty of rooms!", '#ff9d3f');
      return false;
    }
    const r = { x, y, w, h };
    st.rooms.push(r);
    connectRoom(st, r);
    autoPlaceMarkers(st);
    AudioFX.powerup();
    return true;
  }

  // Tapping (not dragging) inside a room you drew removes it again.
  function deleteDrawnRoomAt(st, tx, ty) {
    for (let i = st.rooms.length - 1; i >= 0; i--) {
      const r = st.rooms[i];
      const cx = tx + 0.5, cy = ty + 0.5;
      if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
        st.rooms.splice(i, 1);
        reseatStage(st);
        AudioFX.catch();
        return true;
      }
    }
    return false;
  }

  // ---- the potty and the two kids place themselves ----
  // Nobody picks start spots. The potty goes in the first room drawn; Champ and
  // Captain get the two open tiles that are furthest apart, so there's always a
  // real chase. Recomputed any time the rooms change.
  function autoPlaceMarkers(st) {
    const rooms = allStageRooms(st);
    if (!rooms.length) return;
    const lv = { rooms };

    // Open = inside a room AND not under a blocking item.
    const open = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      open[y] = [];
      for (let x = 0; x < GRID_COLS; x++) open[y][x] = isWalkableTile(x, y, lv);
    }
    for (const it of st.items) {
      if (BUILD_BLOCKING.indexOf(it.type) === -1) continue;
      const sz = BUILD_SIZES[it.type] || [1, 1];
      for (let dy = 0; dy < sz[1]; dy++) {
        for (let dx = 0; dx < sz[0]; dx++) {
          const x = it.x + dx, y = it.y + dy;
          if (open[y] && open[y][x] !== undefined) open[y][x] = false;
        }
      }
    }

    // Everyone has to live in the SAME walkable blob, or the stage is a dud.
    // Find the biggest one and only ever place inside it.
    const seen = [];
    for (let y = 0; y < GRID_ROWS; y++) seen[y] = [];
    let best = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (!open[y][x] || seen[y][x]) continue;
        const blob = [];
        const q = [[x, y]];
        seen[y][x] = true;
        while (q.length) {
          const [cx, cy] = q.pop();
          blob.push({ x: cx, y: cy });
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = cx + dx, ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= GRID_COLS || ny >= GRID_ROWS) continue;
            if (!open[ny][nx] || seen[ny][nx]) continue;
            seen[ny][nx] = true;
            q.push([nx, ny]);
          }
        }
        if (blob.length > best.length) best = blob;
      }
    }
    if (!best.length) return;   // fully boxed in — leave the old spots, validate will shout

    // potty: the spot in that blob nearest the middle of the first room drawn
    const f = rooms[0];
    const fx = f.x + f.w / 2, fy = f.y + f.h / 2;
    let pot = best[0], pd = Infinity;
    for (const t of best) {
      const d = Math.abs(t.x - fx) + Math.abs(t.y - fy);
      if (d < pd) { pd = d; pot = t; }
    }
    st.potty = { x: pot.x + 0.5, y: pot.y };

    // Champ and Captain: the two spots in that blob furthest apart, so there's
    // always a real chase. Sampled, because this runs on every edit.
    let a = best[0], b = best[best.length - 1], bd = -1;
    const step = Math.max(1, Math.floor(best.length / 45));
    for (let i = 0; i < best.length; i += step) {
      for (let j = i + step; j < best.length; j += step) {
        const d = Math.abs(best[i].x - best[j].x) + Math.abs(best[i].y - best[j].y);
        if (d > bd) { bd = d; a = best[i]; b = best[j]; }
      }
    }
    // Captain starts on the side nearer the potty so he isn't hopeless
    const dA = Math.abs(a.x - pot.x) + Math.abs(a.y - pot.y);
    const dB = Math.abs(b.x - pot.x) + Math.abs(b.y - pot.y);
    st.bigStart = dA < dB ? { x: a.x, y: a.y } : { x: b.x, y: b.y };
    st.littleStart = dA < dB ? { x: b.x, y: b.y } : { x: a.x, y: a.y };
  }

  // After the walkable space changes, sweep anything now floating in the void
  // back onto solid ground and re-seat the markers.
  function reseatStage(st) {
    const lv = stageToLevel(st);
    st.items = st.items.filter((it) => isWalkableTile(it.x, it.y, lv));
    autoPlaceMarkers(st);
  }

  function openEditor(idx) {
    ed.idx = idx;
    ed.st = customLevels[idx] ? migrateStage(JSON.parse(JSON.stringify(customLevels[idx]))) : blankStage(idx + 1);
    ed.drag = null;
    ed.sel = BUILD_PALETTE[0].items[0];
    autoPlaceMarkers(ed.st);
    myLevelsEl.classList.add('hidden');
    hideOverlay();
    gameState = 'editor';
    edNameEl.value = ed.st.name;
    setTool('room');            // opens ready to draw — the first thing a kid needs
    editorEl.classList.remove('hidden');
    if (!hasSeenBuildHowto()) buildHowtoEl.classList.remove('hidden');
  }

  // ---- the dock drawer: only the active tool's controls, nothing else ----
  function buildDrawer() {
    edDrawerEl.innerHTML = '';
    if (ed.tool === 'place') { buildStuffDrawer(); return; }
    if (ed.tool === 'floor') { buildFloorDrawer(); return; }
    // room + erase need no controls — the map is the control
  }

  function buildStuffDrawer() {
    const strip = document.createElement('div');
    strip.id = 'ed-strip';
    BUILD_PALETTE.forEach((g, gi) => {
      if (gi > 0) {
        const div = document.createElement('div');
        div.className = 'ed-divider';
        div.textContent = g.tab;
        strip.appendChild(div);
      }
      for (const type of g.items) {
        const b = document.createElement('button');
        b.className = 'ed-item' + (ed.sel === type ? ' on' : '');
        b.innerHTML =
          `<img src="assets/${type}.png" alt="">` +
          `<span class="ed-item-name">${BUILD_NAMES[type] || type}</span>`;
        b.addEventListener('click', () => {
          ed.sel = type;
          edHintEl.textContent = `Tap the map to put down a ${(BUILD_NAMES[type] || type).toLowerCase()}.`;
          [...strip.querySelectorAll('.ed-item')].forEach((o) => o.classList.remove('on'));
          b.classList.add('on');
        });
        strip.appendChild(b);
      }
    });
    edDrawerEl.appendChild(strip);
  }

  function buildFloorDrawer() {
    const strip = document.createElement('div');
    strip.id = 'ed-strip';
    BUILD_FLOORS.forEach((f) => {
      const b = document.createElement('button');
      b.className = 'ed-floor' + (ed.floor === f.id ? ' on' : '');
      b.innerHTML = `<img src="assets/${f.id}.png" alt=""><span>${f.name}</span>`;
      b.addEventListener('click', () => {
        ed.floor = f.id;
        edHintEl.textContent = `Tap a room to make it ${f.name.toLowerCase()}.`;
        [...strip.querySelectorAll('.ed-floor')].forEach((o) => o.classList.remove('on'));
        b.classList.add('on');
      });
      strip.appendChild(b);
    });
    edDrawerEl.appendChild(strip);
  }

  const TOOL_HINTS = {
    room: 'Drag on the map to draw a room. Tap a room to take it away.',
    place: 'Pick something below, then tap the map to put it down.',
    floor: 'Pick a floor, then tap a room to change it.',
    erase: 'Tap anything on the map to take it away.',
  };
  function setTool(t) {
    ed.tool = t;
    [...edToolsEl.querySelectorAll('.ed-tool')].forEach((b) => {
      b.classList.toggle('on', b.dataset.tool === t);
    });
    edHintEl.textContent = TOOL_HINTS[t] || '';
    buildDrawer();
  }
  edToolsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.ed-tool');
    if (b) setTool(b.dataset.tool);
  });
  if (buildHowtoStartBtn) buildHowtoStartBtn.addEventListener('click', () => {
    markBuildHowtoSeen();
    buildHowtoEl.classList.add('hidden');
  });
  if (edHelpBtn) edHelpBtn.addEventListener('click', () => buildHowtoEl.classList.remove('hidden'));

  // Canvas taps -> tile coords (accounts for letterbox offset + scale)
  function tapToTile(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const wx = (clientX - rect.left - offsetX) / scale;
    const wy = (clientY - rect.top - offsetY) / scale;
    return { x: Math.floor(wx / TILE), y: Math.floor(wy / TILE) };
  }

  // ---- room tool: press, drag, release ----
  function editorDragStart(clientX, clientY) {
    if (ed.tool !== 'room') return false;
    const t = tapToTile(clientX, clientY);
    if (t.x < 0 || t.y < 0 || t.x >= GRID_COLS || t.y >= GRID_ROWS) return false;
    ed.drag = { x0: t.x, y0: t.y, x1: t.x, y1: t.y };
    return true;
  }
  function editorDragMove(clientX, clientY) {
    if (!ed.drag) return;
    const t = tapToTile(clientX, clientY);
    ed.drag.x1 = Math.max(0, Math.min(GRID_COLS - 1, t.x));
    ed.drag.y1 = Math.max(0, Math.min(GRID_ROWS - 1, t.y));
  }
  function editorDragEnd() {
    const d = ed.drag;
    ed.drag = null;
    if (!d) return;
    const tiny = Math.abs(d.x1 - d.x0) < 1 && Math.abs(d.y1 - d.y0) < 1;
    if (tiny) {
      // treated as a tap: take away the room they hit
      if (ed.st.rooms.length <= 1) {
        showBanner('Keep at least one room!', '#ff9d3f');
      } else if (!deleteDrawnRoomAt(ed.st, d.x0, d.y0)) {
        showBanner('Drag to draw a room!', '#ff9d3f');
      }
      return;
    }
    addDrawnRoom(ed.st, d.x0, d.y0, d.x1, d.y1);
  }

  function editorTap(clientX, clientY) {
    const t = tapToTile(clientX, clientY);
    if (t.x < 0 || t.y < 0 || t.x >= GRID_COLS || t.y >= GRID_ROWS) return;
    const lv = stageToLevel(ed.st);

    // One eraser for everything: it takes the thing on top first, and if the
    // tile is bare it takes the room. A kid only has to learn "tap to remove."
    if (ed.tool === 'erase') {
      for (let i = ed.st.items.length - 1; i >= 0; i--) {
        const it = ed.st.items[i];
        const sz = BUILD_SIZES[it.type] || [1, 1];
        if (t.x >= it.x && t.x < it.x + sz[0] && t.y >= it.y && t.y < it.y + sz[1]) {
          ed.st.items.splice(i, 1);
          AudioFX.catch();
          return;
        }
      }
      if (ed.st.rooms.length > 1) {
        if (deleteDrawnRoomAt(ed.st, t.x, t.y)) return;
      } else if (isWalkableTile(t.x, t.y, lv)) {
        showBanner('Keep at least one room!', '#ff9d3f');
      }
      return;
    }

    if (ed.tool === 'floor') {
      const rooms = lv.rooms;
      for (let i = 0; i < rooms.length; i++) {
        const r = rooms[i];
        const cx = t.x + 0.5, cy = t.y + 0.5;
        if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
          ed.st.floors[i] = ed.floor;
          AudioFX.catch();
          return;
        }
      }
      return;
    }

    // place — keep big items fully inside a room
    if (!isWalkableTile(t.x, t.y, lv)) { showBanner('Put it inside a room!', '#ff9d3f'); return; }
    const sz = BUILD_SIZES[ed.sel] || [1, 1];
    for (let dy = 0; dy < sz[1]; dy++) {
      for (let dx = 0; dx < sz[0]; dx++) {
        if (!isWalkableTile(t.x + dx, t.y + dy, lv)) { showBanner("It doesn't fit there!", '#ff9d3f'); return; }
      }
    }
    if (ed.st.items.length >= 60) { showBanner('That\u2019s plenty of stuff!', '#ff9d3f'); return; }
    ed.st.items.push({ type: ed.sel, x: t.x, y: t.y });
    autoPlaceMarkers(ed.st);
    AudioFX.catch();
  }

  function drawEditor() {
    const lv = stageToLevel(ed.st);
    drawTilemap(lv);
    drawLights(lv);
    // grid so tapping feels precise
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= GRID_COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * TILE, 0); ctx.lineTo(x * TILE, WORLD_H); ctx.stroke();
    }
    for (let y = 0; y <= GRID_ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * TILE); ctx.lineTo(WORLD_W, y * TILE); ctx.stroke();
    }
    // placed items, depth sorted
    const ds = lv.furniture.map((f) => ({ img: images[f.type], x: f.x * TILE, y: f.y * TILE, sortY: f.y * TILE + f.hTiles * TILE }));
    ds.sort((a, b) => a.sortY - b.sortY);
    for (const d of ds) if (d.img) ctx.drawImage(d.img, d.x, d.y);
    // potty + start markers
    const p = images['potty'];
    if (p) ctx.drawImage(p, lv.pottySpots[0].x * TILE - 12, lv.pottySpots[0].y * TILE - 12);
    const bi = images.big_down_0;
    if (bi) ctx.drawImage(bi, lv.bigStart.x * TILE, lv.bigStart.y * TILE);
    const li = capSprite('little_down_0', progress.capColor || 'red');
    if (li) {
      for (let k = 0; k < (lv.kids || 1); k++) {
        ctx.drawImage(k ? capSprite('little_down_0', 'teal') : li, lv.littleStart.x * TILE + k * TILE, lv.littleStart.y * TILE);
      }
    }
    // labels so it's obvious which marker is which
    ctx.font = '700 8px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9fe8a9';
    ctx.fillText('CAPTAIN', lv.bigStart.x * TILE + 12, lv.bigStart.y * TILE - 3);
    ctx.fillStyle = '#ffd23f';
    ctx.fillText('CHAMP', lv.littleStart.x * TILE + 12, lv.littleStart.y * TILE - 3);
    ctx.fillStyle = '#6fb3ff';
    ctx.fillText('POTTY', lv.pottySpots[0].x * TILE, lv.pottySpots[0].y * TILE - 15);
    ctx.textAlign = 'left';

    // With the room tool up, outline the rooms the player drew so it's obvious
    // which ones they're allowed to tap away.
    if (ed.tool === 'room') {
      ctx.save();
      ctx.strokeStyle = 'rgba(111,179,255,0.85)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      for (let i = 0; i < lv.rooms.length; i++) {
        const r = lv.rooms[i];
        ctx.strokeRect(r.x * TILE, r.y * TILE, r.w * TILE, r.h * TILE);
      }
      ctx.restore();
      if (ed.drag) {
        const x = Math.min(ed.drag.x0, ed.drag.x1) * TILE;
        const y = Math.min(ed.drag.y0, ed.drag.y1) * TILE;
        const w = (Math.abs(ed.drag.x1 - ed.drag.x0) + 1) * TILE;
        const h = (Math.abs(ed.drag.y1 - ed.drag.y0) + 1) * TILE;
        const big = Math.abs(ed.drag.x1 - ed.drag.x0) >= MIN_ROOM - 1 &&
                    Math.abs(ed.drag.y1 - ed.drag.y0) >= MIN_ROOM - 1;
        ctx.save();
        ctx.fillStyle = big ? 'rgba(111,179,255,0.28)' : 'rgba(255,157,63,0.25)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = big ? '#6fb3ff' : '#ff9d3f';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
      }
    }
    drawBanner();
  }

  // ---------- play a custom stage ----------
  function playStage(idx) {
    const st = customLevels[idx];
    if (!st) return;
    if (!isPremium()) { askToUnlock(); return; }   // build free, pay to play
    const v = validateStage(st);
    if (!v.ok) { showBanner(v.msg, '#ff7a8a'); return; }
    myLevelsEl.classList.add('hidden');
    editorEl.classList.add('hidden');
    customMode = true;
    endlessMode = false;
    mayhemMode = false;
    customIdx = idx;
    starsTotal = 0; accidentsTotal = 0; scoreTotal = 0;
    peeSavedRun = 0; poopSavedRun = 0;
    level = stageToLevel(st);
    levelIndex = 0;
    initLevelState();
  }
  let customIdx = 0;

  edBackBtn.addEventListener('click', () => { editorEl.classList.add('hidden'); openMyLevels(); });
  edNameEl.addEventListener('input', () => { ed.st.name = edNameEl.value.slice(0, 18) || `Stage ${ed.idx + 1}`; });
  edSaveBtn.addEventListener('click', () => {
    const v = validateStage(ed.st);
    if (!v.ok) { showBanner(v.msg, '#ff7a8a'); return; }
    customLevels[ed.idx] = JSON.parse(JSON.stringify(ed.st));
    saveCustom();
    AudioFX.fanfare();
    editorEl.classList.add('hidden');
    // Free slot used up? That's the moment to pitch.
    const justHitCap = !isPremium() && customLevels.filter(Boolean).length >= FREE_STAGES;
    openMyLevels();
    if (justHitCap) {
      gameState = 'buildPitch';
      myLevelsEl.classList.add('hidden');
      showOverlay(
        '\u{1F528} You’re a Level Designer!',
        `“${ed.st.name}” is saved. Unlock Everything to <strong>play your stages</strong> and build up to ${MAX_STAGES} of them — plus the Park, Store, School, Dash and Mayhem.`,
        `\u{1F513} Unlock Everything — ${Store.priceString()}`
      );
      overlayQuitBtn.classList.remove('hidden');
    }
  });
  mlBackBtn.addEventListener('click', () => { myLevelsEl.classList.add('hidden'); showMenu(); });

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
    { id: 'twin_tamer', name: 'Double Trouble', icon: 'little_side_0', hint: 'Zero accidents in a twins level.' },
    { id: 'world_home', name: 'Home Hero', icon: 'potty', hint: 'Clear every Home level.' },
    { id: 'world_park', name: 'Park Ranger', icon: 'tree', hint: 'Clear every Park level.' },
    { id: 'world_store', name: 'Aisle Boss', icon: 'cart', hint: 'Clear every Grocery Store level.' },
    { id: 'world_school', name: 'Hall Monitor', icon: 'chalkboard', hint: 'Clear every School level.' },
    { id: 'endless_10', name: 'Marathon Champ', icon: 'cake_whole', hint: 'Reach Day 10 in Endless Mode.' },
    { id: 'dash_500', name: 'Road Runner', icon: 'little_up_0', hint: 'Dash 500 m in Potty Dash.' },
    { id: 'mayhem_15', name: 'Crowd Control', icon: 'little_down_0', hint: 'Save 15 kids in one Potty Mayhem.' },
    { id: 'daily_7', name: 'Golden Week', icon: 'cookie', hint: 'Complete 7 Daily Challenges.' },
  ];

  // ---------- Daily Challenge (a fresh gift goal every day — no guilt streaks) ----------
  const DAILY_TYPES = [
    { id: 'dash', desc: 'Dash 300 m in Potty Dash' },
    { id: 'mayhem', desc: 'Save 10 kids in Potty Mayhem' },
    { id: 'clean', desc: 'Finish a Story level with 0 accidents' },
  ];
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  function dailyTypeToday() {
    // Free players always get the story-mode challenge — the other two need
    // the full Dash/Mayhem modes from the Unlock Everything purchase.
    if (!isPremium()) return DAILY_TYPES[2]; // 'clean'
    const dayIdx = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
    return DAILY_TYPES[dayIdx % DAILY_TYPES.length];
  }
  function isDailyDone() { return progress.dailyDone === todayKey(); }
  function completeDaily(kind) {
    if (dailyTypeToday().id !== kind || isDailyDone()) return;
    progress.dailyDone = todayKey();
    progress.dailyTotal++;
    saveProgress();
    toastQueue.push({
      icon: 'cookie',
      title: 'Daily Challenge complete! \u{1F381}',
      body: `${progress.dailyTotal} gift day${progress.dailyTotal === 1 ? '' : 's'} collected`,
    });
    showNextToast();
    if (progress.dailyTotal >= 7) awardSticker('daily_7');
  }
  function stickerCount() { return STICKERS.filter((s) => progress.stickers[s.id]).length; }

  const toastQueue = [];
  let toastShowing = false;
  function showNextToast() {
    if (toastShowing || toastQueue.length === 0) return;
    const st = toastQueue.shift();
    toastShowing = true;
    stickerToastEl.innerHTML =
      `<img src="assets/${st.icon}.png" alt=""><div><strong>${st.title || 'Sticker earned!'}</strong><br>${st.body || st.name}</div>`;
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
  // ---------- Unlock Everything ($3.99 one-time purchase, via RevenueCat) ----------
  const IAP_PRODUCT_ID = 'com.teamberto.pottychamp.unlock_all';
  const RC_API_KEY = 'appl_DzkhSMlcqYjSmxIwrNlbVwRiRmD'; // starts with appl_
  const DASH_DEMO_METERS = 200; // free players run this far, then the pitch

  const Store = (() => {
    let product = null;
    let ready = false;
    function plugin() {
      const C = window.Capacitor;
      return (C && C.Plugins && C.Plugins.Purchases) || null;
    }
    function ownsPremium(ci) {
      if (!ci) return false;
      if (ci.entitlements && ci.entitlements.active && ci.entitlements.active.premium) return true;
      const ids = ci.allPurchasedProductIdentifiers || [];
      return ids.indexOf(IAP_PRODUCT_ID) !== -1;
    }
    async function init() {
      const P = plugin();
      if (!P || RC_API_KEY.indexOf('appl_') !== 0) return; // web preview or key not set yet
      try {
        await P.configure({ apiKey: RC_API_KEY });
        ready = true;
        try { // already bought on this Apple account? sync it silently
          const r = await P.getCustomerInfo();
          if (ownsPremium(r.customerInfo)) grantPremium(true);
        } catch (e) {}
        try {
          const r = await P.getProducts({ productIdentifiers: [IAP_PRODUCT_ID] });
          if (r && r.products && r.products.length) {
            product = r.products[0];
            refreshPriceLabels();
          }
        } catch (e) {}
      } catch (e) {}
    }
    async function buy() {
      const P = plugin();
      if (!P) { // browser preview: fake purchase so the flow can be tested
        if (window.confirm('Web preview: pretend the purchase worked?')) grantPremium();
        return;
      }
      if (!ready) { alert('The store is not ready. Check your internet connection and try again.'); return; }
      try {
        if (!product) {
          const r = await P.getProducts({ productIdentifiers: [IAP_PRODUCT_ID] });
          product = r && r.products && r.products[0];
        }
        if (!product) { alert('Could not reach the App Store. Please try again in a minute.'); return; }
        const r = await P.purchaseStoreProduct({ product });
        if (ownsPremium(r.customerInfo)) grantPremium();
      } catch (e) {
        const msg = ((e && e.message) || '').toLowerCase();
        if (msg.indexOf('cancel') === -1) alert("The purchase didn't go through. No money was taken.");
      }
    }
    async function restore() {
      const P = plugin();
      if (!P) { alert('Restore works inside the phone app.'); return; }
      if (!ready) { alert('The store is not ready. Check your internet connection and try again.'); return; }
      try {
        const r = await P.restorePurchases();
        if (ownsPremium(r.customerInfo)) grantPremium();
        else alert('No previous purchase was found on this Apple account.');
      } catch (e) { alert('Restore failed — please try again.'); }
    }
    function priceString() { return (product && product.priceString) || '$3.99'; }
    return { init, buy, restore, priceString };
  })();

  function refreshPriceLabels() {
    const p = Store.priceString();
    if (pwBuyBtn) pwBuyBtn.textContent = `Unlock Everything — ${p}`;
    if (menuUnlockBtn && !isPremium()) menuUnlockBtn.innerHTML = `\u{1F513} Unlock Everything — ${p}`;
  }

  function grantPremium(silent) {
    if (progress.premium) return;
    progress.premium = true;
    saveProgress();
    if (paywallEl) paywallEl.classList.add('hidden');
    if (parentGateEl) parentGateEl.classList.add('hidden');
    if (!silent) {
      toastQueue.push({
        icon: 'icon_trophy',
        title: 'Everything unlocked! \u{1F389}',
        body: 'Park, Store, School, full Dash, Mayhem — go get ’em!',
      });
      showNextToast();
    }
    if (gameState === 'menu') showMenu();
    else if (gameState === 'dashDemoOver') { hideOverlay(); startDash(); } // keep dashing right away!
  }

  // Parental gate: quick multiplication a 4-year-old can't do. Required by
  // Apple for purchase flows in kids' games (and just good manners).
  let pgCorrect = 0;
  let pgTries = 0;
  let pgOnPass = null;
  function openParentalGate(onPass) {
    pgOnPass = onPass;
    pgTries = 0;
    newGateQuestion();
    parentGateEl.classList.remove('hidden');
  }
  function newGateQuestion() {
    const a = 3 + Math.floor(Math.random() * 6); // 3..8
    const b = 3 + Math.floor(Math.random() * 6);
    pgCorrect = a * b;
    pgQuestionEl.textContent = `${a} × ${b} = ?`;
    const opts = [pgCorrect];
    while (opts.length < 4) {
      const wrong = pgCorrect + (Math.floor(Math.random() * 13) - 6);
      if (wrong > 0 && wrong !== pgCorrect && opts.indexOf(wrong) === -1) opts.push(wrong);
    }
    opts.sort(() => Math.random() - 0.5);
    pgAnswersEl.innerHTML = '';
    opts.forEach((n) => {
      const btn = document.createElement('button');
      btn.textContent = n;
      btn.addEventListener('click', () => {
        if (n === pgCorrect) {
          parentGateEl.classList.add('hidden');
          if (pgOnPass) pgOnPass();
        } else {
          pgTries++;
          if (pgTries >= 3) parentGateEl.classList.add('hidden');
          else newGateQuestion();
        }
      });
      pgAnswersEl.appendChild(btn);
    });
  }

  function openPaywall() {
    refreshPriceLabels();
    paywallEl.classList.remove('hidden');
  }
  function askToUnlock() { openParentalGate(openPaywall); }

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
  const MAX_GROUND_TOYS = 9;   // busier yard = no waiting around
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

    // Spawn the toddler — plus extra kids on playdate levels (level.kids) and
    // in worlds marked twins (School!).
    const kidCount = level.kids || (worldNow().twins ? 2 : 1);
    toddlers = [makeToddler()];
    for (let ki = 1; ki < kidCount; ki++) {
      const kid = makeToddler();
      kid.isTwin = true;
      toddlers.push(kid);
    }
    toddlers.forEach((t, i) => {
      const lp = tileToPx(level.littleStart);
      t.x = lp.x + i * TILE; t.y = lp.y;
      t.wanderTarget = pickRandomRoomPoint(level.rooms);
      // stagger each extra kid's first alert so crises alternate, never stack
      t.nextAlertIn = randRange(level.alertMin, level.alertMax) + i * 5;
    });

    updateHud();
    gameState = 'playing';
    hideOverlay();
    AudioFX.startMusic();
    if (level.playdate) showBanner('\u{1F476}\u{1F476} A FRIEND’S HERE — PLAYDATE!', '#ffd23f');
  }

  function showOverlay(title, message, buttonText, extraHtml) {
    overlayTitle.textContent = title;
    overlayMessage.innerHTML = message + (extraHtml || '');
    overlayButton.textContent = buttonText;
    overlayQuitBtn.classList.add('hidden'); // only the pause screen shows Quit
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
    timerEl.textContent = `\u{1F4A7} ${peesFixedThisLevel}/${peeQuota()}  \u{1F4A9} ${poopsFixedThisLevel}/${poopQuota()}`;
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
      ? `\u{1F3C6} Best run: ${b.score} pts \u{00B7} ${b.total} saves`
      : 'No high score yet — be the first Potty Champ!';

    // Top strip + player card
    const stars = totalStars();
    const rank = champRank();
    const toNext = STARS_PER_RANK - rankProgress();
    if (menuRankChipEl) menuRankChipEl.textContent = `RANK ${rank}`;
    if (menuStatStarsEl) menuStatStarsEl.textContent = `\u{2605} ${stars}`;
    if (menuStatStickersEl) menuStatStickersEl.textContent = `\u{1F4D6} ${stickerCount()}/${STICKERS.length}`;
    if (menuCardRankEl) {
      menuCardRankEl.textContent = `${KID_NAME} Rank ${rank} \u{00B7} ${toNext} \u{2605} to Rank ${rank + 1}`;
    }
    if (menuCardFillEl) {
      menuCardFillEl.style.width = `${(rankProgress() / STARS_PER_RANK) * 100}%`;
    }

    // Tile label helper — art teaser lives in CSS, so only the text is rewritten.
    const tile = (name, sub) => `<span class="tile-name">${name}</span><span class="tile-sub">${sub}</span>`;
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
      if (!isPremium()) {
        menuDashBtn.innerHTML = tile('Potty Dash', 'Free demo');
      } else {
        menuDashBtn.innerHTML = progress.dashBest > 0
          ? tile('Potty Dash', `Best ${progress.dashBest} m`)
          : tile('Potty Dash', 'Run and run');
      }
    }
    if (menuMayhemBtn) {
      if (!isPremium()) {
        menuMayhemBtn.innerHTML = tile('Potty Mayhem', '\u{1F512} Locked');
      } else {
        menuMayhemBtn.innerHTML = progress.mayhemBest > 0
          ? tile('Potty Mayhem', `Best ${progress.mayhemBest} pts`)
          : tile('Potty Mayhem', 'Total chaos');
      }
    }
    if (menuUnlockBtn) {
      menuUnlockBtn.classList.toggle('hidden', isPremium());
      if (!isPremium()) menuUnlockBtn.innerHTML = `\u{1F513} Unlock Everything — ${Store.priceString()}`;
    }
    if (menuDailyBtn) {
      menuDailyBtn.innerHTML = isDailyDone()
        ? tile('Daily Challenge', `\u{2705} Done \u{00B7} ${progress.dailyTotal} won`)
        : tile('Daily Challenge', dailyTypeToday().desc);
    }
    if (menuStickersBtn) {
      menuStickersBtn.innerHTML = tile('Sticker Book', `${stickerCount()} of ${STICKERS.length} found`);
    }
    if (menuGiftBtn) {
      menuGiftBtn.innerHTML = giftOpenedToday()
        ? '\u{1F381} Surprise opened — back tomorrow!'
        : '\u{1F381} Daily Surprise is ready!';
      menuGiftBtn.classList.toggle('opened', giftOpenedToday());
    }
    if (menuCapBtn) {
      // only worth showing once there's a choice to make
      menuCapBtn.classList.toggle('hidden', ownedCaps().length < 2);
      menuCapBtn.innerHTML = `\u{1F9E2} ${KID_NAME}'s Cap: ${CAP_LABELS[progress.capColor] || 'Red'}`;
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
    introTitleBurst = false;
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
    if (gameState === 'playing' || gameState === 'bonusRound' || gameState === 'dash') {
      pausedFrom = gameState;
      gameState = 'paused';
      AudioFX.stopMusic();
      showOverlay('Paused', 'Take a breather — your brother can hold it. Probably.', 'Resume');
      overlayQuitBtn.classList.remove('hidden');
      dashSwipeX = null; dashSwipeY = null; // drop any half-finished swipe
    } else if (gameState === 'paused') {
      gameState = pausedFrom;
      hideOverlay();
      AudioFX.startMusic();
    }
  }

  function quitToMenu() {
    // The unlock pitch after saving a stage uses this button too — from there,
    // "Quit to Menu" just means "no thanks, back to my levels."
    if (gameState === 'buildPitch') {
      hideOverlay();
      openMyLevels();
      return;
    }
    if (gameState !== 'paused' && gameState !== 'dashDemoOver') return;
    // Bank anything earned this run before leaving — quitting shouldn't
    // erase a new best distance, sticker, or daily challenge.
    if (gameState === 'paused' && pausedFrom === 'dash') {
      const m = dashMeters();
      if (m > progress.dashBest) { progress.dashBest = m; saveProgress(); }
      if (m >= DASH_STICKER_M) awardSticker('dash_500');
      if (m >= 300) completeDaily('dash');
    } else if (mayhemMode) {
      if (scoreThisLevel > progress.mayhemBest) { progress.mayhemBest = scoreThisLevel; saveProgress(); }
      if (mayhemSaves >= 15) awardSticker('mayhem_15');
      if (mayhemSaves >= 10) completeDaily('mayhem');
    }
    const wasCustom = customMode;
    mayhemMode = false;
    endlessMode = false;
    customMode = false;
    dashTut = null;
    dashSwipeX = null; dashSwipeY = null;
    heartsEl.style.display = '';
    particles.length = 0;
    AudioFX.stopAll();
    if (wasCustom) { openMyLevels(); return; } // straight back to their stages
    showMenu();
  }

  function startBonusRound() {
    gameState = 'bonusRound';
    bonusTimeRemaining = BONUS_DURATION;
    bonusScore = 0;
    toysCollected = 0;
    carriedToy = null;
    bonusToys = BONUS_SCENE.presetToys.map((t) => ({ ...t }));
    bonusSpawnTimer = randRange(1.3, 2.6);
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
    if (mayhemSaves >= 10) completeDaily('mayhem');
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
  const DASH_JUMP_TIME = 0.6;      // seconds airborne after a swipe up
  // Turbo Focus: hold the ⚡ button and the WORLD slows down (you feel fast).
  // Draining meter, refilled only by grabbing turbo boots on the road.
  const DASH_FOCUS_MAX = 3.5;      // seconds of focus in a full meter
  const DASH_FOCUS_SCALE = 0.4;    // world speed while focusing (lower = slower)
  const DASH_BOOT_REFILL = 2.0;    // seconds of focus per boot grabbed

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
  let dashJumpT = 0;
  let dashFocusMeter = DASH_FOCUS_MAX;
  let dashFocusOn = false;
  let dashPrevLeft = false, dashPrevRight = false, dashPrevUp = false;
  let dashSwipeX = null, dashSwipeY = null;
  let dashTut = null; // interactive first-run tutorial state

  function hasSeenDashTut() {
    try { return localStorage.getItem('pottychamp_dash_tut') === '1'; } catch (e) { return false; }
  }
  function markDashTutSeen() {
    try { localStorage.setItem('pottychamp_dash_tut', '1'); } catch (e) {}
  }
  function hasSeenDashHowto() {
    try { return localStorage.getItem('pottychamp_dash_howto') === '1'; } catch (e) { return false; }
  }
  function markDashHowtoSeen() {
    try { localStorage.setItem('pottychamp_dash_howto', '1'); } catch (e) {}
  }
  // First Dash ever: read the rules screen, THEN the hands-on tutorial.
  function openDash() {
    if (hasSeenDashHowto()) { startDash(); return; }
    hideMenu();
    hideOverlay();
    dashHowtoEl.classList.remove('hidden');
  }
  function dashJump() {
    if (dashJumpT > 0) return;
    dashJumpT = DASH_JUMP_TIME;
    AudioFX.catch();
  }

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
    dashSpawnGap = 190;
    dashInvincible = 0;
    dashJumpT = 0;
    dashFocusMeter = DASH_FOCUS_MAX;
    dashFocusOn = false;
    particles.length = 0;
    heartsEl.style.display = '';
    hearts = DASH_MAX_HITS;
    // first time playing? run the follow-along tutorial
    dashTut = hasSeenDashTut() ? null : { step: 0, phase: 'run', t: 1.2, want: null, obstacle: null };
    if (dashTut) showBanner('Follow the moves!', '#ffd23f');
    updateDashHud();
    hideOverlay();
    AudioFX.startMusic();
  }

  function dashMeters() { return Math.floor(dashScroll / TILE); }

  function updateDashHud() {
    timerEl.textContent = `${dashMeters()} m`;
    scoreEl.textContent = `${dashScore} pts`;
    starsEl.textContent = progress.dashBest > 0 ? `Best ${progress.dashBest}m` : '';
    turboFillEl.style.width = `${(dashFocusMeter / DASH_FOCUS_MAX) * 100}%`;
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

  // ---------- Dash tutorial: game freezes, shows the gesture, waits for it ----------
  // Steps: 0 swipe left · 1 swipe right · 2 jump an obstacle · 3 grab a turbo
  // boot · 4 hold the ⚡ button for Turbo Focus (world goes slow-mo). Then GO!
  function updateDashTutorial(dt) {
    const T = dashTut;
    const playerY = WORLD_H - 64;
    updateParticles(dt);
    updateFloatingTexts(dt);
    if (T.phase === 'run') {
      dashSpeed = 150;
      dashScroll += dashSpeed * dt;
      T.t -= dt;
      if (T.t <= 0) {
        if (T.step === 0) { T.phase = 'prompt'; T.want = 'left'; }
        else if (T.step === 1) { T.phase = 'prompt'; T.want = 'right'; }
        else if (T.step === 2) {
          // drop a poop stain in the player's lane — time to learn the jump
          T.obstacle = { kind: 'obstacle', type: 'stain_poop', lane: dashLane, y: -40 };
          dashObjs.push(T.obstacle);
          T.phase = 'approach';
        } else if (T.step === 3) {
          // roll a turbo boot down the lane NEXT DOOR — swipe over and grab it
          const bootLane = dashLane === 0 ? 1 : dashLane - 1;
          T.obstacle = { kind: 'pickup', type: 'turbo_shoe', lane: bootLane, y: -40 };
          dashObjs.push(T.obstacle);
          T.phase = 'approachBoot';
        } else if (T.step === 4) {
          // last lesson: an obstacle rolls in (safe lane) — hold ⚡ to see
          // the whole world slow down. Turbo Focus!
          const obLane = dashLane === 0 ? 1 : dashLane - 1;
          T.obstacle = { kind: 'obstacle', type: 'stain_pee', lane: obLane, y: -40 };
          dashObjs.push(T.obstacle);
          T.phase = 'approachFocus';
        } else {
          finishDashTutorial();
        }
      }
    } else if (T.phase === 'approach') {
      dashSpeed = 150;
      dashScroll += dashSpeed * dt;
      T.obstacle.y += dashSpeed * dt;
      if (T.obstacle.y > playerY - 95) { T.phase = 'prompt'; T.want = 'up'; }
    } else if (T.phase === 'approachBoot') {
      dashSpeed = 150;
      dashScroll += dashSpeed * dt;
      T.obstacle.y += dashSpeed * dt;
      if (T.obstacle.y > playerY - 95) {
        T.phase = 'prompt';
        T.want = T.obstacle.lane < dashLane ? 'left' : 'right';
      }
    } else if (T.phase === 'approachFocus') {
      dashSpeed = 150;
      dashScroll += dashSpeed * dt;
      T.obstacle.y += dashSpeed * dt;
      if (T.obstacle.y > playerY - 130) { T.phase = 'prompt'; T.want = 'turbo'; }
    } else if (T.phase === 'prompt') {
      dashSpeed = 0; // world frozen until they do the move
      // Turbo Focus is a HOLD on the ⚡ button, not a swipe — watch for it here.
      if (T.want === 'turbo' && input.turbo) {
        AudioFX.powerup();
        showBanner('TURBO FOCUS! ⚡', '#9fe8a9');
        T.phase = 'focusClear';
      }
    } else if (T.phase === 'clear') {
      dashSpeed = 250;
      dashScroll += dashSpeed * dt;
      if (T.obstacle) {
        T.obstacle.y += dashSpeed * dt;
        if (T.obstacle.y > playerY + 70) { T.step = 3; T.t = 0.7; T.phase = 'run'; }
      }
    } else if (T.phase === 'clearBoot') {
      dashSpeed = 250;
      dashScroll += dashSpeed * dt;
      if (T.obstacle) {
        T.obstacle.y += dashSpeed * dt;
        // scoop it up as it reaches you
        if (T.obstacle.lane === dashLane && Math.abs(T.obstacle.y - playerY) < 26) {
          dashFocusMeter = DASH_FOCUS_MAX;
          AudioFX.powerup();
          spawnFloatText(dashLaneX(dashLane), playerY - 24, '+TURBO ⚡', '#ffe27a');
          spawnBurst(dashLaneX(dashLane), playerY, GOLD_SPARK, 12, 60);
          showBanner('BOOT GRABBED! ⚡', '#9fe8a9');
          dashObjs = dashObjs.filter((o) => o !== T.obstacle);
          T.obstacle = null;
          T.step = 4; T.t = 0.8; T.phase = 'run';
        } else if (T.obstacle.y > playerY + 70) {
          // missed it — roll another one
          T.step = 3; T.t = 0.6; T.phase = 'run';
          dashObjs = dashObjs.filter((o) => o !== T.obstacle);
          T.obstacle = null;
        }
      }
    } else if (T.phase === 'focusClear') {
      // world crawls past in slow motion so they can FEEL the power
      dashSpeed = 250;
      const wdt = dt * DASH_FOCUS_SCALE;
      dashScroll += dashSpeed * wdt;
      if (T.obstacle) {
        T.obstacle.y += dashSpeed * wdt;
        if (T.obstacle.y > playerY + 70) {
          dashObjs = dashObjs.filter((o) => o !== T.obstacle);
          T.obstacle = null;
          T.step = 5; T.t = 0.4; T.phase = 'run';
        }
      }
    }
    updateDashHud();
  }

  // Returns true if the tutorial consumed the gesture.
  function dashTutorialGesture(g) {
    const T = dashTut;
    if (!T) return false;
    if (T.phase !== 'prompt') return true; // ignore inputs mid-run during tutorial
    if (T.want === 'turbo') return true;   // focus step is a button hold, not a swipe
    if (g !== T.want) return true;         // wrong move — keep waiting
    if (T.step === 3) { // grabbing the boot
      dashChangeLane(g === 'right' ? 1 : -1);
      T.phase = 'clearBoot';
      showBanner('GO GET IT!', '#9fe8a9');
      return true;
    }
    if (g === 'left') { dashChangeLane(-1); T.step = 1; T.phase = 'run'; T.t = 1.1; }
    else if (g === 'right') { dashChangeLane(1); T.step = 2; T.phase = 'run'; T.t = 1.1; }
    else if (g === 'up') { dashJumpT = DASH_JUMP_TIME; AudioFX.powerup(); T.phase = 'clear'; }
    spawnBurst(dashLaneX(dashLane), WORLD_H - 64, GOLD_SPARK, 10, 55);
    showBanner(g === 'up' ? 'NICE JUMP!' : 'PERFECT!', '#9fe8a9');
    return true;
  }

  function finishDashTutorial() {
    markDashTutSeen();
    dashTut = null;
    dashObjs = [];
    dashScroll = 0;
    dashScore = 0;
    dashHits = 0;
    hearts = DASH_MAX_HITS;
    dashSpeed = DASH_START_SPEED;
    dashSpawnGap = 190;
    dashFocusMeter = DASH_FOCUS_MAX;
    showBanner('GO! GO! GO!', '#ffd23f');
  }

  function endDashDemo() {
    gameState = 'dashDemoOver';
    AudioFX.stopMusic();
    AudioFX.fanfare();
    const m = dashMeters();
    if (m > progress.dashBest) { progress.dashBest = m; saveProgress(); }
    showOverlay(
      `WOW — ${m} m! \u{1F3C3}`,
      `That's the free demo! Unlock Everything to dash as far as your legs can go — plus the Park, Store, School, and Potty Mayhem.`,
      `\u{1F513} Unlock Everything — ${Store.priceString()}`
    );
    overlayQuitBtn.classList.remove('hidden'); // "Quit to Menu" doubles as "not now"
  }

  function endDash() {
    gameState = 'dashOver';
    AudioFX.stopMusic();
    AudioFX.accident();
    const m = dashMeters();
    if (m > progress.dashBest) { progress.dashBest = m; saveProgress(); }
    if (m >= DASH_STICKER_M) awardSticker('dash_500');
    if (m >= 300) completeDaily('dash');
    showOverlay(
      'Ouch! Too many boo-boos!',
      `You dashed <strong>${m} m</strong> and scored ${dashScore} pts.` +
      `<br><small>Best dash: ${progress.dashBest} m</small>`,
      'Back to Menu'
    );
  }

  function updateDash(dt) {
    if (dashJumpT > 0) dashJumpT -= dt;
    if (dashTut) { updateDashTutorial(dt); return; }

    // Turbo Focus: while held (and the meter has juice), the WORLD runs in
    // slow motion — you keep moving at full speed in your head. Sonic-style.
    dashFocusOn = input.turbo && dashFocusMeter > 0;
    if (dashFocusOn) dashFocusMeter = Math.max(0, dashFocusMeter - dt);
    const wdt = dashFocusOn ? dt * DASH_FOCUS_SCALE : dt; // world time

    dashSpeed = Math.min(DASH_MAX_SPEED, dashSpeed + DASH_ACCEL * wdt);
    dashScroll += dashSpeed * wdt;
    dashScore += Math.round(dashSpeed * wdt * 0.02); // trickle points for distance

    // Free demo ends right when it's getting fun.
    if (!isPremium() && dashMeters() >= DASH_DEMO_METERS) { endDashDemo(); return; }

    // lane input: keyboard edges (up arrow = jump)
    if (input.left && !dashPrevLeft) dashChangeLane(-1);
    if (input.right && !dashPrevRight) dashChangeLane(1);
    if (input.up && !dashPrevUp) dashJump();
    dashPrevLeft = input.left; dashPrevRight = input.right; dashPrevUp = input.up;

    // Champ mirrors your lane with a little lag
    if (dashChampLaneDelay > 0) {
      dashChampLaneDelay -= dt;
      if (dashChampLaneDelay <= 0) dashChampLane = dashLane;
    }

    if (dashInvincible > 0) dashInvincible -= dt;

    // spawn rows by distance traveled — pure dodging now: hazards to avoid,
    // turbo boots (the ONLY pickup) to keep the focus meter charged.
    dashSpawnGap -= dashSpeed * wdt;
    if (dashSpawnGap <= 0) {
      dashSpawnGap = randRange(150, 205); // roomier gaps = more reaction time for little thumbs
      const lanes = [0, 1, 2];
      const firstLane = lanes.splice(Math.floor(Math.random() * lanes.length), 1)[0];
      if (Math.random() < 0.72) {
        const r = Math.random();
        dashObjs.push({ kind: 'obstacle', type: r < 0.4 ? 'stain_poop' : (r < 0.8 ? 'stain_pee' : 'cart'), lane: firstLane, y: -40 });
        // sometimes a second obstacle — but never all three lanes
        if (Math.random() < 0.22 + Math.min(0.2, dashScroll / 30000)) {
          const secondLane = lanes.splice(Math.floor(Math.random() * lanes.length), 1)[0];
          dashObjs.push({ kind: 'obstacle', type: Math.random() < 0.7 ? 'stain_pee' : 'stain_poop', lane: secondLane, y: -40 });
        }
      } else {
        dashObjs.push({ kind: 'pickup', type: 'turbo_shoe', lane: firstLane, y: -40 });
      }
    }

    // move + collide
    const playerY = WORLD_H - 64;
    for (let i = dashObjs.length - 1; i >= 0; i--) {
      const o = dashObjs[i];
      o.y += dashSpeed * wdt;
      if (o.y > WORLD_H + 48) { dashObjs.splice(i, 1); continue; }
      if (o.lane !== dashLane) continue;
      if (Math.abs(o.y - playerY) > 26) continue;
      if (o.kind === 'pickup') {
        dashFocusMeter = Math.min(DASH_FOCUS_MAX, dashFocusMeter + DASH_BOOT_REFILL);
        dashScore += 25;
        AudioFX.powerup();
        spawnFloatText(dashLaneX(o.lane), o.y - 20, '+TURBO ⚡', '#ffe27a');
        spawnBurst(dashLaneX(o.lane), o.y, GOLD_SPARK, 10, 55);
        dashObjs.splice(i, 1);
      } else if (dashInvincible <= 0 && dashJumpT <= 0) { // airborne = safely over it
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
    // How much world space exists beyond the 528x336 play area on this screen
    // (the letterbox margins) — we paint all of it so the game fills the phone.
    const exL = Math.ceil(offsetX / scale) + TILE;
    const exT = Math.ceil(offsetY / scale) + TILE;

    // grass field, edge to edge, scrolling smoothly
    const off = dashScroll % TILE;
    const txStart = -Math.ceil(exL / TILE) - 1;
    const txEnd = GRID_COLS + Math.ceil(exL / TILE) + 1;
    const tyStart = -Math.ceil(exT / TILE) - 2;
    const tyEnd = GRID_ROWS + Math.ceil(exT / TILE) + 1;
    for (let ty = tyStart; ty < tyEnd; ty++) {
      for (let tx = txStart; tx < txEnd; tx++) {
        ctx.drawImage(images.grass, tx * TILE, ty * TILE + off);
      }
    }
    // road (full height of the visible screen)
    const roadX = WORLD_W / 2 - (DASH_LANE_W * DASH_LANES) / 2;
    const roadW = DASH_LANE_W * DASH_LANES;
    ctx.fillStyle = '#8d939c';
    ctx.fillRect(roadX, -exT, roadW, WORLD_H + exT * 2);
    ctx.fillStyle = '#f2f4f6';
    ctx.fillRect(roadX - 3, -exT, 3, WORLD_H + exT * 2);
    ctx.fillRect(roadX + roadW, -exT, 3, WORLD_H + exT * 2);
    // dashed lane lines scrolling with the road
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    const dashLen = 16, gapLen = 20, seg = dashLen + gapLen;
    const lineOff = dashScroll % seg;
    for (let li = 1; li < DASH_LANES; li++) {
      const lx = roadX + li * DASH_LANE_W - 2;
      for (let y = -exT - seg + lineOff; y < WORLD_H + exT; y += seg) {
        ctx.fillRect(lx, y, 4, dashLen);
      }
    }
    // roadside trees, marching down smoothly (two rows each side)
    const treeSeg = 96;
    const treeOff = dashScroll % treeSeg;
    for (let y = -exT - treeSeg + treeOff - 48; y < WORLD_H + exT + 48; y += treeSeg) {
      ctx.drawImage(images.tree, roadX - 42, y);
      ctx.drawImage(images.tree, roadX + roadW + 18, y + 44);
      if (exL > 60) {
        ctx.drawImage(images.tree, roadX - exL + 6, y + 22);
        ctx.drawImage(images.tree, roadX + roadW + exL - 30, y + 66);
      }
    }

    // objects — soft danger markers under hazards, sparkling halos under goodies
    const now = performance.now();
    for (const o of dashObjs) {
      const ox = dashLaneX(o.lane);
      if (o.kind === 'obstacle') {
        const pulse = 0.5 + Math.sin(now / 160) * 0.5; // 0..1
        // soft red danger pool (radial fade, no hard circle edge)
        const dg = ctx.createRadialGradient(ox, o.y + 6, 2, ox, o.y + 6, 34);
        dg.addColorStop(0, `rgba(255,60,60,${(0.38 + 0.16 * pulse).toFixed(3)})`);
        dg.addColorStop(0.65, 'rgba(255,60,60,0.15)');
        dg.addColorStop(1, 'rgba(255,60,60,0)');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.ellipse(ox, o.y + 6, 34, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        const size = o.type === 'cart' ? 46 : 40; // BIG — see it coming from far away
        ctx.drawImage(images[o.type], ox - size / 2, o.y - size / 2, size, size);
        // bobbing warning sign overhead
        const wob = Math.sin(now / 180) * 2.5;
        ctx.textAlign = 'center';
        ctx.font = '17px -apple-system';
        ctx.fillText('⚠️', ox, o.y - size / 2 - 5 + wob);
        ctx.textAlign = 'left';
      } else {
        const bob = Math.sin((now + o.y) / 160) * 2;
        // warm golden halo (radial fade) — turbo boot, the only pickup
        const gg = ctx.createRadialGradient(ox, o.y + bob, 2, ox, o.y + bob, 28);
        gg.addColorStop(0, 'rgba(255,228,130,0.55)');
        gg.addColorStop(0.6, 'rgba(255,205,70,0.22)');
        gg.addColorStop(1, 'rgba(255,205,70,0)');
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(ox, o.y + bob, 28, 0, Math.PI * 2);
        ctx.fill();
        // spinning 4-point sparkle star behind the item
        ctx.save();
        ctx.translate(ox, o.y + bob);
        ctx.rotate(now / 700);
        ctx.fillStyle = 'rgba(255,240,170,0.85)';
        for (let s = 0; s < 4; s++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, -21);
          ctx.lineTo(3, -10);
          ctx.lineTo(-3, -10);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
        ctx.drawImage(images[o.type], ox - 15, o.y - 15 + bob, 30, 30);
        // lightning bolt riding above the boot so it reads as TURBO
        ctx.textAlign = 'center';
        ctx.font = '13px -apple-system';
        ctx.fillText('⚡', ox, o.y + bob - 18);
        ctx.textAlign = 'left';
        // wandering twinkle
        const tw = Math.floor(now / 260 + o.y) % 3;
        const twx = ox + (tw === 0 ? -14 : tw === 1 ? 13 : 4);
        const twy = o.y + bob + (tw === 0 ? -8 : tw === 1 ? -12 : 12);
        ctx.fillStyle = 'rgba(255,255,225,0.95)';
        ctx.fillRect(twx - 1, twy - 3, 2, 6);
        ctx.fillRect(twx - 3, twy - 1, 6, 2);
      }
    }

    // Champ sprinting ahead of you (drawn big)
    const frame = Math.floor(now / 110) % 2;
    const champSize = SPRITE_SIZE * DASH_CHAR_SCALE * 0.9;
    ctx.drawImage(
      images[`little_up_${frame}`],
      dashLaneX(dashChampLane) - champSize / 2,
      WORLD_H - 148,
      champSize, champSize
    );
    // you, pounding pavement (blink while invincible, arc up while jumping)
    const blink = dashInvincible > 0 && dashJumpT <= 0 && Math.floor(now / 120) % 2 === 0;
    if (!blink) {
      const meSize = SPRITE_SIZE * DASH_CHAR_SCALE;
      const meX = dashLaneX(dashLane) - meSize / 2;
      const meY = WORLD_H - 84;
      let lift = 0;
      if (dashJumpT > 0) {
        const p = 1 - dashJumpT / DASH_JUMP_TIME;
        lift = Math.sin(p * Math.PI) * 36;
      }
      // shadow shrinks while airborne
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(dashLaneX(dashLane), meY + meSize - 4, 18 - lift * 0.2, 6 - lift * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(images[`big_up_${frame}`], meX, meY - lift, meSize, meSize);
    }

    drawParticles();
    drawFloatingTexts();
    drawBanner();

    // Turbo Focus: cool blue vignette + rushing speed lines while the world crawls
    if ((dashFocusOn && gameState === 'dash' && !dashTut) || (dashTut && dashTut.phase === 'focusClear')) {
      const vg = ctx.createRadialGradient(WORLD_W / 2, WORLD_H / 2, WORLD_H * 0.35, WORLD_W / 2, WORLD_H / 2, WORLD_H * 0.85);
      vg.addColorStop(0, 'rgba(80,160,255,0)');
      vg.addColorStop(1, 'rgba(40,90,220,0.28)');
      ctx.fillStyle = vg;
      ctx.fillRect(-exL, -exT, WORLD_W + exL * 2, WORLD_H + exT * 2);
      // vertical speed lines whipping past
      ctx.strokeStyle = 'rgba(190,220,255,0.5)';
      ctx.lineWidth = 2;
      for (let s = 0; s < 8; s++) {
        const sx = ((s * 73 + now * 0.9) % (WORLD_W + exL * 2)) - exL;
        const sy = ((now * 1.6 + s * 140) % (WORLD_H + exT * 2)) - exT;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + 34);
        ctx.stroke();
      }
    }

    // tutorial prompt: dark veil + big instruction + animated hand
    if (dashTut && dashTut.phase === 'prompt') {
      ctx.fillStyle = 'rgba(8,9,14,0.55)';
      ctx.fillRect(-exL, -exT, WORLD_W + exL * 2, WORLD_H + exT * 2);
      const w = dashTut.want;
      const grabbingBoot = dashTut.step === 3;
      const msg = w === 'turbo' ? 'HOLD ⚡ FOR TURBO FOCUS!'
        : grabbingBoot ? 'SWIPE TO GRAB THE BOOT!'
        : w === 'left' ? 'SWIPE LEFT!' : w === 'right' ? 'SWIPE RIGHT!' : 'SWIPE UP TO JUMP!';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 28px -apple-system, "Helvetica Neue", sans-serif';
      ctx.lineWidth = 7;
      ctx.strokeStyle = 'rgba(10,8,4,0.95)';
      ctx.strokeText(msg, WORLD_W / 2, WORLD_H / 2 - 56);
      ctx.fillStyle = '#ffe27a';
      ctx.fillText(msg, WORLD_W / 2, WORLD_H / 2 - 56);
      const slide = (Math.sin(now / 300) + 1) / 2; // 0..1
      if (w === 'turbo') {
        // pulsing lightning bolt + a hand pressing down toward the ⚡ button
        ctx.font = `${Math.round(40 + slide * 14)}px -apple-system`;
        ctx.fillText('⚡', WORLD_W / 2, WORLD_H / 2 - 8);
        ctx.font = '38px -apple-system';
        ctx.fillText('\u{1F447}', WORLD_W / 2 + 4, WORLD_H / 2 + 46 + slide * 14);
        ctx.font = '15px -apple-system';
        ctx.fillStyle = '#cfe4ff';
        ctx.fillText('Everything slows down — easy dodging!', WORLD_W / 2, WORLD_H / 2 + 90);
      } else {
        // animated hand sliding in the gesture direction
        let hx = WORLD_W / 2, hy = WORLD_H / 2 + 10;
        if (w === 'left') hx = WORLD_W / 2 + 50 - slide * 100;
        else if (w === 'right') hx = WORLD_W / 2 - 50 + slide * 100;
        else hy = WORLD_H / 2 + 34 - slide * 60;
        ctx.font = '44px -apple-system';
        ctx.fillText(w === 'up' ? '\u{261D}\u{FE0F}' : '\u{1F446}', hx, hy);
        const arrow = w === 'left' ? '\u{2B05}\u{FE0F}' : w === 'right' ? '\u{27A1}\u{FE0F}' : '\u{2B06}\u{FE0F}';
        ctx.font = '30px -apple-system';
        ctx.fillText(arrow, WORLD_W / 2, WORLD_H / 2 - 20);
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    }
    ctx.imageSmoothingEnabled = true;
  }

  // swipe to change lanes / swipe up to jump (pointer events cover touch + mouse)
  canvas.addEventListener('pointerdown', (e) => {
    if (gameState === 'dash') { dashSwipeX = e.clientX; dashSwipeY = e.clientY; }
    else if (gameState === 'editor') {
      e.preventDefault();
      if (editorDragStart(e.clientX, e.clientY)) {
        if (canvas.setPointerCapture) { try { canvas.setPointerCapture(e.pointerId); } catch (err) {} }
      } else {
        editorTap(e.clientX, e.clientY);
      }
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (gameState === 'editor' && ed.drag) { e.preventDefault(); editorDragMove(e.clientX, e.clientY); }
  });
  canvas.addEventListener('pointercancel', () => { ed.drag = null; });
  canvas.addEventListener('pointerup', (e) => {
    if (gameState === 'editor' && ed.drag) { e.preventDefault(); editorDragEnd(); return; }
    if (gameState !== 'dash' || dashSwipeX === null) return;
    const dx = e.clientX - dashSwipeX;
    const dy = e.clientY - dashSwipeY;
    dashSwipeX = null; dashSwipeY = null;
    let g;
    if (Math.abs(dy) > Math.abs(dx) && dy < -24) g = 'up';
    else if (dx > 24) g = 'right';
    else if (dx < -24) g = 'left';
    else {
      // simple tap: left half = left, right half = right (little-kid friendly)
      const rect = canvas.getBoundingClientRect();
      g = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
    }
    if (dashTut) { dashTutorialGesture(g); return; }
    if (g === 'up') dashJump();
    else dashChangeLane(g === 'right' ? 1 : -1);
  });

  overlayButton.addEventListener('click', () => {
    if (gameState === 'splash') {
      startIntro();
    } else if (gameState === 'paused') {
      togglePause();
    } else if (gameState === 'levelComplete') {
      if (customMode) { customMode = false; openMyLevels(); return; }
      // Bonus round only after every 2nd level (endless keeps one per day).
      if (!endlessMode && !level.bonusAfter) {
        hideOverlay();
        advanceStory();
        return;
      }
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
      advanceStory();
    } else if (gameState === 'gameOver') {
      if (customMode) { playStage(customIdx); return; } // retry their own stage
      if (endlessMode) {
        endlessMode = false;
        showMenu();
      } else {
        startLevel(levelIndex); // retry the same level from the start
      }
    } else if (gameState === 'dashOver') {
      showMenu();
    } else if (gameState === 'dashDemoOver') {
      askToUnlock(); // parental gate first, then the paywall
    } else if (gameState === 'mayhemOver') {
      showMenu();
    } else if (gameState === 'buildPitch') {
      askToUnlock(); // parental gate, then the paywall
    } else if (gameState === 'gift') {
      openDailyGift();
    } else if (gameState === 'giftOpen') {
      hideOverlay();
      showMenu();
    } else if (gameState === 'ending') {
      showMenu();
    }
  });

  function startRunAt(wIdx, lIdx) {
    endlessMode = false;
    mayhemMode = false;
    customMode = false;
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
      if (!canPlayWorld(w)) break;
      for (let li = 0; li < w.levels.length; li++) {
        if (starsFor(w.id, li) === 0) { startRunAt(wi, li); return; }
      }
    }
    // Everything cleared — replay the last playable world from the top.
    let lastUnlocked = 0;
    WORLDS.forEach((w, i) => { if (canPlayWorld(w)) lastUnlocked = i; });
    startRunAt(lastUnlocked, 0);
  }

  // ---------- World / level select ----------
  let lsWorldIdx = 0;
  function openLevelSelect() {
    hideMenu();
    // default tab: furthest unlocked world
    lsWorldIdx = 0;
    WORLDS.forEach((w, i) => { if (canPlayWorld(w)) lsWorldIdx = i; });
    renderLevelSelect();
    levelSelectEl.classList.remove('hidden');
  }
  function renderLevelSelect() {
    lsWorldsEl.innerHTML = '';
    lsLevelsEl.innerHTML = '';
    WORLDS.forEach((w, wi) => {
      const b = document.createElement('button');
      const earned = isWorldUnlocked(w);          // beat the world before it
      const playable = canPlayWorld(w);           // earned AND (home or purchased)
      b.className = 'ls-world' + (wi === lsWorldIdx ? ' active' : '') + (playable ? '' : ' locked');
      b.textContent = playable ? w.label : `\u{1F512} ${w.label}`;
      if (playable) b.addEventListener('click', () => { lsWorldIdx = wi; renderLevelSelect(); });
      else if (earned) b.addEventListener('click', askToUnlock); // earned it — just needs the unlock
      lsWorldsEl.appendChild(b);
    });
    const w = WORLDS[lsWorldIdx];
    if (!canPlayWorld(w)) return;
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
    const next = lsWorldIdx + 1 < WORLDS.length ? WORLDS[lsWorldIdx + 1] : null;
    if (next && isWorldUnlocked(next) && !canPlayWorld(next)) {
      lsHintEl.textContent = `You earned ${next.label}! Unlock Everything to play it.`;
    } else if (next && !isWorldUnlocked(next)) {
      lsHintEl.textContent = `Clear all 5 levels to unlock ${next.label}!`;
    } else {
      lsHintEl.textContent = '';
    }
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
  if (menuDashBtn) menuDashBtn.addEventListener('click', openDash);
  if (dashHowtoStartBtn) dashHowtoStartBtn.addEventListener('click', () => {
    markDashHowtoSeen();
    dashHowtoEl.classList.add('hidden');
    startDash();
  });
  if (menuMayhemBtn) menuMayhemBtn.addEventListener('click', () => {
    if (!isPremium()) { askToUnlock(); return; }
    startMayhem();
  });
  if (menuDailyBtn) menuDailyBtn.addEventListener('click', () => {
    const ty = dailyTypeToday().id;
    if (ty === 'dash') openDash();
    else if (ty === 'mayhem') startMayhem();
    else beginRun();
  });
  if (menuStickersBtn) menuStickersBtn.addEventListener('click', openStickerBook);
  if (menuBuildBtn) menuBuildBtn.addEventListener('click', openMyLevels);
  if (menuGiftBtn) menuGiftBtn.addEventListener('click', () => {
    if (giftOpenedToday()) return;
    hideMenu();
    gameState = 'gift';
    showOverlay('\u{1F381} A present for you!', 'Something special is inside…', 'Open it!');
  });
  if (menuCapBtn) menuCapBtn.addEventListener('click', () => {
    const owned = ownedCaps();
    if (owned.length < 2) return;
    const i = owned.indexOf(progress.capColor);
    progress.capColor = owned[(i + 1) % owned.length];
    saveProgress();
    menuCapBtn.innerHTML = `\u{1F9E2} ${KID_NAME}'s Cap: ${CAP_LABELS[progress.capColor]}`;
    AudioFX.catch();
  });
  if (sbBackBtn) sbBackBtn.addEventListener('click', () => {
    stickerBookEl.classList.add('hidden');
    showMenu();
  });
  if (lsBackBtn) lsBackBtn.addEventListener('click', () => {
    levelSelectEl.classList.add('hidden');
    showMenu();
  });
  pauseBtn.addEventListener('click', togglePause);
  overlayQuitBtn.addEventListener('click', quitToMenu);
  if (menuUnlockBtn) menuUnlockBtn.addEventListener('click', askToUnlock);
  if (pwBuyBtn) pwBuyBtn.addEventListener('click', () => Store.buy());
  if (pwRestoreBtn) pwRestoreBtn.addEventListener('click', () => Store.restore());
  if (pwCloseBtn) pwCloseBtn.addEventListener('click', () => paywallEl.classList.add('hidden'));
  if (pgCancelBtn) pgCancelBtn.addEventListener('click', () => parentGateEl.classList.add('hidden'));
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
        unlockHtml = isPremium()
          ? `<br>\u{1F513} <strong>NEW LOCATION UNLOCKED: ${next.label}!</strong>`
          : `<br>\u{1F513} <strong>You earned ${next.label}!</strong> Unlock Everything (${Store.priceString()}) to play it!`;
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

    // Custom stages: score only. No stars, no stickers, no bonus round — so a
    // player can't build a trivial level and farm the whole sticker book.
    if (customMode) {
      celebrateTimer = 2.5;
      celebrateTick = 0;
      showOverlay(
        `\u{1F528} ${level.label} cleared!`,
        `Score: ${scoreThisLevel} pts &nbsp;|&nbsp; Accidents: ${accidentsThisLevel}` +
        `<br><small>Your own stage — nice building!</small>`,
        'Back to My Levels'
      );
      return;
    }

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
    if (accidentsThisLevel === 0) completeDaily('clean');

    // Confetti keeps popping behind the overlay — the win screen IS the game.
    celebrateTimer = rating === 3 ? 4 : 2.5;
    celebrateTick = 0;

    // Stars slam in one at a time (CSS pop animation, staggered).
    const starsHtml = starString(rating).split('').map((s, i) =>
      `<span class="star-pop" style="animation-delay:${(0.15 + i * 0.3).toFixed(2)}s">${s}</span>`).join('');

    // Tease what's next so they beg for one more level (tomorrow counts too).
    let tease = '';
    const next = worldNow().levels[levelIndex + 1];
    const nextWorld = WORLDS[worldIndex + 1];
    if (next) {
      tease = `<br><small>Next up: ${next.label}` +
        (next.kids > 1 && !(level.kids > 1) ? ' \u{1F476}\u{1F476} PLAYDATE!' : '') + '</small>';
    } else if (nextWorld) {
      tease = `<br><small>Next up: ${nextWorld.label}! \u{1F31F}</small>`;
    }

    showOverlay(
      rating === 3 ? '\u{2B50} PERFECT! POTTY CHAMP! \u{1F3C6}' : `${level.label} complete!`,
      `<span class="rating-stars">${starsHtml}</span><br>` +
      `Score: ${scoreThisLevel} pts &nbsp;|&nbsp; Accidents: ${accidentsThisLevel}` +
      (rating < 3 ? '<br><small>No accidents + grab the trophy for ★★★</small>' : '') +
      tease,
      // Backyard bonus comes after every 2nd level; otherwise straight on.
      level.bonusAfter ? 'Clean Up the Yard!' : 'Next Level ▶'
    );
  }

  // Story mode: move on after a level (or its bonus round) wraps up.
  function advanceStory() {
    const completedIdx = levelIndex;
    if (completedIdx + 1 < worldNow().levels.length) {
      startLevel(completedIdx + 1);
    } else {
      gameState = 'ending';
      showEnding();
    }
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
        // Fairness: with multiple kids, only ONE can be in crisis at a time.
        // If another kid is mid-alert, this one holds it a little longer.
        if (toddlers.some((o) => o !== t && o.alertActive)) {
          t.nextAlertIn = 1.5 + Math.random() * 1.5;
          return;
        }
        t.alertActive = true;
        // Don't keep sending alerts for a goal that's already done — once the
        // poop quota is met, only pees pop up (and vice versa).
        const peeDone = peesFixedThisLevel >= peeQuota();
        const poopDone = poopsFixedThisLevel >= poopQuota();
        if (poopDone && !peeDone) t.alertType = 'pee';
        else if (peeDone && !poopDone) t.alertType = 'poop';
        else t.alertType = Math.random() < 0.55 ? 'pee' : 'poop';
        t.alertTimeRemaining = level.alertTimeLimit * (toddlers.length > 1 ? MULTIKID_TIME_SCALE : 1)
          + (t.alertType === 'poop' ? POOP_EXTRA_TIME : 0);
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
        momLookupTimer = MOM_LOOKUP_TIME; // mom hears it and looks up
        AudioFX.accident();
        shake(3, 0.35);
        spawnBurst(t.x + t.w / 2, t.y + t.h / 2, SAD_BLUE, 10, 50);
        t.alertActive = false;
        t.state = 'wander';
        t.wanderTarget = pickRandomRoomPoint(level.rooms);
        t.nextAlertIn = mayhemMode ? Infinity
          : randRange(level.alertMin, level.alertMax) * (toddlers.length > 1 ? MULTIKID_SPACING_SCALE : 1);
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
            poopsFixedThisLevel = Math.min(poopQuota(), poopsFixedThisLevel + 1);
            awardSticker('first_poop');
          } else {
            peeSavedRun++;
            peesFixedThisLevel = Math.min(peeQuota(), peesFixedThisLevel + 1);
            awardSticker('first_pee');
          }
          const timeBonus = Math.round(Math.max(0, t.alertTimeRemaining) * TIME_BONUS_PER_SEC);
          const earned = (isPoop ? POOP_POINTS : PEE_POINTS) + timeBonus;
          scoreThisLevel += earned;
          // Juice: clutch saves get slow-mo, streaks get escalating call-outs.
          if (t.alertTimeRemaining < 1) {
            slowmoTimer = 0.55;
            scoreThisLevel += 50;
            showBanner('JUST IN TIME! +50', '#ffffff');
            spawnFloatText(sx, sy - 34, 'CLUTCH!', '#ffffff');
            AudioFX.combo(6);
          } else if (savesStreakThisLevel >= 2) {
            const n = savesStreakThisLevel;
            showBanner(
              n >= 8 ? 'POTTY LEGEND! \u{1F451}' : n >= 5 ? 'ON FIRE! \u{1F525}' : `${n} IN A ROW!`,
              n >= 5 ? '#ff9d3f' : '#ffd23f'
            );
            AudioFX.combo(n);
          }
          t.alertActive = false;
          t.state = 'relieved';
          t.relieveTimer = 1.0;
          AudioFX.success();
          pottyGlowTimer = POTTY_GLOW_TIME;
          spawnBurst(sx, sy, GOLD_SPARK, 14, 70);
          spawnFloatText(sx, sy - 18, `+${earned}`, isPoop ? '#ffb37a' : '#ffe27a');
          t.nextAlertIn = mayhemMode ? Infinity
            : randRange(level.alertMin, level.alertMax) * (toddlers.length > 1 ? MULTIKID_SPACING_SCALE : 1);
          if (mayhemMode) mayhemSaves++;
          updateHud();
          // Level is complete once both goals are met (story/endless only).
          if (!mayhemMode && peesFixedThisLevel >= peeQuota() && poopsFixedThisLevel >= poopQuota()) {
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
    const startX = 60;
    const potX = WORLD_W - 130;
    const y = WORLD_H / 2 + 22;
    const todX = startX + (potX - 70 - startX) * p;
    return { tod: { x: todX, y }, bro: { x: todX - 62, y }, potX, y, done: p >= 1 };
  }

  function updateIntro(dt) {
    const t = introTime;
    if (t > 3.2 && t < 6.2) {
      const d = introDemoPos(t);
      if (!d.done) {
        introSparkTimer -= dt;
        if (introSparkTimer <= 0) {
          introSparkTimer = 0.07;
          // dust kicking up behind both runners
          spawnBurst(d.bro.x + 8, d.bro.y + 44, PUFF_WHITE, 2, 30);
          spawnBurst(d.tod.x + 8, d.tod.y + 44, PUFF_WHITE, 1, 25);
        }
      } else if (!introSavedBurst) {
        introSavedBurst = true;
        spawnBurst(WORLD_W - 130, WORLD_H / 2 + 30, GOLD_SPARK, 22, 90);
        shake(3, 0.35);
        AudioFX.success();
      }
    }
    if (t > 6.45 && !introTitleBurst) {
      introTitleBurst = true;
      spawnBurst(WORLD_W / 2, WORLD_H / 2 - 24, GOLD_SPARK, 26, 110);
    }
  }

  function fadeAlpha(t, start, end) {
    const F = 0.35;
    if (t < start + F) return Math.max(0, (t - start) / F);
    if (t > end - F) return Math.max(0, (end - t) / F);
    return 1;
  }

  // pop-in with a little overshoot — the classic "trailer text" landing
  function easeOutBack(x) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
  function popScale(t, start, dur = 0.5) {
    const p = Math.max(0, Math.min(1, (t - start) / dur));
    return p <= 0 ? 0 : easeOutBack(p);
  }
  function introPopText(text, cx, cy, size, fill, t, start, endFade) {
    const s = popScale(t, start);
    if (s <= 0) return;
    ctx.save();
    ctx.globalAlpha = endFade ? fadeAlpha(t, start, endFade) : Math.min(1, (t - start) / 0.2);
    ctx.translate(cx, cy);
    ctx.scale(s, s);
    ctx.font = `900 ${size}px -apple-system, "Helvetica Neue", sans-serif`;
    ctx.lineWidth = Math.max(4, size / 6);
    ctx.strokeStyle = 'rgba(10,8,4,0.9)';
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = fill;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
  function introBackdrop() {
    const g = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    g.addColorStop(0, '#1b1e2e');
    g.addColorStop(1, '#0b0c12');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    // vignette
    const v = ctx.createRadialGradient(WORLD_W / 2, WORLD_H / 2, WORLD_H / 3, WORLD_W / 2, WORLD_H / 2, WORLD_H);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }

  function drawIntro() {
    const t = introTime;
    introBackdrop();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (t < 3.2) {
      if (t < 1.6) {
        introPopText('THIS SUMMER…', WORLD_W / 2, WORLD_H / 2, 28, '#ffffff', t, 0.1, 1.6);
      } else {
        introPopText('ONE BIG BROTHER.', WORLD_W / 2, WORLD_H / 2 - 22, 26, '#ffffff', t, 1.7, 3.2);
        introPopText('ONE TINY BLADDER.', WORLD_W / 2, WORLD_H / 2 + 22, 26, '#ffd23f', t, 2.1, 3.2);
      }
    } else if (t < 6.2) {
      // spotlight stage: big 2x actors sprinting for a big potty
      const d = introDemoPos(t);
      const spot = ctx.createRadialGradient(WORLD_W / 2, d.y + 40, 30, WORLD_W / 2, d.y + 40, WORLD_W / 2);
      spot.addColorStop(0, 'rgba(255,226,122,0.14)');
      spot.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      // floor line
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(30, d.y + 48, WORLD_W - 60, 2);
      // the potty (big)
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(images.potty, d.potX, d.y + 2, 48, 48);
      if (!d.done) {
        const frame = Math.floor(t * 9) % 2;
        ctx.drawImage(images[`big_side_${frame}`], d.bro.x, d.bro.y, 48, 48);
        ctx.drawImage(images[`little_side_${frame}`], d.tod.x, d.tod.y, 48, 48);
        const bob = Math.sin(t * 18) * 4;
        ctx.drawImage(images.icon_pee, d.tod.x + 12, d.tod.y - 30 + bob, 24, 24);
      } else {
        ctx.drawImage(images.little_down_0, d.potX - 54, d.y + 2, 48, 48);
        ctx.drawImage(images.big_down_0, d.potX + 52, d.y + 2, 48, 48);
        introPopText('SAVED! ★', WORLD_W / 2, WORLD_H / 2 - 58, 34, '#ffd23f', t, 5.4);
      }
      ctx.imageSmoothingEnabled = true;
      drawParticles();
    } else {
      // title card: layered gold logo, characters, tagline
      const s = popScale(t, 6.2, 0.6);
      if (s > 0) {
        ctx.save();
        ctx.translate(WORLD_W / 2, WORLD_H / 2 - 26);
        ctx.scale(s, s);
        ctx.font = '900 54px -apple-system, "Helvetica Neue", sans-serif';
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#1a1408';
        ctx.strokeText('POTTY CHAMP', 0, 0);
        const lg = ctx.createLinearGradient(0, -30, 0, 22);
        lg.addColorStop(0, '#ffe27a');
        lg.addColorStop(1, '#ff9d00');
        ctx.fillStyle = lg;
        ctx.fillText('POTTY CHAMP', 0, 0);
        ctx.restore();
      }
      const s2 = popScale(t, 6.6, 0.5);
      if (s2 > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (t - 6.6) / 0.3);
        ctx.font = '600 16px -apple-system, "Helvetica Neue", sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('Can you save the day… and the floors?', WORLD_W / 2, WORLD_H / 2 + 22);
        ctx.restore();
        // the heroes, front and center
        ctx.imageSmoothingEnabled = false;
        const bobT = Math.sin(t * 6) * 2;
        ctx.drawImage(images.big_down_0, WORLD_W / 2 - 56, WORLD_H / 2 + 40 + bobT, 48, 48);
        ctx.drawImage(images.little_down_0, WORLD_W / 2 + 10, WORLD_H / 2 + 44 - bobT, 44, 44);
        ctx.imageSmoothingEnabled = true;
      }
      drawParticles();
    }

    // cinematic letterbox bars
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WORLD_W, 24);
    ctx.fillRect(0, WORLD_H - 24, WORLD_W, 24);
    ctx.font = '600 11px -apple-system, "Helvetica Neue", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fillText('tap to skip', WORLD_W / 2, WORLD_H - 12);
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
        bonusSpawnTimer = randRange(1.3, 2.6);
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
    // Level-complete celebration: confetti bursts keep landing behind the overlay.
    if (gameState === 'levelComplete' && celebrateTimer > 0) {
      celebrateTimer -= dt;
      celebrateTick -= dt;
      if (celebrateTick <= 0) {
        celebrateTick = 0.32;
        spawnBurst(randRange(50, WORLD_W - 50), randRange(40, WORLD_H * 0.65), GOLD_SPARK, 12, 75);
      }
    }
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
    updateDuck(dt);
    updateCat(dt);
    if (pottyGlowTimer > 0) pottyGlowTimer -= dt;
    if (momLookupTimer > 0) momLookupTimer -= dt;
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

  // Which floor does this tile use? Per-room floor wins, then the scene's,
  // then plain wood. Gives every room its own identity.
  function floorImgFor(tx, ty, scene) {
    const cx = tx + 0.5, cy = ty + 0.5;
    for (const r of scene.rooms) {
      if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
        return images[r.floor || scene.floorTile || 'floor_wood'];
      }
    }
    return images[scene.floorTile || 'floor_wood'];
  }

  function drawTilemap(scene = level) {
    const wallImg = images[scene.wallTile || 'wall'];
    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    for (let ty = 0; ty < GRID_ROWS; ty++) {
      for (let tx = 0; tx < GRID_COLS; tx++) {
        const px = tx * TILE, py = ty * TILE;
        if (isWalkableTile(tx, ty, scene)) {
          const f = floorImgFor(tx, ty, scene);
          if (f) ctx.drawImage(f, px, py);
          // Baseboard: a shadowed strip where the floor meets a wall above.
          // Cheap trick, huge depth payoff — no perspective needed.
          if (!isWalkableTile(tx, ty - 1, scene)) {
            ctx.fillStyle = 'rgba(0,0,0,0.30)';
            ctx.fillRect(px, py, TILE, 3);
            ctx.fillStyle = 'rgba(0,0,0,0.14)';
            ctx.fillRect(px, py + 3, TILE, 2);
          }
          // soft shadow along side walls too
          if (!isWalkableTile(tx - 1, ty, scene)) {
            ctx.fillStyle = 'rgba(0,0,0,0.16)';
            ctx.fillRect(px, py, 2, TILE);
          }
          if (!isWalkableTile(tx + 1, ty, scene)) {
            ctx.fillStyle = 'rgba(0,0,0,0.16)';
            ctx.fillRect(px + TILE - 2, py, 2, TILE);
          }
        } else {
          const n = isWalkableTile(tx - 1, ty, scene) || isWalkableTile(tx + 1, ty, scene) ||
                    isWalkableTile(tx, ty - 1, scene) || isWalkableTile(tx, ty + 1, scene);
          if (n) {
            ctx.drawImage(wallImg, px, py);
            // lit top edge + shaded bottom = walls read as solid, not flat
            ctx.fillStyle = 'rgba(255,255,255,0.13)';
            ctx.fillRect(px, py, TILE, 2);
            ctx.fillStyle = 'rgba(0,0,0,0.13)';
            ctx.fillRect(px, py + TILE - 2, TILE, 2);
          }
        }
      }
    }
  }

  // ---------- Warm light pools on the floor (dimension without 3-D) ----------
  function drawLights(scene = level) {
    const lights = scene.lights || (worldNow().id === 'home' && !mayhemMode ? HOME_LIGHTS : null);
    if (!lights) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const L of lights) {
      // Rooms open up as levels progress — don't light a room that isn't there.
      if (!isWalkableTile(Math.floor(L.x), Math.floor(L.y), scene)) continue;
      const x = L.x * TILE, y = L.y * TILE, r = L.r || 64;
      const g = ctx.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, L.warm ? 'rgba(255,206,130,0.20)' : 'rgba(150,200,255,0.18)');
      g.addColorStop(0.55, L.warm ? 'rgba(255,190,110,0.07)' : 'rgba(140,190,255,0.06)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ---------- Wall decor: photos, clock, crayon scribbles, growth chart ----------
  // Only paints on tiles that are actually rendered walls, so décor attached to
  // rooms that haven't unlocked yet stays hidden automatically.
  function isDrawnWall(tx, ty, scene) {
    if (isWalkableTile(tx, ty, scene)) return false;
    return isWalkableTile(tx - 1, ty, scene) || isWalkableTile(tx + 1, ty, scene) ||
           isWalkableTile(tx, ty - 1, scene) || isWalkableTile(tx, ty + 1, scene);
  }

  function drawDecor(scene = level) {
    if (worldNow().id !== 'home') return;
    for (const it of HOME_DECOR) {
      if (!isDrawnWall(it.x, it.y, scene)) continue;
      const img = images[it.type];
      if (img) ctx.drawImage(img, it.x * TILE, it.y * TILE);
    }
    // windows with curtains that breathe
    for (const w of HOME_WINDOWS) {
      if (!isDrawnWall(w.x, w.y, scene)) continue;
      const wx = w.x * TILE, wy = w.y * TILE;
      if (images.decor_window) ctx.drawImage(images.decor_window, wx, wy);
      // cool daylight spilling in
      const g = ctx.createRadialGradient(wx + 12, wy + 14, 2, wx + 12, wy + 14, 58);
      g.addColorStop(0, 'rgba(180,220,255,0.16)');
      g.addColorStop(1, 'rgba(180,220,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(wx - 46, wy, 104, 70);
      // curtain sways gently
      if (images.curtain) {
        const sway = Math.sin(performance.now() / 900 + w.x) * 1.6;
        ctx.drawImage(images.curtain, wx + sway, wy);
      }
    }
  }

  // ---------- Ceiling fan: spins above everything ----------
  function drawFans(scene = level) {
    if (worldNow().id !== 'home' || !images.fan) return;
    for (const f of HOME_FANS) {
      const cx = f.x * TILE + 12, cy = f.y * TILE + 12;
      if (!isWalkableTile(Math.floor(f.x), Math.floor(f.y), scene)) continue;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(performance.now() / 260);
      ctx.globalAlpha = 0.5; // it's on the ceiling, above the action
      ctx.drawImage(images.fan, -24, -24);
      ctx.restore();
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
      const px = spot.x * TILE - SPRITE_SIZE / 2, py = spot.y * TILE - SPRITE_SIZE / 2;
      // after a successful rescue the potty glows and throws off sparkles —
      // the room notices what you did
      if (pottyGlowTimer > 0) {
        const t = pottyGlowTimer / POTTY_GLOW_TIME;
        const g = ctx.createRadialGradient(spot.x * TILE, spot.y * TILE, 2, spot.x * TILE, spot.y * TILE, 34);
        g.addColorStop(0, `rgba(255,226,140,${(0.42 * t).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255,226,140,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(spot.x * TILE, spot.y * TILE, 34, 0, Math.PI * 2);
        ctx.fill();
        const n = performance.now();
        ctx.font = '11px -apple-system';
        ctx.textAlign = 'center';
        for (let s = 0; s < 3; s++) {
          const a = n / 380 + s * 2.1;
          ctx.fillText('\u{2728}', spot.x * TILE + Math.cos(a) * 18, spot.y * TILE + Math.sin(a) * 12 - 4);
        }
        ctx.textAlign = 'left';
      }
      ctx.drawImage(images[level.pottyImg || 'potty'], px, py);
    }
  }

  function drawCharacter(entity, prefix) {
    const moving = entity.moving;
    const frame = moving ? (Math.floor(performance.now() / 180) % 2) : 0;
    const key = (entity.facing === 'left' || entity.facing === 'right')
      ? `${prefix}_side_${frame}`
      : `${prefix}_${entity.facing}_${frame}`;
    let img = images[key];
    if (prefix === 'little') {
      // Champ wears whatever cap color is picked; the playdate friend is always teal.
      img = capSprite(key, entity.isTwin ? 'teal' : (progress.capColor || 'red'));
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

  // ---------- The house cat: pads up and down the hallway ----------
  const cat = { x: 6 * TILE, dir: 1, pauseT: 0, meowCool: 0 };
  function updateCat(dt) {
    if (worldNow().id !== 'home' || mayhemMode) return;
    if (cat.meowCool > 0) cat.meowCool -= dt;
    if (cat.pauseT > 0) { cat.pauseT -= dt; return; }
    cat.x += cat.dir * 15 * dt;
    if (cat.x > HOME_CAT.xMax * TILE) { cat.dir = -1; cat.pauseT = randRange(0.8, 2.2); }
    if (cat.x < HOME_CAT.xMin * TILE) { cat.dir = 1; cat.pauseT = randRange(0.8, 2.2); }
    // walk into the cat and it meows at you
    const pc = centerOf(player);
    if (cat.meowCool <= 0 && Math.hypot(pc.x - (cat.x + 12), pc.y - (HOME_CAT.y * TILE + 12)) < 22) {
      cat.meowCool = 3;
      AudioFX.catch();
      spawnFloatText(cat.x + 12, HOME_CAT.y * TILE - 6, 'MEOW!', '#d8d0e0');
    }
  }
  function drawCat() {
    if (worldNow().id !== 'home' || mayhemMode) return;
    const moving = cat.pauseT <= 0;
    const frame = moving ? Math.floor(performance.now() / 240) % 2 : 0;
    const img = images[`cat_${frame}`];
    if (!img) return;
    const y = HOME_CAT.y * TILE;
    ctx.save();
    if (cat.dir < 0) { // flip so he faces the way he's walking
      ctx.translate(cat.x + TILE, y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
    } else {
      ctx.drawImage(img, cat.x, y);
    }
    ctx.restore();
  }

  // ---------- Rubber duck easter egg (Home bathroom — walk into it!) ----------
  const duck = { tx: 2.5, ty: 10, quackT: 0, cool: 0 };
  function updateDuck(dt) {
    if (worldNow().id !== 'home' || mayhemMode) return;
    if (duck.cool > 0) duck.cool -= dt;
    if (duck.quackT > 0) duck.quackT -= dt;
    const dx = duck.tx * TILE - (player.x + player.w / 2);
    const dy = duck.ty * TILE - (player.y + player.h / 2);
    if (duck.cool <= 0 && Math.hypot(dx, dy) < 22) {
      duck.cool = 2.5;
      duck.quackT = 0.7;
      AudioFX.catch();
      spawnFloatText(duck.tx * TILE, duck.ty * TILE - 16, 'QUACK!', '#ffe27a');
      spawnBurst(duck.tx * TILE, duck.ty * TILE, PUFF_WHITE, 5, 40);
    }
  }
  function drawDuck() {
    if (worldNow().id !== 'home' || mayhemMode) return;
    const hop = duck.quackT > 0 ? Math.abs(Math.sin(duck.quackT * 14)) * 5 : 0;
    ctx.font = '15px -apple-system';
    ctx.fillText('\u{1F986}', duck.tx * TILE - 8, duck.ty * TILE + 6 - hop);
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
    drawLights();     // warm pools on the floor
    drawDecor();      // wall art, windows, swaying curtains
    drawStains();
    drawScrubBars();
    drawPottySpots();
    drawShoePickup();
    drawCandy();
    drawTrophy();
    drawMopSpot();
    drawDuck();
    drawCat();

    // depth-sorted furniture + characters
    const drawables = [];
    for (const f of level.furniture) {
      const img = images[f.type];
      if (!img) continue;
      const px = f.x * TILE, py = f.y * TILE;
      drawables.push({ img, x: px, y: py, sortY: py + f.hTiles * TILE, tvFlicker: f.type === 'tv' });
    }
    // nail salon: mom files away at the client's nails (Home world only).
    // On an accident she stops and looks up — the world reacts to you.
    if (worldNow().momSalon) {
      const momLooking = momLookupTimer > 0;
      drawables.push({
        img: images[momLooking ? 'mom_alt' : (Math.floor(performance.now() / 500) % 2 === 0 ? 'mom' : 'mom_alt')],
        x: MOM_POS.x * TILE, y: MOM_POS.y * TILE, sortY: MOM_POS.y * TILE + TILE,
        exclaim: momLooking,
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
        // The friend's teal cap (via capSprite) is how you tell the kids apart.
        drawCharacter(d.toddlerRef, 'little');
      }
      else {
        ctx.drawImage(d.img, d.x, d.y);
        // the TV actually flickers between channels
        if (d.tvFlicker) {
          ctx.fillStyle = `rgba(200,240,255,${(0.10 + Math.random() * 0.16).toFixed(3)})`;
          ctx.fillRect(d.x + 3, d.y + 4, 18, 12);
        }
        if (d.exclaim) {
          const bob = Math.sin(performance.now() / 150) * 2;
          ctx.font = '13px -apple-system';
          ctx.textAlign = 'center';
          ctx.fillText('\u{2757}', d.x + 12, d.y - 4 + bob);
          ctx.textAlign = 'left';
        }
      }
    }

    drawCarriedMop();
    drawParticles();
    drawFloatingTexts();
    drawFans();       // ceiling fan spins above the whole room
    drawAlertIcon();
    drawBanner();
    // white flash during clutch slow-mo
    if (slowmoTimer > 0) {
      ctx.fillStyle = `rgba(255,255,255,${(slowmoTimer * 0.45).toFixed(3)})`;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }
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

    // clutch slow-mo: the world crawls for a beat after a last-second save
    if (slowmoTimer > 0) {
      slowmoTimer -= dt;
      dt *= 0.3;
    }
    if (bannerTimer > 0) bannerTimer -= dt;

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
    else if (gameState === 'editor') drawEditor();
    else if (gameState === 'dash' || gameState === 'dashOver' || (gameState === 'paused' && pausedFrom === 'dash')) drawDash();
    else if (gameState === 'bonusRound' || gameState === 'bonusComplete' || (gameState === 'paused' && pausedFrom === 'bonusRound')) drawBonusRound();
    else draw();

    pauseBtn.style.display = (gameState === 'playing' || gameState === 'bonusRound' || gameState === 'dash') ? 'flex' : 'none';
    // Hide the HUD + touch controls on non-game screens (menu, intro, splash,
    // ending) so they don't bleed through the menu or sticker book.
    const onGameScreen = gameState !== 'splash' && gameState !== 'intro' && gameState !== 'menu'
      && gameState !== 'ending' && gameState !== 'gift' && gameState !== 'giftOpen'
      && gameState !== 'editor' && gameState !== 'myLevels' && gameState !== 'buildPitch';
    gameContainerEl.classList.toggle('ui-hidden', !onGameScreen);

    requestAnimationFrame(loop);
  }

  // Potty Champ ships completely free — no ads, no in-app purchases, no
  // tracking. Monetization can be added back in a future update.

  resize();
  Store.init(); // connects to the App Store in the background (no-op on web)
  loadAssets(() => {
    showOverlay(
      'Potty Champ',
      `Help ${BIG_NAME} catch ${KID_NAME} before it's too late!`,
      'Tap to Begin',
      '<div class="splash-chars"><img src="assets/big_down_0.png" alt=""><img src="assets/little_down_0.png" alt=""></div>'
    );
    requestAnimationFrame(loop);
  });
})();
