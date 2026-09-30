/**
 * HORROR PROBLEM SOLVER - REACT APPLICATION (ULTRA ANNOYING EDITION)
 * Highly frustrating, eerie, disobedient horror UX with genuinely clean, useful solutions.
 */

const { useState, useEffect, useRef } = React;

// ============================================================
// 1. GHOST FOLLOWER CURSOR
// ============================================================
function GhostCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [visible]);

  if (!visible || !window.HORROR_CONFIG?.annoyance?.enableGhostCursor) return null;

  return (
    <div
      className="ghost-crosshair"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
      aria-hidden="true"
    >
      <div className="crosshair-reticle"></div>
      <span className="ghost-eye">👁️</span>
      <span className="ghost-coords">LOC: [{Math.floor(pos.x)},{Math.floor(pos.y)}]</span>
    </div>
  );
}

// ============================================================
// 2. REUSABLE EVASIVE BUTTON COMPONENT
// ============================================================
function EvasiveButton({ onClick, children, className = "", maxDodges = 3, distance = 55, ...props }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentLabel, setCurrentLabel] = useState(null);
  const btnRef = useRef(null);

  const teaseLabels = [
    "DON'T TOUCH ME",
    "MISCLICK DETECTED",
    "TRY HARDER",
    "ALMOST HAD IT",
    "TOO SLOW",
    "ARE YOU READY?"
  ];

  const handleMouseEnter = () => {
    if (!window.HORROR_CONFIG?.annoyance?.buttonEvasionEnabled) return;

    if (dodgeCount < maxDodges) {
      window.HorrorAudio?.playHoverGlitch();
      const angle = Math.random() * Math.PI * 2;
      const newX = Math.cos(angle) * distance;
      const newY = Math.sin(angle) * distance;
      setOffset({ x: newX, y: newY });
      setCurrentLabel(teaseLabels[dodgeCount % teaseLabels.length]);
      setDodgeCount(prev => prev + 1);
    }
  };

  const handleClick = (e) => {
    window.HorrorAudio?.playClickThud();
    setOffset({ x: 0, y: 0 });
    setDodgeCount(0);
    setCurrentLabel(null);
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={`horror-btn evasive-btn ${className}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.16s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
      }}
      {...props}
    >
      {currentLabel || children}
    </button>
  );
}

// ============================================================
// 3. HOLD-TO-CONFIRM ANNOYING BUTTON
// Requires holding down for 1.8 seconds. Resets if released early!
// ============================================================
function HoldToSurrenderButton({ onComplete, label = "HOLD TO SURRENDER SOUL", requiredMs = 1800 }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [failedMsg, setFailedMsg] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startHold = () => {
    setFailedMsg(null);
    setHolding(true);
    startTimeRef.current = Date.now();
    window.HorrorAudio?.startChargingTone();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.floor((elapsed / requiredMs) * 100));
      setProgress(pct);

      if (elapsed >= requiredMs) {
        clearInterval(timerRef.current);
        window.HorrorAudio?.stopChargingTone();
        window.HorrorAudio?.playReliefChime();
        setHolding(false);
        onComplete();
      }
    }, 30);
  };

  const cancelHold = () => {
    if (!holding) return;
    clearInterval(timerRef.current);
    window.HorrorAudio?.playFailBuzz();
    setHolding(false);
    if (progress < 100) {
      setFailedMsg(`⚠️ HESITATION DETECTED AT ${progress}%! The terminal demands sustained willpower.`);
      setProgress(0);
    }
  };

  return (
    <div className="hold-button-wrapper">
      <button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        className={`horror-btn hold-to-surrender-btn ${holding ? 'is-holding' : ''}`}
      >
        <div className="hold-progress-fill" style={{ width: `${progress}%` }}></div>
        <span className="hold-btn-text">
          {holding ? `⚡ HOLDING... (${progress}%)` : label}
        </span>
      </button>
      {failedMsg && (
        <div className="hold-failed-alert" role="alert">
          {failedMsg}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 4. VOID COOKIE & CURSE CONSENT BANNER
// ============================================================
function VoidCookieBanner({ onDismiss }) {
  const [customizing, setCustomizing] = useState(false);
  const curses = window.HORROR_CONFIG?.annoyance?.curseCookies || [];

  return (
    <aside className="void-cookie-banner" role="region" aria-label="Curse Cookie Consent">
      <div className="cookie-main-content">
        <div className="cookie-badge">⚠️ MANDATORY VOID TELEMETRY</div>
        <p className="cookie-text">
          This terminal harvests subconscious cognitive dread, erratic cursor tremors, and heavy sighs to maintain CSS layout stability.
          By remaining in this reality, you consent to all subterranean tracking.
        </p>

        {customizing && (
          <div className="cookie-custom-panel">
            <div className="custom-panel-title">NON-NEGOTIABLE TELEMETRY STREAMS:</div>
            {curses.map(c => (
              <label key={c.id} className="curse-checkbox-row">
                <input type="checkbox" checked readOnly />
                <span>{c.label} <strong>[LOCKED]</strong></span>
              </label>
            ))}
            <div className="curse-fine-print">* Unchecking any curse will cause your CSS flexbox to randomly collapse.</div>
          </div>
        )}

        <div className="cookie-actions">
          <button
            onClick={() => {
              window.HorrorAudio?.playClickThud();
              setCustomizing(!customizing);
            }}
            className="horror-btn btn-secondary tiny-btn"
          >
            {customizing ? "HIDE AGONY" : "CUSTOMIZE AGONY"}
          </button>
          <button
            onClick={() => {
              window.HorrorAudio?.playClickThud();
              onDismiss();
            }}
            className="horror-btn btn-danger"
          >
            ACCEPT ALL CURSES & PROCEED
          </button>
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// 5. TERMINAL STATUS BAR
// ============================================================
function TerminalStatusBar({ onEscapeClick, onDoNotPress, stabilityJitter, audioMuted, onToggleAudio, topologyName }) {
  return (
    <header className="terminal-header" role="banner">
      <div className="terminal-brand">
        <span className="terminal-skull">💀</span>
        <div className="brand-text">
          <span className="terminal-id">TERMINAL // 0x7F-VOID</span>
          <span className="terminal-sub">ANOMALOUS PROBLEM DISASSEMBLER</span>
        </div>
      </div>

      <div className="status-indicators-grid" aria-label="Terminal telemetry">
        <div className="status-chip chip-critical" title="Session stability is decaying">
          <span className="chip-dot"></span>
          <span className="chip-label">STABILITY:</span>
          <span className="chip-val">{stabilityJitter}% (CRITICAL)</span>
        </div>
        <div className="status-chip chip-threat" title="Dynamic geometric alignment of this terminal">
          <span className="chip-label">TOPOLOGY:</span>
          <span className="chip-val">{topologyName || "EUCLIDEAN"}</span>
        </div>
        <div className="status-chip chip-dim" title="Probability of positive outcome">
          <span className="chip-label">HOPE:</span>
          <span className="chip-val">LOW</span>
        </div>
        <div className="status-chip chip-dim" title="Confidence of resolution">
          <span className="chip-label">INTEGRITY:</span>
          <span className="chip-val">QUESTIONABLE</span>
        </div>
        <div className="status-chip chip-dim" title="Cognitive threshold remaining">
          <span className="chip-label">SANITY:</span>
          <span className="chip-val">12.4%</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          onClick={onDoNotPress}
          className="forbidden-btn"
          title="Do not touch this under any circumstances"
        >
          ⛔ DO NOT PRESS
        </button>

        <button
          onClick={onToggleAudio}
          className="audio-btn"
          title="Toggle audio drone"
        >
          {audioMuted ? "🔇 MUTED" : "🔊 SOUND: ON"}
        </button>

        <button
          onClick={onEscapeClick}
          className="escape-btn"
          title="Flee from this terminal"
        >
          🚪 ESCAPE
        </button>
      </div>
    </header>
  );
}

// ============================================================
// 6. HORROR AMBIENT EFFECTS
// ============================================================
function HorrorScreenEffects({ ominousMessage }) {
  return (
    <>
      <GhostCursor />
      <div className="crt-scanlines" aria-hidden="true"></div>
      <div className="crt-flicker-overlay" aria-hidden="true"></div>
      <div className="vignette-shadow" aria-hidden="true"></div>
      
      <aside className="creepy-ticker-bar" aria-label="System warning">
        <span className="ticker-badge">⚠️ BROADCAST:</span>
        <span className="ticker-text">{ominousMessage}</span>
      </aside>
    </>
  );
}

// ============================================================
// 7. CONFIRMATION GAUNTLET (4 DEEPLY ANNOYING STAGES)
// ============================================================
function ConfirmationGauntlet({ problem, stage, onNextStage, onCancel }) {
  if (!problem) return null;

  const [captchaChoice, setCaptchaChoice] = useState(null);

  const captchaOptions = [
    { id: "hubris", label: "My own architectural hubris & premature optimization" },
    { id: "legacy", label: "A legacy developer who vanished into the woods 3 years ago" },
    { id: "mercury", label: "Mercury is in retrograde and node_modules is corrupted" },
    { id: "all", label: "All of the above (and the universe is indifferent)" }
  ];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
      <div className="horror-modal-box">
        <div className="modal-header-tag">
          STAGE {stage} OF 4 // UNNECESSARY VERIFICATION GAUNTLET
        </div>

        {/* STAGE 1: Problem Detected */}
        {stage === 1 && (
          <div className="modal-content-stage">
            <h2 id="modal-heading" className="modal-title">⚠️ PROBLEM DETECTED</h2>
            <p className="modal-lead">
              You selected: <strong className="highlight-problem">{problem.title}</strong>
            </p>
            <p className="modal-warning">
              The system notes that acknowledging this dilemma may evoke profound feelings of developer inadequacy, temporal dread, and existential contemplation.
            </p>
            <div className="modal-question">
              Are you completely certain you wish to admit that this problem exists?
            </div>
            <div className="modal-actions">
              <button onClick={onCancel} className="horror-btn btn-secondary">
                FLEE (CANCEL)
              </button>
              <button onClick={onNextStage} className="horror-btn btn-danger">
                YES, I CONFIRM THIS DILEMMA →
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: Captcha of Mortal Regret */}
        {stage === 2 && (
          <div className="modal-content-stage">
            <h2 id="modal-heading" className="modal-title">🤖 MORTAL PROOF VERIFICATION</h2>
            <p className="modal-lead">
              To verify you are a genuine distressed human and not an automated crawler:
            </p>
            <p className="modal-question">
              Identify the philosophical root origin of this catastrophe:
            </p>
            <div className="captcha-options-list">
              {captchaOptions.map(opt => (
                <label
                  key={opt.id}
                  className={`captcha-choice ${captchaChoice === opt.id ? 'selected' : ''}`}
                  onClick={() => {
                    window.HorrorAudio?.playHoverGlitch();
                    setCaptchaChoice(opt.id);
                  }}
                >
                  <input
                    type="radio"
                    name="mortal-captcha"
                    checked={captchaChoice === opt.id}
                    onChange={() => {}}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={onCancel} className="horror-btn btn-secondary">
                REJECT RESPONSIBILITY
              </button>
              <button
                disabled={!captchaChoice}
                onClick={onNextStage}
                className="horror-btn btn-danger"
              >
                {captchaChoice ? "CONFIRM GUILT & ADVANCE →" : "SELECT AN OPTION ABOVE"}
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: Evasive Button Confirmation */}
        {stage === 3 && (
          <div className="modal-content-stage">
            <h2 id="modal-heading" className="modal-title">👁️ ARE YOU ABSOLUTELY, TRULY CERTAIN?</h2>
            <p className="modal-lead">
              Code: <code className="problem-code">{problem.horrorCode}</code>
            </p>
            <p className="modal-warning">
              {problem.creepySubtitle}
            </p>
            <p className="modal-subnote">
              Notice: The confirmation button below is somewhat recalcitrant and may resist click attempts. Persist through the friction.
            </p>
            <div className="modal-actions">
              <button onClick={onCancel} className="horror-btn btn-secondary">
                ABORT SEQUENCE
              </button>
              <EvasiveButton
                onClick={onNextStage}
                className="btn-danger-evasive"
                maxDodges={window.HORROR_CONFIG?.annoyance?.buttonEvasionMaxDodges || 3}
                distance={window.HORROR_CONFIG?.annoyance?.buttonEvasionDistance || 55}
              >
                I ACCEPT MY FATE // PROCEED →
              </EvasiveButton>
            </div>
          </div>
        )}

        {/* STAGE 4: Hold-to-Surrender Button */}
        {stage === 4 && (
          <div className="modal-content-stage">
            <h2 id="modal-heading" className="modal-title">🩸 FINAL IRREVERSIBLE COMMITMENT</h2>
            <p className="modal-lead">
              The terminal requires uninterrupted, physical tactile devotion.
            </p>
            <p className="modal-warning">
              You must <strong>CLICK AND HOLD</strong> the button below for 1.8 seconds. Releasing early will disappoint the mainframe and reset your progress.
            </p>
            <div className="modal-actions center-actions">
              <HoldToSurrenderButton
                onComplete={onNextStage}
                label="HOLD DOWN TO SURRENDER SOUL (1.8s)"
                requiredMs={window.HORROR_CONFIG?.annoyance?.holdDurationMs || 1800}
              />
            </div>
            <div className="cancel-sub-link">
              <button onClick={onCancel} className="text-cancel-btn">
                [ Nevermind, take me back to safety ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 8. HORROR ANALYSIS LOADING EXPERIENCE
// ============================================================
function HorrorAnalysisSequence({ problem, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "[SYS-BOOT] Initializing deep cognitive disassembler...",
    "[READING] Siphoning user angst from input buffers...",
    "[ANOMALY] Encountered recursive hesitation loop in human wetware...",
    "[PROCESSING] Isolating genuine architectural & psychological bottlenecks...",
    "[SUBSYSTEM] Querying forgotten archives for practical remediation...",
    "[RESOLUTION] Purging horror heuristics... Synthesizing genuine solution..."
  ];

  useEffect(() => {
    window.HorrorAudio?.playGlitchStatic();

    const timeline = [
      { at: 400, prog: 14, log: 0 },
      { at: 1200, prog: 39, log: 1 },
      { at: 2200, prog: 66, log: 2 },
      { at: 3100, prog: 13, log: 2 }, // Glitch drop!
      { at: 4200, prog: 81, log: 3 },
      { at: 5200, prog: 96, log: 4 },
      { at: 6200, prog: 100, log: 5 }
    ];

    const timeouts = timeline.map(item => {
      return setTimeout(() => {
        setProgress(item.prog);
        setLogIndex(item.log);
        window.HorrorAudio?.playAnalysisSonar();
      }, item.at);
    });

    const completionTimeout = setTimeout(() => {
      window.HorrorAudio?.playReliefChime();
      onComplete();
    }, window.HORROR_CONFIG?.annoyance?.analysisDurationMs || 6500);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(completionTimeout);
    };
  }, []);

  return (
    <div className="horror-analysis-screen" role="status" aria-live="polite">
      <div className="analysis-terminal-box">
        <div className="analysis-header">
          <span className="pulsing-skull">💀</span>
          <h2>HORROR ANALYSIS IN PROGRESS</h2>
          <span className="blinking-warning">[DO NOT DISCONNECT]</span>
        </div>

        <p className="analyzing-target">
          SUBJECT: <code>{problem.horrorCode}</code> // {problem.title}
        </p>

        <div className="creepy-progress-container">
          <div
            className="creepy-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="progress-percentage-label">{progress}%</span>
        </div>

        <div className="analysis-terminal-logs">
          {logs.slice(0, logIndex + 1).map((log, idx) => (
            <div key={idx} className="terminal-log-line">
              <span className="log-timestamp">&gt;</span> {log}
            </div>
          ))}
          <div className="terminal-cursor-line">
            <span className="blinking-cursor">_</span>
          </div>
        </div>

        <div className="analysis-footer-creepy">
          "The machine weeps for your code, but clarity is imminent."
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 9. OVERCOMPLICATED HORROR PROBLEM SELECTOR
// ============================================================
function ProblemSelector({ onSelectProblem, activeCategory, onCategoryChange, searchQuery, onSearchChange }) {
  const problems = window.HORROR_CONFIG?.problems || [];
  const categories = ["All Sins", "Software & Architecture", "Focus & Executive Function", "Wellbeing & Career", "Team & Communication"];
  const [miseryLevel, setMiseryLevel] = useState(75);

  const filtered = problems.filter(p => {
    const matchesCat = activeCategory === "All Sins" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.horrorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.creepySubtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="problem-selection-container">
      <div className="terminal-welcome-card">
        <div className="welcome-tag">ARCHIVAL DATABASE // SECTOR 13</div>
        <h1 className="welcome-title">SELECT THY PREDICAMENT</h1>
        <p className="welcome-desc">
          Choose a catastrophe from the ledger below. Each dilemma is cataloged with severe precision.
          Select carefully; the terminal remembers all choices.
        </p>
      </div>

      <div className="selector-controls-panel">
        <div className="search-and-misery-row">
          <div className="search-input-wrapper">
            <span className="search-symbol">🔍</span>
            <input
              type="text"
              className="horror-search-input"
              placeholder="Search anomaly code, title, or misery..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Annoying Misery Coefficient Slider */}
          <div className="misery-slider-box">
            <label htmlFor="misery-range">
              SUFFERING COEFFICIENT: <strong>{miseryLevel}%</strong>
            </label>
            <input
              id="misery-range"
              type="range"
              min="0"
              max="100"
              value={miseryLevel}
              onChange={(e) => {
                window.HorrorAudio?.playHoverGlitch();
                setMiseryLevel(e.target.value);
              }}
              className="misery-slider"
            />
          </div>
        </div>

        <nav className="nested-category-nav" aria-label="Problem categories">
          <span className="nav-label">CLASSIFICATION:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                window.HorrorAudio?.playHoverGlitch();
                onCategoryChange(cat);
              }}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      <div className="problems-grid" role="list">
        {filtered.map(problem => (
          <article key={problem.id} className="problem-card" role="listitem">
            <div className="card-top-bar">
              <span className="problem-code-badge">{problem.horrorCode}</span>
              <span className={`severity-tag severity-${problem.severity.toLowerCase()}`}>
                SEVERITY: {problem.severity}
              </span>
            </div>

            <h3 className="problem-card-title">{problem.title}</h3>
            <p className="problem-card-desc">{problem.creepySubtitle}</p>

            <div className="card-meta-row">
              <span className="meta-category">📁 {problem.category}</span>
              <span className="meta-threat">THREAT: 98.4%</span>
            </div>

            <button
              onClick={() => onSelectProblem(problem)}
              className="horror-btn select-problem-btn"
            >
              SELECT THIS AFFLICTION →
            </button>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="no-problems-found">
            <span className="no-problems-icon">👁️</span>
            <p>No matching afflictions found in this sector. The void is empty.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// 10. CLEAN SOLUTION VIEW
// ============================================================
function CleanSolutionView({ problem, onReset }) {
  const { solution } = problem;
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = () => {
    const text = `PROBLEM: ${problem.title}\nROOT CAUSE: ${solution.identifiedIssue}\nSTRATEGY: ${solution.solutionSummary}\n\nSTEPS:\n${solution.stepByStep.map(s => `${s.step}. ${s.title}: ${s.instruction}`).join('\n')}\n\nIMMEDIATE ACTION: ${solution.immediateAction}\nPRO-TIP: ${solution.proTip}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    });
  };

  return (
    <div className="clean-solution-wrapper">
      <div className="clean-solution-card">
        
        <header className="clean-header">
          <div className="clean-success-pill">
            <span className="check-icon">✓</span>
            <span>DIAGNOSTIC COMPLETE // RESOLUTION UNLOCKED</span>
          </div>
          <h1 className="clean-title">{problem.title}</h1>
          <p className="clean-lead">{solution.problemStatement}</p>
        </header>

        <section className="clean-section root-cause-box">
          <h2 className="section-label">IDENTIFIED ROOT CAUSE</h2>
          <p className="root-cause-text">{solution.identifiedIssue}</p>
        </section>

        <section className="clean-section strategy-box">
          <h2 className="section-label">CORE STRATEGY</h2>
          <p className="strategy-text">{solution.solutionSummary}</p>
        </section>

        <section className="clean-section">
          <h2 className="section-label">STEP-BY-STEP ACTIONABLE BLUEPRINT</h2>
          <div className="steps-container">
            {solution.stepByStep.map(item => (
              <div key={item.step} className="step-item">
                <div className="step-number-badge">{item.step}</div>
                <div className="step-body">
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-instruction">{item.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="clean-section immediate-action-box">
          <div className="action-tag">⚡ IMMEDIATE ACTION ITEM (NEXT 10 MINUTES)</div>
          <p className="action-text">{solution.immediateAction}</p>
        </section>

        <div className="pro-tip-callout">
          <span className="tip-icon">💡</span>
          <div className="tip-content">
            <strong>Pro-Tip:</strong> {solution.proTip}
          </div>
        </div>

        {/* Copy to clipboard button with sarcastic message */}
        <div className="clipboard-section">
          <button onClick={handleCopy} className="clean-copy-btn">
            {copied ? "✓ COPIED (Along with a small piece of your soul)" : "📋 Copy Clean Blueprint to Clipboard"}
          </button>
        </div>

        {/* Feedback buttons */}
        <div className="clean-feedback-box">
          <span>Did this solution relieve your existential dread?</span>
          <div className="feedback-btns">
            <button
              onClick={() => setFeedback("Glad sanity prevailed.")}
              className={`feedback-chip ${feedback ? 'active' : ''}`}
            >
              😊 Yes, immensely
            </button>
            <button
              onClick={() => setFeedback("The void awaits your return.")}
              className={`feedback-chip ${feedback ? 'active' : ''}`}
            >
              💀 I demand more terror
            </button>
          </div>
          {feedback && <div className="feedback-reply">{feedback}</div>}
        </div>

        <footer className="clean-footer-actions">
          <button onClick={onReset} className="clean-reset-btn">
            ← Solve Another Problem (Return to Terminal)
          </button>
        </footer>

      </div>
    </div>
  );
}

// ============================================================
// 11. ESCAPE CONFIRMATION MODAL
// ============================================================
function EscapeModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="horror-modal-box">
        <h2 className="modal-title">🚪 ATTEMPTING TO ESCAPE?</h2>
        <p className="modal-lead">
          Are you sure you wish to abandon this diagnostic terminal?
        </p>
        <p className="modal-warning">
          Unsolved dilemmas do not disappear when you turn your back on them. They fester silently in git branches and background cortisol levels.
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="horror-btn btn-danger">
            STAY AND CONFRONT IT
          </button>
          <button onClick={onConfirm} className="horror-btn btn-secondary">
            YES, LET ME OUT
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 12. MAIN APP ORCHESTRATOR
// ============================================================
function App() {
  const [view, setView] = useState('selection');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [confirmationStage, setConfirmationStage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All Sins");
  const [searchQuery, setSearchQuery] = useState("");
  const [audioMuted, setAudioMuted] = useState(false);
  const [escapeModalOpen, setEscapeModalOpen] = useState(false);
  const [stabilityJitter, setStabilityJitter] = useState(37);
  const [forbiddenCount, setForbiddenCount] = useState(0);
  const [forbiddenGlitchActive, setForbiddenGlitchActive] = useState(false);
  const [ominousIndex, setOminousIndex] = useState(0);
  const [cookieConsentDismissed, setCookieConsentDismissed] = useState(false);

  const ominousMessages = window.HORROR_CONFIG?.annoyance?.ominousMessages || [
    "WHY DID YOU CHOOSE THIS?",
    "THE PROBLEM HAS NOT FORGOTTEN YOU."
  ];

  const [topologyName, setTopologyName] = useState("EUCLIDEAN (FLAT)");

  // Listen to spatial alignment scrambles
  useEffect(() => {
    const handleAlignment = (e) => {
      if (e.detail?.topologyName) {
        setTopologyName(e.detail.topologyName);
      }
    };
    window.addEventListener('alignment-scrambled', handleAlignment);
    return () => window.removeEventListener('alignment-scrambled', handleAlignment);
  }, []);

  // Random stability fluctuation every few seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const delta = Math.floor(Math.random() * 7) - 3;
      setStabilityJitter(prev => Math.min(48, Math.max(14, prev + delta)));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Cycle ominous messages
  useEffect(() => {
    const timer = setInterval(() => {
      setOminousIndex(prev => (prev + 1) % ominousMessages.length);
    }, window.HORROR_CONFIG?.annoyance?.randomGlitchIntervalMs || 6000);
    return () => clearInterval(timer);
  }, [ominousMessages.length]);

  const handleToggleAudio = () => {
    const unmuted = window.HorrorAudio?.toggleMute();
    setAudioMuted(!unmuted);
  };

  const handleDoNotPress = () => {
    window.HorrorAudio?.playForbiddenBoing();
    setForbiddenCount(prev => prev + 1);
    setForbiddenGlitchActive(true);

    const funnyToasts = [
      "⚠️ YOU PRESSED IT. ABSOLUTELY NOTHING HAPPENED.",
      "⚠️ SYSTEM ANOMALY: A rubber duck has entered the cooling manifold.",
      "⚠️ WARNING: Curiosity is the #1 cause of unhandled promise rejections.",
      "⚠️ CONGRATULATIONS: You broke the sacred rule. Enjoy the brief color inversion."
    ];
    alert(funnyToasts[forbiddenCount % funnyToasts.length]);

    setTimeout(() => {
      setForbiddenGlitchActive(false);
    }, 600);
  };

  const handleSelectProblem = (problem) => {
    window.HorrorAudio?.playClickThud();
    setSelectedProblem(problem);
    setConfirmationStage(1);
    setView('confirming');
  };

  const handleNextConfirmation = () => {
    if (confirmationStage < (window.HORROR_CONFIG?.annoyance?.confirmationStages || 4)) {
      setConfirmationStage(prev => prev + 1);
    } else {
      setView('analyzing');
    }
  };

  const handleCancelConfirmation = () => {
    window.HorrorAudio?.playHoverGlitch();
    setSelectedProblem(null);
    setConfirmationStage(1);
    setView('selection');
  };

  const handleAnalysisComplete = () => {
    window.HorrorAligner?.resetAlignment();
    setView('solution');
  };

  const handleReset = () => {
    window.HorrorAudio?.playClickThud();
    window.HorrorAligner?.scrambleAlignment();
    setSelectedProblem(null);
    setConfirmationStage(1);
    setView('selection');
  };

  return (
    <div className={`terminal-root ${forbiddenGlitchActive ? 'invert-glitch' : ''} view-${view}`}>
      {view !== 'solution' && (
        <HorrorScreenEffects ominousMessage={ominousMessages[ominousIndex]} />
      )}

      {view !== 'solution' && (
        <TerminalStatusBar
          onEscapeClick={() => setEscapeModalOpen(true)}
          onDoNotPress={handleDoNotPress}
          stabilityJitter={stabilityJitter}
          audioMuted={audioMuted}
          onToggleAudio={handleToggleAudio}
          topologyName={topologyName}
        />
      )}

      {/* Mandatory Void Cookie Consent Banner */}
      {!cookieConsentDismissed && view !== 'solution' && (
        <VoidCookieBanner onDismiss={() => setCookieConsentDismissed(true)} />
      )}

      <main className="main-viewport">
        {view === 'selection' && (
          <ProblemSelector
            onSelectProblem={handleSelectProblem}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {view === 'confirming' && (
          <ConfirmationGauntlet
            problem={selectedProblem}
            stage={confirmationStage}
            onNextStage={handleNextConfirmation}
            onCancel={handleCancelConfirmation}
          />
        )}

        {view === 'analyzing' && (
          <HorrorAnalysisSequence
            problem={selectedProblem}
            onComplete={handleAnalysisComplete}
          />
        )}

        {view === 'solution' && selectedProblem && (
          <CleanSolutionView
            problem={selectedProblem}
            onReset={handleReset}
          />
        )}
      </main>

      {escapeModalOpen && (
        <EscapeModal
          onConfirm={() => {
            setEscapeModalOpen(false);
            handleReset();
          }}
          onCancel={() => setEscapeModalOpen(false)}
        />
      )}
    </div>
  );
}

// Render React App
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}
