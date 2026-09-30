/**
 * ANTIGRAVITY IDE - CHAOS EDITION JAVASCRIPT ENGINE
 * Intentionally Horrible, Bizarre & Chaotic UI
 * 100% Technically Functional & Safe
 */

(function() {
  'use strict';

  // ============================================================
  // SOUND SYNTHESIZER (WEB AUDIO API - 100% NATIVE, NO ASSETS)
  // ============================================================
  const ChaosAudio = {
    ctx: null,
    enabled: true,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },

    playTone(freq, type = 'sine', duration = 0.1, delay = 0) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
      } catch (e) {
        // audio error ignored safely
      }
    },

    playClick() {
      this.playTone(400, 'square', 0.05);
    },

    playWrong() {
      this.playTone(180, 'sawtooth', 0.15);
      this.playTone(140, 'sawtooth', 0.2, 0.1);
    },

    playFanfare() {
      const notes = [300, 400, 500, 700];
      notes.forEach((freq, idx) => {
        this.playTone(freq, 'triangle', 0.15, idx * 0.08);
      });
    },

    playWorse() {
      this.playTone(120, 'sawtooth', 0.3);
      this.playTone(240, 'square', 0.25, 0.1);
      this.playTone(600, 'sawtooth', 0.35, 0.2);
    },

    playNeonZap() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.35);

        mod.type = 'square';
        mod.frequency.setValueAtTime(60, this.ctx.currentTime);
        modGain.gain.setValueAtTime(220, this.ctx.currentTime);

        mod.connect(osc.frequency);
        gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        mod.start(this.ctx.currentTime);
        osc.start(this.ctx.currentTime);
        mod.stop(this.ctx.currentTime + 0.35);
        osc.stop(this.ctx.currentTime + 0.35);
      } catch (e) {
        // audio error ignored
      }
    }
  };

  // ============================================================
  // APP STATE
  // ============================================================
  const state = {
    worseLevel: 1,
    chaosMeterValue: 87,
    logoClicks: 0,
    totalClicks: 0,
    user: JSON.parse(localStorage.getItem('chaos_user')) || {
      isLoggedIn: true,
      username: 'SupremeChaosCadet',
      role: 'OVERLORD OF MISRULE',
      avatar: '🧙‍♂️'
    },
    tasks: JSON.parse(localStorage.getItem('chaos_tasks')) || [
      { id: '1', title: 'Overthink simple CSS margin', priority: 'critical', done: false },
      { id: '2', title: 'Pretend to understand regular expressions', priority: 'mild', done: true },
      { id: '3', title: 'Search for bugs that don’t exist', priority: 'pointless', done: false }
    ],
    taskFilter: 'all',
    calcExpression: '',
    achievements: {
      first_click: { id: 'first_click', title: 'You clicked a button', desc: 'A monumental achievement for modern humanity.', icon: '🏆', unlocked: false },
      survive_30: { id: 'survive_30', title: 'You survived 30 seconds', desc: 'Your eyes are officially battle-tested.', icon: '⏳', unlocked: false },
      find_nothing: { id: 'find_nothing', title: 'You found nothing', desc: 'Excellence in digital exploration.', icon: '🔍', unlocked: false },
      pro_clicker: { id: 'pro_clicker', title: 'Professional Button Clicker', desc: 'You have clicked at least 15 buttons.', icon: '🖱️', unlocked: false },
      ui_survivor: { id: 'ui_survivor', title: 'UI Survivor', desc: 'Endured 60 seconds of certified visual nonsense.', icon: '🛡️', unlocked: false },
      chaos_enthusiast: { id: 'chaos_enthusiast', title: 'Chaos Enthusiast', desc: 'Clicked "Make UI Worse" at least 3 times.', icon: '💀', unlocked: false },
      rule_breaker: { id: 'rule_breaker', title: 'Rule Breaker', desc: 'Ventured into the forbidden DO NOT CLICK zone.', icon: '⛔', unlocked: false },
      curious_cat: { id: 'curious_cat', title: 'Curious Cat', desc: 'Clicked the logo 7 times.', icon: '🐱', unlocked: false }
    },
    settings: {
      cursor: true,
      sound: true,
      mutations: true,
      notifs: true
    }
  };

  // Load saved achievements
  const savedAch = JSON.parse(localStorage.getItem('chaos_achievements'));
  if (savedAch) {
    Object.keys(savedAch).forEach(k => {
      if (state.achievements[k]) state.achievements[k].unlocked = savedAch[k];
    });
  }

  // ============================================================
  // 1. CHAOTIC CURSOR
  // ============================================================
  const cursorEl = document.getElementById('custom-cursor');
  const cursorIcons = [
    '🐸', '👽', '💩', '❌', '⚠️', 
    '↗️', '🏹', '➡️', '⤹', '🡵', '⤸', '🡽', '➶', '🦆', '👾'
  ];

  function initChaoticCursor() {
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorEl && state.settings.cursor) {
        cursorEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    });

    // Randomly change cursor emoji and size every 2.5 - 4.5 seconds
    function mutateCursor() {
      if (cursorEl && state.settings.cursor) {
        const randomIcon = cursorIcons[Math.floor(Math.random() * cursorIcons.length)];
        const randomSize = Math.floor(Math.random() * 28) + 20; // 20px - 48px
        const randomRot = (Math.random() * 30 - 15);
        cursorEl.textContent = randomIcon;
        cursorEl.style.fontSize = `${randomSize}px`;
        cursorEl.style.filter = `drop-shadow(2px 2px 0px #000) drop-shadow(0 0 ${Math.random() * 10 + 4}px #${Math.floor(Math.random()*16777215).toString(16)})`;
      }
      setTimeout(mutateCursor, Math.random() * 2000 + 2500);
    }
    mutateCursor();
  }

  // ============================================================
  // 2. CONFUSING PAGE TITLE
  // ============================================================
  const confusingTitles = [
    "WHY ARE YOU HERE?",
    "ERROR 7392",
    "DO NOT LEAVE",
    "THIS IS FINE",
    "ABSOLUTELY NORMAL WEBSITE",
    "SYSTEM MELTDOWN (MAYBE)",
    "DO NOT LOOK BEHIND YOU",
    "UPDATING MATRIX CODE...",
    "IS ANYONE WATCHING?",
    "PRESS ALT+F4 FOR COOKIES (DON'T)"
  ];

  function initConfusingTitle() {
    let titleIndex = 0;
    setInterval(() => {
      titleIndex = (titleIndex + 1) % confusingTitles.length;
      document.title = confusingTitles[titleIndex];
    }, 3200);
  }

  // ============================================================
  // 3. RANDOM UI PERSONALITY (Every 10-15s subtle mutation)
  // ============================================================
  const fonts = [
    '"Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive',
    '"Papyrus", "Chalkduster", fantasy',
    '"Impact", "Arial Black", fantasy',
    '"Courier New", Courier, monospace',
    '"Times New Roman", Times, serif',
    'cursive'
  ];

  const borderStyles = ['dotted', 'dashed', 'groove', 'ridge', 'double', 'solid'];

  function initUIPersonality() {
    function mutateUI() {
      if (!state.settings.mutations) {
        setTimeout(mutateUI, 12000);
        return;
      }

      // Heading scale
      const headingScales = [0.9, 1.0, 1.1, 1.18, 1.25];
      const randomHeadingScale = headingScales[Math.floor(Math.random() * headingScales.length)];
      document.documentElement.style.setProperty('--heading-scale', randomHeadingScale);

      // Border styles
      const randomBorderStyle = borderStyles[Math.floor(Math.random() * borderStyles.length)];
      document.documentElement.style.setProperty('--border-style-dynamic', randomBorderStyle);

      // Font Family
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
      document.documentElement.style.setProperty('--base-font', randomFont);

      // Button rotation
      const buttons = document.querySelectorAll('.chaos-btn');
      buttons.forEach(btn => {
        if (!btn.classList.contains('giant-pulse-btn')) {
          const deg = (Math.random() * 6 - 3).toFixed(1);
          btn.style.transform = `rotate(${deg}deg)`;
        }
      });

      // Card slight offsets
      const cards = document.querySelectorAll('.chaos-card');
      cards.forEach(card => {
        const offX = (Math.random() * 8 - 4).toFixed(1);
        const offY = (Math.random() * 6 - 3).toFixed(1);
        const rot = (Math.random() * 1.6 - 0.8).toFixed(1);
        card.style.transform = `translate(${offX}px, ${offY}px) rotate(${rot}deg)`;
      });

      setTimeout(mutateUI, Math.random() * 5000 + 10000);
    }

    setTimeout(mutateUI, 11000);
  }

  // ============================================================
  // 4. USELESS CHAOS METER
  // ============================================================
  const chaosPercentEl = document.getElementById('chaos-percentage');
  const chaosBarEl = document.getElementById('chaos-ascii-bar');
  const chaosMeterContainer = document.getElementById('chaos-meter-container');
  const meterSubtextEl = document.getElementById('meter-subtext');

  function renderChaosMeter() {
    if (!chaosPercentEl || !chaosBarEl) return;
    chaosPercentEl.textContent = `${state.chaosMeterValue}%`;
    
    // Render ASCII blocks
    const totalBlocks = 20;
    const filledBlocks = Math.round((state.chaosMeterValue / 100) * totalBlocks);
    const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
    const barStr = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    chaosBarEl.textContent = barStr;
  }

  function initChaosMeter() {
    renderChaosMeter();

    setInterval(() => {
      // Fluctuates randomly up or down
      const delta = Math.floor(Math.random() * 21) - 10;
      let newVal = state.chaosMeterValue + delta;
      if (newVal > 100 + (state.worseLevel * 15)) newVal = 90;
      if (newVal < 10) newVal = 25;
      state.chaosMeterValue = newVal;
      renderChaosMeter();
    }, 2400);

    // Easter egg: clicking chaos meter confuses it
    if (chaosMeterContainer) {
      chaosMeterContainer.addEventListener('click', () => {
        ChaosAudio.playWrong();
        recordClick();
        state.chaosMeterValue = 999;
        chaosPercentEl.textContent = 'POTATO%';
        chaosBarEl.textContent = '🥔🥔🥔🥔🥔🥔🥔🥔🥔🥔🥔🥔🥔🥔';
        meterSubtextEl.textContent = 'ERROR: METER CONFUSED. NOW MEASURING POTATO DENSITY.';
        showToastNotification('🥔 Chaos meter has lost its mind.');
        unlockAchievement('first_click');
        setTimeout(() => {
          state.chaosMeterValue = 88;
          renderChaosMeter();
          meterSubtextEl.textContent = 'STATUS: PURE UNFILTERED NONSENSE (CLICK METER FOR DIAGNOSTICS)';
        }, 4000);
      });
    }
  }

  // ============================================================
  // 5. FAKE SYSTEM STATUS
  // ============================================================
  function initFakeSystemStatus() {
    const cpuEl = document.getElementById('stat-cpu');
    const ramEl = document.getElementById('stat-ram');
    const brainEl = document.getElementById('stat-brain');
    const uiEl = document.getElementById('stat-ui');
    const senseEl = document.getElementById('stat-sense');
    const gravityEl = document.getElementById('stat-gravity');

    const brainStatuses = ["NOT FOUND", "REBOOTING", "OUT TO LUNCH", "RUNNING WIN95", "404 NULL", "VAPORWARE"];
    const gravityStatuses = ["OPTIONAL", "INVERTED", "12.4 m/s²", "99% OFF", "FLOATING", "CHAOTIC"];

    setInterval(() => {
      if (cpuEl) cpuEl.textContent = `${Math.floor(Math.random() * 150) + 75}%`;
      if (ramEl) ramEl.textContent = `${Math.floor(Math.random() * 1200) + 800}%`;
      if (uiEl) uiEl.textContent = `-${Math.floor(Math.random() * 800) + 200}`;
      if (senseEl) senseEl.textContent = `${Math.floor(Math.random() * 5)}%`;
      
      if (brainEl && Math.random() > 0.6) {
        brainEl.textContent = brainStatuses[Math.floor(Math.random() * brainStatuses.length)];
      }
      if (gravityEl && Math.random() > 0.6) {
        gravityEl.textContent = gravityStatuses[Math.floor(Math.random() * gravityStatuses.length)];
      }
    }, 2800);
  }

  // ============================================================
  // 6. UNNECESSARY LOADING
  // ============================================================
  const fakeLoadingTexts = [
    "Loading...",
    "Still loading...",
    "Almost...",
    "Actually no.",
    "Loading nothing...",
    "Downloading extra RAM...",
    "Consulting rubber duck...",
    "Inverting binary trees...",
    "Heating coffee electronically...",
    "Blaming network latency...",
    "Waiting for inspiration...",
    "Synthesizing useless pixels..."
  ];

  function initUnnecessaryLoading() {
    const labels = [
      document.getElementById('loader-label-1'),
      document.getElementById('loader-label-2'),
      document.getElementById('loader-label-3')
    ];

    const fills = [
      document.getElementById('loader-bar-1'),
      document.getElementById('loader-bar-2'),
      document.getElementById('loader-bar-3')
    ];

    setInterval(() => {
      labels.forEach((label, idx) => {
        if (label && Math.random() > 0.4) {
          const txt = fakeLoadingTexts[Math.floor(Math.random() * fakeLoadingTexts.length)];
          label.textContent = txt;
        }
        if (fills[idx]) {
          const randWidth = Math.floor(Math.random() * 95) + 5;
          fills[idx].style.width = `${randWidth}%`;
        }
      });
    }, 3500);

    const speedBtn = document.getElementById('speed-up-fake-loader');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        labels.forEach(l => { if (l) l.textContent = 'ACCELERATING INFINITE VOID...'; });
        showToastNotification('⚡ Accelerating nothing at 88 mph!');
      });
    }

    const cancelBtn = document.getElementById('cancel-fake-loader');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        ChaosAudio.playWrong();
        recordClick();
        labels.forEach(l => { if (l) l.textContent = 'Reality cancellation rejected.'; });
        showToastNotification('❌ Reality cancellation denied by administrator.');
      });
    }
  }

  // ============================================================
  // 7. WRONG BUTTON LABELS
  // ============================================================
  const wrongLabels = [
    "ARE YOU SURE?",
    "WHY?",
    "NOPE",
    "TRY AGAIN",
    "ABSOLUTELY NOT",
    "WHAT HAVE YOU DONE?",
    "DO NOT TOUCH",
    "MISTAKE CONFIRMED",
    "CANCELLED BY VOID",
    "REGRET INCOMING"
  ];

  function attachWrongButtonLabels() {
    const wrongButtons = document.querySelectorAll('.wrong-label-target');
    wrongButtons.forEach(btn => {
      // Store original label if not stored
      if (!btn.dataset.originalLabel) {
        btn.dataset.originalLabel = btn.textContent.trim();
      }

      btn.addEventListener('click', (e) => {
        recordClick();
        // Do not interrupt the real action event handlers
        const nextLabel = wrongLabels[Math.floor(Math.random() * wrongLabels.length)];
        btn.textContent = nextLabel;
        
        // Revert or cycle after 3 seconds
        setTimeout(() => {
          if (btn.dataset.originalLabel) {
            btn.textContent = btn.dataset.originalLabel;
          }
        }, 3000);
      });
    });
  }

  // ============================================================
  // 8. FAKE ACHIEVEMENTS SYSTEM
  // ============================================================
  const achArea = document.getElementById('achievement-area');
  const achGrid = document.getElementById('achievements-grid');

  function renderAchievementsShowcase() {
    if (!achGrid) return;
    achGrid.innerHTML = '';
    Object.values(state.achievements).forEach(ach => {
      const card = document.createElement('div');
      card.className = `achievement-card ${ach.unlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="ach-icon">${ach.unlocked ? ach.icon : '🔒'}</div>
        <div class="ach-info">
          <h4>${ach.title}</h4>
          <p>${ach.desc}</p>
        </div>
      `;
      achGrid.appendChild(card);
    });
  }

  function unlockAchievement(id) {
    const ach = state.achievements[id];
    if (!ach || ach.unlocked) return;

    ach.unlocked = true;
    localStorage.setItem('chaos_achievements', JSON.stringify(
      Object.fromEntries(Object.entries(state.achievements).map(([k, v]) => [k, v.unlocked]))
    ));

    renderAchievementsShowcase();
    ChaosAudio.playFanfare();

    // Show trophy popup toast
    if (achArea) {
      const toast = document.createElement('div');
      toast.className = 'achievement-toast';
      toast.innerHTML = `
        <div class="ach-toast-icon">${ach.icon}</div>
        <div class="ach-toast-content">
          <h4>🏆 ACHIEVEMENT UNLOCKED!</h4>
          <p>${ach.title}</p>
        </div>
      `;
      achArea.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 500);
      }, 5000);
    }
  }

  function initTimersAndTracking() {
    // 30 seconds survival achievement
    setTimeout(() => {
      unlockAchievement('survive_30');
    }, 30000);

    // 60 seconds UI survivor
    setTimeout(() => {
      unlockAchievement('ui_survivor');
    }, 60000);
  }

  function recordClick() {
    state.totalClicks++;
    unlockAchievement('first_click');
    if (state.totalClicks >= 15) {
      unlockAchievement('pro_clicker');
    }
  }

  // ============================================================
  // 9. RANDOM NOTIFICATIONS
  // ============================================================
  const randomNotifTexts = [
    "🐸 Frog detected.",
    "⚠️ Nothing is wrong.",
    "💀 UI confidence decreasing.",
    "🍌 Banana unavailable.",
    "🚨 This notification is unnecessary.",
    "🖨️ Printer is thinking about you.",
    "🥪 Sandwich dropped at unknown location.",
    "📶 Wi-Fi signals confused by aesthetic choices.",
    "🧀 Cheese factor exceeded tolerance threshold.",
    "🛸 Alien observers are unimpressed."
  ];

  const notifArea = document.getElementById('notification-area');

  function showToastNotification(text) {
    if (!notifArea || !state.settings.notifs) return;
    const notif = document.createElement('div');
    notif.className = 'chaos-notification';
    notif.innerHTML = `
      <span>${text}</span>
      <button class="notif-dismiss-btn" title="Dismiss">✕</button>
    `;

    notif.querySelector('.notif-dismiss-btn').addEventListener('click', () => {
      ChaosAudio.playClick();
      notif.remove();
    });

    notifArea.appendChild(notif);

    setTimeout(() => {
      if (notif.parentNode) {
        notif.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        notif.style.opacity = '0';
        notif.style.transform = 'translateY(15px)';
        setTimeout(() => notif.remove(), 400);
      }
    }, 4500);
  }

  function initRandomNotifications() {
    function triggerNext() {
      if (state.settings.notifs) {
        const msg = randomNotifTexts[Math.floor(Math.random() * randomNotifTexts.length)];
        showToastNotification(msg);
      }
      setTimeout(triggerNext, Math.random() * 8000 + 8000);
    }
    setTimeout(triggerNext, 5000);
  }

  // ============================================================
  // 10. TERRIBLE SEARCH BAR
  // ============================================================
  function initTerribleSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('chaos-search-input');
    const searchResultsBox = document.getElementById('search-results-box');
    const searchResultsContent = document.getElementById('search-results-content');
    const searchStatusTitle = document.getElementById('search-status-title');

    const absurdSearchAnswers = [
      "Search successful. We found absolutely nothing.",
      "Your query was converted to Morse code and transmitted to Jupiter.",
      "Found 412,091 results. We discarded them to keep the website chaotic.",
      "Did you mean: 'how to escape this awful webpage'?",
      "Search engine is currently taking a mandatory union nap.",
      "Query accepted. Result has been printed directly into the Mariana Trench.",
      "Congratulations! Your search has yielded 0 useful insights.",
      "The algorithms took a look at your query and shook their digital heads."
    ];

    function handleSearch() {
      const q = searchInput.value.trim();
      if (!q) {
        showToastNotification('⚠️ Cannot search for emptiness; we already have plenty.');
        return;
      }

      ChaosAudio.playClick();
      recordClick();

      // Check if user is searching for their actual tasks!
      const matchingTasks = state.tasks.filter(t => t.title.toLowerCase().includes(q.toLowerCase()));

      const randomAbsurdMsg = absurdSearchAnswers[Math.floor(Math.random() * absurdSearchAnswers.length)];
      searchResultsBox.classList.remove('hidden');

      let taskSection = '';
      if (matchingTasks.length > 0) {
        taskSection = `
          <div style="margin-top: 10px; border-top: 1px dashed #ffff00; padding-top: 8px;">
            <strong style="color: #39ff14;">REAL MATCHING TASKS YOU ARE PROCRASTINATING ON:</strong>
            <ul style="margin-top: 6px; padding-left: 20px;">
              ${matchingTasks.map(t => `<li>${t.title} [Status: ${t.done ? 'Done' : 'Pending'}]</li>`).join('')}
            </ul>
          </div>
        `;
      }

      searchStatusTitle.textContent = `QUERY DISPATCHED: "${q}"`;
      searchResultsContent.innerHTML = `
        <p style="font-size: 15px; margin-bottom: 6px;">${randomAbsurdMsg}</p>
        <p style="font-size: 12px; color: #888;">Search elapsed time: 0.00000001ms. Relevance: -99.8%.</p>
        ${taskSection}
      `;

      unlockAchievement('find_nothing');
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch();
      });
    }

    const searchBtn = document.getElementById('chaos-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', handleSearch);
    }
  }

  // ============================================================
  // 11. USELESS SIDEBAR & TABS
  // ============================================================
  function switchView(targetView) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.dataset.view === targetView) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const panels = document.querySelectorAll('.view-panel');
    panels.forEach(p => {
      if (p.id === `view-${targetView}`) {
        p.classList.remove('hidden');
        p.classList.add('active-view');
      } else {
        p.classList.add('hidden');
        p.classList.remove('active-view');
      }
    });

    if (targetView === 'do-not-click') {
      unlockAchievement('rule_breaker');
      ChaosAudio.playWrong();
      showToastNotification('🚨 YOU BROKE THE SACRED RULE!');
    }
  }

  function initSidebarNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        const view = btn.dataset.view;
        switchView(view);
      });
    });

    // Coffee widget
    const drinkBtn = document.getElementById('drink-coffee-btn');
    const coffeeFill = document.getElementById('coffee-fill');
    const coffeeText = document.getElementById('coffee-text');
    let coffeeLevel = 90;

    if (drinkBtn) {
      drinkBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        coffeeLevel = (coffeeLevel <= 10) ? 100 : coffeeLevel - 20;
        if (coffeeFill) coffeeFill.style.width = `${coffeeLevel}%`;
        if (coffeeText) coffeeText.textContent = `${coffeeLevel}% CAFFEINE`;
        showToastNotification(`☕ Coffee consumed! Current jitter level: ${100 - coffeeLevel}%`);
      });
    }

    // Oracle Widget in MAYBE view
    const askOracleBtn = document.getElementById('ask-oracle-btn');
    const oracleAnswer = document.getElementById('oracle-answer');
    const oracleAnswers = [
      '"MAYBE. PERHAPS. ASK AGAIN IN 10,000 YEARS."',
      '"SIGNS POINT TO SOMETHING, PROBABLY."',
      '"OUTLOOK INDECISIVE. REBOOT UNIVERSE."',
      '"YES, UNLESS NO, IN WHICH CASE PERHAPS."',
      '"THE ORACLE HAS RUN OUT OF TOKENS."',
      '"ERROR: ORACLE DOES NOT WANT TO BE HELD RESPONSIBLE."'
    ];

    if (askOracleBtn) {
      askOracleBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        if (oracleAnswer) {
          oracleAnswer.textContent = oracleAnswers[Math.floor(Math.random() * oracleAnswers.length)];
        }
      });
    }

    // Conspiracy Widget in SECRET SETTINGS
    const newConspiracyBtn = document.getElementById('btn-new-conspiracy');
    const conspiracyText = document.getElementById('conspiracy-text');
    const conspiracies = [
      '"Pigeons are actually surveillance drones recharging on power lines to steal your CSS variables."',
      '"The semicolon was invented by big keyboard manufacturers to wear out your shift key."',
      '"There are actually only 4 people on the internet, and all the rest are caching proxies."',
      '"Tabs vs Spaces was orchestrated to distract developers from the moon being hollow."',
      '"JavaScript was created in 10 days because day 11 was reserved for adding NaN."'
    ];

    if (newConspiracyBtn) {
      newConspiracyBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        if (conspiracyText) {
          conspiracyText.textContent = conspiracies[Math.floor(Math.random() * conspiracies.length)];
        }
      });
    }

    // Press anyway button in DO NOT CLICK
    const pressAnywayBtn = document.getElementById('btn-press-anyway');
    if (pressAnywayBtn) {
      pressAnywayBtn.addEventListener('click', () => {
        ChaosAudio.playWrong();
        recordClick();
        document.body.classList.add('screen-shake');
        showModal('💥 CATASTROPHIC BLAST AVOIDED', 'You pressed the big red button. Fortunately, the detonation team was on a doughnut break. Next time you might not be so lucky!');
        setTimeout(() => document.body.classList.remove('screen-shake'), 600);
      });
    }

    // Sliders in Wrong Settings
    const sliders = [
      { id: 'slider-magenta', valId: 'slider-val-magenta', unit: ' N/kg' },
      { id: 'slider-yellow', valId: 'slider-val-yellow', unit: ' (DEAFENING)' },
      { id: 'slider-dread', valId: 'slider-val-dread', unit: ' OOF' },
      { id: 'slider-friends', valId: 'slider-val-friends', unit: ' specters' }
    ];

    sliders.forEach(s => {
      const input = document.getElementById(s.id);
      const display = document.getElementById(s.valId);
      if (input && display) {
        input.addEventListener('input', () => {
          display.textContent = `${input.value}${s.unit}`;
        });
      }
    });

    const saveWrongBtn = document.getElementById('btn-save-wrong-settings');
    if (saveWrongBtn) {
      saveWrongBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        showToastNotification('💾 Wrong settings successfully misconfigured.');
      });
    }
  }

  // ============================================================
  // 12. CHAOTIC FOOTER & VISITOR TICKER
  // ============================================================
  function initChaoticFooter() {
    const counterEl = document.getElementById('visitor-counter');
    let count = 42069;

    setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1;
      const digits = String(count).padStart(7, '0').split('');
      if (counterEl) {
        counterEl.innerHTML = digits.map(d => `<span class="digit">${d}</span>`).join('');
      }
    }, 4500);

    const serverTag = document.getElementById('server-status-tag');
    setInterval(() => {
      if (serverTag) {
        const ping = Math.floor(Math.random() * 8000) + 1200;
        serverTag.textContent = `HELD TOGETHER BY DUCT TAPE & PRAYERS (PONG: ${ping}ms)`;
      }
    }, 5000);
  }

  function triggerUselessLink(event, name) {
    if (event) event.preventDefault();
    ChaosAudio.playWrong();
    recordClick();
    showModal(
      `LEGAL VOID: ${name.toUpperCase()}`,
      `You clicked "${name}". By doing so, you have legally agreed that this website is blameless for any aesthetic distress caused to your optic nerves. Enjoy your stay!`
    );
  }

  // ============================================================
  // 13. RANDOM EASTER EGGS
  // ============================================================
  function showModal(title, message, icon = '🎉') {
    const modal = document.getElementById('easter-egg-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalIcon = document.getElementById('modal-icon');

    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = title;
      modalBody.textContent = message;
      if (modalIcon) modalIcon.textContent = icon;
      modal.classList.remove('hidden');
    }
  }

  function closeModal() {
    const modal = document.getElementById('easter-egg-modal');
    if (modal) modal.classList.add('hidden');
  }

  function initEasterEggs() {
    // Modal close listeners
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.getElementById('modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Easter egg 1: Click logo 7 times
    const logoBox = document.getElementById('logo-box');
    if (logoBox) {
      logoBox.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        state.logoClicks++;
        if (state.logoClicks === 7) {
          ChaosAudio.playFanfare();
          unlockAchievement('curious_cat');
          showModal(
            '🎉 CONGRATULATIONS! SEVENTH CLICK!',
            'You clicked the logo exactly 7 times! As promised by ancient prophecy, you have won an INVISIBLE TOASTER! It has already been delivered to your front lawn in a parallel universe.',
            '🍞'
          );
          state.logoClicks = 0;
        } else if (state.logoClicks > 0 && state.logoClicks < 7) {
          showToastNotification(`⚡ Logo clicks: ${state.logoClicks}/7. Keep poking!`);
        }
      });
    }

    // Easter egg 2: Press 'K' key
    window.addEventListener('keydown', (e) => {
      // If user is currently typing in an input field, do not trigger modal
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'k' || e.key === 'K') {
        ChaosAudio.playFanfare();
        recordClick();
        showModal(
          '🥔 SPECIAL "K" PROTOCOL ACTIVATED',
          'Why did you press K? Are you okay? Did your cat walk across your keyboard? Regardless, here is a ceremonial digital potato: 🥔. May it bring starchy prosperity to your endeavors.',
          '🦘'
        );
      }
    });

    // Easter egg 3: Hover over unstable word
    const unstableWord = document.getElementById('unstable-word');
    const chaoticWordAlternatives = [
      "TERRIBLE",
      "CATASTROPHIC",
      "QUESTIONABLE",
      "UNHINGED",
      "DUBIOUS",
      "FRAGILE",
      "GLITCHED",
      "CHAOTIC",
      "BROKEN"
    ];
    let wordIdx = 0;
    if (unstableWord) {
      unstableWord.addEventListener('mouseenter', () => {
        ChaosAudio.playTone(600, 'triangle', 0.05);
        wordIdx = (wordIdx + 1) % chaoticWordAlternatives.length;
        unstableWord.textContent = chaoticWordAlternatives[wordIdx];
      });
    }
  }

  // ============================================================
  // 14. TERRIBLE BUT FUNCTIONAL LOGIN
  // ============================================================
  function updateAuthUI() {
    const loginContainer = document.getElementById('login-container');
    const profileContainer = document.getElementById('user-profile-container');
    const loggedUserName = document.getElementById('logged-user-name');
    const avatarEmoji = document.getElementById('user-avatar-emoji');
    const userRoleTag = document.getElementById('user-role-tag');

    if (state.user && state.user.isLoggedIn) {
      if (loginContainer) loginContainer.classList.add('hidden');
      if (profileContainer) profileContainer.classList.remove('hidden');
      if (loggedUserName) loggedUserName.textContent = `Salutations, ${state.user.username}!`;
      if (avatarEmoji) avatarEmoji.textContent = state.user.avatar || '🧙‍♂️';
      if (userRoleTag) userRoleTag.textContent = `ROLE: ${state.user.role}`;
    } else {
      if (loginContainer) loginContainer.classList.remove('hidden');
      if (profileContainer) profileContainer.classList.add('hidden');
    }
  }

  function initTerribleAuth() {
    updateAuthUI();

    const loginBtn = document.getElementById('btn-login');
    const guestBtn = document.getElementById('btn-quick-guest');
    const logoutBtn = document.getElementById('btn-logout');
    const mutateIdBtn = document.getElementById('btn-randomize-identity');

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const pwdGaugeBar = document.getElementById('pwd-gauge-bar');
    const pwdStrengthText = document.getElementById('pwd-strength-text');

    // Dynamic password evaluation mocking user
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        const len = passwordInput.value.length;
        if (len === 0) {
          if (pwdGaugeBar) pwdGaugeBar.style.width = '0%';
          if (pwdStrengthText) pwdStrengthText.textContent = 'NONEXISTENT';
        } else if (len < 5) {
          if (pwdGaugeBar) pwdGaugeBar.style.width = '20%';
          if (pwdStrengthText) pwdStrengthText.textContent = 'WEAK AS WET TOAST';
        } else if (len < 10) {
          if (pwdGaugeBar) pwdGaugeBar.style.width = '55%';
          if (pwdStrengthText) pwdStrengthText.textContent = 'SUSPICIOUSLY MEDIOCRE';
        } else {
          if (pwdGaugeBar) pwdGaugeBar.style.width = '92%';
          if (pwdStrengthText) pwdStrengthText.textContent = 'CONTAINS NO HIEROGLYPHICS';
        }
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        const uname = usernameInput ? usernameInput.value.trim() : '';
        if (!uname) {
          showToastNotification('⚠️ Username rejected: Cannot be blank, even in chaos.');
          return;
        }

        state.user = {
          isLoggedIn: true,
          username: uname,
          role: 'SUPREME CHAOS CADET',
          avatar: '🧙‍♂️'
        };
        localStorage.setItem('chaos_user', JSON.stringify(state.user));
        updateAuthUI();
        showToastNotification(`🎉 Authenticated as ${uname}! The mainframe shivers.`);
      });
    }

    if (guestBtn) {
      guestBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        const guestNames = ['SirClickALot', 'AnonymousPotato', 'DigitalGremlin', 'GlitchGoblin'];
        const chosen = guestNames[Math.floor(Math.random() * guestNames.length)];
        state.user = {
          isLoggedIn: true,
          username: chosen,
          role: 'HONORARY GUEST OF DOOM',
          avatar: '🤡'
        };
        localStorage.setItem('chaos_user', JSON.stringify(state.user));
        updateAuthUI();
        showToastNotification(`🤡 Entered as ${chosen}!`);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        ChaosAudio.playWrong();
        recordClick();
        state.user.isLoggedIn = false;
        localStorage.setItem('chaos_user', JSON.stringify(state.user));
        updateAuthUI();
        showToastNotification('🚪 You have fled the session. Come back soon!');
      });
    }

    if (mutateIdBtn) {
      mutateIdBtn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        const avatars = ['🧙‍♂️', '👾', '🦖', '🦹', '🛸', '🗿', '🦄'];
        const roles = ['ARCHDUKE OF UNHANDLED PROMISES', 'LORD OF INFINITE LOOPS', 'BARON OF MARQUEE TAGS'];
        state.user.avatar = avatars[Math.floor(Math.random() * avatars.length)];
        state.user.role = roles[Math.floor(Math.random() * roles.length)];
        localStorage.setItem('chaos_user', JSON.stringify(state.user));
        updateAuthUI();
        showToastNotification('🎲 Identity mutated successfully!');
      });
    }
  }

  // ============================================================
  // ============================================================
  // 15. "MAKE IT MORE WORST IN NEON" ULTRA RADIOACTIVE SYSTEM
  // ============================================================
  function spawnNeonSparks(sourceEl) {
    const emojis = ['⚡', '💚', '💖', '🪩', '☢️', '👽', '❇️', '💥', '✨', '🟢', '🟣', '🟡'];
    const rect = sourceEl ? sourceEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: 120, width: 0, height: 0 };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'neon-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = `${centerX}px`;
      p.style.top = `${centerY}px`;

      const angle = (Math.PI * 2 * i) / 18 + (Math.random() * 0.4 - 0.2);
      const dist = Math.random() * 260 + 90;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }

    // Blinding neon screen flash
    const flash = document.createElement('div');
    flash.className = 'neon-flash-overlay';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  }

  function makeItWorse() {
    state.worseLevel++;
    ChaosAudio.playNeonZap();
    ChaosAudio.playWorse();
    recordClick();

    const worseBtn = document.getElementById('make-worse-btn');
    if (worseBtn) {
      spawnNeonSparks(worseBtn);
    }

    if (state.worseLevel >= 3) {
      unlockAchievement('chaos_enthusiast');
    }

    // Screen shake
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 450);

    // Increase rotation on elements
    const rot = (state.worseLevel * 2.2).toFixed(1);
    document.documentElement.style.setProperty('--worse-rotation', `${rot}deg`);

    // Blinding neon saturation, contrast, and color shift across body
    const saturation = 100 + (state.worseLevel * 45);
    const contrast = 100 + (state.worseLevel * 15);
    const hue = (state.worseLevel * 30) % 360;
    document.body.style.filter = `saturate(${saturation}%) contrast(${contrast}%) hue-rotate(${hue}deg)`;

    // Increase chaos meter
    state.chaosMeterValue = Math.min(999, state.chaosMeterValue + 35);
    renderChaosMeter();

    const multBadge = document.getElementById('chaos-multiplier-badge');
    if (multBadge) {
      multBadge.textContent = `☢️ NEON CHAOS MULTIPLIER: x${state.worseLevel} ${state.worseLevel > 4 ? '(RADIOACTIVE NEON MELTDOWN)' : ''}`;
    }

    // Apply hyper-neon glowing borders and tilts to all cards
    const neonPalette = ['#39ff14', '#ff007f', '#00ffff', '#ffff00', '#ff0055', '#9900ff'];
    const cards = document.querySelectorAll('.chaos-card');
    cards.forEach((card, idx) => {
      const tilt = ((idx % 2 === 0 ? 1 : -1) * (state.worseLevel * 1.1)).toFixed(1);
      const c1 = neonPalette[(idx + state.worseLevel) % neonPalette.length];
      const c2 = neonPalette[(idx + state.worseLevel + 1) % neonPalette.length];
      const glowSpread = 10 + (state.worseLevel * 8);

      card.style.transform = `rotate(${tilt}deg) scale(${1 + (state.worseLevel * 0.015)})`;
      card.style.borderColor = `${c1} ${c2} ${c1} ${c2}`;
      card.style.boxShadow = `0 0 ${glowSpread}px ${c1}, 0 0 ${glowSpread * 2}px ${c2}, 8px 8px 0px #000`;
    });

    // Intense radioactive neon cursor aura
    if (cursorEl) {
      cursorEl.style.filter = `drop-shadow(0 0 ${12 + state.worseLevel * 6}px #39ff14) drop-shadow(0 0 ${24 + state.worseLevel * 10}px #ff00ff) drop-shadow(2px 2px 0 #000)`;
    }

    // Random absurd neon notifications
    const neonMsgs = [
      `☢️ NEON OVERDRIVE LEVEL ${state.worseLevel}! Lumens exceeded legal limit.`,
      `⚡ 50,000 Volts of radioactive neon pumped into stylesheet.`,
      `🪩 Optometrists across the globe are sounding alarms.`,
      `💚 Radioactive neon saturation is now at ${saturation}%.`,
      `🔥 Neon meltdown imminent! Reality is vibrating in ultraviolet.`
    ];
    showToastNotification(neonMsgs[Math.floor(Math.random() * neonMsgs.length)]);
  }

  function initMakeItWorse() {
    const worseBtn = document.getElementById('make-worse-btn');
    if (worseBtn) {
      worseBtn.addEventListener('click', makeItWorse);
    }

    const betterBtn = document.getElementById('make-better-btn');
    if (betterBtn) {
      betterBtn.addEventListener('click', () => {
        ChaosAudio.playWrong();
        recordClick();
        showToastNotification('😇 Did you really think clicking "Make Better" would save you? Neon chaos amplified!');
        makeItWorse();
      });
    }
  }

  // ============================================================
  // FUNCTIONAL TASK MANAGER (ANTI-PRODUCTIVITY)
  // ============================================================
  function saveTasks() {
    localStorage.setItem('chaos_tasks', JSON.stringify(state.tasks));
  }

  function renderTasks() {
    const listEl = document.getElementById('task-list');
    const countAll = document.getElementById('count-all');
    const countPending = document.getElementById('count-pending');
    const countDone = document.getElementById('count-done');

    if (!listEl) return;

    const all = state.tasks.length;
    const done = state.tasks.filter(t => t.done).length;
    const pending = all - done;

    if (countAll) countAll.textContent = all;
    if (countPending) countPending.textContent = pending;
    if (countDone) countDone.textContent = done;

    let filtered = state.tasks;
    if (state.taskFilter === 'pending') {
      filtered = state.tasks.filter(t => !t.done);
    } else if (state.taskFilter === 'done') {
      filtered = state.tasks.filter(t => t.done);
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `<li style="padding: 12px; color: #ff007f; text-align: center; font-style: italic;">No tasks found here. Go contemplate existence.</li>`;
      return;
    }

    listEl.innerHTML = '';
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item priority-${task.priority} ${task.done ? 'done' : ''}`;
      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}" title="Mark completed or procrastinated">
          <span class="task-text">${task.title}</span>
          ${task.done ? '<span class="procrastinated-stamp">PROCRASTINATED!</span>' : ''}
        </div>
        <div class="task-actions">
          <button class="chaos-btn tiny-btn danger-btn delete-task-btn" data-id="${task.id}" title="Vanish task">DELETE</button>
        </div>
      `;

      // Checkbox toggle
      li.querySelector('.task-checkbox').addEventListener('change', (e) => {
        ChaosAudio.playClick();
        recordClick();
        task.done = e.target.checked;
        saveTasks();
        renderTasks();
        if (task.done) {
          showToastNotification('✅ Task completed! Or at least digitally swept under the rug.');
        }
      });

      // Delete button
      li.querySelector('.delete-task-btn').addEventListener('click', () => {
        ChaosAudio.playWrong();
        recordClick();
        state.tasks = state.tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
        showToastNotification('🗑️ Task vaporized.');
      });

      listEl.appendChild(li);
    });
  }

  function initTaskManager() {
    renderTasks();

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-title-input');
    const prioritySelect = document.getElementById('task-priority-select');

    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (!title) {
          showToastNotification('⚠️ A task must have words, or else it is merely a sigh.');
          return;
        }

        ChaosAudio.playClick();
        recordClick();

        state.tasks.unshift({
          id: Date.now().toString(),
          title: title,
          priority: prioritySelect ? prioritySelect.value : 'mild',
          done: false
        });

        taskInput.value = '';
        saveTasks();
        renderTasks();
        showToastNotification('📝 Task spawned into digital existence!');
      });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.taskFilter = btn.dataset.filter;
        renderTasks();
      });
    });

    // Clear all button
    const clearBtn = document.getElementById('btn-chaos-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        ChaosAudio.playWrong();
        recordClick();
        if (state.tasks.length === 0) return;
        state.tasks = [];
        saveTasks();
        renderTasks();
        showToastNotification('💥 All tasks wiped into the void!');
      });
    }
  }

  // ============================================================
  // FUNCTIONAL CHAOS CALCULATOR
  // ============================================================
  const calcComments = [
    "Congratulations on basic arithmetic.",
    "Calculated using 100% certified dark magic.",
    "Did you really need a computer for that?",
    "Result verified by 3 independent hamsters.",
    "The digits are confident, though reality is uncertain.",
    "Math is just numbers with anxiety."
  ];

  function initChaosCalculator() {
    const screen = document.getElementById('calc-screen');
    const commentEl = document.getElementById('calc-comment');
    const buttons = document.querySelectorAll('.calc-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        ChaosAudio.playClick();
        recordClick();
        const action = btn.dataset.calc;

        if (action === 'clear') {
          state.calcExpression = '';
          if (screen) screen.textContent = '0';
          if (commentEl) commentEl.textContent = 'Awaiting foolish human input...';
        } else if (action === '=') {
          if (!state.calcExpression) return;
          try {
            // Safe evaluation of arithmetic expressions
            // Replace any unexpected characters
            const sanitized = state.calcExpression.replace(/[^0-9+\-*/.()]/g, '');
            // Simple Function-based safe eval of mathematical expressions
            const result = new Function(`return (${sanitized})`)();
            if (screen) screen.textContent = isFinite(result) ? result : 'INFINITY & BEYOND';
            if (commentEl) {
              commentEl.textContent = calcComments[Math.floor(Math.random() * calcComments.length)];
            }
            state.calcExpression = String(result);
          } catch (e) {
            if (screen) screen.textContent = 'MATH PANIC';
            if (commentEl) commentEl.textContent = 'You broke algebra. Newton is crying.';
            ChaosAudio.playWrong();
            state.calcExpression = '';
          }
        } else if (action === 'random') {
          const rand = Math.floor(Math.random() * 9999);
          state.calcExpression += rand;
          if (screen) screen.textContent = state.calcExpression;
          if (commentEl) commentEl.textContent = '🎲 A wild random number appeared!';
        } else {
          state.calcExpression += action;
          if (screen) screen.textContent = state.calcExpression;
        }
      });
    });
  }

  // ============================================================
  // SETTINGS & SOUND CONTROLS
  // ============================================================
  function initRealSettings() {
    const soundHeaderBtn = document.getElementById('sound-toggle-btn');
    const soundSettingToggle = document.getElementById('setting-sound-toggle');
    const cursorSettingToggle = document.getElementById('setting-cursor-toggle');
    const mutationSettingToggle = document.getElementById('setting-mutation-toggle');
    const notifsSettingToggle = document.getElementById('setting-notifs-toggle');

    function updateSoundState(enabled) {
      state.settings.sound = enabled;
      ChaosAudio.enabled = enabled;
      if (soundHeaderBtn) {
        soundHeaderBtn.textContent = enabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
      }
      if (soundSettingToggle) soundSettingToggle.checked = enabled;
    }

    if (soundHeaderBtn) {
      soundHeaderBtn.addEventListener('click', () => {
        updateSoundState(!state.settings.sound);
        recordClick();
      });
    }

    if (soundSettingToggle) {
      soundSettingToggle.addEventListener('change', (e) => {
        updateSoundState(e.target.checked);
        recordClick();
      });
    }

    if (cursorSettingToggle) {
      cursorSettingToggle.addEventListener('change', (e) => {
        state.settings.cursor = e.target.checked;
        if (cursorEl) cursorEl.style.display = e.target.checked ? 'block' : 'none';
        recordClick();
      });
    }

    if (mutationSettingToggle) {
      mutationSettingToggle.addEventListener('change', (e) => {
        state.settings.mutations = e.target.checked;
        recordClick();
      });
    }

    if (notifsSettingToggle) {
      notifsSettingToggle.addEventListener('change', (e) => {
        state.settings.notifs = e.target.checked;
        recordClick();
      });
    }
  }

  // ============================================================
  // GLOBAL WINDOW EXPORT FOR INLINE ACTIONS
  // ============================================================
  window.chaosApp = {
    makeItWorse,
    switchView,
    triggerUselessLink,
    showModal,
    closeModal
  };

  // ============================================================
  // INITIALIZATION ON DOM READY
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    initChaoticCursor();
    initConfusingTitle();
    initUIPersonality();
    initChaosMeter();
    initFakeSystemStatus();
    initUnnecessaryLoading();
    attachWrongButtonLabels();
    renderAchievementsShowcase();
    initTimersAndTracking();
    initRandomNotifications();
    initTerribleSearch();
    initSidebarNavigation();
    initChaoticFooter();
    initEasterEggs();
    initTerribleAuth();
    initMakeItWorse();
    initTaskManager();
    initChaosCalculator();
    initRealSettings();

    // Welcome greeting
    setTimeout(() => {
      showToastNotification('🐸 Frog detected in your vicinity.');
    }, 1500);
  });

})();
