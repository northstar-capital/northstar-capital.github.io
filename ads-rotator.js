(function () {
  const SESSION_KEY = "northstar_rotator_v4";
  const SESSION_TTL_MS = 30 * 60 * 1000;

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

  function makeState() {
    return {
      createdAt: now(),
      aggressiveTypes: {
        overlay: {
          order: ["propellerVignette"],
          currentIndex: 0
        },
        notification: {
          order: ["propellerPush"],
          currentIndex: 0
        }
      }
    };
  }

  let state = loadState();
  if (!state) {
    state = makeState();
    saveState(state);
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function renderAdsterraNativeBanner(container) {
    if (!container) return;

    clearNode(container);

    const adWrap = document.createElement("div");
    adWrap.id = "container-e821b7ed43b19695ac76a080b82fb3af";
    container.appendChild(adWrap);

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = "https://pl28933884.effectivegatecpm.com/e821b7ed43b19695ac76a080b82fb3af/invoke.js";
    container.appendChild(s);
  }

  function renderGoodSlot(slotName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (slotName === "calculatorTop") {
      renderAdsterraNativeBanner(container);
    }
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
