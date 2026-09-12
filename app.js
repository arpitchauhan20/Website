// =====================================================
// TEACHTRACK — Application Core
// Plan. Teach. Record. Track.
// =====================================================

// =====================================================
// State Management
// =====================================================
const AppState = {
  currentPage: 'login',
  isAuthenticated: false,
  sidebarCollapsed: false,
  showDashboardGreeting: false,
  greetingAnimationDone: false,
  searchOpen: false,
  activeModal: null,
  activeTab: {},
  filters: {},

  // New state variables
  currentMood: 8,
  selectedMoodQuote: null,
  studentSortBy: 'rollNo', // 'rollNo' or 'name'
  studentSortOrder: 'asc',
  activeStudentId: 's1',
  calendarYear: 2026,
  calendarMonth: 7, // August (0-indexed)
  selectedCalendarDate: '2026-08-19',
  materialsActiveTab: 'resources', // 'resources' or 'lesson-records'
  safeUnlocked: true,

  sidebarWidth: 260,

  init() {
    this.isAuthenticated = false;
    const saved = localStorage.getItem('teachtrack_auth');
    if (saved === 'true') {
      this.isAuthenticated = true;
      this.currentPage = 'dashboard';
      this.greetingAnimationDone = true;
    } else {
      this.isAuthenticated = false;
      this.currentPage = 'login';
    }
    this.speedometerSwept = false;
    const sidebar = localStorage.getItem('teachtrack_sidebar');
    if (sidebar === 'collapsed') this.sidebarCollapsed = true;

    const savedWidth = localStorage.getItem('teachtrack_sidebar_width');
    if (savedWidth) {
      const w = parseInt(savedWidth);
      if (w >= 72 && w <= 480) {
        this.sidebarWidth = w;
        document.documentElement.style.setProperty('--sidebar-current-width', `${w}px`);
      }
    }
  },

  login() {
    this.isAuthenticated = true;
    localStorage.setItem('teachtrack_auth', 'true');
    this.currentPage = 'dashboard';
    this.showDashboardGreeting = true;
    this.greetingAnimationDone = false;
    this.speedometerSwept = false;
    closeModal();
    renderApp();
    // Trigger greeting animation after DOM render
    requestAnimationFrame(() => {
      setTimeout(() => startDashboardGreetingAnimation(), 60);
    });
  },

  logout() {
    closeModal();
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.querySelectorAll('.dashboard-greeting-overlay').forEach(el => el.remove());
    const tooltip = document.getElementById('global-floating-tooltip');
    if (tooltip) tooltip.classList.remove('visible');
    this.isAuthenticated = false;
    localStorage.removeItem('teachtrack_auth');
    this.currentPage = 'login';
    this.showDashboardGreeting = false;
    this.greetingAnimationDone = false;
    renderApp();
    showToast('Signed Out', 'You have been safely signed out.', 'info');
  },

  navigate(page, params) {
    this.currentPage = page;
    this.pageParams = params || {};
    this.closeMobileSidebar();
    renderApp();
    // Scroll to top
    const content = document.querySelector('.page-content');
    if (content) content.scrollTop = 0;
  },

  toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('mobile-open');
    if (backdrop) backdrop.classList.toggle('visible', isOpen);
  },

  closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('visible');
  },

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('teachtrack_sidebar', this.sidebarCollapsed ? 'collapsed' : 'expanded');
    const sidebar = document.querySelector('.sidebar');
    const shell = document.querySelector('.app-shell');
    if (sidebar) {
      sidebar.scrollLeft = 0;
      sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
    }
    if (shell) shell.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
    const nav = document.querySelector('.sidebar-nav');
    if (nav) nav.scrollLeft = 0;
    const roster = document.querySelector('.sidebar-student-list');
    if (roster) roster.scrollLeft = 0;

    if (this.sidebarCollapsed) {
      document.documentElement.style.setProperty('--sidebar-current-width', '72px');
    } else {
      const restoreWidth = this.sidebarWidth >= 240 ? this.sidebarWidth : 260;
      document.documentElement.style.setProperty('--sidebar-current-width', `${restoreWidth}px`);
    }

    const toggleIcons = document.querySelectorAll('.sidebar-toggle span');
    toggleIcons.forEach(icon => {
      icon.textContent = this.sidebarCollapsed ? '→' : '←';
    });
  },

  setSidebarWidth(width) {
    let effectiveWidth = width;
    let isCollapsed = false;

    // Enforce clear snapping so text is NEVER clipped
    if (width < 180) {
      effectiveWidth = 72;
      isCollapsed = true;
    } else {
      // Minimum expanded width is 240px to ensure full labels fit with zero clipping
      effectiveWidth = Math.max(240, Math.min(480, width));
      isCollapsed = false;
    }

    this.sidebarWidth = effectiveWidth;
    this.sidebarCollapsed = isCollapsed;
    localStorage.setItem('teachtrack_sidebar_width', effectiveWidth.toString());
    localStorage.setItem('teachtrack_sidebar', isCollapsed ? 'collapsed' : 'expanded');
    document.documentElement.style.setProperty('--sidebar-current-width', `${effectiveWidth}px`);

    const sidebar = document.querySelector('.sidebar');
    const shell = document.querySelector('.app-shell');

    if (sidebar) {
      sidebar.scrollLeft = 0;
      sidebar.classList.toggle('collapsed', isCollapsed);
    }
    if (shell) shell.classList.toggle('sidebar-collapsed', isCollapsed);
    const nav = document.querySelector('.sidebar-nav');
    if (nav) nav.scrollLeft = 0;
    const roster = document.querySelector('.sidebar-student-list');
    if (roster) roster.scrollLeft = 0;

    const toggleIcons = document.querySelectorAll('.sidebar-toggle span');
    toggleIcons.forEach(icon => {
      icon.textContent = isCollapsed ? '→' : '←';
    });
  }
};

// =====================================================
// Toast System
// =====================================================
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon ${type}">${icons[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// =====================================================
// Modal System
// =====================================================
function showModal(content, size = '') {
  const existing = document.querySelector('.modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<div class="modal ${size}">${content}</div>`;
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.body.appendChild(backdrop);

  // Close on escape
  const handler = (e) => {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', handler); }
  };
  document.addEventListener('keydown', handler);
}

function closeModal() {
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(b => b.remove());
}

// =====================================================
// Render Engine
// =====================================================
// Speedometer Mood & Pedagogical Energy Engine
// =====================================================
function getMoodZone(score) {
  if (score <= 3) return 'zone-recharge';
  if (score <= 6) return 'zone-steady';
  if (score <= 8) return 'zone-energized';
  return 'zone-peak';
}

function getMoodZoneLabel(score) {
  if (score <= 3) return 'Restorative / Gentle Pace';
  if (score <= 6) return 'Steady & Grounded';
  if (score <= 8) return 'Energized & Inspired';
  return 'Peak Creative Flow';
}

function getMoodLabel(score) {
  return getMoodZoneLabel(score);
}

function getQuoteForMood(rating) {
  if (!MOCK_DATA.moodQuotes || !MOCK_DATA.moodQuotes.length) {
    return {
      quote: "Words have the power to create light in unexpected places. Take this day one steady sentence at a time.",
      author: "Emily Dickinson",
      zoneLabel: "Steady & Grounded"
    };
  }
  const matching = MOCK_DATA.moodQuotes.filter(q => q.min <= rating && q.max >= rating);
  if (matching.length) {
    return matching[Math.floor(Math.random() * matching.length)];
  }
  return MOCK_DATA.moodQuotes[0];
}

function selectMood(score) {
  AppState.currentMood = score;
  AppState.selectedMoodQuote = getQuoteForMood(score);
  
function updateSpeedoZoneDOM(zoneEl, txtEl, score) {
  if (zoneEl) {
    zoneEl.className = `speedo-zone-pill ${getMoodZone(score)}`;
  }
  if (txtEl) {
    txtEl.textContent = getMoodLabel(score);
  }
}

function updateDashboardReflectionQuote(score) {
  const quote = getQuoteForMood(score);
  const quoteCard = document.querySelector('.speedo-quote-card');
  if (quoteCard) {
    quoteCard.className = `speedo-quote-card ${getMoodZone(score)}`;
    const badge = quoteCard.querySelector('.speedo-quote-badge');
    if (badge) badge.textContent = quote.zoneLabel || getMoodLabel(score);
    const body = quoteCard.querySelector('.speedo-quote-body');
    if (body) body.textContent = `"${quote.quote}"`;
    const author = quoteCard.querySelector('.speedo-quote-author');
    if (author) author.textContent = `— ${quote.author}`;
  }
}

function getScoreFromEvent(e, svgEl) {
  const rect = svgEl.getBoundingClientRect();
  const svgX = ((e.clientX - rect.left) / rect.width) * 340;
  const svgY = ((e.clientY - rect.top) / rect.height) * 190;
  const dx = svgX - 170;
  const dy = svgY - 152;
  
  let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (deg > 180) deg -= 360;
  if (deg < -180) deg += 360;

  // Clamp angle to -75deg (score 1) .. +75deg (score 10)
  const clampedDeg = Math.max(-75, Math.min(75, deg));
  const rawScore = 1 + (clampedDeg - (-75)) * (9 / 150);
  const score = Math.max(1, Math.min(10, Math.round(rawScore)));
  return { score, deg: clampedDeg };
}

function runSpeedometerSweepAnimation(containerId = 'speedometer-widget-main') {
  const widget = document.getElementById(containerId);
  if (!widget) return;
  const needle = document.getElementById(`${containerId}-needle`);
  const valDisplay = document.getElementById(`${containerId}-val`);
  const zoneDisplay = document.getElementById(`${containerId}-zone`);
  const zoneTxt = document.getElementById(`${containerId}-zonetxt`);
  if (!needle) return;

  AppState.speedometerSwept = true;

  // Phase 0: Start needle at 1 (-75deg)
  needle.style.transition = 'none';
  needle.style.transform = 'rotate(-75deg)';
  if (valDisplay) valDisplay.textContent = '1';
  updateSpeedoZoneDOM(zoneDisplay, zoneTxt, 1);

  // Phase 1: Smooth, rapid power sweep to 10 (+75deg) over 850ms
  requestAnimationFrame(() => {
    setTimeout(() => {
      needle.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1.1)';
      needle.style.transform = 'rotate(75deg)';
      
      let startTime = performance.now();
      function countUp(now) {
        let progress = Math.min(1, (now - startTime) / 850);
        let s = Math.min(10, Math.max(1, Math.round(1 + progress * 9)));
        if (valDisplay) valDisplay.textContent = s;
        updateSpeedoZoneDOM(zoneDisplay, zoneTxt, s);
        if (progress < 1) requestAnimationFrame(countUp);
      }
      requestAnimationFrame(countUp);

      // Phase 2: Pause at 10, then smoothly sweep back to 5 (0deg) over 750ms
      setTimeout(() => {
        needle.style.transition = 'transform 0.75s cubic-bezier(0.34, 1.3, 0.64, 1)';
        needle.style.transform = 'rotate(0deg)'; // 0deg corresponds to score 5

        let startBackTime = performance.now();
        function countDown(now) {
          let progress = Math.min(1, (now - startBackTime) / 750);
          let s = Math.round(10 - progress * 5); // 10 -> 5
          if (valDisplay) valDisplay.textContent = s;
          updateSpeedoZoneDOM(zoneDisplay, zoneTxt, s);
          if (progress < 1) {
            requestAnimationFrame(countDown);
          } else {
            AppState.currentMood = 5;
            AppState.selectedMoodQuote = getQuoteForMood(5);
            updateDashboardReflectionQuote(5);

            // Highlight 5 as active tick
            widget.querySelectorAll('.speedo-tick, .speedo-number').forEach(el => {
              const num = parseInt(el.getAttribute('data-tick'));
              if (num === 5) el.classList.add('active');
              else el.classList.remove('active');
            });
          }
        }
        requestAnimationFrame(countDown);
      }, 1050);
    }, 150);
  });
}

function initSpeedometerInteractivity(containerId = 'speedometer-widget-main') {
  const widget = document.getElementById(containerId);
  if (!widget) return;
  const svg = document.getElementById(`${containerId}-svg`);
  const needle = document.getElementById(`${containerId}-needle`);
  const valDisplay = document.getElementById(`${containerId}-val`);
  const zoneDisplay = document.getElementById(`${containerId}-zone`);
  const zoneTxt = document.getElementById(`${containerId}-zonetxt`);
  if (!svg || !needle) return;

  // Run startup sweep if first time on dashboard after login
  if (!AppState.speedometerSwept && containerId === 'speedometer-widget-main') {
    runSpeedometerSweepAnimation(containerId);
  }

  let isDragging = false;

  function updateGaugeVisuals(e, isLiveDrag) {
    const { score, deg } = getScoreFromEvent(e, svg);
    needle.style.transition = isLiveDrag ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1)';
    needle.style.transform = `rotate(${deg}deg)`;
    if (valDisplay) valDisplay.textContent = score;
    updateSpeedoZoneDOM(zoneDisplay, zoneTxt, score);

    widget.querySelectorAll('.speedo-tick, .speedo-number').forEach(el => {
      const s = parseInt(el.getAttribute('data-tick'));
      if (s === score) el.classList.add('active');
      else el.classList.remove('active');
    });

    return score;
  }

  svg.style.cursor = 'grab';
  svg.style.touchAction = 'none';

  svg.addEventListener('pointerdown', (e) => {
    isDragging = true;
    svg.style.cursor = 'grabbing';
    svg.setPointerCapture(e.pointerId);
    updateGaugeVisuals(e, true);
    e.preventDefault();
  });

  svg.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateGaugeVisuals(e, true);
    e.preventDefault();
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    svg.style.cursor = 'grab';
    const score = updateGaugeVisuals(e, false);
    
    // Snap needle to discrete integer score angle
    const snapAngle = -75 + (score - 1) * (150 / 9);
    needle.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.35, 0.64, 1)';
    needle.style.transform = `rotate(${snapAngle}deg)`;

    AppState.currentMood = score;
    AppState.selectedMoodQuote = getQuoteForMood(score);
    updateDashboardReflectionQuote(score);

    // Update weekly arc bar highlight for today
    const todayBar = document.querySelector('.weekly-arc-col.active-today');
    if (todayBar) {
      const bar = todayBar.querySelector('.weekly-arc-bar');
      const scoreEl = todayBar.querySelector('.weekly-arc-score');
      if (bar) {
        bar.className = `weekly-arc-bar ${getMoodZone(score)}`;
        bar.style.height = `${Math.round((score / 10) * 100)}%`;
      }
      if (scoreEl) scoreEl.textContent = score;
    }
  }

  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
}

function renderSpeedometer(score, containerId = 'speedometer-widget-main') {
  const angle = -75 + (score - 1) * (150 / 9);
  
  // Ticks calculation around 150-degree semi-arc
  const ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => {
    const a = -75 + (s - 1) * (150 / 9);
    const rad = (a - 90) * Math.PI / 180;
    const x1 = Math.round(170 + 96 * Math.cos(rad));
    const y1 = Math.round(152 + 96 * Math.sin(rad));
    const x2 = Math.round(170 + 114 * Math.cos(rad));
    const y2 = Math.round(152 + 114 * Math.sin(rad));
    const tx = Math.round(170 + 130 * Math.cos(rad));
    const ty = Math.round(152 + 130 * Math.sin(rad));
    const isSelected = s === score;
    return `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="speedo-tick ${isSelected ? 'active' : ''}" data-tick="${s}" />
      <text x="${tx}" y="${ty + 4}" class="speedo-number ${isSelected ? 'active' : ''}" data-tick="${s}" text-anchor="middle">${s}</text>
    `;
  }).join('');

  return `
    <div class="speedometer-widget" id="${containerId}">
      <div class="speedometer-dial-container" title="Drag needle or click arc to calibrate energy">
        <svg viewBox="0 0 340 190" class="speedometer-svg" id="${containerId}-svg" aria-label="Teacher Speedometer Mood Gauge">
          <defs>
            <linearGradient id="speedoTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#DCA278" />
              <stop offset="35%" stop-color="#E8BA85" />
              <stop offset="70%" stop-color="#9EB07A" />
              <stop offset="100%" stop-color="#5B8C5A" />
            </linearGradient>
            <filter id="speedoNeedleShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.25)" />
            </filter>
          </defs>

          <!-- Outer Track Background -->
          <path d="M 58.8,181 A 115,115 0 0,1 281.2,181" class="speedo-track-bg" fill="none" stroke="rgba(220,162,120,0.18)" stroke-width="24" stroke-linecap="round" />
          
          <!-- Colored Gradient Active Arc -->
          <path d="M 58.8,181 A 115,115 0 0,1 281.2,181" class="speedo-track-active" fill="none" stroke="url(#speedoTrackGrad)" stroke-width="15" stroke-linecap="round" />

          <!-- Ticks and Numbers -->
          <g class="speedo-ticks-group">
            ${ticks}
          </g>

          <!-- Rotating Speedometer Needle (Draggable & Interactive) -->
          <g class="speedometer-needle-group" id="${containerId}-needle" style="transform: rotate(${angle}deg); transform-origin: 170px 152px;" filter="url(#speedoNeedleShadow)">
            <polygon points="166,152 174,152 171.5,42 168.5,42" fill="#2E2420" />
            <polygon points="168,62 172,62 171,36 169,36" fill="#DCA278" />
            <circle cx="170" cy="152" r="15" fill="#2E2420" />
            <circle cx="170" cy="152" r="8" fill="#FFF9E2" />
            <circle cx="170" cy="152" r="4" fill="#8D532B" />
            <!-- Drag Knob / Tip Highlight -->
            <circle cx="170" cy="38" r="5" fill="#DCA278" stroke="#FFFFFF" stroke-width="1.5" class="speedo-needle-tip-glow" />
          </g>
        </svg>
      </div>

      <!-- Center Digital Gauge Readout -->
      <div class="speedometer-digital-readout">
        <div class="speedo-score-row">
          <span class="speedo-score-number" id="${containerId}-val">${score}</span>
          <span class="speedo-score-denom">/ 10</span>
        </div>
        <div class="speedo-zone-pill ${getMoodZone(score)}" id="${containerId}-zone">
          <span class="speedo-zone-dot"></span>
          <span id="${containerId}-zonetxt">${getMoodLabel(score)}</span>
        </div>
      </div>

      <!-- Drag & Touch Guidance Indicator (No Buttons) -->
      <div class="speedo-interactive-hint">
        <span class="speedo-hint-icon">✥</span>
        <span>Drag needle or tap arc to calibrate velocity</span>
      </div>
    </div>
  `;
}

function showMoodCheckInModal() {
  if (!AppState.selectedMoodQuote) {
    AppState.selectedMoodQuote = getQuoteForMood(AppState.currentMood);
  }
  const quote = AppState.selectedMoodQuote;
  const zoneClass = getMoodZone(AppState.currentMood);

  showModal(`
    <div class="modal-header">
      <div class="flex items-center gap-2">
        <div class="brand-badge-dot"></div>
        <div>
          <h2>Teacher Mindset & Energy Velocity</h2>
          <p class="text-xs text-muted">Drag the needle or click the dial to adjust energy velocity</p>
        </div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" style="padding:var(--space-6)">
      ${renderSpeedometer(AppState.currentMood, 'speedometer-widget-modal')}

      <!-- Pedagogical Insight Card -->
      <div class="speedo-quote-card ${zoneClass}" style="margin-top:18px">
        <div class="speedo-quote-badge">${quote.zoneLabel || getMoodLabel(AppState.currentMood)}</div>
        <blockquote class="speedo-quote-body">"${quote.quote}"</blockquote>
        <div class="speedo-quote-author">— ${quote.author}</div>
      </div>
    </div>
    <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--space-3)">
      <button class="btn btn-secondary btn-sm" onclick="shuffleModalQuote()">New Reflection</button>
      <button class="btn btn-primary btn-sm" onclick="closeModal(); showToast('Velocity Saved', 'Your teaching energy has been logged!', 'success'); renderApp();">Save & Done</button>
    </div>
  `, 'md');

  // Initialize interactive drag on modal gauge
  setTimeout(() => initSpeedometerInteractivity('speedometer-widget-modal'), 50);
}

function selectModalMood(score) {
  AppState.currentMood = score;
  AppState.selectedMoodQuote = getQuoteForMood(score);
  showMoodCheckInModal();
}

function shuffleModalQuote() {
  AppState.selectedMoodQuote = getQuoteForMood(AppState.currentMood);
  showMoodCheckInModal();
}

