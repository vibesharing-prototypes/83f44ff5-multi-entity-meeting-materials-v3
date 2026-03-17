/*!
 * proto-panel.js — Reusable prototype controls bar
 * ─────────────────────────────────────────────────
 * Drop into any Claude-coded project. Zero dependencies.
 *
 * QUICK START (auto-init via data attribute):
 *   <script src="proto-panel.js"
 *           data-description="My project description"></script>
 *
 * QUICK START (JS API — call after DOMContentLoaded):
 *   ProtoPanel.init({
 *     description: 'My project description.',
 *   });
 *
 * FULL CONFIG:
 *   ProtoPanel.init({
 *     description:     'What this prototype does.',   // shown in the expanded panel
 *     themeToggle:     true,                          // show Dark / Light toggle
 *     stateToggle:     true,                          // show Near-term / Future goal toggle
 *     stateLabels:     ['CALM', 'BUSY', 'CRITICAL'],   // labels for the three states
 *     applyThemeClass: true,   // auto-toggle .light on <html>
 *     applyStateClass: true,   // auto-toggle .future-state on <body>
 *     onThemeChange:   (theme) => {},  // 'dark' | 'light'
 *     onStateChange:   (state) => {},  // 'near'  | 'future'
 *   });
 *
 * EVENTS (fired on document regardless of callbacks):
 *   document.addEventListener('proto:theme', e => console.log(e.detail.theme));
 *   document.addEventListener('proto:state', e => console.log(e.detail.state));
 *
 * HOST-PAGE CLASS HOOKS (for CSS in the host page):
 *   body.pp-open        — proto panel is expanded
 *   html.light          — light theme active   (when applyThemeClass: true)
 *   body.future-state   — future state active  (when applyStateClass: true)
 */

