/**
 * HORROR AUDIO ENGINE (WEB AUDIO API)
 * 100% native, zero external audio assets, respects user mute and browser permissions.
 */

window.HorrorAudio = (function() {
  let ctx = null;
  let isMuted = false;
  let ambientDrone = null;
  let ambientGain = null;

  let compressor = null;

  function initContext() {
    if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, ctx.currentTime);
      compressor.knee.setValueAtTime(25, ctx.currentTime);
      compressor.ratio.setValueAtTime(10, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);
      compressor.connect(ctx.destination);
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  function getAudioTarget() {
    return compressor || (ctx ? ctx.destination : null);
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted && ambientGain) {
      ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    }
    return !isMuted;
  }

  function isEnabled() {
    return !isMuted && window.HORROR_CONFIG?.annoyance?.enableCreepyHoverSounds !== false;
  }

  // Subtle creepy hover click
  function playHoverGlitch() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const freq = Math.random() * 120 + 80;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Creepy heavy button click
  function playClickThud() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  // Horror analysis processing ping
  function playAnalysisSonar() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // Glitch static burst
  function playGlitchStatic() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime);
    } catch (e) {}
  }

  // Clean solution reveal chord (heavenly major triad, relief!)
  function playReliefChime() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.2);
      });
    } catch (e) {}
  }

  // Funny harmless bounce sound for "Do Not Press"
  function playForbiddenBoing() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // Rising charge tone when user holds button
  let chargingOsc = null;
  let chargingGain = null;

  function startChargingTone() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      stopChargingTone();
      chargingOsc = ctx.createOscillator();
      chargingGain = ctx.createGain();
      chargingOsc.type = 'sawtooth';
      chargingOsc.frequency.setValueAtTime(120, ctx.currentTime);
      chargingOsc.frequency.linearRampToValueAtTime(480, ctx.currentTime + 1.8);

      chargingGain.gain.setValueAtTime(0.06, ctx.currentTime);
      chargingGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.8);

      chargingOsc.connect(chargingGain);
      chargingGain.connect(ctx.destination);
      chargingOsc.start();
    } catch (e) {}
  }

  function stopChargingTone() {
    if (chargingOsc) {
      try {
        chargingOsc.stop();
        chargingOsc.disconnect();
      } catch (e) {}
      chargingOsc = null;
      chargingGain = null;
    }
  }

  // Disappointing buzz when user releases hold early
  function playFailBuzz() {
    stopChargingTone();
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      osc.frequency.setValueAtTime(80, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  }

  // ============================================================
  // ANNOYING BUTTON CLICK SOUNDS SUITE
  // ============================================================

  // 1. High-pitched rubber duck squeak
  function playSqueak() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(2600, ctx.currentTime + 0.07);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // 2. Loud, discordant wrong buzzer / fart synth
  function playWrongBuzzer() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(85, ctx.currentTime);
      osc2.frequency.setValueAtTime(91.5, ctx.currentTime); // Discordant beating

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.22);
      osc2.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }

  // 3. Piercing 90s dial-up screech
  function playModemScreech() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(1336, ctx.currentTime);
      osc2.frequency.setValueAtTime(941, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(1750, ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.14);
      osc2.stop(ctx.currentTime + 0.14);
    } catch (e) {}
  }

  // 4. Bouncing cartoon spring boing
  function playBoing() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.16);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.26);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.26);
    } catch (e) {}
  }

  // 5. Pathetic sad slide whistle womp
  function playSadSlide() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  // 6. Abrasive clown honk-honk
  function playClownHorn() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const playBeep = (timeOffset) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'square';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(370, ctx.currentTime + timeOffset);
        osc2.frequency.setValueAtTime(466, ctx.currentTime + timeOffset);

        gain.gain.setValueAtTime(0.14, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.09);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(ctx.currentTime + timeOffset);
        osc2.start(ctx.currentTime + timeOffset);
        osc1.stop(ctx.currentTime + timeOffset + 0.09);
        osc2.stop(ctx.currentTime + timeOffset + 0.09);
      };
      playBeep(0);
      playBeep(0.11);
    } catch (e) {}
  }

  // ============================================================
  // BIG VOLUME LOUD IMPACT SOUNDS
  // ============================================================

  // 1. Loud Booming 808 Sub-Bass Impact with Transient Crack
  function playBigVolumeBoom() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const target = getAudioTarget();

      // Deep 808 sub
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.38);

      subGain.gain.setValueAtTime(0.85, ctx.currentTime); // BIG volume!
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      sub.connect(subGain);
      subGain.connect(target);
      sub.start(ctx.currentTime);
      sub.stop(ctx.currentTime + 0.38);

      // Crunchy transient punch
      const crunch = ctx.createOscillator();
      const crunchGain = ctx.createGain();
      crunch.type = 'sawtooth';
      crunch.frequency.setValueAtTime(950, ctx.currentTime);
      crunch.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.12);

      crunchGain.gain.setValueAtTime(0.55, ctx.currentTime);
      crunchGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      crunch.connect(crunchGain);
      crunchGain.connect(target);
      crunch.start(ctx.currentTime);
      crunch.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // 2. Loud Brassy Sports Airhorn Blast
  function playBigVolumeAirhorn() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const target = getAudioTarget();

      const freqs = [466.16, 587.33, 698.46]; // Bb4, D5, F5
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        gain.gain.setValueAtTime(0.35, ctx.currentTime); // Summed is > 0.9!
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(target);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      });
    } catch (e) {}
  }

  // 3. Loud Distorted Alarm Buzzer
  function playBigVolumeBuzzer() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const target = getAudioTarget();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(95, ctx.currentTime);
      osc2.frequency.setValueAtTime(102, ctx.currentTime); // Harsh discord

      gain.gain.setValueAtTime(0.80, ctx.currentTime); // BIG volume!
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(target);
      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.28);
      osc2.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  }

  // 4. Loud Piercing Duck Squeal
  function playBigVolumeSqueak() {
    if (!isEnabled()) return;
    try {
      initContext();
      if (!ctx) return;
      const target = getAudioTarget();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(3400, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.75, ctx.currentTime); // BIG volume!
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(target);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }

  // Master Big Volume Sound Trigger
  function playBigVolumeSound() {
    const bigSounds = [
      playBigVolumeBoom,
      playBigVolumeAirhorn,
      playBigVolumeBuzzer,
      playBigVolumeSqueak
    ];
    const chosen = bigSounds[Math.floor(Math.random() * bigSounds.length)];
    chosen();
  }

  // Master annoying sound trigger
  function playRandomAnnoyingSound() {
    // 60% chance big volume sound, 40% other annoying sounds
    if (Math.random() > 0.4) {
      playBigVolumeSound();
    } else {
      const sounds = [
        playSqueak,
        playWrongBuzzer,
        playModemScreech,
        playBoing,
        playSadSlide,
        playClownHorn
      ];
      const chosen = sounds[Math.floor(Math.random() * sounds.length)];
      chosen();
    }
  }

  // Automatically attach to ANY clickable button, option, tab, or card on the entire page
  window.addEventListener('click', (e) => {
    // Check if clicked element is an option, button, tab, card, or choice
    const optionEl = e.target.closest(
      '.problem-card, .cat-pill, .captcha-choice, button, .horror-btn, .forbidden-btn, .audio-btn, .escape-btn, .clean-reset-btn, .clean-copy-btn, .feedback-chip, .select-problem-btn, .hold-to-surrender-btn, .status-chip'
    );

    if (optionEl) {
      // 1. Play BIG volume sound!
      playBigVolumeSound();

      // 2. Start ROTATING the clicked option!
      // If it's already rotating, spin faster or reverse direction!
      if (!optionEl.classList.contains('is-rotating') && !optionEl.classList.contains('is-rotating-fast') && !optionEl.classList.contains('is-rotating-reverse')) {
        optionEl.classList.add('is-rotating');
      } else if (optionEl.classList.contains('is-rotating')) {
        optionEl.classList.remove('is-rotating');
        optionEl.classList.add('is-rotating-fast');
      } else if (optionEl.classList.contains('is-rotating-fast')) {
        optionEl.classList.remove('is-rotating-fast');
        optionEl.classList.add('is-rotating-reverse');
      } else {
        optionEl.classList.remove('is-rotating-reverse');
        optionEl.classList.add('is-rotating');
      }

      // If a select button inside a .problem-card was clicked, rotate the parent card too!
      const parentCard = optionEl.closest('.problem-card');
      if (parentCard && parentCard !== optionEl) {
        parentCard.classList.add('is-rotating');
      }

      // 3. Align the website in random and complicated ways!
      window.HorrorAligner?.scrambleAlignment();
    }
  }, true);

  return {
    toggleMute,
    isMuted: () => isMuted,
    playHoverGlitch,
    playClickThud,
    playAnalysisSonar,
    playGlitchStatic,
    playReliefChime,
    playForbiddenBoing,
    startChargingTone,
    stopChargingTone,
    playFailBuzz,
    playRandomAnnoyingSound,
    playBigVolumeSound,
    playBigVolumeBoom,
    playBigVolumeAirhorn,
    playBigVolumeBuzzer,
    playBigVolumeSqueak,
    playSqueak,
    playWrongBuzzer,
    playModemScreech,
    playBoing,
    playSadSlide,
    playClownHorn
  };
})();
