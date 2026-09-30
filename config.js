/**
 * CONFIGURATION & PROBLEM DATABASE
 * Centralized settings for horror effects, frustration UX, and genuinely useful solutions.
 */

window.HORROR_CONFIG = {
  // Annoying & Frustration UX settings (fully customizable)
  annoyance: {
    buttonEvasionEnabled: true,
    buttonEvasionMaxDodges: 3,        // Dodges up to 3 times
    buttonEvasionDistance: 55,        // Pixels to jump away
    confirmationStages: 4,            // 4-step confirmation gauntlet (includes Hold to Confirm & Captcha)
    holdDurationMs: 1800,             // Must hold button for 1.8 seconds to confirm
    analysisDurationMs: 6500,         // Duration of exaggerated horror analysis
    flickerIntensity: 'medium',       // 'low', 'medium', 'high', 'off'
    randomGlitchIntervalMs: 6000,     // Frequency of random harmless text glitches
    enableCreepyHoverSounds: true,
    enableGhostCursor: true,          // Ghost crosshair follower
    showOvercomplicatedSelector: true,// Multi-layer category tree & misery slider
    cookieConsentEnabled: true,       // Giant annoying void cookie banner
    curseCookies: [
      { id: "c1", label: "Track tears shed per Git conflict", required: true },
      { id: "c2", label: "Record involuntary desk banging velocity", required: true },
      { id: "c3", label: "Broadcast sigh frequencies to subterranean void", required: true },
      { id: "c4", label: "Transmit memory leak coordinates to alien observers", required: true }
    ],
    continueButtonFateTexts: [
      "PROCEED (PERHAPS)",
      "I ACCEPT MY FATE",
      "ENTER THE ABYSS",
      "SUBMIT TO ENTROPY",
      "CONFIRM QUESTIONABLE CHOICE",
      "DO NOT LOOK BACK"
    ],
    ominousMessages: [
      "WHY DID YOU CHOOSE THIS?",
      "THE PROBLEM HAS NOT FORGOTTEN YOU.",
      "ANALYZING YOUR SINS...",
      "DO NOT CLOSE THIS WINDOW.",
      "YOUR HESITATION HAS BEEN NOTED.",
      "THE REPOSITORY OF GRIEF EXPANDS.",
      "SANITY BUFFER DEPRECATING...",
      "SYSTEM RUNNING ON FORGOTTEN PROTOCOLS.",
      "1 UNKNOWN SPECTER IS CURRENTLY VIEWING YOUR SCREEN.",
      "RECALIBRATING PARANOIA SENSORS...",
      "WARNING: LOGICAL CERTAINTY DROPPING BELOW 14%."
    ]
  },

  // Initial terminal status indicators
  statusIndicators: {
    sessionStability: "37% (CRITICAL)",
    hopeLevel: "LOW",
    solutionIntegrity: "QUESTIONABLE",
    ominousPresence: "DETECTED",
    sanityBuffer: "12.4%",
    terminalId: "TERM-0x7F-VOID"
  },

  // Realistic problems with GENUINELY USEFUL, high-value solutions
  problems: [
    {
      id: "prob-react-leak",
      category: "Software & Architecture",
      horrorCode: "ERR_HEAP_EXHAUSTION_0xDEAD",
      title: "Client-Side Memory Leak & Sluggish UI",
      creepySubtitle: "The application devours RAM until the browser collapses into silence.",
      severity: "CRITICAL",
      solution: {
        problemStatement: "The web application progressively degrades in performance and browser tabs crash with 'Out of Memory' after 15–20 minutes of active use.",
        identifiedIssue: "Uncleaned event listeners, uncleared `setInterval` timers, and lingering detached DOM references held inside closures or global event buses (e.g., subscribing to window resize or WebSocket streams inside React `useEffect` without returning cleanup functions).",
        solutionSummary: "Systematically profile memory snapshots using Chrome DevTools Heap Allocator, audit component unmount hooks for proper cleanup return handlers, and eliminate unbounded in-memory caches.",
        stepByStep: [
          {
            step: 1,
            title: "Capture Heap Snapshots",
            instruction: "Open Chrome DevTools → Memory Tab. Take 'Snapshot 1' immediately upon loading. Perform user interactions for 3 minutes, return to the initial screen, and take 'Snapshot 2'. Filter by 'Objects allocated between Snapshot 1 and 2' and sort by Retained Size."
          },
          {
            step: 2,
            title: "Inspect Detached DOM Trees",
            instruction: "Search for 'Detached HTMLElement' in the Class Filter. Expand the retainer tree to pinpoint which JavaScript closure or React Fiber ref is holding onto unmounted DOM elements."
          },
          {
            step: 3,
            title: "Enforce Lifecycle Cleanup Handlers",
            instruction: "Verify every `useEffect` or subscription pattern returns a cleanup function: `useEffect(() => { const handler = () => {}; window.addEventListener('resize', handler); return () => window.removeEventListener('resize', handler); }, []);`."
          },
          {
            step: 4,
            title: "Guard Global Observables & Event Busses",
            instruction: "If using RxJS, EventEmitter, or WebSocket subscribers, ensure you pipe through `takeUntil(destroy$)` or call `.unsubscribe()` in componentWillUnmount / React cleanup."
          },
          {
            step: 5,
            title: "Implement WeakRef & Bounded Caches",
            instruction: "Replace unbounded plain object caches (`const cache = {}`) with `Map` having an explicit LRU eviction ceiling or use `WeakMap`/`WeakSet` where keys can be garbage-collected automatically."
          }
        ],
        immediateAction: "Open your project's main components and search for `addEventListener` or `setInterval` across the codebase; verify every single occurrence has a matching removal in its cleanup hook.",
        proTip: "In React 18 Strict Mode, components mount twice in development specifically to help you identify missing cleanup functions immediately."
      }
    },
    {
      id: "prob-procrastination-dread",
      category: "Focus & Executive Function",
      horrorCode: "ERR_VOLITION_PARALYSIS_0x00",
      title: "Paralyzing Procrastination & Deadline Dread",
      creepySubtitle: "Mountains of urgent tasks loom in the dark, yet your hands refuse to move.",
      severity: "HAUNTING",
      solution: {
        problemStatement: "You have critical deadlines approaching, but feelings of overwhelm, perfectionism, and anxiety trigger involuntary avoidance, scrolling, and paralyzing guilt.",
        identifiedIssue: "Procrastination is an emotional regulation problem, not a time-management flaw. The brain perceives the task as an emotional threat (fear of failure, ambiguity, or fatigue), triggering the amygdala to seek short-term mood repair through avoidance.",
        solutionSummary: "Lower the activation energy below the threshold of emotional resistance using the 'Micro-Entry Protocol' and radical scoping reduction.",
        stepByStep: [
          {
            step: 1,
            title: "Decouple Worth from the Outcome",
            instruction: "Give yourself explicit permission to write garbage or create an intentionally flawed first draft. A terrible draft can be edited; an unwritten masterpiece remains imaginary."
          },
          {
            step: 2,
            title: "The 2-Minute Micro-Step",
            instruction: "Reduce the task size until resistance vanishes. If 'Write the quarterly proposal' triggers dread, reduce it to: 'Open a blank Google Doc and type the title.' You are only committed to 120 seconds."
          },
          {
            step: 3,
            title: "Externalize Working Memory",
            instruction: "Take a physical blank piece of paper. Write down the single next physical action (e.g., 'Open file userController.ts line 42'). Do not write 'Finish authentication module'."
          },
          {
            step: 4,
            title: "Establish a Sensory Boundary",
            instruction: "Put phone in another room or out of arm's reach. Put on brown noise or binaural beats (40Hz). Set a physical kitchen timer for 15 minutes."
          },
          {
            step: 5,
            title: "Celebrate Completion of Friction",
            instruction: "Acknowledge that starting was the hardest part. Once working memory is loaded, momentum (the Zeigarnik effect) naturally carries you through the next 25 minutes."
          }
        ],
        immediateAction: "Close all browser tabs except one. Pick the scariest task, shrink it to a 2-minute non-threatening micro-action, and set a timer right now.",
        proTip: "Never schedule 'Work on Project X' on your calendar. Always schedule a verb + noun + tiny scope: 'Draft 3 bullet points for section 2'."
      }
    },
    {
      id: "prob-database-slow",
      category: "Software & Architecture",
      horrorCode: "ERR_QUERY_ABYSS_0x99",
      title: "Database Query Spikes & 100% CPU Lockup",
      creepySubtitle: "The relational engine groans beneath sequential scans into infinite dark tables.",
      severity: "CRITICAL",
      solution: {
        problemStatement: "Database response times have jumped from 35ms to 12+ seconds during peak traffic hours, causing connection pool exhaustion and 504 Gateway Timeouts.",
        identifiedIssue: "Missing indexes on foreign keys and frequently filtered columns (`WHERE`, `ORDER BY`), compounded by ORM-generated N+1 queries executing thousands of roundtrips inside loops.",
        solutionSummary: "Capture slow query logs with `EXPLAIN ANALYZE`, add composite B-Tree indexes for active filter paths, and batch queries using `IN (...)` or `JOIN` eager-loading.",
        stepByStep: [
          {
            step: 1,
            title: "Enable & Inspect Slow Query Logs",
            instruction: "Check `pg_stat_statements` (PostgreSQL) or `slow_query_log` (MySQL). Sort queries by total execution time (`total_exec_time` / `calls`) to identify the top 3 culprits."
          },
          {
            step: 2,
            title: "Run EXPLAIN ANALYZE on Heavy Queries",
            instruction: "Run `EXPLAIN (ANALYZE, BUFFERS) SELECT ...`. Look for `Seq Scan` (Sequential Table Scan) across tables with > 50,000 rows. Note where the execution time diverges from the query plan."
          },
          {
            step: 3,
            title: "Create Targeted Covering Indexes",
            instruction: "Add an index matching your filter and sort columns in order: `CREATE INDEX CONCURRENTLY idx_users_org_created ON users (org_id, created_at DESC);` Always use CONCURRENTLY in production to avoid locking tables."
          },
          {
            step: 4,
            title: "Eradicate N+1 Query Loops",
            instruction: "If using Prisma, TypeORM, Hibernate, or Django ORM: look for `.findMany()` inside loops. Replace with eager joins (`include: { relations }`) or batch loaders (`DataLoader`)."
          },
          {
            step: 5,
            title: "Tune Connection Pool Boundaries",
            instruction: "Ensure your application connection pool size is capped at `(CPU_CORES * 2) + DISK_CHANNELS` (typically 10-25 per instance) rather than unlimited, preventing server thrashing."
          }
        ],
        immediateAction: "Log into your database metrics dashboard, copy the #1 slowest query, run `EXPLAIN ANALYZE`, and check if it is executing a full table scan.",
        proTip: "Indexing every column is as damaging as indexing none. Every index adds write overhead to `INSERT` and `UPDATE` operations."
      }
    },
    {
      id: "prob-burnout-exhaustion",
      category: "Wellbeing & Career",
      horrorCode: "ERR_SOUL_CORROSION_0x33",
      title: "Severe Burnout, Cynicism & Cognitive Drain",
      creepySubtitle: "The digital fire is extinguished. Every keystroke feels like lifting obsidian stones.",
      severity: "HAUNTING",
      solution: {
        problemStatement: "You wake up feeling chronic fatigue, emotional detachment from your work, intense cynicism toward management/colleagues, and severe brain fog.",
        identifiedIssue: "Chronic nervous system dysregulation caused by sustained cortisol elevation with zero recovery periods, compounded by lack of agency, unaligned values, and blurred work/rest boundaries.",
        solutionSummary: "Institute strict energetic triage: disconnect completely from after-hours communication, radically downscale daily output to minimum viable competence, and rebuild non-screen dopamine pathways.",
        stepByStep: [
          {
            step: 1,
            title: "Acknowledge Burnout as a Neurobiological Condition",
            instruction: "Stop treating burnout as laziness or lack of willpower. Your nervous system is in a freeze response to protect you from sustained chronic threat."
          },
          {
            step: 2,
            title: "Enforce Immediate Digital Sunset",
            instruction: "Remove Slack/Teams and work email from your personal mobile device immediately. Set a recurring hard stop time each evening and physically close the laptop lid."
          },
          {
            step: 3,
            title: "Practice Minimum Viable Professionalism (MVP)",
            instruction: "For the next 14 days, deliver exactly what is required to maintain operational stability—no volunteer tasks, no perfectionist refactoring, no overtime heroism."
          },
          {
            step: 4,
            title: "Reactivate Parasympathetic Recovery",
            instruction: "Engage in non-cognitive physical recovery: 20-minute outdoor walks without headphones, sauna/hot baths, progressive muscle relaxation, or somatic stretching."
          },
          {
            step: 5,
            title: "Audit Autonomy and Chronic Stressors",
            instruction: "Identify the top 2 stressors you lack control over (e.g. erratic client demands, micromanager). Schedule a candid realignment conversation or formulate a 60-day transition exit strategy."
          }
        ],
        immediateAction: "Delete work messaging apps from your phone right now. Set your status to 'Offline at 5:00 PM' and decline non-essential meetings for tomorrow.",
        proTip: "Rest is not a reward you earn after working; it is a biological prerequisite for functioning."
      }
    },
    {
      id: "prob-team-conflict",
      category: "Team & Communication",
      horrorCode: "ERR_TRUST_PARTITION_0x11",
      title: "Hostile Code Reviews & Siloed Communication",
      creepySubtitle: "Shadows whisper in pull request comments. Trust has rotted into territorial warfare.",
      severity: "MODERATE",
      solution: {
        problemStatement: "Code reviews take days, comments are pedantic or passive-aggressive, developers dread submitting PRs, and cross-team knowledge sharing has completely halted.",
        identifiedIssue: "Absence of psychological safety combined with undefined, subjective coding standards and using asynchronous pull request comments as an adversarial debate forum.",
        solutionSummary: "Automate code style enforcement through linters/formatters, establish a 10-minute synchronous resolution rule, and adopt constructive PR commenting conventions.",
        stepByStep: [
          {
            step: 1,
            title: "Automate All Mechanical Arguments",
            instruction: "Never debate formatting, spacing, imports, or naming nitpicks in human reviews. Enforce Prettier, ESLint, and CI checks with zero tolerance. If a linter didn't flag it, it's not a blocking issue."
          },
          {
            step: 2,
            title: "Adopt the Conventional Comments Standard",
            instruction: "Require labels on all review comments: `praise:`, `nitpick: (non-blocking)`, `suggestion:`, `question:`, or `issue: (blocking)`. This removes emotional ambiguity."
          },
          {
            step: 3,
            title: "The 3-Comment Synchronous Pivot Rule",
            instruction: "If a specific pull request comment thread exceeds 3 back-and-forth replies without consensus, mandatory rule: jump on a 5-minute video or voice call to resolve, then post a 1-sentence summary."
          },
          {
            step: 4,
            title: "Keep Pull Requests Under 250 Lines",
            instruction: "Cognitive load spikes above 200 lines. Reviewers become exhausted and irritable. Break epics into stacked, reviewable feature-flagged micro-PRs."
          },
          {
            step: 5,
            title: "Lead with Genuine Curiosity and Appreciation",
            instruction: "Frame critiques as collaborative questions ('What do you think about using a hash map here to avoid O(n²)?') rather than declarations ('This is wrong and slow')."
          }
        ],
        immediateAction: "Draft a team agreement: install a linter rule in CI today and pledge to label non-blocking suggestions with `[nitpick]` starting immediately.",
        proTip: "High-performing engineering teams review code for architectural correctness, security, and test coverage—not stylistic preferences."
      }
    },
    {
      id: "prob-git-merge-nightmare",
      category: "Software & Architecture",
      horrorCode: "ERR_DIVERGENT_TREE_0x44",
      title: "Catastrophic Git Merge Conflict & Entangled History",
      creepySubtitle: "Two branches grew in darkness for months. Merging them summons an ancient beast.",
      severity: "CRITICAL",
      solution: {
        problemStatement: "Your feature branch has diverged 140+ commits from `main`, and attempting a merge or rebase yields conflicts across 45 files with missing context.",
        identifiedIssue: "Long-lived feature branches, concurrent refactoring across multiple team members, and lack of continuous integration rebase discipline.",
        solutionSummary: "Perform an isolated interactive rebase using `git rebase -i --onto` or generate a clean patch branch, resolving conflicts in chronological batches with visual diff tools.",
        stepByStep: [
          {
            step: 1,
            title: "Create a Safety Anchor Branch First",
            instruction: "Never rebase without an immutable backup branch: `git branch backup-feature-branch-safety`. If anything goes wrong, you can `git reset --hard backup-feature-branch-safety` instantly."
          },
          {
            step: 2,
            title: "Configure Better Conflict Diff Markers",
            instruction: "Run `git config --global merge.conflictstyle zdiff3`. This displays the common ancestor base code in addition to 'ours' and 'theirs', making the original author's intent crystal clear."
          },
          {
            step: 3,
            title: "Rebase Incrementally or Use Rebase -i",
            instruction: "Rather than doing `git merge main` all at once, fetch and rebase in smaller commit windows: `git fetch origin && git rebase origin/main`. If too entangled, squash your feature into logical chunks first."
          },
          {
            step: 4,
            title: "Leverage git rerere (Reuse Recorded Resolution)",
            instruction: "Run `git config --global rerere.enabled true`. Git will memorize how you resolved a specific conflict, so if you have to abort and re-run, Git resolves identical conflicts automatically."
          },
          {
            step: 5,
            title: "The Nuclear Alternative: Patch Over Clean Base",
            instruction: "If rebase loop is endless: create a fresh branch from `origin/main`, run `git diff origin/main..my-feature-branch > feature.patch`, and apply changes cleanly file-by-file or via `git checkout my-feature-branch -- path/to/isolated-feature`."
          }
        ],
        immediateAction: "Run `git branch safe-backup-$(date +%s)` right now before touching another git command so your work is 100% safeguarded.",
        proTip: "Prevent this permanently by practicing Trunk-Based Development with feature toggles, keeping branch lifetimes under 48 hours."
      }
    }
  ]
};