(function (global) {
  'use strict';

  // ── Defaults ─────────────────────────────────────────────────────────────────

  const DEFAULTS = {
    description:     'A Claude-coded prototype.',
    themeToggle:     true,
    stateToggle:     true,
    stateLabels:     ['CALM', 'BUSY', 'CRITICAL'],
    applyThemeClass: true,
    applyStateClass: true,
    onThemeChange:   null,
    onStateChange:   null,
  };

  // ── CSS ──────────────────────────────────────────────────────────────────────

  const CSS = /* css */`
    /* ── Proto Panel shell ── */
    .pp-bar {
      background: linear-gradient(180deg, #111113 0%, #1a1a1d 55%, #1c1c1f 100%);
      border-bottom: 1px solid #2e2e32;
      flex-shrink: 0;
      z-index: 200;
      overflow: hidden;
      position: relative;
      transition: max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      max-height: 34px;
      box-shadow:
        inset 0 1px 0 rgba(0,0,0,0.8),
        inset 0 3px 12px rgba(0,0,0,0.5),
        0 3px 10px rgba(0,0,0,0.35);
      /* reset inherited font so the bar is self-contained */
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-size: 12px;
      box-sizing: border-box;
    }

    /* specular highlight at bottom lip of recess */
    .pp-bar::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(255,255,255,0.07) 15%,
        rgba(255,255,255,0.07) 85%,
        transparent 100%);
      pointer-events: none;
      z-index: 1;
    }

    .pp-bar.pp-open { max-height: 130px; }

    /* ── Collapsed row ── */
    .pp-collapsed {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 34px;
      padding: 0 14px 0 16px;
      cursor: pointer;
      user-select: none;
      transition: background 0.15s;
    }
    .pp-collapsed:hover { background: rgba(255,255,255,0.02); }
    .pp-collapsed:hover .pp-label { color: #c0c0c3; }

    .pp-label {
      font-family: 'Courier New', Courier, 'Lucida Console', monospace;
      font-size: 12px;
      letter-spacing: 0.06em;
      color: #909093;
      transition: color 0.15s;
      white-space: nowrap;
    }

    .pp-chevron {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #8a8a8d;
      display: flex;
      align-items: center;
      transition: color 0.15s, transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }
    .pp-chevron:hover { color: #c0c0c3; }
    .pp-bar.pp-open .pp-chevron { transform: rotate(180deg); }

    /* ── Expanded panel ── */
    .pp-expanded {
      display: flex;
      align-items: center;
      gap: 0;
      padding: 0 16px 11px;
      opacity: 0;
      transform: perspective(480px) rotateX(-6deg) translateY(-6px);
      transform-origin: top center;
      transition:
        opacity 0.25s 0.04s,
        transform 0.28s 0.04s cubic-bezier(0.2, 0.8, 0.4, 1);
      pointer-events: none;
    }
    .pp-bar.pp-open .pp-expanded {
      opacity: 1;
      transform: perspective(480px) rotateX(0deg) translateY(0);
      pointer-events: auto;
    }

    /* ── Dividers ── */
    .pp-divider {
      width: 1px;
      height: 20px;
      background: #424246;
      margin: 0 16px;
      flex-shrink: 0;
    }

    /* ── Control groups ── */
    .pp-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pp-group-label {
      font-size: 12px;
      color: #8a8a8d;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }

    /* ── Pill toggles ── */
    .pp-pill {
      display: flex;
      background: #111113;
      border: 1px solid #424246;
      border-radius: 20px;
      padding: 2px;
      gap: 2px;
    }
    .pp-btn {
      font-family: inherit;
      font-size: 12px;
      border: none;
      background: none;
      color: #8a8a8d;
      padding: 3px 10px;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
    .pp-btn:hover:not(.pp-active):not(.pp-state-active) { color: #c0c0c3; }

    /* Theme button — active state */
    .pp-theme-pill .pp-btn.pp-active {
      background: #2e2e32;
      color: #ccccce;
    }

    /* State button — active states per value */
    .pp-state-pill .pp-btn[data-pp-state="calm"].pp-active {
      background: #2a2040;
      color: #9d84e8;
      border: 1px solid rgba(157, 132, 232, 0.25);
    }
    .pp-state-pill .pp-btn[data-pp-state="busy"].pp-active {
      background: #2a2200;
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.25);
    }
    .pp-state-pill .pp-btn[data-pp-state="critical"].pp-active {
      background: #3a1a1a;
      color: #f87171;
      border: 1px solid rgba(248, 113, 113, 0.25);
    }

    /* ── Description ── */
    .pp-description {
      font-size: 12px;
      color: #8a8a8d;
      line-height: 1.5;
      letter-spacing: 0.03em;
      flex: 1;
      min-width: 0;
      margin: 0;
    }
  `;

  // ── HTML builder ─────────────────────────────────────────────────────────────

  function buildHTML(cfg) {
    const themeBlock = cfg.themeToggle ? `
      <div class="pp-group">
        <span class="pp-group-label">THEME</span>
        <div class="pp-pill pp-theme-pill">
          <button class="pp-btn pp-active" data-pp-theme="light">LIGHT</button>
          <button class="pp-btn"           data-pp-theme="dark">DARK</button>
        </div>
      </div>
      <div class="pp-divider"></div>` : '';

    const stateBlock = cfg.stateToggle ? `
      <div class="pp-group">
        <span class="pp-group-label">STATE</span>
        <div class="pp-pill pp-state-pill">
          <button class="pp-btn pp-active" data-pp-state="calm">${cfg.stateLabels[0]}</button>
          <button class="pp-btn"           data-pp-state="busy">${cfg.stateLabels[1]}</button>
          <button class="pp-btn"           data-pp-state="critical">${cfg.stateLabels[2]}</button>
        </div>
      </div>
      <div class="pp-divider"></div>` : '';

    return `
      <div class="pp-bar" id="pp-bar" role="region" aria-label="Prototype controls">
        <div class="pp-collapsed" id="pp-collapsed" role="button" aria-expanded="false" tabindex="0">
          <span class="pp-label">PROTOTYPE CONTROLS &mdash; NOT PART OF THE PRODUCT</span>
          <button class="pp-chevron" aria-label="Toggle prototype controls" tabindex="-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="pp-expanded" aria-hidden="true">
          ${themeBlock}
          ${stateBlock}
          <p class="pp-description">${cfg.description}</p>
        </div>
      </div>`;
  }

  // ── Core init ─────────────────────────────────────────────────────────────────

  function init(userConfig) {
    const cfg = Object.assign({}, DEFAULTS, userConfig);

    // Guard: don't double-init
    if (document.getElementById('pp-bar')) return;

    // 1. Inject CSS
    const style = document.createElement('style');
    style.id = 'pp-styles';
    style.textContent = CSS;
    document.head.appendChild(style);

    // 2. Inject HTML at the very top of <body>
    const tmp = document.createElement('div');
    tmp.innerHTML = buildHTML(cfg);
    const bar = tmp.firstElementChild;
    document.body.insertBefore(bar, document.body.firstChild);

    // 3. Ensure body stacks vertically (non-destructive — only sets if not flex)
    const bs = getComputedStyle(document.body);
    if (bs.display !== 'flex' && bs.display !== 'grid') {
      document.body.style.cssText += ';display:flex;flex-direction:column';
    }

    // ── Expand / collapse ──────────────────────────────────────────────────────
    const collapsed = bar.querySelector('.pp-collapsed');
    const expanded  = bar.querySelector('.pp-expanded');

    function toggle() {
      const isOpen = bar.classList.toggle('pp-open');
      document.body.classList.toggle('pp-open', isOpen);
      collapsed.setAttribute('aria-expanded', String(isOpen));
      expanded.setAttribute('aria-hidden', String(!isOpen));
    }

    collapsed.addEventListener('click', toggle);
    collapsed.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    // ── Theme toggle ───────────────────────────────────────────────────────────
    if (cfg.themeToggle) {
      let currentTheme = 'light';
      bar.querySelectorAll('[data-pp-theme]').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const theme = btn.dataset.ppTheme;
          if (theme === currentTheme) return;
          currentTheme = theme;

          bar.querySelectorAll('[data-pp-theme]').forEach(b => b.classList.remove('pp-active'));
          btn.classList.add('pp-active');

          if (cfg.applyThemeClass) {
            document.documentElement.classList.toggle('light', theme === 'light');
          }

          if (typeof cfg.onThemeChange === 'function') cfg.onThemeChange(theme);
          document.dispatchEvent(new CustomEvent('proto:theme', { detail: { theme }, bubbles: true }));
        });
      });
    }

    // ── State toggle ───────────────────────────────────────────────────────────
    if (cfg.stateToggle) {
      let currentState = 'calm';
      bar.querySelectorAll('[data-pp-state]').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const state = btn.dataset.ppState;
          if (state === currentState) return;
          currentState = state;

          bar.querySelectorAll('[data-pp-state]').forEach(b => b.classList.remove('pp-active'));
          btn.classList.add('pp-active');

          if (cfg.applyStateClass) {
            document.body.dataset.ppState = state;
          }

          if (typeof cfg.onStateChange === 'function') cfg.onStateChange(state);
          document.dispatchEvent(new CustomEvent('proto:state', { detail: { state }, bubbles: true }));
        });
      });
    }
  }

  // ── Auto-init from script data attribute ──────────────────────────────────────
  // Usage: <script src="proto-panel.js" data-description="My project"></script>

  function autoInit() {
    const scripts = document.querySelectorAll('script[src*="proto-panel"]');
    const script  = document.currentScript || scripts[scripts.length - 1];
    if (!script || !('description' in script.dataset)) return;

    const cfg = { description: script.dataset.description };
    if (script.dataset.themeToggle  === 'false') cfg.themeToggle  = false;
    if (script.dataset.stateToggle  === 'false') cfg.stateToggle  = false;
    if (script.dataset.stateLabels) {
      cfg.stateLabels = script.dataset.stateLabels.split('|').map(s => s.trim());
    }

    const run = () => init(cfg);
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run)
      : run();
  }

  // ── Export ────────────────────────────────────────────────────────────────────

  global.ProtoPanel = { init };
  autoInit();

}(window));
