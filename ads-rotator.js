(function () {
  const SESSION_KEY = "northstar_rotator_v2";
  const SESSION_TTL_MS = 30 * 60 * 1000;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function now() {
    return Date.now();
  }

  function loadState() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.createdAt) return null;
      if (now() - parsed.createdAt > SESSION_TTL_MS) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveState(state) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  }

  function makeState(config) {
    const state = {
      createdAt: now(),
      goodSlots: {},
      aggressiveTypes: {}
    };

    for (const slotName of Object.keys(config.goodSlots)) {
      state.goodSlots[slotName] = {
        order: [...config.goodSlots[slotName]],
        currentIndex: 0,
        shown: 0,
        limit: randInt(2, 4)
      };
    }

    for (const typeName of Object.keys(config.aggressiveTypes)) {
      state.aggressiveTypes[typeName] = {
        order: [...config.aggressiveTypes[typeName]],
        currentIndex: 0
      };
    }

    return state;
  }

  const config = {
    goodSlots: {
      calculatorTop: ["adsterraNative", "adsenseDisplay"]
    },
    aggressiveTypes: {
      overlay: ["propellerVignette"],
      notification: ["propellerPush"]
    }
  };

  let state = loadState();
  if (!state) {
    state = makeState(config);
    saveState(state);
  }

  function getCurrentGoodNetwork(slotName) {
    const slot = state.goodSlots[slotName];
    if (!slot) return null;
    return slot.order[slot.currentIndex] || null;
  }

  function advanceGoodSlot(slotName) {
    const slot = state.goodSlots[slotName];
    if (!slot) return;

    slot.shown += 1;

    if (slot.shown >= slot.limit) {
      slot.currentIndex = (slot.currentIndex + 1) % slot.order.length;
      slot.shown = 0;
      slot.limit = randInt(2, 4);
    }

    saveState(state);
  }

  function getCurrentAggressiveNetwork(typeName) {
    const type = state.aggressiveTypes[typeName];
    if (!type) return null;
    return type.order[type.currentIndex] || null;
  }

  function rotateAggressive(typeName) {
    const type = state.aggressiveTypes[typeName];
    if (!type) return;
    type.currentIndex = (type.currentIndex + 1) % type.order.length;
    saveState(state);
  }

  function renderAdsterraNative(container) {
    if (!container) return;
    container.innerHTML = `
      <script async="async" data-cfasync="false" src="https://pl28933884.effectivegatecpm.com/e821b7ed43b19695ac76a080b82fb3af/invoke.js"><\/script>
      <div id="container-e821b7ed43b19695ac76a080b82fb3af"></div>
    `;
  }

  function renderAdsensePlaceholder(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="ad-space">
        <div>
          <div class="ad-space-title">Ad Space</div>
          <div class="ad-space-note">Add your real AdSense display unit here when you have a slot ID.</div>
        </div>
      </div>
    `;
  }

  function renderGoodSlot(slotName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const network = getCurrentGoodNetwork(slotName);

    if (network === "adsterraNative") {
      renderAdsterraNative(container);
      advanceGoodSlot(slotName);
      return;
    }

    if (network === "adsenseDisplay") {
      renderAdsensePlaceholder(container);
      advanceGoodSlot(slotName);
      return;
    }

    container.innerHTML = "";
  }

  function loadScriptOnce(id, src, attrs = {}) {
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.async = true;

    for (const [key, value] of Object.entries(attrs)) {
      s.setAttribute(key, value);
    }

    document.head.appendChild(s);
  }

  function bootAggressiveAds() {
    const overlayNetwork = getCurrentAggressiveNetwork("overlay");
    const notificationNetwork = getCurrentAggressiveNetwork("notification");

    if (overlayNetwork === "propellerVignette") {
      const s = document.createElement("script");
      s.dataset.zone = "10742966";
      s.src = "https://gizokraijaw.net/vignette.min.js";
      (document.documentElement || document.body).appendChild(s);
    }

    if (notificationNetwork === "propellerPush") {
      loadScriptOnce(
        "propeller-push-script",
        "https://5gvci.com/act/files/tag.min.js?z=10742973",
        { "data-cfasync": "false" }
      );
    }

    rotateAggressive("overlay");
    rotateAggressive("notification");
  }

  window.NorthstarAds = {
    renderGoodSlot,
    bootAggressiveAds
  };
})();