// =====================================================
// Dashboard Greeting & Square Paper Confetti Pop
// =====================================================
function startDashboardGreetingAnimation() {
  // Clean up any existing overlay
  document.querySelectorAll('.dashboard-greeting-overlay').forEach(el => el.remove());

  // Create overlay and mount directly to document.body for unclipped viewport positioning
  const greetingOverlay = document.createElement('div');
  greetingOverlay.id = 'dashboard-greeting-overlay';
  greetingOverlay.className = 'dashboard-greeting-overlay';
  greetingOverlay.innerHTML = `
    <!-- Small Square Paper Confetti Canvas -->
    <canvas id="party-popper-canvas" class="party-popper-canvas"></canvas>

    <!-- Centered Greeting Card -->
    <div class="greeting-content">
      <div class="greeting-badge">✨ Welcome to TeachTrack</div>
      <h1 class="greeting-title">Good ${getGreeting()}, ${MOCK_DATA.user.name.split(' ')[0]}!</h1>
      <p class="greeting-subtitle">Your workspace is ready. Let's make today inspiring.</p>
    </div>
  `;
  document.body.appendChild(greetingOverlay);

  const canvas = greetingOverlay.querySelector('#party-popper-canvas');

  // Phase 1: Fade-in and launch small colorful square paper confetti pop
  requestAnimationFrame(() => {
    greetingOverlay.classList.add('animate-in');
    launchSquarePaperConfetti(canvas);
  });

  // Phase 2: Reveal mood wellness section after confetti pop
  setTimeout(() => {
    const moodSection = document.getElementById('dashboard-mood-section');
    if (moodSection) moodSection.classList.add('reveal');
  }, 2600);

  // Phase 3: Fade out greeting overlay and reveal full dashboard
  setTimeout(() => {
    greetingOverlay.classList.add('fade-out');
    const dashContent = document.getElementById('dashboard-main-content');
    if (dashContent) dashContent.classList.add('reveal');
    AppState.greetingAnimationDone = true;
    AppState.showDashboardGreeting = false;
  }, 4800);

  // Phase 4: Cleanup overlay from DOM
  setTimeout(() => {
    if (greetingOverlay.parentNode) {
      greetingOverlay.remove();
    }
  }, 5800);
}

// Clean & High-Density 60FPS Small Colorful Square Paper Confetti (Extended Duration)
function launchSquarePaperConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Vibrant, rich square paper confetti palette
  const colors = [
    '#FF3366', '#FF6B35', '#FFAA00', '#FFD700', '#FFEA00',
    '#00E676', '#00C853', '#00E5FF', '#2979FF', '#7C4DFF',
    '#E040FB', '#FF4081', '#FF1744', '#00B0FF', '#76FF03'
  ];

  const particles = [];
  const startTime = Date.now();
  const duration = 5600; // Extended to 5.6 seconds

  // Spawn a wave of small square paper pieces from exact bottom corners
  function spawnSquareWave(originX, originY, baseAngle, count, velocityMultiplier = 1) {
    for (let i = 0; i < count; i++) {
      // Wide angular splash covering full central canopy
      const angle = baseAngle + (Math.random() - 0.5) * 0.74;
      // High velocity range for tall splash height
      const speed = (Math.random() * 22 + 18) * velocityMultiplier;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 4 + 6; // 6px to 10px small square papers

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        gravity: 0.24 + Math.random() * 0.10, // Gentle float gravity
        drag: 0.976, // High air resistance for longer hang-time
        color,
        size,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.14 + 0.06,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.22,
        opacity: 1,
        fadeSpeed: Math.random() * 0.005 + 0.0025,
        scaleY: 1
      });
    }
  }

  // Wave 1: Immediate massive splash from bottom corners (0ms)
  spawnSquareWave(0, canvas.height, Math.PI * 0.28, 120, 1.25);
  spawnSquareWave(canvas.width, canvas.height, Math.PI * 0.72, 120, 1.25);

  // Wave 2: Second dense pop wave (350ms)
  setTimeout(() => {
    spawnSquareWave(0, canvas.height, Math.PI * 0.30, 85, 1.15);
    spawnSquareWave(canvas.width, canvas.height, Math.PI * 0.70, 85, 1.15);
  }, 350);

  // Wave 3: High-arc mid splash (750ms)
  setTimeout(() => {
    spawnSquareWave(0, canvas.height, Math.PI * 0.33, 75, 1.05);
    spawnSquareWave(canvas.width, canvas.height, Math.PI * 0.67, 75, 1.05);
  }, 750);

  // Wave 4: Extended celebration splash (1200ms)
  setTimeout(() => {
    spawnSquareWave(0, canvas.height, Math.PI * 0.35, 60, 0.95);
    spawnSquareWave(canvas.width, canvas.height, Math.PI * 0.65, 60, 0.95);
  }, 1200);

  // Wave 5: Final trailing shower wave (1700ms)
  setTimeout(() => {
    spawnSquareWave(0, canvas.height, Math.PI * 0.37, 50, 0.9);
    spawnSquareWave(canvas.width, canvas.height, Math.PI * 0.63, 50, 0.9);
  }, 1700);

  let animationFrameId;

  function render() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Physics integration
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;

      // 3D paper flutter & spin
      p.wobble += p.wobbleSpeed;
      p.rotation += p.rotationSpeed;
      p.scaleY = Math.cos(p.wobble);

      // Fade out gradually in the later stage of celebration
      if (elapsed > 2800) {
        p.opacity -= p.fadeSpeed;
      }

      if (p.opacity <= 0 || p.y > canvas.height + 60) {
        particles.splice(i, 1);
        continue;
      }

      // Draw small colorful square paper piece
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(1, p.scaleY);

      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

      ctx.restore();
    }

    if (elapsed < duration && particles.length > 0) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  animationFrameId = requestAnimationFrame(render);
}

function renderApp() {
  const app = document.getElementById('app');
  if (!AppState.isAuthenticated) {
    app.innerHTML = renderAuthPage();
    attachAuthEvents();
  } else {
    app.innerHTML = renderAppShell();
    attachAppEvents();
    if (AppState.currentPage === 'dashboard') {
      setTimeout(() => initSpeedometerInteractivity('speedometer-widget-main'), 60);
    }
  }
}

// =====================================================
// AUTH PAGES
// =====================================================
function renderAuthPage() {
  if (AppState.currentPage === 'signup') return renderSignup();
  if (AppState.currentPage === 'forgot-password') return renderForgotPassword();
  return renderLogin();
}

function renderLogin() {
  return `
    <div class="login-page" id="auth-page">
      <!-- Animated Peach Background Orbs -->
      <div class="login-bg-orbs">
        <div class="login-orb login-orb-1"></div>
        <div class="login-orb login-orb-2"></div>
        <div class="login-orb login-orb-3"></div>
      </div>
      
      <!-- Modern Split Card -->
      <div class="login-split-card">
        <!-- Left Hero Image Showcase (Clean, text-free) -->
        <div class="login-hero-side">
          <img src="login-hero.jpg" alt="TeachTrack Educator Workspace" class="login-hero-img" onerror="this.src='https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'">
        </div>

        <!-- Right Form Panel -->
        <div class="login-form-side">
          <div class="login-form-header">
            <div class="login-brand-badge">
              <span class="brand-badge-dot"></span>
              <span class="brand-badge-text">TeachTrack</span>
            </div>
            <h1 class="login-form-title">Welcome Back</h1>
            <p class="login-form-subtitle">Enter your credentials to access your teacher workspace.</p>
          </div>

          <div class="login-demo-pill" onclick="document.getElementById('login-email').value='ishita.sharma@school.edu';document.getElementById('login-password').value='password'" title="Click to autofill demo credentials">
            <span><strong>Quick Demo:</strong> Prof. Ishita Sharma</span>
          </div>

          <form class="login-form" id="login-form" onsubmit="event.preventDefault(); AppState.login();">
            <div class="login-field">
              <label for="login-email">Email Address</label>
              <div class="login-input-wrap">
                <input type="email" id="login-email" placeholder="ishita.sharma@school.edu" value="ishita.sharma@school.edu" required>
              </div>
            </div>
            <div class="login-field">
              <label for="login-password">Password</label>
              <div class="login-input-wrap">
                <input type="password" id="login-password" placeholder="Enter your password" value="password" required>
              </div>
            </div>
            <div class="login-options">
              <label class="login-remember"><input type="checkbox" checked> <span>Remember me</span></label>
              <a href="#" class="login-forgot" onclick="AppState.currentPage='forgot-password'; renderApp(); return false;">Forgot password?</a>
            </div>
            <button type="submit" class="login-submit-btn" id="login-submit-btn">
              <span class="login-btn-text">Sign In</span>
            </button>
          </form>
          <div class="login-footer">
            Don't have an account? <a href="#" onclick="AppState.currentPage='signup'; renderApp(); return false;">Create account</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSignup() {
  return `
    <div class="login-page" id="auth-page">
      <div class="login-bg-orbs">
        <div class="login-orb login-orb-1"></div>
        <div class="login-orb login-orb-2"></div>
        <div class="login-orb login-orb-3"></div>
      </div>
      
      <div class="login-split-card">
        <!-- Left Hero Image Showcase (Clean, text-free) -->
        <div class="login-hero-side">
          <img src="login-hero.jpg" alt="TeachTrack Educator Workspace" class="login-hero-img" onerror="this.src='https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'">
        </div>

        <!-- Right Form Panel -->
        <div class="login-form-side">
          <div class="login-form-header">
            <div class="login-brand-badge">
              <span class="brand-badge-dot"></span>
              <span class="brand-badge-text">TeachTrack</span>
            </div>
            <h1 class="login-form-title">Create Account</h1>
            <p class="login-form-subtitle">Register your educator profile in seconds.</p>
          </div>

          <form class="login-form" id="signup-form" onsubmit="event.preventDefault(); AppState.login();">
            <div class="login-field">
              <label for="signup-name">Full Name</label>
              <div class="login-input-wrap">
                <input type="text" id="signup-name" placeholder="Prof. Ishita Sharma" value="Prof. Ishita Sharma" required>
              </div>
            </div>
            <div class="login-field">
              <label for="signup-email">Email Address</label>
              <div class="login-input-wrap">
                <input type="email" id="signup-email" placeholder="teacher@school.edu" value="ishita.sharma@school.edu" required>
              </div>
            </div>
            <div class="login-field">
              <label for="signup-password">Password</label>
              <div class="login-input-wrap">
                <input type="password" id="signup-password" placeholder="Create a secure password" value="password" required>
              </div>
            </div>
            <button type="submit" class="login-submit-btn">
              <span class="login-btn-text">Create Account</span>
            </button>
          </form>
          <div class="login-footer">
            Already have an account? <a href="#" onclick="AppState.currentPage='login'; renderApp(); return false;">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderForgotPassword() {
  return `
    <div class="login-page" id="auth-page">
      <div class="login-bg-orbs">
        <div class="login-orb login-orb-1"></div>
        <div class="login-orb login-orb-2"></div>
      </div>
      
      <div class="login-split-card" id="forgot-card-wrapper">
        <div class="login-hero-side">
          <img src="login-hero.jpg" alt="TeachTrack Educator Workspace" class="login-hero-img" onerror="this.src='https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'">
        </div>

        <div class="login-form-side" id="forgot-card">
          <div class="login-form-header">
            <div class="login-brand-badge">
              <span class="brand-badge-dot"></span>
              <span class="brand-badge-text">TeachTrack</span>
            </div>
            <h1 class="login-form-title">Reset Password</h1>
            <p class="login-form-subtitle">Enter your institutional email to receive a recovery link.</p>
          </div>

          <form class="login-form" id="forgot-form" onsubmit="event.preventDefault(); handleForgotSubmit();">
            <div class="login-field">
              <label for="forgot-email">Email Address</label>
              <div class="login-input-wrap">
                <input type="email" id="forgot-email" placeholder="teacher@school.edu" value="ishita.sharma@school.edu" required>
              </div>
            </div>
            <button type="submit" class="login-submit-btn">
              <span class="login-btn-text">Send Reset Link</span>
            </button>
          </form>
          <div class="login-footer">
            Remember your password? <a href="#" onclick="AppState.currentPage='login'; renderApp(); return false;">Back to Sign In</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleForgotSubmit() {
  const card = document.getElementById('forgot-card');
  if (card) {
    card.innerHTML = `
      <div style="text-align:center;padding:30px 10px;">
        <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:#FEECD0;display:flex;align-items:center;justify-content:center;color:#DCA278;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17z"/><polyline points="3 7 12 13 21 7"/></svg>
        </div>
        <h2 style="color:var(--neutral-900);font-size:1.6rem;font-weight:800;margin-bottom:8px;">Reset Link Sent</h2>
        <p style="color:var(--neutral-600);font-size:0.95rem;margin-bottom:28px;line-height:1.6;">Check your inbox for instructions to reset your teacher credentials.</p>
        <button class="login-submit-btn" onclick="AppState.currentPage='login'; renderApp();">
          <span class="login-btn-text">Back to Sign In</span>
        </button>
      </div>
    `;
  }
}

function attachAuthEvents() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      AppState.login();
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      AppState.login();
    });
  }

  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleForgotSubmit();
    });
  }
}

// =====================================================
// APP SHELL
// =====================================================
function renderAppShell() {
  return `
    <div class="sidebar-backdrop" id="sidebar-backdrop" onclick="AppState.closeMobileSidebar()"></div>
    <div class="app-shell ${AppState.sidebarCollapsed ? 'sidebar-collapsed' : ''}">
      ${renderSidebar()}
      <div class="main-content">
        ${renderTopbar()}
        <div class="page-content animate-fade-in" id="page-content">
          ${renderCurrentPage()}
        </div>
      </div>
    </div>
    <div id="toast-container" class="toast-container"></div>
  `;
}

function renderSidebar() {
  // If we are viewing student detail, replace default sidebar navigation with student roster!
  if (AppState.currentPage === 'student-detail') {
    return renderStudentSidebar();
  }

  // Standard Main Menu items (without separate profile and without welcome mood)
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'journal', icon: '🔒', label: 'Daily Safe', badge: MOCK_DATA.teacherSafeJournal.length || null },
    { id: 'classes', icon: '🏫', label: 'Classes' },
    { id: 'students', icon: '👨‍🎓', label: 'Students & Quizzes' },
    { id: 'materials', icon: '📚', label: 'Materials & Logs' },
    { id: 'syllabus', icon: '📋', label: 'Syllabus Tracker' },
    { id: 'reports', icon: '📈', label: 'Reports' },
  ];

  return `
    <nav class="sidebar ${AppState.sidebarCollapsed ? 'collapsed' : ''}" id="sidebar">
      <!-- Drag Resize Handle -->
      <div class="sidebar-resize-handle" id="sidebar-resize-handle" title="Drag to resize sidebar width"></div>

      <div class="sidebar-brand" onclick="AppState.navigate('dashboard')" style="cursor:pointer" data-tooltip="TeachTrack Academic Workspace">
        <div class="sidebar-brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
        </div>
        <div class="sidebar-brand-text">
          <h2>TeachTrack</h2>
          <span>Academic Workspace</span>
        </div>
      </div>
      <div class="sidebar-nav">
        <div class="sidebar-nav-label">Main Menu</div>
        ${navItems.map(item => `
          <div class="sidebar-link ${AppState.currentPage === item.id ? 'active' : ''}"
               onclick="AppState.navigate('${item.id}')"
               data-tooltip="${item.label}">
            <span class="sidebar-link-icon">${item.icon}</span>
            <span class="sidebar-link-text">${item.label}</span>
            ${item.badge ? `<span class="sidebar-link-badge">${item.badge}</span>` : ''}
          </div>
        `).join('')}
      </div>
      <div class="sidebar-footer">
        <!-- Teacher Profile Section at Bottom Footer -->
        <div class="sidebar-user" title="Click to view Teacher Profile & Details" onclick="showTeacherProfileModal()" data-tooltip="${MOCK_DATA.user.name} (Faculty Profile)">
          <img src="${MOCK_DATA.user.avatarUrl}" class="sidebar-user-avatar" style="object-fit:cover;border-radius:50%" onerror="this.outerHTML='<div class=\\'sidebar-user-avatar\\'>${MOCK_DATA.user.initials}</div>'">
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${MOCK_DATA.user.name}</div>
            <div class="sidebar-user-role">${MOCK_DATA.user.role}</div>
          </div>
        </div>
        <div class="sidebar-toggle" onclick="AppState.toggleSidebar()" data-tooltip="${AppState.sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}">
          <span>${AppState.sidebarCollapsed ? '→' : '←'}</span>
        </div>
      </div>
    </nav>
  `;
}

function renderStudentSidebar() {
  const currentStudentId = AppState.pageParams?.studentId || AppState.activeStudentId || 's1';
  const sortedStudents = getSortedStudents(MOCK_DATA.students);

  return `
    <nav class="sidebar sidebar-student-mode ${AppState.sidebarCollapsed ? 'collapsed' : ''}" id="sidebar">
      <!-- Drag Resize Handle -->
      <div class="sidebar-resize-handle" id="sidebar-resize-handle" title="Drag to resize sidebar width"></div>

      <!-- Back to Default Workspace Menu Button -->
      <div class="sidebar-student-header">
        <button class="sidebar-student-back-btn" onclick="AppState.navigate('students')" title="Close and return to default navigation" data-tooltip="Back to Menu">
          <span class="back-icon">←</span>
          <span class="back-text">Back to Menu</span>
        </button>
        <input type="text" class="sidebar-student-search" placeholder="Search student..." oninput="filterSidebarStudents(this.value)" id="sidebar-student-search-input">
      </div>

      <!-- Student Navigation Roster -->
      <div class="sidebar-student-list" id="sidebar-student-list-container">
        ${sortedStudents.map(st => `
          <div class="sidebar-student-item ${st.id === currentStudentId ? 'active' : ''}"
               onclick="switchDetailStudent('${st.id}')"
               data-tooltip="${st.name} (Roll #${st.rollNo} • ${getClassName(st.classId)})">
            <img src="${st.photo}" class="sidebar-student-item-avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'">
            <div class="sidebar-student-item-info">
              <div class="sidebar-student-item-name">${st.name}</div>
              <div class="sidebar-student-item-meta">Roll #${st.rollNo} • ${getClassName(st.classId)}</div>
            </div>
            <span class="sidebar-student-item-badge">${st.avgGrade}</span>
          </div>
        `).join('')}
      </div>

      <!-- Footer with teacher badge & toggle button -->
      <div class="sidebar-footer">
        <div class="sidebar-user" onclick="showTeacherProfileModal()" title="Teacher Profile" data-tooltip="${MOCK_DATA.user.name}">
          <img src="${MOCK_DATA.user.avatarUrl}" class="sidebar-user-avatar" style="object-fit:cover;border-radius:50%">
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${MOCK_DATA.user.name}</div>
            <div class="sidebar-user-role">View Faculty Card</div>
          </div>
        </div>
        <div class="sidebar-toggle" onclick="AppState.toggleSidebar()" data-tooltip="${AppState.sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}">
          <span>${AppState.sidebarCollapsed ? '→' : '←'}</span>
        </div>
      </div>
    </nav>
  `;
}

function filterSidebarStudents(query) {
  const q = query.toLowerCase();
  const items = document.querySelectorAll('.sidebar-student-item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(q) ? 'flex' : 'none';
  });
}

function renderTopbar() {
  const pageNames = {
    dashboard: 'Dashboard', journal: 'Teacher Diary Safe', classes: 'Classes',
    'class-detail': 'Class Detail', students: 'Students & Quizzes', 'student-detail': 'Student Detail & Assessment',
    materials: 'Teaching Materials & Logs', syllabus: 'Syllabus Tracker', reports: 'Reports', search: 'Search'
  };
  const pageName = pageNames[AppState.currentPage] || 'Dashboard';

  return `
    <header class="topbar">
      <div class="topbar-left-group">
        <button class="mobile-menu-btn" id="mobile-menu-btn" onclick="AppState.toggleMobileSidebar()" aria-label="Toggle Navigation Menu">
          <span>☰</span>
        </button>
        <div class="topbar-breadcrumb">
          <span class="current">${pageName}</span>
        </div>
      </div>
      <div class="topbar-search">
        <span class="topbar-search-icon">🔍</span>
        <input type="text" placeholder="Search students, tasks, resources..."
               id="global-search-input"
               onfocus="openSearchPanel()"
               readonly>
        <span class="topbar-search-shortcut">Ctrl+K</span>
      </div>
      <div class="topbar-actions">
        <button class="topbar-action-btn" title="Notifications" onclick="showToast('Notifications', 'All teaching activities are synced', 'info')">
          🔔
          <span class="notification-dot"></span>
        </button>
        <div class="topbar-user-btn" title="Teacher Profile" onclick="showTeacherProfileModal()">
          <img src="${MOCK_DATA.user.avatarUrl}" onerror="this.outerHTML='<div class=\\'topbar-user-avatar\\'>${MOCK_DATA.user.initials}</div>'">
        </div>
      </div>
    </header>
  `;
}

function renderCurrentPage() {
  switch (AppState.currentPage) {
    case 'dashboard': return renderDashboard();
    case 'journal': return renderJournal();
    case 'classes': return renderClasses();
    case 'class-detail': return renderClassDetail();
    case 'students': return renderStudents();
    case 'student-detail': return renderStudentDetail();
    case 'materials': return renderMaterials();
    case 'syllabus': return renderSyllabus();
    case 'reports': return renderReports();
    case 'search': return renderSearchPage();
    default: return renderDashboard();
  }
}

let eventsAttached = false;
function attachAppEvents() {
  if (eventsAttached) return;
  eventsAttached = true;

  // Global search shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchPanel();
    }
    if (e.key === 'Escape') {
      closeSearchPanel();
    }
  });

  // Sidebar drag resizer
  initSidebarResize();

  // Floating hover tooltips
  initGlobalTooltips();
}

// =====================================================
// Global Floating Tooltip System
// =====================================================
function initGlobalTooltips() {
  let tooltipEl = document.getElementById('global-floating-tooltip');
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'global-floating-tooltip';
    tooltipEl.className = 'global-floating-tooltip';
    document.body.appendChild(tooltipEl);
  }

  let activeTarget = null;

  function showTooltipFor(target) {
    const tooltipText = target.getAttribute('data-tooltip');
    if (!tooltipText) return;

    activeTarget = target;
    tooltipEl.textContent = tooltipText;
    tooltipEl.classList.add('visible');
    positionTooltip(target, tooltipEl);
  }

  function hideTooltip() {
    activeTarget = null;
    tooltipEl.classList.remove('visible');
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;

    const sidebar = document.querySelector('.sidebar');
    const isSidebarCollapsed = sidebar && sidebar.classList.contains('collapsed');
    const isInsideSidebar = target.closest('.sidebar');

    // If inside sidebar, show tooltip if sidebar is collapsed,
    // or if it's the toggle button, or if it's a student roster item / back button
    if (isInsideSidebar) {
      if (isSidebarCollapsed) {
        showTooltipFor(target);
      } else if (target.classList.contains('sidebar-toggle') || target.classList.contains('sidebar-student-back-btn')) {
        showTooltipFor(target);
      }
      return;
    }

    // For elements outside the sidebar
    showTooltipFor(target);
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target && target === activeTarget) {
      hideTooltip();
    }
  });

  window.addEventListener('scroll', () => {
    if (activeTarget) {
      positionTooltip(activeTarget, tooltipEl);
    }
  }, true);

  function positionTooltip(target, el) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = el.getBoundingClientRect();

    let left = rect.right + 12;
    let top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);

    // If overflowing right edge of window
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = Math.max(8, rect.left - tooltipRect.width - 12);
    }

    // Keep vertically inside window
    top = Math.max(8, Math.min(window.innerHeight - tooltipRect.height - 8, top));

    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
  }
}

function initSidebarResize() {
  let isResizing = false;
  let startX = 0;
  let startWidth = 260;

  document.addEventListener('mousedown', (e) => {
    if (e.target && e.target.id === 'sidebar-resize-handle') {
      isResizing = true;
      startX = e.clientX;
      const sidebar = document.querySelector('.sidebar');
      startWidth = sidebar ? sidebar.getBoundingClientRect().width : (AppState.sidebarWidth || 260);

      document.body.classList.add('sidebar-resizing');
      if (sidebar) sidebar.classList.add('resizing');
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const diff = e.clientX - startX;
    const newWidth = startWidth + diff;
    AppState.setSidebarWidth(newWidth);
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.classList.remove('sidebar-resizing');
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.classList.remove('resizing');
    }
  });
}

// =====================================================
// SEARCH PANEL (Command Palette)
// =====================================================
function openSearchPanel() {
  if (document.getElementById('search-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.id = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-panel">
      <div class="search-panel-input">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search everything..." id="search-panel-query" autofocus
               oninput="handleSearchInput(this.value)">
      </div>
      <div class="search-results" id="search-results">
        <div class="search-result-group">
          <div class="search-result-group-title">Quick Actions</div>
          <div class="search-result-item" onclick="closeSearchPanel(); showJournalModal();">
            <div class="search-result-icon journal">📝</div>
            <div class="search-result-info">
              <div class="search-result-title">New Journal Entry</div>
              <div class="search-result-meta">Record a teaching activity</div>
            </div>
          </div>
          <div class="search-result-item" onclick="closeSearchPanel(); showMaterialModal();">
            <div class="search-result-icon material">📚</div>
            <div class="search-result-info">
              <div class="search-result-title">Upload Material</div>
              <div class="search-result-meta">Add a teaching resource</div>
            </div>
          </div>
          <div class="search-result-item" onclick="closeSearchPanel(); AppState.navigate('reports');">
            <div class="search-result-icon class">📈</div>
            <div class="search-result-info">
              <div class="search-result-title">Generate Report</div>
              <div class="search-result-meta">Create an academic report</div>
            </div>
          </div>
        </div>
      </div>
      <div class="search-panel-footer">
        <span><kbd>↑↓</kbd> Navigate</span>
        <span><kbd>↵</kbd> Select</span>
        <span><kbd>Esc</kbd> Close</span>
      </div>
    </div>
  `;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearchPanel();
  });
  document.body.appendChild(overlay);
  setTimeout(() => document.getElementById('search-panel-query')?.focus(), 100);
}

function closeSearchPanel() {
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.remove();
}

function handleSearchInput(query) {
  const container = document.getElementById('search-results');
  if (!container) return;
  if (!query.trim()) {
    container.innerHTML = '<div class="empty-state" style="padding:var(--space-8)"><p class="text-muted text-sm">Type to search across journal, materials, students, and classes...</p></div>';
    return;
  }
  const q = query.toLowerCase();
  let results = '';

  // Search journal
  const journalResults = MOCK_DATA.journal.filter(j =>
    j.topic.toLowerCase().includes(q) || j.subject.toLowerCase().includes(q) ||
    j.activities.toLowerCase().includes(q) || j.chapter.toLowerCase().includes(q)
  ).slice(0, 3);
  if (journalResults.length) {
    results += `<div class="search-result-group"><div class="search-result-group-title">Journal Entries</div>`;
    journalResults.forEach(j => {
      results += `
        <div class="search-result-item" onclick="closeSearchPanel(); viewJournalEntry('${j.id}');">
          <div class="search-result-icon journal">📝</div>
          <div class="search-result-info">
            <div class="search-result-title">${j.topic}</div>
            <div class="search-result-meta">${getClassName(j.classId)} • ${j.subject} • ${formatDateShort(j.date)}</div>
          </div>
        </div>`;
    });
    results += '</div>';
  }

  // Search materials
  const matResults = MOCK_DATA.materials.filter(m =>
    m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) ||
    m.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 3);
  if (matResults.length) {
    results += `<div class="search-result-group"><div class="search-result-group-title">Materials</div>`;
    matResults.forEach(m => {
      results += `
        <div class="search-result-item" onclick="closeSearchPanel(); AppState.navigate('materials');">
          <div class="search-result-icon material">${getMaterialIcon(m.type)}</div>
          <div class="search-result-info">
            <div class="search-result-title">${m.name}</div>
            <div class="search-result-meta">${getClassName(m.classId)} • ${m.subject}</div>
          </div>
        </div>`;
    });
    results += '</div>';
  }

  // Search students
  const stuResults = MOCK_DATA.students.filter(s =>
    s.name.toLowerCase().includes(q)
  ).slice(0, 3);
  if (stuResults.length) {
    results += `<div class="search-result-group"><div class="search-result-group-title">Students</div>`;
    stuResults.forEach(s => {
      results += `
        <div class="search-result-item" onclick="closeSearchPanel(); AppState.navigate('student-detail', {studentId:'${s.id}'});">
          <div class="search-result-icon student">👨‍🎓</div>
          <div class="search-result-info">
            <div class="search-result-title">${s.name}</div>
            <div class="search-result-meta">${getClassName(s.classId)} • Roll No. ${s.rollNo}</div>
          </div>
        </div>`;
    });
    results += '</div>';
  }

  // Search classes
  const clsResults = MOCK_DATA.classes.filter(c =>
    c.name.toLowerCase().includes(q)
  );
  if (clsResults.length) {
    results += `<div class="search-result-group"><div class="search-result-group-title">Classes</div>`;
    clsResults.forEach(c => {
      results += `
        <div class="search-result-item" onclick="closeSearchPanel(); AppState.navigate('class-detail', {classId:'${c.id}'});">
          <div class="search-result-icon class">🏫</div>
          <div class="search-result-info">
            <div class="search-result-title">${c.name}</div>
            <div class="search-result-meta">${c.studentCount} students • ${c.subjects.length} subjects</div>
          </div>
        </div>`;
    });
    results += '</div>';
  }

  if (!results) {
    results = '<div class="empty-state" style="padding:var(--space-8)"><p class="text-muted text-sm">No results found for "' + query + '"</p></div>';
  }

  container.innerHTML = results;
}

// =====================================================
// TEACHER WORK TRACKER & PROGRESS
// =====================================================
function toggleTeacherTask(taskId) {
  const task = MOCK_DATA.teacherTasks.find(t => t.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  const statusStr = task.completed ? 'completed' : 'pending';
  showToast('Task Updated', `Task marked as ${statusStr}.`, 'success');
  renderApp();
}

function saveTaskReview(taskId) {
  const input = document.getElementById(`review-input-${taskId}`);
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('Empty Review', 'Please enter your reflection or review before saving.', 'error');
    return;
  }
  const task = MOCK_DATA.teacherTasks.find(t => t.id === taskId);
  if (task) {
    task.review = val;
    task.isEditingReview = false;
    showToast('Experience Recorded', 'Your classroom review has been saved.', 'success');
    renderApp();
  }
}

function editTaskReview(taskId) {
  const task = MOCK_DATA.teacherTasks.find(t => t.id === taskId);
  if (task) {
    task.isEditingReview = true;
    renderApp();
    setTimeout(() => {
      const el = document.getElementById(`review-input-${taskId}`);
      if (el) { el.focus(); el.value = task.review; }
    }, 100);
  }
}

function showAddTaskModal() {
  showModal(`
    <div class="modal-header">
      <h2>Add Today's Work Task</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Task Description <span class="required">*</span></label>
        <input type="text" class="form-input" id="new-task-title" placeholder="e.g., Grade Class 6A Science Lab experiment journals">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Class</label>
          <select class="form-select" id="new-task-class">
            ${MOCK_DATA.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
            <option value="General">General / All Classes</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-select" id="new-task-subject">
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Social Science">Social Science</option>
            <option value="Administration">Administration</option>
            <option value="Parent Outreach">Parent Outreach</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Estimated Time</label>
        <input type="text" class="form-input" id="new-task-time" placeholder="e.g., 30 mins">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewTask()">Save Task</button>
    </div>
  `);
}

function saveNewTask() {
  const title = document.getElementById('new-task-title')?.value.trim();
  const className = document.getElementById('new-task-class')?.value;
  const subject = document.getElementById('new-task-subject')?.value;
  const timeEst = document.getElementById('new-task-time')?.value.trim() || '30 mins';

  if (!title) {
    showToast('Missing Title', 'Please enter a description for the work task.', 'error');
    return;
  }

  MOCK_DATA.teacherTasks.push({
    id: generateId(),
    title,
    className,
    subject,
    completed: false,
    timeEst,
    review: ''
  });

  closeModal();
  showToast('Task Created', `"${title}" added to today's work.`, 'success');
  renderApp();
}

// =====================================================
// DASHBOARD
// =====================================================
// =====================================================
// DASHBOARD — TEACHER WELLBEING & SPEEDOMETER MOOD HUB
// =====================================================
function renderDashboard() {
  const completedTasks = MOCK_DATA.teacherTasks.filter(t => t.completed).length;
  const totalTasks = MOCK_DATA.teacherTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const syllabusProgress = getOverallSyllabusProgress();
  const totalStudents = MOCK_DATA.students.length;
  const safeCount = MOCK_DATA.teacherSafeJournal.length;

  if (!AppState.selectedMoodQuote) {
    AppState.selectedMoodQuote = getQuoteForMood(AppState.currentMood);
  }
  const quote = AppState.selectedMoodQuote;
  const zoneClass = getMoodZone(AppState.currentMood);
  const showGreeting = AppState.showDashboardGreeting;
  const greetingDone = AppState.greetingAnimationDone;
  const todayFormatted = formatDate(getToday());

  // Weekly mood arc mock trajectory (Mon - Sun)
  const weekDays = [
    { day: 'Mon', date: '08 Sep', score: 7 },
    { day: 'Tue', date: '09 Sep', score: 8 },
    { day: 'Wed', date: '10 Sep', score: 6 },
    { day: 'Thu', date: '11 Sep', score: 8 },
    { day: 'Fri', date: '12 Sep (Today)', score: AppState.currentMood, isToday: true },
    { day: 'Sat', date: '13 Sep', score: 8 },
    { day: 'Sun', date: '14 Sep', score: 9 },
  ];

  return `
    <div class="dashboard-grid stagger-children">
      <!-- Top Welcome Banner & Teacher Status -->
      <div class="teacher-hero-header">
        <div class="teacher-hero-profile">
          <img src="${MOCK_DATA.user.avatarUrl}" alt="${MOCK_DATA.user.name}" class="teacher-hero-avatar" onerror="this.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'">
          <div class="teacher-hero-details">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <h1 class="teacher-hero-name">Good ${getGreeting()}, ${MOCK_DATA.user.name.split(' ')[0]}</h1>
              <span class="badge badge-primary">Faculty Hub</span>
              <span class="teacher-active-indicator"><span class="pulse-dot"></span> Active in Session</span>
            </div>
            <p class="teacher-hero-meta">
              ${MOCK_DATA.user.role} • ${MOCK_DATA.user.department} • <strong>${todayFormatted}</strong>
            </p>
          </div>
        </div>
        <div class="teacher-hero-actions">
          <button class="btn btn-secondary btn-sm" onclick="showMoodCheckInModal()">Calibrate Meter</button>
          <button class="btn btn-primary btn-sm" onclick="AppState.navigate('journal')">Open Diary Safe</button>
        </div>
      </div>

      <!-- Hero Viewport: Speedometer Mood & Pedagogical Energy Center -->
      <div class="speedometer-hero-card ${greetingDone || !showGreeting ? 'reveal' : ''}" id="dashboard-mood-section">
        <div class="speedometer-card-header">
          <div>
            <div class="speedometer-pill-badge">Faculty Wellbeing & Mindset Velocity</div>
            <h2 class="speedometer-card-title">Teaching Energy & Mood Meter</h2>
          </div>
          <div class="speedo-header-zone-pill ${zoneClass}">
            <span class="speedo-zone-dot"></span>
            <span>${getMoodZoneLabel(AppState.currentMood)}</span>
          </div>
        </div>

        <div class="speedometer-grid-main">
          <!-- Left Column: The Interactive Speedometer Dial (Draggable / Clickable) -->
          <div class="speedometer-dial-panel">
            ${renderSpeedometer(AppState.currentMood)}
          </div>

          <!-- Right Column: Daily Pedagogical Fuel & Pre-Class Reflection -->
          <div class="speedometer-reflection-panel">
            <!-- Pedagogical Quote / Insight Box -->
            <div class="speedo-quote-card ${zoneClass}">
              <div class="speedo-quote-header">
                <span class="speedo-quote-badge">${quote.zoneLabel || getMoodLabel(AppState.currentMood)}</span>
                <button class="quote-refresh-btn" onclick="shuffleMoodQuote()" title="Refresh Pedagogical Insight">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  New Insight
                </button>
              </div>
              <blockquote class="speedo-quote-body">"${quote.quote}"</blockquote>
              <div class="speedo-quote-author">— ${quote.author}</div>
            </div>

            <!-- Quick Pre-Class Reflection / Intention Logger -->
            <div class="speedo-quick-reflection">
              <div class="speedo-reflection-head">
                <span class="speedo-reflection-label">Pre-Class Reflection & Intention</span>
                <span class="speedo-reflection-sub">Auto-syncs to Private Safe</span>
              </div>
              <div class="speedo-reflection-input-wrap">
                <input type="text" id="speedo-reflection-text" class="speedo-reflection-input" placeholder="Note your focus or pedagogical intention before class..." onkeydown="if(event.key==='Enter') saveSpeedoReflection();" />
                <button class="btn btn-primary btn-sm" onclick="saveSpeedoReflection()">Log Note</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Mood & Emotional Resilience Arc -->
      <div class="card card-elevated" style="padding:24px 28px;">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 style="font-size:1.15rem;font-weight:700;color:var(--neutral-900);margin:0 0 4px 0">Weekly Energy & Emotional Resilience Arc</h3>
            <p class="text-xs text-muted" style="margin:0">Faculty vitality trajectory across the 7-day teaching cycle</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold text-muted">Weekly Average: <strong style="color:var(--primary-700)">7.8 / 10 (Energized)</strong></span>
          </div>
        </div>

        <div class="weekly-arc-row">
          ${weekDays.map(item => {
            const heightPercent = Math.round((item.score / 10) * 100);
            const zClass = getMoodZone(item.score);
            return `
              <div class="weekly-arc-col ${item.isToday ? 'active-today' : ''}" onclick="selectMood(${item.score})" title="${item.day}: ${item.score}/10 — ${getMoodLabel(item.score)}">
                <div class="weekly-arc-bar-wrap">
                  <div class="weekly-arc-bar ${zClass}" style="height:${heightPercent}%">
                    <span class="weekly-arc-score">${item.score}</span>
                  </div>
                </div>
                <div class="weekly-arc-day">${item.day}</div>
                <div class="weekly-arc-date">${item.date}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Quick Faculty Vitality Metric Tiles (Clean SVGs, No Emojis) -->
      <div class="stats-grid">
        <div class="card card-elevated stat-card" onclick="AppState.navigate('journal')" style="cursor:pointer">
          <div class="stat-card-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="stat-card-info">
            <div class="stat-card-label">Diary Safe Reflections</div>
            <div class="stat-card-value">${safeCount}</div>
            <div class="stat-card-trend up">Private reflections recorded</div>
          </div>
        </div>

        <div class="card card-elevated stat-card" onclick="AppState.navigate('dashboard')" style="cursor:pointer">
          <div class="stat-card-icon cyan">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-card-info">
            <div class="stat-card-label">Teaching Periods Done</div>
            <div class="stat-card-value">${completedTasks}/${totalTasks}</div>
            <div class="stat-card-trend up">${progressPercent}% daily curriculum flow</div>
          </div>
        </div>

        <div class="card card-elevated stat-card" onclick="AppState.navigate('syllabus')" style="cursor:pointer">
          <div class="stat-card-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="stat-card-info">
            <div class="stat-card-label">Syllabus Velocity</div>
            <div class="stat-card-value">${syllabusProgress}%</div>
            <div class="stat-card-trend ${syllabusProgress >= 40 ? 'up' : 'down'}">${syllabusProgress >= 40 ? 'On Track' : 'Review Needed'}</div>
          </div>
        </div>

        <div class="card card-elevated stat-card" onclick="AppState.navigate('students')" style="cursor:pointer">
          <div class="stat-card-icon amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-card-info">
            <div class="stat-card-label">Students Mentored</div>
            <div class="stat-card-value">${totalStudents}</div>
            <div class="stat-card-trend up">${MOCK_DATA.classes.length} active literature sections</div>
          </div>
        </div>
      </div>

      <!-- Main Row: Today's Teaching Flow & Class Reflections -->
      <div class="dashboard-row">
        <!-- Teacher Teaching Sessions & Class Reviews -->
        <div class="card card-elevated teacher-work-card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Today's Teaching Flow & Classroom Reflections</h3>
              <p class="text-xs text-muted mt-1">Review your lessons, student discussions, and pedagogical observations</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="showAddTaskModal()">+ Add Lesson Period</button>
          </div>
          <div class="card-body">
            <!-- Live Progress Bar -->
            <div class="work-progress-box">
              <div class="work-progress-labels">
                <span class="work-progress-title">Daily Teaching Completion</span>
                <span class="work-progress-percent">${progressPercent}% (${completedTasks}/${totalTasks} Periods Completed)</span>
              </div>
              <div class="progress-bar lg">
                <div class="progress-bar-fill green" style="width:${progressPercent}%;transition:width 0.4s ease"></div>
              </div>
            </div>

            <!-- Task List with Reviews -->
            <div class="task-list">
              ${MOCK_DATA.teacherTasks.map(task => {
                const showReviewInput = task.isEditingReview || !task.review;
                return `
                  <div class="task-item-container ${task.completed ? 'completed' : ''}" id="task-${task.id}">
                    <div class="task-main-row">
                      <div class="task-checkbox-custom ${task.completed ? 'checked' : ''}" onclick="toggleTeacherTask('${task.id}')">
                        ${task.completed ? '✓' : ''}
                      </div>
                      <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">
                          <span class="badge badge-neutral">${task.className}</span>
                          <span class="badge badge-cyan">${task.subject}</span>
                          <span class="text-xs text-muted">Estimated: ${task.timeEst}</span>
                          ${task.completed ? '<span class="badge badge-green">Delivered</span>' : '<span class="badge badge-amber">Upcoming</span>'}
                        </div>
                      </div>
                    </div>

                    <!-- Experience / Review Field after each task -->
                    <div class="task-review-box">
                      <div class="text-xs font-semibold text-muted mb-1">TEACHING EXPERIENCE & NOTES:</div>
                      ${showReviewInput ? `
                        <div class="task-review-input-row">
                          <input type="text" class="task-review-input" id="review-input-${task.id}"
                                 placeholder="Record how this lesson went, student discourse, or insights..."
                                 value="${task.review ? task.review.replace(/"/g, '&quot;') : ''}">
                          <button class="btn btn-primary btn-sm" onclick="saveTaskReview('${task.id}')">Save Notes</button>
                        </div>
                      ` : `
                        <div class="saved-review-badge">
                          <div style="flex:1">
                            <strong>Class Observation:</strong> "${task.review}"
                          </div>
                          <button class="btn btn-ghost btn-xs" onclick="editTaskReview('${task.id}')" title="Edit Review">Edit</button>
                        </div>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Navigation & Diary Safe Highlights -->
        <div class="flex flex-col gap-5">
          <!-- Safe Highlights Card -->
          <div class="card card-elevated">
            <div class="card-header">
              <h3 class="card-title">Recent Diary Safe Highlights</h3>
              <button class="btn btn-ghost btn-sm" onclick="AppState.navigate('journal')">Open Safe</button>
            </div>
            <div class="card-body">
              <div class="activity-list">
                ${MOCK_DATA.teacherSafeJournal.slice(0, 3).map(entry => `
                  <div class="activity-item" style="cursor:pointer" onclick="AppState.navigate('journal')">
                    <div class="activity-dot green"></div>
                    <div>
                      <div class="activity-text">
                        <strong>${entry.title}</strong>
                      </div>
                      <div class="activity-time">${formatDate(entry.date)} • Velocity: ${entry.moodScore}/10</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Quick Navigation Panel -->
          <div class="card card-elevated">
            <div class="card-header">
              <h3 class="card-title">Quick Workspace Navigation</h3>
            </div>
            <div class="card-body">
              <div class="quick-actions-grid">
                <div class="quick-action-item" onclick="AppState.navigate('materials')">
                  <div class="quick-action-icon stat-card-icon cyan">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div class="quick-action-text">Materials & Logs<span>Literature texts & slides</span></div>
                </div>
                <div class="quick-action-item" onclick="AppState.navigate('syllabus')">
                  <div class="quick-action-icon stat-card-icon amber">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                  <div class="quick-action-text">Syllabus Tracker<span>Track syllabus pacing</span></div>
                </div>
                <div class="quick-action-item" onclick="AppState.navigate('students')">
                  <div class="quick-action-icon stat-card-icon blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </div>
                  <div class="quick-action-text">Students & Quizzes<span>View student progress</span></div>
                </div>
                <div class="quick-action-item" onclick="AppState.navigate('reports')">
                  <div class="quick-action-icon stat-card-icon green">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  </div>
                  <div class="quick-action-text">Academic Reports<span>Term grade metrics</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

// =====================================================
// JOURNAL
// =====================================================
// =====================================================
// TEACHER JOURNAL SAFE (Calendar Format with Emoji Stickers)
// =====================================================
function changeCalendarMonth(delta) {
  AppState.calendarMonth += delta;
  if (AppState.calendarMonth > 11) {
    AppState.calendarMonth = 0;
    AppState.calendarYear++;
  } else if (AppState.calendarMonth < 0) {
    AppState.calendarMonth = 11;
    AppState.calendarYear--;
  }
  renderApp();
}

function selectCalendarDate(dateStr) {
  AppState.selectedCalendarDate = dateStr;
  renderApp();
}

function toggleEmojiSticker(dateStr, emoji) {
  let entry = MOCK_DATA.teacherSafeJournal.find(e => e.date === dateStr);
  if (!entry) {
    entry = {
      id: generateId(),
      date: dateStr,
      title: 'Daily Reflection',
      experience: '',
      emojiStickers: [],
      moodScore: AppState.currentMood || 8
    };
    MOCK_DATA.teacherSafeJournal.push(entry);
  }
  if (!entry.emojiStickers) entry.emojiStickers = [];
  const idx = entry.emojiStickers.indexOf(emoji);
  if (idx >= 0) {
    entry.emojiStickers.splice(idx, 1);
  } else {
    entry.emojiStickers.push(emoji);
  }
  renderApp();
}

function saveSafeReflection(dateStr) {
  const title = document.getElementById('safe-entry-title')?.value.trim() || 'Daily Reflection';
  const experience = document.getElementById('safe-entry-text')?.value.trim();
  const moodScore = parseInt(document.getElementById('safe-entry-mood')?.value) || 8;

  if (!experience) {
    showToast('Reflection Empty', 'Please write a few thoughts about your day before saving.', 'error');
    return;
  }

  let entry = MOCK_DATA.teacherSafeJournal.find(e => e.date === dateStr);
  if (entry) {
    entry.title = title;
    entry.experience = experience;
    entry.moodScore = moodScore;
  } else {
    MOCK_DATA.teacherSafeJournal.push({
      id: generateId(),
      date: dateStr,
      title,
      experience,
      emojiStickers: ['✨', '😊'],
      moodScore
    });
  }

  showToast('Reflection Saved', `Safe entry for ${formatDate(dateStr)} recorded with stickers.`, 'success');
  renderApp();
}

function toggleSafeLock() {
  AppState.safeUnlocked = !AppState.safeUnlocked;
  const msg = AppState.safeUnlocked ? 'Diary Safe unlocked.' : 'Diary Safe is now locked & protected.';
  showToast('Safe Security', msg, 'info');
  renderApp();
}

function renderJournal() {
  const year = AppState.calendarYear;
  const month = AppState.calendarMonth;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[month];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedDate = AppState.selectedCalendarDate || getToday();
  const activeEntry = MOCK_DATA.teacherSafeJournal.find(e => e.date === selectedDate);
  const activeStickers = activeEntry?.emojiStickers || [];

  const availableStickers = ['🌟', '😊', '💡', '😴', '💪', '❤️', '🔬', '🤯', '🧘', '🏆', '☕', '🌱', '🎉', '📚'];

  return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="flex items-center gap-3">
          <h1>Teacher's Reflection Safe</h1>
          <span class="safe-header-badge" onclick="toggleSafeLock()" style="cursor:pointer">
            ${AppState.safeUnlocked ? '🔓 Safe Unlocked' : '🔒 Safe Protected'}
          </span>
        </div>
        <p>A private sanctuary to record daily experiences, classroom triumphs, and emotions with calendar emoji stickers.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="AppState.navigate('materials')">View Lesson Records & Materials →</button>
      </div>
    </div>

    <div class="calendar-safe-wrapper stagger-children">
      <!-- Left: Interactive Calendar -->
      <div>
        <div class="calendar-header-controls">
          <button class="btn btn-ghost btn-sm" onclick="changeCalendarMonth(-1)">◀ Previous</button>
          <h3 style="font-size:1.2rem;font-weight:700;color:var(--neutral-800)">${monthName} ${year}</h3>
          <button class="btn btn-ghost btn-sm" onclick="changeCalendarMonth(1)">Next ▶</button>
        </div>

        <div class="calendar-grid-header">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div class="calendar-grid-days">
          ${Array.from({ length: firstDayIndex }).map(() => `<div class="calendar-day-cell empty"></div>`).join('')}
          ${Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === getToday();
            const isSelected = dateStr === selectedDate;
            const entry = MOCK_DATA.teacherSafeJournal.find(e => e.date === dateStr);
            const stickers = entry?.emojiStickers || [];

            return `
              <div class="calendar-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'active-selected' : ''}" onclick="selectCalendarDate('${dateStr}')">
                <span style="font-size:var(--font-size-xs);font-weight:700">${dayNum}</span>
                <div class="calendar-day-stickers">
                  ${stickers.slice(0, 3).map(s => `<span>${s}</span>`).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="text-xs text-muted mt-4">
          💡 <em>Tip: Click any day to read or record your reflections. Attached emoji stickers will show directly on that date!</em>
        </div>
      </div>

      <!-- Right: Daily Experience & Sticker Picker -->
      <div class="safe-entry-pane">
        <div class="flex items-center justify-between">
          <div>
            <h3 style="font-size:1.15rem;font-weight:700;color:var(--neutral-800)">
              Daily Reflection: ${formatDate(selectedDate)}
            </h3>
            <span class="text-xs text-muted">Safe Entry: ${activeEntry ? 'Recorded' : 'Not yet saved'}</span>
          </div>
          <span class="badge badge-green">${activeEntry ? 'Saved in Safe' : 'Draft'}</span>
        </div>

        <!-- Emoji Sticker Bar -->
        <div>
          <label class="form-label mb-2" style="display:block">Click Emoji Stickers to attach to this day:</label>
          <div class="emoji-sticker-picker">
            ${availableStickers.map(emoji => {
              const hasSticker = activeStickers.includes(emoji);
              return `
                <div class="sticker-pill ${hasSticker ? 'active' : ''}"
                     onclick="toggleEmojiSticker('${selectedDate}', '${emoji}')"
                     title="${hasSticker ? 'Click to remove' : 'Click to attach'}">
                  ${emoji}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Entry Title</label>
          <input type="text" class="form-input" id="safe-entry-title"
                 placeholder="e.g., A breakthrough moment in Class 6A"
                 value="${activeEntry ? activeEntry.title.replace(/"/g, '&quot;') : ''}">
        </div>

        <div class="form-group">
          <label class="form-label">Daily Classroom Experience & Feelings</label>
          <textarea class="form-textarea" id="safe-entry-text" rows="5"
                    placeholder="Describe how your classes went today, student breakthroughs, moments of joy, or challenges you encountered...">${activeEntry ? activeEntry.experience : ''}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Day's Mood Score (1-10)</label>
            <select class="form-select" id="safe-entry-mood">
              ${[1,2,3,4,5,6,7,8,9,10].map(s => `
                <option value="${s}" ${(activeEntry ? activeEntry.moodScore === s : AppState.currentMood === s) ? 'selected' : ''}>
                  ${getMoodEmoji(s)} ${s}/10 — ${getMoodLabel(s)}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <button class="btn btn-primary" onclick="saveSafeReflection('${selectedDate}')" style="align-self:flex-start">
          🔒 Save Reflection in Safe
        </button>
      </div>
    </div>

    <!-- Recent Safe Entries Stream -->
    <div class="card card-elevated mt-6">
      <div class="card-header">
        <h3 class="card-title">Past Reflections & Highlights</h3>
      </div>
      <div class="card-body">
        <div class="activity-list">
          ${MOCK_DATA.teacherSafeJournal.map(entry => `
            <div class="activity-item" style="cursor:pointer" onclick="selectCalendarDate('${entry.date}')">
              <div class="activity-dot green"></div>
              <div style="flex:1">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-sm">${entry.title}</span>
                  <span class="text-xs text-muted">${formatDate(entry.date)}</span>
                </div>
                <div class="text-xs mt-1" style="color:var(--neutral-600)">${entry.experience}</div>
                <div class="flex items-center gap-2 mt-2">
                  <span style="font-size:1.1rem">${entry.emojiStickers.join(' ')}</span>
                  <span class="badge badge-neutral text-xs">Mood: ${entry.moodScore}/10</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function viewJournalEntry(id) {
  const j = MOCK_DATA.journal.find(x => x.id === id);
  if (!j) return;
  const linkedMaterials = j.materials.map(mid => MOCK_DATA.materials.find(m => m.id === mid)).filter(Boolean);

  showModal(`
    <div class="modal-header">
      <h2>Journal Entry</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="badge badge-blue">${getClassName(j.classId)}</span>
        <span class="badge badge-cyan">${j.subject}</span>
        <span class="badge badge-neutral">${j.chapter}</span>
        <span class="badge ${j.status === 'draft' ? 'badge-amber' : 'badge-green'}">${j.status}</span>
      </div>
      <div>
        <div class="text-xs text-muted mb-2">DATE</div>
        <div class="text-sm font-medium">${formatDate(j.date)}</div>
      </div>
      <div>
        <div class="text-xs text-muted mb-2">TOPIC</div>
        <div class="text-sm font-semibold" style="font-size:var(--font-size-lg)">${j.topic}</div>
      </div>
      <div>
        <div class="text-xs text-muted mb-2">LEARNING OBJECTIVES</div>
        <div class="text-sm">${j.objectives}</div>
      </div>
      <div>
        <div class="text-xs text-muted mb-2">ACTIVITIES</div>
        <div class="text-sm">${j.activities}</div>
      </div>
      ${j.homework ? `<div>
        <div class="text-xs text-muted mb-2">HOMEWORK</div>
        <div class="text-sm">${j.homework}</div>
      </div>` : ''}
      ${j.remarks ? `<div>
        <div class="text-xs text-muted mb-2">REMARKS</div>
        <div class="text-sm">${j.remarks}</div>
      </div>` : ''}
      ${linkedMaterials.length ? `<div>
        <div class="text-xs text-muted mb-2">LINKED MATERIALS</div>
        ${linkedMaterials.map(m => `
          <div class="flex items-center gap-3" style="padding:var(--space-2) 0">
            <span>${getMaterialIcon(m.type)}</span>
            <span class="text-sm font-medium">${m.name}</span>
            <span class="badge badge-neutral">${m.type.toUpperCase()}</span>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="closeModal(); showJournalModal('${j.id}')">Edit Entry</button>
    </div>
  `, 'lg');
}

function showJournalModal(editId) {
  const j = editId ? MOCK_DATA.journal.find(x => x.id === editId) : null;

  showModal(`
    <div class="modal-header">
      <h2>${j ? 'Edit' : 'New'} Journal Entry</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Class <span class="required">*</span></label>
          <select class="form-select" id="journal-class" onchange="updateJournalSubjects()">
            <option value="">Select Class</option>
            ${MOCK_DATA.classes.map(c => `<option value="${c.id}" ${j && j.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Subject <span class="required">*</span></label>
          <select class="form-select" id="journal-subject">
            <option value="">Select Subject</option>
            <option value="Science" ${j?.subject === 'Science' ? 'selected' : ''}>Science</option>
            <option value="Mathematics" ${j?.subject === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
            <option value="Social Science" ${j?.subject === 'Social Science' ? 'selected' : ''}>Social Science</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Date <span class="required">*</span></label>
          <input type="date" class="form-input" id="journal-date" value="${j ? j.date : getToday()}">
        </div>
        <div class="form-group">
          <label class="form-label">Chapter</label>
          <input type="text" class="form-input" id="journal-chapter" placeholder="e.g., Motion" value="${j?.chapter || ''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Topic <span class="required">*</span></label>
        <input type="text" class="form-input" id="journal-topic" placeholder="e.g., Speed and Velocity" value="${j?.topic || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Learning Objectives</label>
        <textarea class="form-textarea" id="journal-objectives" placeholder="What should students learn from this lesson?">${j?.objectives || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Activities <span class="required">*</span></label>
        <textarea class="form-textarea" id="journal-activities" placeholder="Describe the teaching activities conducted...">${j?.activities || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Homework</label>
        <textarea class="form-textarea" id="journal-homework" placeholder="Homework assigned to students..." style="min-height:60px">${j?.homework || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Remarks</label>
        <textarea class="form-textarea" id="journal-remarks" placeholder="Any observations or notes..." style="min-height:60px">${j?.remarks || ''}</textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-secondary" onclick="saveJournal('${editId || ''}', 'draft')">Save as Draft</button>
      <button class="btn btn-primary" onclick="saveJournal('${editId || ''}', 'completed')">Save Entry</button>
    </div>
  `, 'lg');
}

function updateJournalSubjects() {
  const classId = document.getElementById('journal-class')?.value;
  const cls = MOCK_DATA.classes.find(c => c.id === classId);
  const subSelect = document.getElementById('journal-subject');
  if (cls && subSelect) {
    subSelect.innerHTML = '<option value="">Select Subject</option>' +
      cls.subjects.map(s => `<option value="${s}">${s}</option>`).join('');
  }
}

function saveJournal(editId, status) {
  const classId = document.getElementById('journal-class')?.value;
  const subject = document.getElementById('journal-subject')?.value;
  const date = document.getElementById('journal-date')?.value;
  const chapter = document.getElementById('journal-chapter')?.value;
  const topic = document.getElementById('journal-topic')?.value;
  const objectives = document.getElementById('journal-objectives')?.value;
  const activities = document.getElementById('journal-activities')?.value;
  const homework = document.getElementById('journal-homework')?.value;
  const remarks = document.getElementById('journal-remarks')?.value;

  if (!classId || !subject || !topic || !activities) {
    showToast('Missing Fields', 'Please fill in all required fields', 'error');
    return;
  }

  if (editId) {
    const j = MOCK_DATA.journal.find(x => x.id === editId);
    if (j) {
      Object.assign(j, { classId, subject, date, chapter, topic, objectives, activities, homework, remarks, status });
    }
  } else {
    MOCK_DATA.journal.push({
      id: generateId(), date, classId, subject, topic, chapter, objectives, activities, homework, remarks, materials: [], status
    });
  }

  closeModal();
  showToast('Journal Saved', `Entry "${topic}" has been ${status === 'draft' ? 'saved as draft' : 'saved successfully'}.`, 'success');
  if (AppState.currentPage === 'journal') AppState.navigate('journal');
  else if (AppState.currentPage === 'dashboard') AppState.navigate('dashboard');
}

// =====================================================
// CLASSES
// =====================================================
function renderClasses() {
  return `
    <div class="page-header">
      <div class="page-header-left">
        <h1>My Classes</h1>
        <p>Manage your classes, subjects, and students</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showClassModal()">+ New Class</button>
      </div>
    </div>

    <div class="classes-grid stagger-children">
      ${MOCK_DATA.classes.map(cls => {
        const subjects = cls.subjects.map(s => {
          const p = getSyllabusProgress(s, cls.id);
          return { name: s, progress: p };
        });
        return `
          <div class="card card-elevated card-interactive class-card" onclick="AppState.navigate('class-detail', {classId:'${cls.id}'})">
            <div class="class-card-accent ${cls.color}"></div>
            <div class="class-card-body">
              <h3>${cls.name}</h3>
              <div class="class-card-section">Section ${cls.section} • Grade ${cls.grade}</div>
              <div class="class-card-info">
                <div class="class-card-info-item">👨‍🎓 <span>${cls.studentCount}</span> students</div>
                <div class="class-card-info-item">📚 <span>${cls.subjects.length}</span> subjects</div>
              </div>
              <div class="class-card-subjects">
                ${subjects.map(s => `<span class="badge badge-blue">${s.name} (${s.progress}%)</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderClassDetail() {
  const classId = AppState.pageParams?.classId;
  const cls = MOCK_DATA.classes.find(c => c.id === classId);
  if (!cls) return '<div class="empty-state"><h3>Class not found</h3></div>';

  const students = getStudentsByClass(classId);
  const journals = getJournalByClass(classId).sort((a, b) => b.date.localeCompare(a.date));
  const materials = getMaterialsByClass(classId);
  const activeTab = AppState.activeTab['class-detail'] || 'overview';

  return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="flex items-center gap-3">
          <button class="btn btn-ghost btn-sm" onclick="AppState.navigate('classes')">← Back</button>
          <div>
            <h1>${cls.name}</h1>
            <p>Section ${cls.section} • Grade ${cls.grade} • ${cls.studentCount} Students</p>
          </div>
        </div>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showJournalModal()">+ Journal Entry</button>
      </div>
    </div>

    <div class="tabs">
      <div class="tab ${activeTab === 'overview' ? 'active' : ''}" onclick="switchClassTab('overview')">Overview</div>
      <div class="tab ${activeTab === 'students' ? 'active' : ''}" onclick="switchClassTab('students')">Students (${students.length})</div>
      <div class="tab ${activeTab === 'journal' ? 'active' : ''}" onclick="switchClassTab('journal')">Journal (${journals.length})</div>
      <div class="tab ${activeTab === 'materials' ? 'active' : ''}" onclick="switchClassTab('materials')">Materials (${materials.length})</div>
    </div>

    <div id="class-tab-content">
      ${activeTab === 'overview' ? renderClassOverview(cls, students) : ''}
      ${activeTab === 'students' ? renderClassStudents(students) : ''}
      ${activeTab === 'journal' ? renderClassJournal(journals) : ''}
      ${activeTab === 'materials' ? renderClassMaterials(materials) : ''}
    </div>
  `;
}

function switchClassTab(tab) {
  AppState.activeTab['class-detail'] = tab;
  AppState.navigate('class-detail', AppState.pageParams);
}

function renderClassOverview(cls, students) {
  return `
    <div class="stats-grid mb-6 stagger-children">
      ${cls.subjects.map(s => {
        const p = getSyllabusProgress(s, cls.id);
        return `
          <div class="card card-elevated stat-card" onclick="AppState.navigate('syllabus')">
            <div class="stat-card-icon blue">📋</div>
            <div class="stat-card-info">
              <div class="stat-card-label">${s}</div>
              <div class="stat-card-value">${p}%</div>
              <div class="progress-bar sm mt-2"><div class="progress-bar-fill" style="width:${p}%"></div></div>
            </div>
          </div>
        `;
      }).join('')}
      <div class="card card-elevated stat-card">
        <div class="stat-card-icon green">👨‍🎓</div>
        <div class="stat-card-info">
          <div class="stat-card-label">Average Attendance</div>
          <div class="stat-card-value">${Math.round(students.reduce((a, s) => a + s.attendance, 0) / (students.length || 1))}%</div>
          <div class="stat-card-trend up">Overall class</div>
        </div>
      </div>
    </div>

    <div class="card card-elevated">
      <div class="card-header">
        <h3 class="card-title">Curriculum & Subject Progress</h3>
        <button class="btn btn-ghost btn-sm" onclick="AppState.navigate('syllabus')">Open Syllabus Tracker →</button>
      </div>
      <div class="card-body">
        <div class="flex flex-col gap-4">
          ${cls.subjects.map(sub => {
            const p = getSyllabusProgress(sub, cls.id);
            return `
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium text-sm">${sub}</span>
                  <span class="text-xs font-semibold text-muted">${p}% Completed</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill green" style="width:${p}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderClassStudents(students) {
  return `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Attendance</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${students.sort((a, b) => a.rollNo - b.rollNo).map(s => `
            <tr>
              <td>${s.rollNo}</td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="student-avatar ${s.avatarColor}" style="width:32px;height:32px;font-size:var(--font-size-xs)">${s.name.split(' ').map(w => w[0]).join('')}</div>
                  <span class="font-medium">${s.name}</span>
                </div>
              </td>
              <td><span class="badge badge-${getAttendanceColor(s.attendance)}">${s.attendance}%</span></td>
              <td><span class="badge badge-${getGradeColor(s.avgGrade)}">${s.avgGrade}</span></td>
              <td><button class="btn btn-ghost btn-sm" onclick="AppState.navigate('student-detail', {studentId:'${s.id}'})">View →</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderClassJournal(journals) {
  return journals.length
    ? `<div class="flex flex-col gap-4 stagger-children">${journals.map(j => renderJournalCard(j)).join('')}</div>`
    : `<div class="empty-state"><div class="empty-state-icon">📝</div><h3>No Journal Entries</h3><p>Start recording your teaching activities for this class.</p><button class="btn btn-primary" onclick="showJournalModal()">+ New Entry</button></div>`;
}

function renderClassMaterials(materials) {
  return materials.length
    ? `<div class="materials-grid stagger-children">${materials.map(m => renderMaterialCard(m)).join('')}</div>`
    : `<div class="empty-state"><div class="empty-state-icon">📚</div><h3>No Materials</h3><p>Upload teaching materials for this class.</p><button class="btn btn-primary" onclick="showMaterialModal()">+ Upload</button></div>`;
}

function showClassModal() {
  showModal(`
    <div class="modal-header">
      <h2>Create New Class</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Class Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="new-class-name" placeholder="e.g., Class 10A">
        </div>
        <div class="form-group">
          <label class="form-label">Section</label>
          <input type="text" class="form-input" id="new-class-section" placeholder="e.g., A">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Grade <span class="required">*</span></label>
        <select class="form-select" id="new-class-grade">
          ${[1,2,3,4,5,6,7,8,9,10,11,12].map(g => `<option value="${g}">Grade ${g}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewClass()">Create Class</button>
    </div>
  `);
}

function saveNewClass() {
  const name = document.getElementById('new-class-name')?.value;
  const section = document.getElementById('new-class-section')?.value || 'A';
  const grade = document.getElementById('new-class-grade')?.value;

  if (!name) { showToast('Error', 'Please enter a class name', 'error'); return; }

  const colors = ['blue', 'green', 'amber', 'purple'];
  MOCK_DATA.classes.push({
    id: generateId(), name, section, grade: parseInt(grade), studentCount: 0,
    subjects: ['Science', 'Mathematics'], color: colors[MOCK_DATA.classes.length % 4], schedule: []
  });

  closeModal();
  showToast('Class Created', `${name} has been created successfully.`, 'success');
  AppState.navigate('classes');
}

// =====================================================
// STUDENTS & ASSESSMENT DIAGNOSTICS
// =====================================================
function changeStudentSort(sortValue) {
  const [field, order] = sortValue.split('-');
  AppState.studentSortBy = field;
  AppState.studentSortOrder = order || 'asc';
  renderApp();
}

function getSortedStudents(studentList) {
  const list = [...studentList];
  if (AppState.studentSortBy === 'rollNo') {
    list.sort((a, b) => AppState.studentSortOrder === 'desc' ? b.rollNo - a.rollNo : a.rollNo - b.rollNo);
  } else if (AppState.studentSortBy === 'name') {
    list.sort((a, b) => AppState.studentSortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  }
  return list;
}

function renderStudents() {
  const sorted = getSortedStudents(MOCK_DATA.students);

  return `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Students & Academic Diagnostics</h1>
        <p>Manage student profiles, parent details, and interactive question assessments</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showAddStudentModal()">+ Add New Student</button>
      </div>
    </div>

    <!-- Controls Bar: Search, Class Filter, and Arrange/Sort by Roll No or Name -->
    <div class="student-view-controls">
      <div class="filter-bar" style="margin-bottom:0;flex:1">
        <select class="form-select" id="student-filter-class" onchange="filterStudents()">
          <option value="">All Classes</option>
          ${MOCK_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <input type="text" class="form-input" placeholder="Search by name, roll no, parent..." id="student-search" oninput="filterStudents()" style="min-width:260px">
      </div>

      <div class="student-sort-group">
        <span class="text-xs font-semibold text-muted">Arrange Cards:</span>
        <select class="form-select" id="student-sort-select" onchange="changeStudentSort(this.value)">
          <option value="rollNo-asc" ${AppState.studentSortBy === 'rollNo' && AppState.studentSortOrder === 'asc' ? 'selected' : ''}>Roll Number (1 → 9)</option>
          <option value="rollNo-desc" ${AppState.studentSortBy === 'rollNo' && AppState.studentSortOrder === 'desc' ? 'selected' : ''}>Roll Number (9 → 1)</option>
          <option value="name-asc" ${AppState.studentSortBy === 'name' && AppState.studentSortOrder === 'asc' ? 'selected' : ''}>Student Name (A → Z)</option>
          <option value="name-desc" ${AppState.studentSortBy === 'name' && AppState.studentSortOrder === 'desc' ? 'selected' : ''}>Student Name (Z → A)</option>
        </select>
      </div>
    </div>

    <div class="students-grid stagger-children mt-5" id="students-grid">
      ${sorted.map(s => renderStudentCard(s)).join('')}
    </div>
  `;
}

function renderStudentCard(s) {
  const avgScore = Object.values(s.scores).reduce((a, b) => a + b, 0) / (Object.values(s.scores).length || 1);
  const questionsCount = MOCK_DATA.studentQuestions.filter(q => q.studentId === s.id).length;

  return `
    <div class="card card-elevated card-interactive student-card" onclick="AppState.navigate('student-detail', {studentId:'${s.id}'})">
      <div style="position:relative">
        <img src="${s.photo}" alt="${s.name}" class="student-avatar" style="width:72px;height:72px;object-fit:cover;border-radius:50%;border:3px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.1)" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'">
        <span class="badge badge-blue" style="position:absolute;bottom:-4px;right:0;font-size:10px">Roll #${s.rollNo}</span>
      </div>
      <h3 style="margin-top:var(--space-2)">${s.name}</h3>
      <div class="student-card-class">${getClassName(s.classId)} • Roll No. ${s.rollNo}</div>
      
      <div class="text-xs text-muted mb-2 text-center" style="line-height:1.4">
        <div>👨‍👩‍👧 <strong>Parent:</strong> ${s.parentName}</div>
        <div>📞 ${s.phone}</div>
      </div>

      <div class="student-card-stats">
        <div class="student-card-stat">
          <div class="student-card-stat-value">${s.attendance}%</div>
          <div class="student-card-stat-label">Attendance</div>
        </div>
        <div class="student-card-stat">
          <div class="student-card-stat-value">${Math.round(avgScore)}</div>
          <div class="student-card-stat-label">Avg Score</div>
        </div>
        <div class="student-card-stat">
          <div class="student-card-stat-value">${questionsCount}</div>
          <div class="student-card-stat-label">Quizzes</div>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm btn-block mt-3" style="color:var(--primary-600)">View Full Details & Quizzes →</button>
    </div>
  `;
}

function filterStudents() {
  const cls = document.getElementById('student-filter-class')?.value;
  const search = document.getElementById('student-search')?.value?.toLowerCase() || '';

  let filtered = [...MOCK_DATA.students];
  if (cls) filtered = filtered.filter(s => s.classId === cls);
  if (search) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.rollNo.toString().includes(search) ||
      (s.parentName && s.parentName.toLowerCase().includes(search)) ||
      (s.address && s.address.toLowerCase().includes(search))
    );
  }

  filtered = getSortedStudents(filtered);

  const grid = document.getElementById('students-grid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? filtered.map(s => renderStudentCard(s)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">👨‍🎓</div><h3>No students found</h3><p>Try adjusting your search or add a new student.</p><button class="btn btn-primary" onclick="showAddStudentModal()">+ Add Student</button></div>`;
  }
}

// Student Split View: Left roster column + Right full info & Question Hub
function switchDetailStudent(newStudentId) {
  AppState.pageParams = { studentId: newStudentId };
  AppState.activeStudentId = newStudentId;
  renderApp();
}

function renderStudentDetail() {
  const studentId = AppState.pageParams?.studentId || AppState.activeStudentId || 's1';
  const s = MOCK_DATA.students.find(x => x.id === studentId) || MOCK_DATA.students[0];
  if (!s) return '<div class="empty-state"><h3>Student not found</h3></div>';

  const cls = MOCK_DATA.classes.find(c => c.id === s.classId);
  const avgScore = Object.values(s.scores).reduce((a, b) => a + b, 0) / (Object.values(s.scores).length || 1);
  const sortedStudents = getSortedStudents(MOCK_DATA.students);

  // Student questions & live stats
  const questions = MOCK_DATA.studentQuestions.filter(q => q.studentId === s.id);
  const answered = questions.filter(q => q.studentAnswerIndex !== null && q.studentAnswerIndex !== undefined);
  const correctCount = answered.filter(q => q.studentAnswerIndex === q.correctIndex).length;
  const wrongCount = answered.length - correctCount;
  const accuracy = answered.length > 0 ? Math.round((correctCount / answered.length) * 100) : 0;

  // Subject strength breakdown
  const subjectStats = {};
  answered.forEach(q => {
    if (!subjectStats[q.subject]) subjectStats[q.subject] = { total: 0, correct: 0 };
    subjectStats[q.subject].total++;
    if (q.studentAnswerIndex === q.correctIndex) subjectStats[q.subject].correct++;
  });

  const subjectStrengths = Object.keys(subjectStats).map(subj => {
    const data = subjectStats[subj];
    const pct = Math.round((data.correct / data.total) * 100);
    return { subject: subj, total: data.total, correct: data.correct, percent: pct };
  });

  const topSubject = subjectStrengths.length
    ? [...subjectStrengths].sort((a, b) => b.percent - a.percent)[0]
    : null;
  const weakSubject = subjectStrengths.length > 1
    ? [...subjectStrengths].sort((a, b) => a.percent - b.percent)[0]
    : null;

  return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="flex items-center gap-3">
          <button class="btn btn-primary btn-sm" onclick="AppState.navigate('students')" style="display:flex;align-items:center;gap:6px">
            <span>← Back to Students</span>
          </button>
          <div>
            <h1>${s.name} — Student Diagnostics & Assessments</h1>
            <p>Roll No. ${s.rollNo} • ${cls?.name || ''} • Selected from Left Navigation Roster</p>
          </div>
        </div>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-secondary" onclick="showAddStudentModal()">+ Add New Student</button>
      </div>
    </div>

    <!-- Student Detail & Assessment Content -->
    <div class="student-detail-pane animate-fade-in" style="display:flex;flex-direction:column;gap:var(--space-6)">
      <!-- Student Hero Info Card -->
      <div class="student-info-hero">
          <img src="${s.photo}" alt="${s.name}" class="student-big-photo" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'">
          <div style="flex:1">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 style="font-size:1.6rem;font-weight:800;color:var(--neutral-800);line-height:1.2">${s.name}</h2>
                <div class="flex items-center gap-2 mt-1">
                  <span class="badge badge-blue">Roll #${s.rollNo}</span>
                  <span class="badge badge-green">${cls?.name || ''}</span>
                  <span class="badge badge-neutral">${s.gender === 'M' ? 'Male' : 'Female'}</span>
                  <span class="badge badge-cyan">Blood Group: ${s.bloodGroup || 'O+'}</span>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="showEditStudentModal('${s.id}')">✏️ Edit Details</button>
            </div>

            <!-- Detailed Info Grid: Parent Name, Address, Phone, Emergency -->
            <div class="student-info-grid">
              <div class="info-item">
                <label>Parent / Guardian</label>
                <span>👨‍👩‍👧 ${s.parentName}</span>
              </div>
              <div class="info-item">
                <label>Phone Number</label>
                <span>📞 <a href="tel:${s.phone}" style="color:var(--primary-600)">${s.phone}</a></span>
              </div>
              <div class="info-item" style="grid-column:1/-1">
                <label>Residential Address</label>
                <span>🏠 ${s.address}</span>
              </div>
              <div class="info-item">
                <label>Emergency Contact</label>
                <span>🚨 ${s.emergencyContact || s.phone}</span>
              </div>
              <div class="info-item">
                <label>Attendance Rate</label>
                <span class="badge badge-${getAttendanceColor(s.attendance)}">${s.attendance}% Present</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Academic Scores Breakdown -->
        <div class="card card-elevated">
          <div class="card-header">
            <h3 class="card-title">Academic Subject Scores</h3>
          </div>
          <div class="card-body">
            <div class="data-table-wrapper">
              <table class="data-table">
                <thead><tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Proficiency Bar</th></tr></thead>
                <tbody>
                  ${Object.entries(s.scores).map(([sub, score]) => {
                    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C';
                    return `
                      <tr>
                        <td class="font-semibold">${sub}</td>
                        <td>${score} / 100</td>
                        <td><span class="badge badge-${getGradeColor(grade)}">${grade}</span></td>
                        <td style="min-width:140px">
                          <div class="progress-bar sm">
                            <div class="progress-bar-fill ${score >= 80 ? 'green' : score >= 60 ? '' : 'amber'}" style="width:${score}%"></div>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- BOTTOM SECTION: Question & Assessment Hub with Share Option & Subject Strengths -->
        <div class="question-hub-card">
          <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 style="font-size:1.3rem;font-weight:800;color:var(--neutral-800)">Practice & Assessment Hub</h3>
              <p class="text-xs text-muted mt-1">Add custom questions for ${s.name}, share for student answers, and view live correct/wrong statistics & subject diagnosis.</p>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm" onclick="showAddQuestionModal('${s.id}')">+ Add Question</button>
              <button class="btn btn-secondary btn-sm" onclick="showShareQuizModal('${s.id}')">📤 Share with Student</button>
              <button class="btn btn-ghost btn-sm" onclick="showAnswerQuizModal('${s.id}')" style="border:1px solid var(--accent-400);color:var(--accent-700)">✍️ Student Take Test</button>
            </div>
          </div>

          <!-- Live Evaluation Stats Banner (Correct vs Wrong) -->
          <div class="quiz-stats-banner">
            <div class="quiz-stat-box">
              <div class="quiz-stat-value" style="color:var(--neutral-800)">${questions.length}</div>
              <div class="quiz-stat-label">Total Questions</div>
            </div>
            <div class="quiz-stat-box">
              <div class="quiz-stat-value" style="color:var(--accent-600)">${correctCount}</div>
              <div class="quiz-stat-label">Correct Answers ✓</div>
            </div>
            <div class="quiz-stat-box">
              <div class="quiz-stat-value" style="color:var(--danger-500)">${wrongCount}</div>
              <div class="quiz-stat-label">Wrong Answers ✕</div>
            </div>
            <div class="quiz-stat-box">
              <div class="quiz-stat-value" style="color:var(--primary-600)">${accuracy}%</div>
              <div class="quiz-stat-label">Assessment Accuracy</div>
            </div>
          </div>

          <!-- Subject Strength Diagnosis (Figures out which subject the student is good at) -->
          <div class="subject-analysis-card">
            <div class="flex items-center justify-between mb-2">
              <h4 style="font-size:var(--font-size-sm);font-weight:700;color:var(--neutral-800)">
                Subject Strength & Competency Breakdown:
              </h4>
              <span class="text-xs text-muted">Diagnosed from student responses</span>
            </div>
            
            <div class="flex gap-3 flex-wrap mb-3">
              ${subjectStrengths.map(st => `
                <div style="display:flex;align-items:center;gap:6px;background:var(--neutral-50);border:1px solid var(--neutral-200);padding:6px 12px;border-radius:var(--radius-md)">
                  <span class="font-semibold text-xs">${st.subject}:</span>
                  <span class="${st.percent >= 80 ? 'strength-tag-good' : 'strength-tag-need-help'}">
                    ${st.percent >= 80 ? '🌟 High Proficiency' : '⚠️ Needs Practice'} (${st.correct}/${st.total} - ${st.percent}%)
                  </span>
                </div>
              `).join('')}
            </div>

            <!-- Dynamic Teacher Insight Banner -->
            <div style="background:rgba(59,147,109,0.08);border-left:4px solid var(--accent-500);padding:10px 14px;border-radius:var(--radius-md);font-size:var(--font-size-xs);color:var(--neutral-700)">
              <strong>Teacher Diagnostic Insight:</strong> 
              ${topSubject ? `
                <strong>${s.name} is strongest in ${topSubject.subject}</strong> (${topSubject.percent}% accuracy), showing confident conceptual mastery.
                ${weakSubject && weakSubject.percent < 80 ? ` In <strong>${weakSubject.subject}</strong> (${weakSubject.percent}%), further guided problem practice is suggested.` : ' Consistent high performance across evaluated subjects!'}
              ` : `
                No questions answered yet. Click "Share with Student" or "Student Take Test" to record answers and generate subject strengths!
              `}
            </div>
          </div>

          <!-- Questions List -->
          <div class="mt-5">
            <div class="flex items-center justify-between mb-3">
              <h4 style="font-size:var(--font-size-sm);font-weight:700;color:var(--neutral-700)">Current Question Roster (${questions.length})</h4>
              <span class="text-xs text-muted">Green = Correct Answer</span>
            </div>

            ${questions.length ? questions.map((q, idx) => {
              const hasAnswered = q.studentAnswerIndex !== null && q.studentAnswerIndex !== undefined;
              const isCorrect = hasAnswered && q.studentAnswerIndex === q.correctIndex;
              return `
                <div class="question-item-card" id="q-${q.id}">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="badge badge-neutral" style="font-weight:700">Q${idx + 1}</span>
                        <span class="badge badge-cyan">${q.subject}</span>
                        ${hasAnswered ? `
                          <span class="badge ${isCorrect ? 'badge-green' : 'badge-danger'}">
                            ${isCorrect ? '✓ Student Answered Correctly' : '✕ Student Answered Wrong'}
                          </span>
                        ` : '<span class="badge badge-amber">Awaiting Response</span>'}
                      </div>
                      <div class="font-medium text-sm" style="color:var(--neutral-800)">${q.question}</div>
                    </div>
                    <button class="btn btn-ghost btn-xs text-muted" onclick="deleteQuestion('${q.id}')" title="Delete Question">🗑️</button>
                  </div>

                  <div class="question-options-grid">
                    ${q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctIndex;
                      const isOptionStudentAnswer = hasAnswered && optIdx === q.studentAnswerIndex;
                      let pillClass = '';
                      if (isOptionCorrect) pillClass = 'correct';
                      else if (isOptionStudentAnswer && !isOptionCorrect) pillClass = 'wrong-selected';

                      return `
                        <div class="question-option-pill ${pillClass}">
                          <span>${['A', 'B', 'C', 'D'][optIdx]}.</span>
                          <span style="flex:1">${opt}</span>
                          ${isOptionCorrect ? '<span title="Correct Answer">✓</span>' : ''}
                          ${isOptionStudentAnswer && !isOptionCorrect ? '<span title="Student Picked">✕</span>' : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="empty-state" style="padding:var(--space-6)">
                <p class="text-sm text-muted">No assessment questions created yet for ${s.name}.</p>
                <button class="btn btn-primary btn-sm mt-2" onclick="showAddQuestionModal('${s.id}')">+ Add First Question</button>
              </div>
            `}
          </div>
        </div>
      </div>
  `;
}

function filterRosterList(query) {
  const q = query.toLowerCase();
  const items = document.querySelectorAll('.student-roster-item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(q) ? 'flex' : 'none';
  });
}

// Add / Edit Student Modals
function showAddStudentModal() {
  const avatarPresets = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  ];

  showModal(`
    <div class="modal-header">
      <h2>Add New Student Profile</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Roll Number <span class="required">*</span></label>
          <input type="number" class="form-input" id="new-stu-roll" placeholder="e.g., 9" value="${MOCK_DATA.students.length + 1}" required>
        </div>
        <div class="form-group" style="flex:2">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="new-stu-name" placeholder="e.g., Harshita Singhania" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Assigned Class <span class="required">*</span></label>
          <select class="form-select" id="new-stu-class">
            ${MOCK_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Gender</label>
          <select class="form-select" id="new-stu-gender">
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Blood Group</label>
          <select class="form-select" id="new-stu-blood">
            <option value="O+">O+</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="O-">O-</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group" style="flex:1.5">
          <label class="form-label">Parent / Guardian Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="new-stu-parent" placeholder="e.g., Rajiv & Neeta Singhania" required>
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Phone Number <span class="required">*</span></label>
          <input type="tel" class="form-input" id="new-stu-phone" placeholder="e.g., +91 98118 76543" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Residential Address <span class="required">*</span></label>
        <input type="text" class="form-input" id="new-stu-address" placeholder="e.g., Flat 501, Silver Heights, Sector 50, Noida" required>
      </div>

      <div class="form-group">
        <label class="form-label">Photo URL / Choose Avatar</label>
        <input type="text" class="form-input" id="new-stu-photo" placeholder="Enter image URL or select from below" value="${avatarPresets[0]}">
        <div class="flex gap-2 mt-2">
          ${avatarPresets.map((img, i) => `
            <img src="${img}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;cursor:pointer;border:2px solid var(--neutral-200)"
                 onclick="document.getElementById('new-stu-photo').value='${img}'" title="Select Preset ${i + 1}">
          `).join('')}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewStudent()">Create Student Profile</button>
    </div>
  `, 'lg');
}

function saveNewStudent() {
  const rollNo = parseInt(document.getElementById('new-stu-roll')?.value) || (MOCK_DATA.students.length + 1);
  const name = document.getElementById('new-stu-name')?.value.trim();
  const classId = document.getElementById('new-stu-class')?.value;
  const gender = document.getElementById('new-stu-gender')?.value;
  const bloodGroup = document.getElementById('new-stu-blood')?.value;
  const parentName = document.getElementById('new-stu-parent')?.value.trim();
  const phone = document.getElementById('new-stu-phone')?.value.trim();
  const address = document.getElementById('new-stu-address')?.value.trim();
  const photo = document.getElementById('new-stu-photo')?.value.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  if (!name || !parentName || !phone) {
    showToast('Missing Fields', 'Please fill in the student name, parent name, and phone number.', 'error');
    return;
  }

  const newId = generateId();
  const newStudent = {
    id: newId,
    name,
    classId,
    rollNo,
    gender,
    photo,
    parentName,
    phone,
    address: address || 'New Delhi, India',
    bloodGroup,
    emergencyContact: phone,
    avatarColor: 'blue',
    attendance: 95,
    avgGrade: 'A',
    scores: { Science: 85, Mathematics: 88, 'Social Science': 82 },
    remarks: ['Newly enrolled student. Motivated and eager to learn.']
  };

  MOCK_DATA.students.push(newStudent);
  closeModal();
  showToast('Student Created', `${name} (Roll #${rollNo}) has been successfully added.`, 'success');
  AppState.activeStudentId = newId;
  AppState.navigate('student-detail', { studentId: newId });
}

function showEditStudentModal(studentId) {
  const s = MOCK_DATA.students.find(x => x.id === studentId);
  if (!s) return;

  showModal(`
    <div class="modal-header">
      <h2>Edit Student Info</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Roll Number</label>
          <input type="number" class="form-input" id="edit-stu-roll" value="${s.rollNo}">
        </div>
        <div class="form-group" style="flex:2">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" id="edit-stu-name" value="${s.name}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1.5">
          <label class="form-label">Parent Name</label>
          <input type="text" class="form-input" id="edit-stu-parent" value="${s.parentName}">
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Phone</label>
          <input type="tel" class="form-input" id="edit-stu-phone" value="${s.phone}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Residential Address</label>
        <input type="text" class="form-input" id="edit-stu-address" value="${s.address}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEditedStudent('${s.id}')">Save Changes</button>
    </div>
  `);
}

function saveEditedStudent(studentId) {
  const s = MOCK_DATA.students.find(x => x.id === studentId);
  if (!s) return;
  s.rollNo = parseInt(document.getElementById('edit-stu-roll')?.value) || s.rollNo;
  s.name = document.getElementById('edit-stu-name')?.value.trim() || s.name;
  s.parentName = document.getElementById('edit-stu-parent')?.value.trim() || s.parentName;
  s.phone = document.getElementById('edit-stu-phone')?.value.trim() || s.phone;
  s.address = document.getElementById('edit-stu-address')?.value.trim() || s.address;

  closeModal();
  showToast('Profile Updated', 'Student details have been updated successfully.', 'success');
  renderApp();
}

// Question & Assessment Hub Handlers
function showAddQuestionModal(studentId) {
  showModal(`
    <div class="modal-header">
      <h2>Add Assessment Question</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Subject Category <span class="required">*</span></label>
        <select class="form-select" id="new-q-subject">
          <option value="Science">Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Social Science">Social Science</option>
          <option value="English">English</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Question Text <span class="required">*</span></label>
        <textarea class="form-textarea" id="new-q-text" rows="3" placeholder="Type the question here..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Option A <span class="required">*</span></label>
          <input type="text" class="form-input" id="new-q-opt0" placeholder="Option A">
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Option B <span class="required">*</span></label>
          <input type="text" class="form-input" id="new-q-opt1" placeholder="Option B">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Option C <span class="required">*</span></label>
          <input type="text" class="form-input" id="new-q-opt2" placeholder="Option C">
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Option D <span class="required">*</span></label>
          <input type="text" class="form-input" id="new-q-opt3" placeholder="Option D">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Correct Option <span class="required">*</span></label>
        <select class="form-select" id="new-q-correct">
          <option value="0">Option A is Correct</option>
          <option value="1">Option B is Correct</option>
          <option value="2">Option C is Correct</option>
          <option value="3">Option D is Correct</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewQuestion('${studentId}')">Save Question</button>
    </div>
  `, 'lg');
}

function saveNewQuestion(studentId) {
  const subject = document.getElementById('new-q-subject')?.value;
  const question = document.getElementById('new-q-text')?.value.trim();
  const opt0 = document.getElementById('new-q-opt0')?.value.trim();
  const opt1 = document.getElementById('new-q-opt1')?.value.trim();
  const opt2 = document.getElementById('new-q-opt2')?.value.trim();
  const opt3 = document.getElementById('new-q-opt3')?.value.trim();
  const correctIndex = parseInt(document.getElementById('new-q-correct')?.value) || 0;

  if (!question || !opt0 || !opt1) {
    showToast('Incomplete Question', 'Please enter question text and at least two options.', 'error');
    return;
  }

  const options = [opt0, opt1, opt2 || 'None of the above', opt3 || 'All of the above'];

  MOCK_DATA.studentQuestions.push({
    id: generateId(),
    studentId,
    question,
    options,
    correctIndex,
    subject,
    studentAnswerIndex: null // not answered yet
  });

  closeModal();
  showToast('Question Added', 'Assessment question added for this student.', 'success');
  renderApp();
}

function deleteQuestion(questionId) {
  const idx = MOCK_DATA.studentQuestions.findIndex(q => q.id === questionId);
  if (idx >= 0) {
    MOCK_DATA.studentQuestions.splice(idx, 1);
    showToast('Question Deleted', 'Question removed from student hub.', 'info');
    renderApp();
  }
}

function showShareQuizModal(studentId) {
  const s = MOCK_DATA.students.find(x => x.id === studentId);
  const questionsCount = MOCK_DATA.studentQuestions.filter(q => q.studentId === studentId).length;
  const shareLink = `https://teachtrack.edu/quiz/${studentId}`;

  showModal(`
    <div class="modal-header">
      <h2>Share Assessment with ${s?.name || 'Student'}</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <p class="text-sm text-muted mb-4">
        Share this direct link with <strong>${s?.name}</strong> or their parents. Once the student completes and submits the questions, live stats and subject strengths will appear on this page.
      </p>

      <div class="form-group">
        <label class="form-label">Student Quiz Access Link</label>
        <div class="flex gap-2">
          <input type="text" class="form-input" id="share-link-input" value="${shareLink}" readonly>
          <button class="btn btn-secondary" onclick="navigator.clipboard?.writeText('${shareLink}'); showToast('Link Copied', 'Student assessment link copied to clipboard!', 'success');">Copy Link</button>
        </div>
      </div>

      <div style="background:var(--neutral-50);border:1px solid var(--neutral-200);border-radius:var(--radius-lg);padding:var(--space-4);margin-top:var(--space-4)">
        <div class="font-semibold text-sm mb-1">Assessment Summary</div>
        <div class="text-xs text-muted">Includes ${questionsCount} practice questions in Science & Mathematics.</div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="closeModal(); showAnswerQuizModal('${studentId}');">Open Student Answer Portal ✍️</button>
    </div>
  `);
}

function showAnswerQuizModal(studentId) {
  const s = MOCK_DATA.students.find(x => x.id === studentId);
  const questions = MOCK_DATA.studentQuestions.filter(q => q.studentId === studentId);

  if (!questions.length) {
    showToast('No Questions', 'Please add questions before launching the student answer portal.', 'error');
    return;
  }

  showModal(`
    <div class="modal-header">
      <h2>Student Answer Portal — ${s?.name}</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" style="max-height:65vh;overflow-y:auto">
      <p class="text-xs text-muted mb-4">Simulate or record ${s?.name}'s responses for each question:</p>
      
      <form id="student-quiz-form">
        ${questions.map((q, qIndex) => `
          <div style="background:var(--neutral-50);border:1px solid var(--neutral-200);border-radius:var(--radius-lg);padding:var(--space-4);margin-bottom:var(--space-4)">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-neutral">Q${qIndex + 1}</span>
              <span class="badge badge-cyan">${q.subject}</span>
            </div>
            <p class="font-semibold text-sm mb-3" style="color:var(--neutral-800)">${q.question}</p>
            
            <div class="flex flex-col gap-2">
              ${q.options.map((opt, optIndex) => `
                <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#ffffff;border:1px solid var(--neutral-200);border-radius:var(--radius-md);cursor:pointer">
                  <input type="radio" name="q_${q.id}" value="${optIndex}" ${q.studentAnswerIndex === optIndex ? 'checked' : ''}>
                  <span class="text-sm">${['A', 'B', 'C', 'D'][optIndex]}. ${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitStudentQuiz('${studentId}')">Submit Answers & Calculate Stats</button>
    </div>
  `, 'lg');
}

function submitStudentQuiz(studentId) {
  const questions = MOCK_DATA.studentQuestions.filter(q => q.studentId === studentId);
  questions.forEach(q => {
    const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
    if (selected) {
      q.studentAnswerIndex = parseInt(selected.value);
    }
  });

  closeModal();
  showToast('Assessment Submitted', 'Student answers evaluated! Instant stats and subject mastery updated.', 'success');
  renderApp();
}

// =====================================================
// MATERIALS & LESSON RECORDS (DUAL TABS)
// =====================================================
function renderMaterials() {
  const activeTab = AppState.activeTab['materials-tab'] || 'resources';

  return `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Teaching Materials & Lesson Records</h1>
        <p>Resource library, uploads, and transferred curriculum lesson records</p>
      </div>
      <div class="page-header-actions">
        ${activeTab === 'resources' 
          ? `<button class="btn btn-primary" onclick="showMaterialModal()">+ Upload Material</button>`
          : `<button class="btn btn-primary" onclick="showAddLessonRecordModal()">+ Add Lesson Record</button>`
        }
      </div>
    </div>

    <!-- Materials Tab Navigation -->
    <div class="materials-tab-nav mb-5" style="display:flex;gap:12px;border-bottom:2px solid var(--neutral-200);padding-bottom:12px">
      <button class="btn ${activeTab === 'resources' ? 'btn-primary' : 'btn-secondary'}" onclick="switchMaterialsTab('resources')">
        📁 Teaching Resources & Files (${MOCK_DATA.materials.length})
      </button>
      <button class="btn ${activeTab === 'records' ? 'btn-primary' : 'btn-secondary'}" onclick="switchMaterialsTab('records')">
        📖 Curriculum & Lesson Records (${MOCK_DATA.journal.length})
      </button>
    </div>

    ${activeTab === 'resources' ? renderMaterialsResourcesTab() : renderMaterialsLessonRecordsTab()}
  `;
}

function switchMaterialsTab(tab) {
  AppState.activeTab['materials-tab'] = tab;
  renderApp();
}

function renderMaterialsResourcesTab() {
  return `
    <div class="filter-bar">
      <select class="form-select" id="mat-filter-class" onchange="filterMaterials()">
        <option value="">All Classes</option>
        ${MOCK_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
      <select class="form-select" id="mat-filter-subject" onchange="filterMaterials()">
        <option value="">All Subjects</option>
        <option value="Science">Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Social Science">Social Science</option>
      </select>
      <select class="form-select" id="mat-filter-type" onchange="filterMaterials()">
        <option value="">All Types</option>
        <option value="pdf">PDF</option>
        <option value="ppt">Presentation</option>
        <option value="doc">Document</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="link">Link</option>
      </select>
      <input type="text" class="form-input" placeholder="Search materials..." id="mat-search" oninput="filterMaterials()" style="min-width:200px">
    </div>

    <div class="materials-grid stagger-children" id="materials-grid">
      ${MOCK_DATA.materials.map(m => renderMaterialCard(m)).join('')}
    </div>
  `;
}

function renderMaterialsLessonRecordsTab() {
  return `
    <div class="filter-bar">
      <select class="form-select" id="rec-filter-class" onchange="filterLessonRecords()">
        <option value="">All Classes</option>
        ${MOCK_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
      <select class="form-select" id="rec-filter-subject" onchange="filterLessonRecords()">
        <option value="">All Subjects</option>
        <option value="Science">Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Social Science">Social Science</option>
      </select>
      <input type="text" class="form-input" placeholder="Search lesson topics, objectives..." id="rec-search" oninput="filterLessonRecords()" style="min-width:220px">
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4" id="lesson-records-grid">
      ${MOCK_DATA.journal.map(entry => renderLessonRecordCard(entry)).join('')}
    </div>
  `;
}

function renderLessonRecordCard(entry) {
  return `
    <div class="card card-elevated card-interactive" style="border-left:4px solid var(--primary-500);display:flex;flex-direction:column;gap:12px;cursor:pointer" onclick="viewLessonRecord('${entry.id}')">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="badge badge-primary">${getClassName(entry.classId)}</span>
            <span class="badge badge-neutral">${entry.subject}</span>
            <span class="badge ${entry.status === 'completed' ? 'badge-green' : 'badge-amber'}">${entry.status.toUpperCase()}</span>
          </div>
          <h3 style="font-size:var(--font-size-base);font-weight:700;color:var(--neutral-900);margin:0">${entry.topic}</h3>
        </div>
        <span class="text-xs text-muted font-medium">${formatDateShort(entry.date)}</span>
      </div>

      <div>
        <div class="text-xs text-muted font-semibold uppercase mb-1">Learning Objectives:</div>
        <ul style="margin:0;padding-left:18px;font-size:var(--font-size-xs);color:var(--neutral-700)">
          ${entry.objectives.slice(0, 2).map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>

      <div style="background:var(--neutral-50);padding:8px 12px;border-radius:var(--radius-md);border:1px solid var(--neutral-200)">
        <span class="text-xs font-semibold text-muted">Activities: </span>
        <span class="text-xs text-neutral-800">${entry.activities ? entry.activities.substring(0, 110) + '...' : 'Lesson conducted successfully.'}</span>
      </div>

      <div class="flex justify-between items-center text-xs text-muted pt-2" style="border-top:1px solid var(--neutral-150)">
        <span>Homework: <strong>${entry.homework || 'None'}</strong></span>
        <span>${entry.materials?.length || 0} Materials Linked 📎</span>
      </div>
    </div>
  `;
}

function filterLessonRecords() {
  const cls = document.getElementById('rec-filter-class')?.value;
  const sub = document.getElementById('rec-filter-subject')?.value;
  const search = document.getElementById('rec-search')?.value?.toLowerCase() || '';

  let filtered = [...MOCK_DATA.journal];
  if (cls) filtered = filtered.filter(j => j.classId === cls);
  if (sub) filtered = filtered.filter(j => j.subject === sub);
  if (search) filtered = filtered.filter(j => j.topic.toLowerCase().includes(search) || j.activities?.toLowerCase().includes(search) || j.homework?.toLowerCase().includes(search));

  const grid = document.getElementById('lesson-records-grid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? filtered.map(j => renderLessonRecordCard(j)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📖</div><h3>No lesson records found</h3><p>Try modifying your search or class filters.</p></div>`;
  }
}

function viewLessonRecord(id) {
  const entry = MOCK_DATA.journal.find(j => j.id === id);
  if (!entry) return;

  showModal(`
    <div class="modal-header">
      <h2>Curriculum Lesson Record</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="flex items-center gap-2 mb-3">
        <span class="badge badge-primary">${getClassName(entry.classId)}</span>
        <span class="badge badge-neutral">${entry.subject}</span>
        <span class="badge ${entry.status === 'completed' ? 'badge-green' : 'badge-amber'}">${entry.status.toUpperCase()}</span>
        <span class="text-xs text-muted ml-auto">${formatDate(entry.date)}</span>
      </div>

      <h3 style="font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-900);margin-bottom:16px">${entry.topic}</h3>

      <div class="mb-4">
        <h4 class="text-xs uppercase font-bold text-muted mb-2">Learning Objectives</h4>
        <ul style="padding-left:20px;font-size:var(--font-size-sm);color:var(--neutral-800)">
          ${entry.objectives.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>

      <div class="mb-4">
        <h4 class="text-xs uppercase font-bold text-muted mb-2">Classroom Activities & Pedagogy</h4>
        <div style="background:var(--neutral-50);border:1px solid var(--neutral-200);border-radius:var(--radius-md);padding:12px;font-size:var(--font-size-sm)">
          ${entry.activities || 'Conducted standard classroom instructional session.'}
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-xs uppercase font-bold text-muted mb-2">Assigned Homework</h4>
        <p class="text-sm font-medium" style="color:var(--primary-700)">${entry.homework || 'No homework assigned.'}</p>
      </div>

      <div>
        <h4 class="text-xs uppercase font-bold text-muted mb-2">Linked Materials & References</h4>
        <div class="flex gap-2 flex-wrap">
          ${(entry.materials || []).map(matId => {
            const m = MOCK_DATA.materials.find(x => x.id === matId);
            return `<span class="badge badge-neutral">📎 ${m ? m.name : matId}</span>`;
          }).join('') || '<span class="text-xs text-muted">No external files attached.</span>'}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="showToast('Print', 'Lesson plan exported for inspection.', 'success')">Export Record</button>
    </div>
  `, 'lg');
}

function showAddLessonRecordModal() {
  showModal(`
    <div class="modal-header">
      <h2>Add Curriculum Lesson Record</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Class <span class="required">*</span></label>
          <select class="form-select" id="rec-add-class">
            ${MOCK_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Subject <span class="required">*</span></label>
          <select class="form-select" id="rec-add-subject">
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Social Science">Social Science</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Lesson Topic <span class="required">*</span></label>
        <input type="text" class="form-input" id="rec-add-topic" placeholder="e.g., Photosynthesis & Plant Nutrition">
      </div>

      <div class="form-group">
        <label class="form-label">Objectives (comma-separated)</label>
        <input type="text" class="form-input" id="rec-add-objectives" placeholder="e.g., Understand chloroplast function, Explain light reaction">
      </div>

      <div class="form-group">
        <label class="form-label">Activities & Experience</label>
        <textarea class="form-textarea" id="rec-add-activities" rows="3" placeholder="Describe classroom activities, demonstrations, and student responses..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Homework</label>
        <input type="text" class="form-input" id="rec-add-homework" placeholder="e.g., Exercises 1-5 on page 42">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewLessonRecord()">Save Lesson Record</button>
    </div>
  `, 'lg');
}

function saveNewLessonRecord() {
  const classId = document.getElementById('rec-add-class')?.value;
  const subject = document.getElementById('rec-add-subject')?.value;
  const topic = document.getElementById('rec-add-topic')?.value?.trim();
  const objStr = document.getElementById('rec-add-objectives')?.value?.trim() || '';
  const activities = document.getElementById('rec-add-activities')?.value?.trim() || '';
  const homework = document.getElementById('rec-add-homework')?.value?.trim() || '';

  if (!topic) {
    showToast('Missing Field', 'Please enter a lesson topic', 'error');
    return;
  }

  const objectives = objStr.split(',').map(s => s.trim()).filter(Boolean);

  MOCK_DATA.journal.unshift({
    id: generateId(),
    date: getToday(),
    classId,
    subject,
    topic,
    objectives: objectives.length ? objectives : ['Complete topic overview and key exercises'],
    activities,
    homework,
    materials: [],
    status: 'completed'
  });

  closeModal();
  showToast('Record Added', `Lesson record for "${topic}" added to Materials!`, 'success');
  renderApp();
}

function renderMaterialCard(m) {
  return `
    <div class="card card-elevated card-interactive material-card" onclick="viewMaterial('${m.id}')">
      <div class="material-card-icon ${m.type}">${getMaterialIcon(m.type)}</div>
      <h3>${m.name}</h3>
      <div class="material-card-meta">
        <span>${getClassName(m.classId)} • ${m.subject}</span>
        <span>${m.size} • ${formatDateShort(m.date)}</span>
      </div>
      <div class="material-card-tags">
        ${m.tags.slice(0, 3).map(t => `<span class="badge badge-neutral">${t}</span>`).join('')}
      </div>
    </div>
  `;
}

function filterMaterials() {
  const cls = document.getElementById('mat-filter-class')?.value;
  const sub = document.getElementById('mat-filter-subject')?.value;
  const type = document.getElementById('mat-filter-type')?.value;
  const search = document.getElementById('mat-search')?.value?.toLowerCase() || '';

  let filtered = [...MOCK_DATA.materials];
  if (cls) filtered = filtered.filter(m => m.classId === cls);
  if (sub) filtered = filtered.filter(m => m.subject === sub);
  if (type) filtered = filtered.filter(m => m.type === type);
  if (search) filtered = filtered.filter(m => m.name.toLowerCase().includes(search) || m.tags.some(t => t.toLowerCase().includes(search)));

  const grid = document.getElementById('materials-grid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? filtered.map(m => renderMaterialCard(m)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📚</div><h3>No materials found</h3><p>Try adjusting your filters or upload a new material.</p><button class="btn btn-primary" onclick="showMaterialModal()">+ Upload</button></div>`;
  }
}

function viewMaterial(id) {
  const m = MOCK_DATA.materials.find(x => x.id === id);
  if (!m) return;

  showModal(`
    <div class="modal-header">
      <h2>Material Details</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="flex items-center gap-4 mb-4">
        <div class="material-card-icon ${m.type}" style="width:64px;height:64px;font-size:1.8rem">${getMaterialIcon(m.type)}</div>
        <div>
          <h3 style="font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-800)">${m.name}</h3>
          <p class="text-sm text-muted mt-1">${m.type.toUpperCase()} • ${m.size}</p>
        </div>
      </div>
      <div class="flex gap-3 flex-wrap">
        <span class="badge badge-blue">${getClassName(m.classId)}</span>
        <span class="badge badge-cyan">${m.subject}</span>
        <span class="badge badge-neutral">${m.topic}</span>
      </div>
      <div>
        <div class="text-xs text-muted mb-2">UPLOADED</div>
        <div class="text-sm">${formatDate(m.date)}</div>
      </div>
      <div>
        <div class="text-xs text-muted mb-2">TAGS</div>
        <div class="flex gap-2 flex-wrap">
          ${m.tags.map(t => `<span class="badge badge-neutral">${t}</span>`).join('')}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="showToast('Download', 'Material downloaded successfully!', 'success')">Download</button>
    </div>
  `);
}

function showMaterialModal() {
  showModal(`
    <div class="modal-header">
      <h2>Upload Material</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Material Name <span class="required">*</span></label>
        <input type="text" class="form-input" id="mat-name" placeholder="e.g., Motion - Complete Notes">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Type <span class="required">*</span></label>
          <select class="form-select" id="mat-type">
            <option value="pdf">PDF</option>
            <option value="ppt">Presentation</option>
            <option value="doc">Document</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Class <span class="required">*</span></label>
          <select class="form-select" id="mat-class">
            ${MOCK_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Subject <span class="required">*</span></label>
          <select class="form-select" id="mat-subject">
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Social Science">Social Science</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Topic</label>
          <input type="text" class="form-input" id="mat-topic" placeholder="e.g., Motion">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tags</label>
        <input type="text" class="form-input" id="mat-tags" placeholder="Comma-separated tags, e.g., notes, physics, revision">
      </div>
      <div class="form-group">
        <label class="form-label">File</label>
        <div style="border:2px dashed var(--neutral-200);border-radius:var(--radius-lg);padding:var(--space-8);text-align:center;cursor:pointer;transition:all var(--transition-fast)" onmouseover="this.style.borderColor='var(--primary-300)'" onmouseout="this.style.borderColor='var(--neutral-200)'">
          <div style="font-size:2rem;margin-bottom:var(--space-2)">📎</div>
          <p class="text-sm text-muted">Click to select a file or drag and drop</p>
          <p class="text-xs text-muted mt-1">PDF, PPT, DOC, Images up to 10MB</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveMaterial()">Upload Material</button>
    </div>
  `, 'lg');
}

function saveMaterial() {
  const name = document.getElementById('mat-name')?.value;
  const type = document.getElementById('mat-type')?.value;
  const classId = document.getElementById('mat-class')?.value;
  const subject = document.getElementById('mat-subject')?.value;
  const topic = document.getElementById('mat-topic')?.value || '';
  const tagsStr = document.getElementById('mat-tags')?.value || '';
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

  if (!name) { showToast('Error', 'Please enter a material name', 'error'); return; }

  MOCK_DATA.materials.push({
    id: generateId(), name, type, classId, subject, topic, size: '1.2 MB',
    date: getToday(), tags
  });

  closeModal();
  showToast('Material Uploaded', `"${name}" has been uploaded successfully.`, 'success');
  if (AppState.currentPage === 'materials') AppState.navigate('materials');
}

// =====================================================
// SYLLABUS TRACKER WITH ADD, EDIT & DELETE TOPICS
// =====================================================
function renderSyllabus() {
  const activeSubject = AppState.activeTab['syllabus-subject'] || 'Science';
  const activeClass = AppState.activeTab['syllabus-class'] || 'c1';
  
  if (!MOCK_DATA.syllabus[activeSubject]) {
    MOCK_DATA.syllabus[activeSubject] = {};
  }
  if (!MOCK_DATA.syllabus[activeSubject][activeClass]) {
    MOCK_DATA.syllabus[activeSubject][activeClass] = [];
  }
  const chapters = MOCK_DATA.syllabus[activeSubject][activeClass];

  const totalTopics = chapters.reduce((a, ch) => a + ch.topics.length, 0);
  const completedTopics = chapters.reduce((a, ch) => a + ch.topics.filter(t => t.status === 'completed').length, 0);
  const inProgressTopics = chapters.reduce((a, ch) => a + ch.topics.filter(t => t.status === 'in-progress').length, 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Syllabus Tracker</h1>
        <p>Monitor chapter progress, add new topics, update existing lessons, or manage tasks</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showAddChapterModal('${activeSubject}', '${activeClass}')">+ Add Chapter</button>
      </div>
    </div>

    <div class="filter-bar mb-5">
      <select class="form-select" id="syllabus-class-select" onchange="switchSyllabusFilter()" style="min-width:150px">
        ${MOCK_DATA.classes.map(c => `<option value="${c.id}" ${c.id === activeClass ? 'selected' : ''}>${c.name}</option>`).join('')}
      </select>
      <select class="form-select" id="syllabus-subject-select" onchange="switchSyllabusFilter()" style="min-width:150px">
        <option value="Science" ${activeSubject === 'Science' ? 'selected' : ''}>Science</option>
        <option value="Mathematics" ${activeSubject === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
        <option value="Social Science" ${activeSubject === 'Social Science' ? 'selected' : ''}>Social Science</option>
      </select>
    </div>

    <!-- Progress Summary -->
    <div class="stats-grid mb-6 stagger-children">
      <div class="card card-elevated stat-card">
        <div class="stat-card-icon blue">📊</div>
        <div class="stat-card-info">
          <div class="stat-card-label">Overall Progress</div>
          <div class="stat-card-value">${overallProgress}%</div>
          <div class="progress-bar sm mt-2"><div class="progress-bar-fill" style="width:${overallProgress}%"></div></div>
        </div>
      </div>
      <div class="card card-elevated stat-card">
        <div class="stat-card-icon green">✓</div>
        <div class="stat-card-info">
          <div class="stat-card-label">Completed</div>
          <div class="stat-card-value">${completedTopics}</div>
          <div class="stat-card-trend up">topics done</div>
        </div>
      </div>
      <div class="card card-elevated stat-card">
        <div class="stat-card-icon amber">⏳</div>
        <div class="stat-card-info">
          <div class="stat-card-label">In Progress</div>
          <div class="stat-card-value">${inProgressTopics}</div>
          <div class="stat-card-trend up">ongoing</div>
        </div>
      </div>
      <div class="card card-elevated stat-card">
        <div class="stat-card-icon red">📋</div>
        <div class="stat-card-info">
          <div class="stat-card-label">Remaining</div>
          <div class="stat-card-value">${totalTopics - completedTopics - inProgressTopics}</div>
          <div class="stat-card-trend down">not started</div>
        </div>
      </div>
    </div>

    <!-- Chapters list -->
    <div id="syllabus-chapters" class="stagger-children flex flex-col gap-4">
      ${chapters.length ? chapters.map(ch => {
        const chCompleted = ch.topics.filter(t => t.status === 'completed').length;
        const chProgress = ch.topics.length ? Math.round((chCompleted / ch.topics.length) * 100) : 0;
        return `
          <div class="syllabus-chapter open" id="chapter-${ch.id}">
            <div class="syllabus-chapter-header" style="cursor:pointer" onclick="toggleChapter('${ch.id}')">
              <span class="chevron">▶</span>
              <span class="syllabus-chapter-title">${ch.name}</span>
              <div class="syllabus-chapter-progress" style="display:flex;align-items:center;gap:12px;margin-left:auto">
                <div class="progress-bar sm" style="width:140px">
                  <div class="progress-bar-fill ${chProgress === 100 ? 'green' : ''}" style="width:${chProgress}%"></div>
                </div>
                <span class="font-bold text-xs">${chProgress}%</span>
                <button class="btn btn-secondary btn-sm" style="padding:4px 10px;font-size:0.75rem" onclick="event.stopPropagation(); showAddTopicModal('${activeSubject}', '${activeClass}', '${ch.id}')">
                  + Add Topic
                </button>
              </div>
            </div>
            <div class="syllabus-topics" style="display:flex;flex-direction:column;gap:8px;padding:12px 16px">
              ${ch.topics.length ? ch.topics.map(t => `
                <div class="syllabus-topic" style="display:flex;align-items:center;gap:12px;padding:8px 12px;background:#ffffff;border:1px solid var(--neutral-200);border-radius:var(--radius-md)">
                  <div class="syllabus-topic-check ${t.status === 'completed' ? 'completed' : ''}"
                       title="Click to cycle status"
                       onclick="toggleTopicStatus('${activeSubject}', '${activeClass}', '${ch.id}', '${t.id}')">
                    ${t.status === 'completed' ? '✓' : ''}
                  </div>
                  <span class="syllabus-topic-name ${t.status === 'completed' ? 'completed' : ''}" style="flex:1;font-weight:500;font-size:var(--font-size-sm)">
                    ${t.name}
                  </span>
                  <span class="text-xs text-muted font-medium">${t.hours} hrs</span>
                  <span class="badge ${t.status === 'completed' ? 'badge-green' : t.status === 'in-progress' ? 'badge-amber badge-dot' : 'badge-neutral'}">
                    ${t.status === 'completed' ? 'Completed' : t.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                  ${t.completedDate ? `<span class="text-xs text-muted">${formatDateShort(t.completedDate)}</span>` : ''}
                  
                  <div class="flex items-center gap-1 ml-2">
                    <button class="btn btn-ghost btn-sm" title="Edit Topic" style="padding:4px 8px;font-size:0.8rem" onclick="showEditTopicModal('${activeSubject}', '${activeClass}', '${ch.id}', '${t.id}')">
                      ✏️
                    </button>
                    <button class="btn btn-ghost btn-sm" title="Delete Topic / Task" style="padding:4px 8px;font-size:0.8rem;color:var(--danger-500)" onclick="deleteTopic('${activeSubject}', '${activeClass}', '${ch.id}', '${t.id}')">
                      🗑️
                    </button>
                  </div>
                </div>
              `).join('') : `
                <div class="p-3 text-sm text-muted text-center" style="background:var(--neutral-50);border-radius:var(--radius-md)">
                  No topics yet. Click "+ Add Topic" to add the first lesson topic.
                </div>
              `}
            </div>
          </div>
        `;
      }).join('') : `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>No syllabus data</h3>
          <p>No chapters found for ${activeSubject} in ${getClassName(activeClass)}. Click below to create one:</p>
          <button class="btn btn-primary mt-3" onclick="showAddChapterModal('${activeSubject}', '${activeClass}')">+ Add First Chapter</button>
        </div>
      `}
    </div>
  `;
}

function showAddChapterModal(subject, classId) {
  showModal(`
    <div class="modal-header">
      <h2>Add Chapter</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Subject & Class</label>
        <input type="text" class="form-input" value="${subject} — ${getClassName(classId)}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Chapter Name / Title <span class="required">*</span></label>
        <input type="text" class="form-input" id="new-chapter-name" placeholder="e.g., Chapter 5: Periodic Classification of Elements">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewChapter('${subject}', '${classId}')">Create Chapter</button>
    </div>
  `);
}

function saveNewChapter(subject, classId) {
  const name = document.getElementById('new-chapter-name')?.value?.trim();
  if (!name) {
    showToast('Missing Field', 'Please enter a chapter name', 'error');
    return;
  }
  if (!MOCK_DATA.syllabus[subject]) MOCK_DATA.syllabus[subject] = {};
  if (!MOCK_DATA.syllabus[subject][classId]) MOCK_DATA.syllabus[subject][classId] = [];

  const newCh = {
    id: generateId(),
    name,
    topics: []
  };
  MOCK_DATA.syllabus[subject][classId].push(newCh);
  closeModal();
  showToast('Chapter Created', `"${name}" added successfully.`, 'success');
  renderApp();
}

function showAddTopicModal(subject, classId, chId) {
  const ch = MOCK_DATA.syllabus[subject]?.[classId]?.find(c => c.id === chId);
  if (!ch) return;

  showModal(`
    <div class="modal-header">
      <h2>Add Topic to ${ch.name}</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Topic / Task Name <span class="required">*</span></label>
        <input type="text" class="form-input" id="new-topic-name" placeholder="e.g., Mendeleev's Periodic Table & Anomalies">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Estimated Teaching Hours</label>
          <input type="number" class="form-input" id="new-topic-hours" value="2" min="1" max="50">
        </div>
        <div class="form-group">
          <label class="form-label">Initial Status</label>
          <select class="form-select" id="new-topic-status">
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewTopic('${subject}', '${classId}', '${chId}')">Add Topic</button>
    </div>
  `);
}

function saveNewTopic(subject, classId, chId) {
  const name = document.getElementById('new-topic-name')?.value?.trim();
  const hours = parseInt(document.getElementById('new-topic-hours')?.value) || 2;
  const status = document.getElementById('new-topic-status')?.value || 'not-started';

  if (!name) {
    showToast('Missing Field', 'Please enter a topic title', 'error');
    return;
  }

  const ch = MOCK_DATA.syllabus[subject]?.[classId]?.find(c => c.id === chId);
  if (!ch) return;

  ch.topics.push({
    id: generateId(),
    name,
    hours,
    status,
    completedDate: status === 'completed' ? getToday() : null
  });

  closeModal();
  showToast('Topic Added', `Topic "${name}" added to ${ch.name}`, 'success');
  renderApp();
}

function showEditTopicModal(subject, classId, chId, topicId) {
  const ch = MOCK_DATA.syllabus[subject]?.[classId]?.find(c => c.id === chId);
  if (!ch) return;
  const topic = ch.topics.find(t => t.id === topicId);
  if (!topic) return;

  showModal(`
    <div class="modal-header">
      <h2>Edit Topic / Task</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Topic / Task Name <span class="required">*</span></label>
        <input type="text" class="form-input" id="edit-topic-name" value="${topic.name}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Teaching Hours</label>
          <input type="number" class="form-input" id="edit-topic-hours" value="${topic.hours}" min="1" max="50">
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="edit-topic-status">
            <option value="not-started" ${topic.status === 'not-started' ? 'selected' : ''}>Not Started</option>
            <option value="in-progress" ${topic.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${topic.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEditedTopic('${subject}', '${classId}', '${chId}', '${topicId}')">Update Topic</button>
    </div>
  `);
}

function saveEditedTopic(subject, classId, chId, topicId) {
  const name = document.getElementById('edit-topic-name')?.value?.trim();
  const hours = parseInt(document.getElementById('edit-topic-hours')?.value) || 2;
  const status = document.getElementById('edit-topic-status')?.value || 'not-started';

  if (!name) {
    showToast('Missing Field', 'Please enter a topic name', 'error');
    return;
  }

  const ch = MOCK_DATA.syllabus[subject]?.[classId]?.find(c => c.id === chId);
  if (!ch) return;
  const topic = ch.topics.find(t => t.id === topicId);
  if (!topic) return;

  topic.name = name;
  topic.hours = hours;
  topic.status = status;
  if (status === 'completed' && !topic.completedDate) {
    topic.completedDate = getToday();
  } else if (status !== 'completed') {
    topic.completedDate = null;
  }

  closeModal();
  showToast('Topic Updated', `Topic "${name}" updated successfully.`, 'success');
  renderApp();
}

function deleteTopic(subject, classId, chId, topicId) {
  const ch = MOCK_DATA.syllabus[subject]?.[classId]?.find(c => c.id === chId);
  if (!ch) return;
  const topic = ch.topics.find(t => t.id === topicId);
  if (!topic) return;

  if (confirm(`Are you sure you want to delete the topic "${topic.name}" from ${ch.name}?`)) {
    ch.topics = ch.topics.filter(t => t.id !== topicId);
    showToast('Topic Deleted', `Deleted "${topic.name}".`, 'info');
    renderApp();
  }
}

function switchSyllabusFilter() {
  AppState.activeTab['syllabus-class'] = document.getElementById('syllabus-class-select')?.value;
  AppState.activeTab['syllabus-subject'] = document.getElementById('syllabus-subject-select')?.value;
  AppState.navigate('syllabus');
}

function toggleChapter(chId) {
  const el = document.getElementById(`chapter-${chId}`);
  if (el) el.classList.toggle('open');
}

function toggleTopicStatus(subject, classId, chId, topicId) {
  const chapters = MOCK_DATA.syllabus[subject]?.[classId];
  if (!chapters) return;
  const ch = chapters.find(c => c.id === chId);
  if (!ch) return;
  const topic = ch.topics.find(t => t.id === topicId);
  if (!topic) return;

  // Cycle: not-started → in-progress → completed → not-started
  if (topic.status === 'not-started') {
    topic.status = 'in-progress';
    topic.completedDate = null;
  } else if (topic.status === 'in-progress') {
    topic.status = 'completed';
    topic.completedDate = getToday();
  } else {
    topic.status = 'not-started';
    topic.completedDate = null;
  }

  showToast('Topic Updated', `"${topic.name}" is now ${topic.status.replace('-', ' ')}.`, 'success');
  AppState.navigate('syllabus');
}

// =====================================================
// REPORTS
// =====================================================
function renderReports() {
  const selectedReport = AppState.activeTab['report-type'] || 'journal';

  return `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Reports</h1>
        <p>Generate and export academic reports</p>
      </div>
    </div>

    <div class="report-type-grid stagger-children">
      <div class="card report-type-card ${selectedReport === 'journal' ? 'selected' : ''}" onclick="selectReportType('journal')">
        <div class="report-type-icon stat-card-icon blue">📝</div>
        <h3>Journal Report</h3>
        <p>Summary of teaching activities</p>
      </div>
      <div class="card report-type-card ${selectedReport === 'syllabus' ? 'selected' : ''}" onclick="selectReportType('syllabus')">
        <div class="report-type-icon stat-card-icon green">📋</div>
        <h3>Syllabus Report</h3>
        <p>Syllabus completion status</p>
      </div>
      <div class="card report-type-card ${selectedReport === 'progress' ? 'selected' : ''}" onclick="selectReportType('progress')">
        <div class="report-type-icon stat-card-icon amber">📊</div>
        <h3>Progress Report</h3>
        <p>Student performance overview</p>
      </div>
      <div class="card report-type-card ${selectedReport === 'class' ? 'selected' : ''}" onclick="selectReportType('class')">
        <div class="report-type-icon stat-card-icon cyan">🏫</div>
        <h3>Class Report</h3>
        <p>Overall class summary</p>
      </div>
    </div>

    <div class="filter-bar mb-5">
      <select class="form-select" id="report-class" onchange="generateReport()">
        <option value="">All Classes</option>
        ${MOCK_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
      <select class="form-select" id="report-subject" onchange="generateReport()">
        <option value="">All Subjects</option>
        <option value="Science">Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Social Science">Social Science</option>
      </select>
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print Report</button>
    </div>

    <div class="report-preview" id="report-preview">
      <div class="report-preview-header">
        <span class="text-sm font-semibold text-muted">Report Preview</span>
        <button class="btn btn-ghost btn-sm" onclick="window.print()">Export PDF</button>
      </div>
      <div class="report-preview-body" id="report-body">
        ${generateReportContent(selectedReport)}
      </div>
    </div>
  `;
}

function selectReportType(type) {
  AppState.activeTab['report-type'] = type;
  AppState.navigate('reports');
}

function generateReport() {
  const type = AppState.activeTab['report-type'] || 'journal';
  const body = document.getElementById('report-body');
  if (body) body.innerHTML = generateReportContent(type);
}

function generateReportContent(type) {
  const classFilter = document.getElementById('report-class')?.value;
  const subjectFilter = document.getElementById('report-subject')?.value;

  switch (type) {
    case 'journal': return generateJournalReport(classFilter, subjectFilter);
    case 'syllabus': return generateSyllabusReport(classFilter, subjectFilter);
    case 'progress': return generateProgressReport(classFilter);
    case 'class': return generateClassReport(classFilter);
    default: return '';
  }
}

function generateJournalReport(classFilter, subjectFilter) {
  let entries = [...MOCK_DATA.journal].sort((a, b) => b.date.localeCompare(a.date));
  if (classFilter) entries = entries.filter(j => j.classId === classFilter);
  if (subjectFilter) entries = entries.filter(j => j.subject === subjectFilter);

  return `
    <div class="report-preview-title">
      <h2>📝 Journal Report</h2>
      <p>Teaching Activity Summary • Generated ${formatDate(getToday())}</p>
    </div>
    <div class="mb-4">
      <span class="badge badge-blue">Total Entries: ${entries.length}</span>
      <span class="badge badge-green">Completed: ${entries.filter(j => j.status === 'completed').length}</span>
      <span class="badge badge-amber">Drafts: ${entries.filter(j => j.status === 'draft').length}</span>
    </div>
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Date</th><th>Class</th><th>Subject</th><th>Topic</th><th>Status</th></tr></thead>
        <tbody>
          ${entries.map(j => `
            <tr>
              <td>${formatDateShort(j.date)}</td>
              <td>${getClassName(j.classId)}</td>
              <td>${j.subject}</td>
              <td>${j.topic}</td>
              <td><span class="badge ${j.status === 'completed' ? 'badge-green' : 'badge-amber'}">${j.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function generateSyllabusReport(classFilter, subjectFilter) {
  let data = [];
  const subjects = subjectFilter ? [subjectFilter] : Object.keys(MOCK_DATA.syllabus);
  subjects.forEach(subject => {
    const classes = classFilter ? [classFilter] : Object.keys(MOCK_DATA.syllabus[subject] || {});
    classes.forEach(classId => {
      const chapters = MOCK_DATA.syllabus[subject]?.[classId] || [];
      chapters.forEach(ch => {
        const completed = ch.topics.filter(t => t.status === 'completed').length;
        const progress = Math.round((completed / ch.topics.length) * 100);
        data.push({
          className: getClassName(classId), subject, chapter: ch.name,
          total: ch.topics.length, completed, progress
        });
      });
    });
  });

  return `
    <div class="report-preview-title">
      <h2>📋 Syllabus Completion Report</h2>
      <p>Subject-wise Progress • Generated ${formatDate(getToday())}</p>
    </div>
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Class</th><th>Subject</th><th>Chapter</th><th>Topics</th><th>Completed</th><th>Progress</th></tr></thead>
        <tbody>
          ${data.map(d => `
            <tr>
              <td>${d.className}</td>
              <td>${d.subject}</td>
              <td>${d.chapter}</td>
              <td>${d.total}</td>
              <td>${d.completed}</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="progress-bar sm" style="width:80px">
                    <div class="progress-bar-fill ${d.progress === 100 ? 'green' : d.progress >= 50 ? '' : 'amber'}" style="width:${d.progress}%"></div>
                  </div>
                  <span class="text-xs font-semibold">${d.progress}%</span>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function generateProgressReport(classFilter) {
  let students = [...MOCK_DATA.students];
  if (classFilter) students = students.filter(s => s.classId === classFilter);

  return `
    <div class="report-preview-title">
      <h2>📊 Student Progress Report</h2>
      <p>Performance Overview • Generated ${formatDate(getToday())}</p>
    </div>
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Class</th><th>Attendance</th>${students[0] ? Object.keys(students[0].scores).map(s => `<th>${s}</th>`).join('') : ''}<th>Grade</th></tr></thead>
        <tbody>
          ${students.map(s => `
            <tr>
              <td class="font-medium">${s.name}</td>
              <td>${getClassName(s.classId)}</td>
              <td><span class="badge badge-${getAttendanceColor(s.attendance)}">${s.attendance}%</span></td>
              ${Object.values(s.scores).map(sc => `<td>${sc}</td>`).join('')}
              <td><span class="badge badge-${getGradeColor(s.avgGrade)}">${s.avgGrade}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function generateClassReport(classFilter) {
  const classes = classFilter
    ? MOCK_DATA.classes.filter(c => c.id === classFilter)
    : MOCK_DATA.classes;

  return `
    <div class="report-preview-title">
      <h2>🏫 Class Report</h2>
      <p>Academic Summary • Generated ${formatDate(getToday())}</p>
    </div>
    ${classes.map(cls => {
      const students = getStudentsByClass(cls.id);
      const avgAttendance = students.length ? Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length) : 0;
      const journals = getJournalByClass(cls.id);

      return `
        <div class="card card-elevated mb-5" style="padding:var(--space-5)">
          <h3 style="font-size:var(--font-size-lg);font-weight:700;margin-bottom:var(--space-4)">${cls.name}</h3>
          <div class="stats-grid mb-4">
            <div style="text-align:center">
              <div class="text-sm text-muted">Students</div>
              <div class="font-bold" style="font-size:var(--font-size-xl)">${students.length}</div>
            </div>
            <div style="text-align:center">
              <div class="text-sm text-muted">Avg Attendance</div>
              <div class="font-bold" style="font-size:var(--font-size-xl)">${avgAttendance}%</div>
            </div>
            <div style="text-align:center">
              <div class="text-sm text-muted">Journal Entries</div>
              <div class="font-bold" style="font-size:var(--font-size-xl)">${journals.length}</div>
            </div>
            <div style="text-align:center">
              <div class="text-sm text-muted">Subjects</div>
              <div class="font-bold" style="font-size:var(--font-size-xl)">${cls.subjects.length}</div>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            ${cls.subjects.map(s => {
              const p = getSyllabusProgress(s, cls.id);
              return `
                <div>
                  <div class="progress-info">
                    <span class="progress-label">${s}</span>
                    <span class="progress-value">${p}%</span>
                  </div>
                  <div class="progress-bar"><div class="progress-bar-fill ${p >= 70 ? 'green' : ''}" style="width:${p}%"></div></div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

// =====================================================
// SEARCH PAGE
// =====================================================
function renderSearchPage() {
  return `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Search</h1>
        <p>Search across all your academic records</p>
      </div>
    </div>
    <div class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <h3>Use Global Search</h3>
      <p>Press Ctrl+K to open the search panel and find anything across your workspace.</p>
      <button class="btn btn-primary" onclick="openSearchPanel()">Open Search</button>
    </div>
  `;
}

// =====================================================
// TEACHER PROFILE PAGE (DISPLAYING DATA, NOT LOGIN)
// =====================================================
function renderProfile() {
  const u = MOCK_DATA.user;

  return `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Teacher Profile</h1>
        <p>Faculty credentials, teaching assignments, and professional records</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showEditProfileModal()">Edit Profile</button>
        <button class="btn btn-secondary" onclick="AppState.logout()">Sign Out</button>
      </div>
    </div>

    <div class="profile-hero-card mb-6" style="background:linear-gradient(135deg, rgba(220,162,120,0.12) 0%, rgba(205,212,177,0.2) 100%);border:1px solid rgba(220,162,120,0.3);border-radius:var(--radius-xl);padding:32px;display:flex;gap:28px;align-items:center">
      <img src="${u.avatarUrl}" alt="${u.name}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:4px solid #ffffff;box-shadow:0 8px 24px rgba(0,0,0,0.12)" onerror="this.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'">
      <div style="flex:1">
        <div class="flex items-center gap-3 mb-1">
          <h2 style="font-size:var(--font-size-2xl);font-weight:800;color:var(--neutral-900);margin:0">${u.name}</h2>
          <span class="badge badge-primary">${u.role}</span>
          <span class="badge badge-green">Active Faculty</span>
        </div>
        <p class="text-sm font-medium" style="color:var(--primary-700);margin-bottom:8px">
          ${u.department} • Employee ID: <strong>${u.employeeId}</strong> • ${u.experience}
        </p>
        <p class="text-sm text-neutral-700" style="max-width:700px;line-height:1.5">
          ${u.bio}
        </p>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-5 mb-6">
      <!-- Contact & Personal Card -->
      <div class="card card-elevated" style="padding:24px">
        <h3 style="font-size:var(--font-size-lg);font-weight:700;margin-bottom:16px;color:var(--neutral-900);display:flex;align-items:center;gap:8px">
          Contact & Academic Info
        </h3>
        <div class="flex flex-col gap-3">
          <div class="flex justify-between py-2" style="border-bottom:1px solid var(--neutral-200)">
            <span class="text-xs font-semibold text-muted">EMAIL</span>
            <span class="text-sm font-medium">${u.email}</span>
          </div>
          <div class="flex justify-between py-2" style="border-bottom:1px solid var(--neutral-200)">
            <span class="text-xs font-semibold text-muted">PHONE NUMBER</span>
            <span class="text-sm font-medium">${u.phone}</span>
          </div>
          <div class="flex justify-between py-2" style="border-bottom:1px solid var(--neutral-200)">
            <span class="text-xs font-semibold text-muted">QUALIFICATIONS</span>
            <span class="text-sm font-medium">${u.qualification}</span>
          </div>
          <div class="flex justify-between py-2" style="border-bottom:1px solid var(--neutral-200)">
            <span class="text-xs font-semibold text-muted">CAMPUS ADDRESS</span>
            <span class="text-sm font-medium">${u.address}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-xs font-semibold text-muted">DATE JOINED</span>
            <span class="text-sm font-medium">${formatDate(u.joinDate)}</span>
          </div>
        </div>
      </div>

      <!-- Teaching Assignments & Accolades -->
      <div class="card card-elevated" style="padding:24px">
        <h3 style="font-size:var(--font-size-lg);font-weight:700;margin-bottom:16px;color:var(--neutral-900);display:flex;align-items:center;gap:8px">
          Teaching Portfolio & Honors
        </h3>
        
        <div class="mb-4">
          <div class="text-xs font-semibold text-muted uppercase mb-2">Primary Teaching Subjects:</div>
          <div class="flex gap-2 flex-wrap">
            ${u.subjects.map(sub => `<span class="badge badge-primary" style="font-size:0.85rem;padding:6px 12px">${sub}</span>`).join('')}
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-semibold text-muted uppercase mb-2">Assigned Classes:</div>
          <div class="flex gap-2 flex-wrap">
            ${u.assignedClasses.map(cId => `<span class="badge badge-neutral" style="font-size:0.85rem;padding:6px 12px">${getClassName(cId)}</span>`).join('')}
          </div>
        </div>

        <div>
          <div class="text-xs font-semibold text-muted uppercase mb-2">Recognitions & Awards:</div>
          <ul style="margin:0;padding-left:18px;font-size:var(--font-size-sm);color:var(--neutral-800);display:flex;flex-direction:column;gap:6px">
            ${u.achievements.map(ach => `<li><strong>${ach}</strong></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <!-- Quick Navigation from Profile -->
    <div class="card card-elevated" style="padding:24px;background:var(--neutral-50);display:flex;justify-content:space-between;align-items:center">
      <div>
        <h4 style="font-size:var(--font-size-base);font-weight:700;margin:0 0 4px 0">Need to record your personal reflection or daily mind state?</h4>
        <p class="text-xs text-muted" style="margin:0">Visit your private daily diary safe or calibrate your energy velocity on the dashboard.</p>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-secondary" onclick="AppState.navigate('journal')">Open Diary Safe</button>
        <button class="btn btn-primary" onclick="AppState.navigate('dashboard')">Energy Speedometer</button>
      </div>
    </div>
  `;
}

function showEditProfileModal() {
  const u = MOCK_DATA.user;
  showModal(`
    <div class="modal-header">
      <h2>Edit Faculty Profile</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="prof-name" value="${u.name}">
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="text" class="form-input" id="prof-phone" value="${u.phone}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="prof-email" value="${u.email}">
        </div>
        <div class="form-group">
          <label class="form-label">Qualifications</label>
          <input type="text" class="form-input" id="prof-qual" value="${u.qualification}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Campus Address</label>
        <input type="text" class="form-input" id="prof-address" value="${u.address}">
      </div>
      <div class="form-group">
        <label class="form-label">Professional Bio</label>
        <textarea class="form-textarea" id="prof-bio" rows="3">${u.bio}</textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveProfileChanges()">Save Profile</button>
    </div>
  `, 'md');
}

function saveProfileChanges() {
  const name = document.getElementById('prof-name')?.value.trim();
  const phone = document.getElementById('prof-phone')?.value.trim();
  const email = document.getElementById('prof-email')?.value.trim();
  const qual = document.getElementById('prof-qual')?.value.trim();
  const address = document.getElementById('prof-address')?.value.trim();
  const bio = document.getElementById('prof-bio')?.value.trim();

  if (!name || !email) {
    showToast('Missing Fields', 'Name and Email are required.', 'error');
    return;
  }

  MOCK_DATA.user.name = name;
  MOCK_DATA.user.phone = phone || MOCK_DATA.user.phone;
  MOCK_DATA.user.email = email;
  MOCK_DATA.user.qualification = qual || MOCK_DATA.user.qualification;
  MOCK_DATA.user.address = address || MOCK_DATA.user.address;
  MOCK_DATA.user.bio = bio || MOCK_DATA.user.bio;

  closeModal();
  showToast('Profile Updated', 'Faculty details updated successfully.', 'success');
  renderApp();
}

function showTeacherProfileModal() {
  const u = MOCK_DATA.user;
  showModal(`
    <div class="modal-header">
      <h2>Teacher Profile & Academic Records</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="profile-hero-card mb-4" style="background:linear-gradient(135deg, rgba(220,162,120,0.12) 0%, rgba(205,212,177,0.2) 100%);border:1px solid rgba(220,162,120,0.3);border-radius:var(--radius-xl);padding:20px;display:flex;gap:20px;align-items:center">
        <img src="${u.avatarUrl}" alt="${u.name}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.12)" onerror="this.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'">
        <div style="flex:1">
          <div class="flex items-center gap-2 mb-1">
            <h3 style="font-size:var(--font-size-lg);font-weight:800;color:var(--neutral-900);margin:0">${u.name}</h3>
            <span class="badge badge-primary">${u.role}</span>
          </div>
          <p class="text-xs font-medium" style="color:var(--primary-700);margin:0 0 4px 0">
            ${u.department} • ID: <strong>${u.employeeId}</strong> • ${u.totalExperience || '8+ Years'}
          </p>
          <p class="text-xs text-neutral-700" style="margin:0;line-height:1.4">
            ${u.bio}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="card" style="padding:14px;background:var(--neutral-50);border:1px solid var(--neutral-200);border-radius:var(--radius-lg)">
          <div class="text-xs font-bold text-muted uppercase mb-2">Contact & Campus Info</div>
          <div class="text-xs flex flex-col gap-1 text-neutral-800">
            <div><strong>Email:</strong> ${u.email}</div>
            <div><strong>Phone:</strong> ${u.phone}</div>
            <div><strong>Qualifications:</strong> ${u.qualification}</div>
            <div><strong>Address:</strong> ${u.address}</div>
          </div>
        </div>

        <div class="card" style="padding:14px;background:var(--neutral-50);border:1px solid var(--neutral-200);border-radius:var(--radius-lg)">
          <div class="text-xs font-bold text-muted uppercase mb-2">Teaching Portfolio</div>
          <div class="text-xs flex flex-col gap-2">
            <div>
              <span class="text-muted font-semibold">Subjects: </span>
              ${u.subjects.map(s => `<span class="badge badge-primary" style="font-size:10px;padding:2px 6px">${s}</span>`).join(' ')}
            </div>
            <div>
              <span class="text-muted font-semibold">Assigned Classes: </span>
              ${(u.assignedClasses || ['c1','c2','c3']).map(c => `<span class="badge badge-neutral" style="font-size:10px;padding:2px 6px">${getClassName(c)}</span>`).join(' ')}
            </div>
            <div>
              <span class="text-muted font-semibold">Honors: </span>
              <span class="text-neutral-800">${u.achievements?.[0] || 'National Literature Mentor'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" style="display:flex;justify-content:space-between">
      <button class="btn btn-secondary btn-sm" onclick="closeModal(); AppState.logout();" style="color:var(--danger-500)">Sign Out</button>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>
        <button class="btn btn-primary btn-sm" onclick="closeModal(); showEditProfileModal()">Edit Profile</button>
      </div>
    </div>
  `, 'lg');
}

// =====================================================
// Initialize App
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
  renderApp();
});

