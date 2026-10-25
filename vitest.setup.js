// Browser APIs jsdom does not implement that app code touches on mount.
globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};
globalThis.ResizeObserver ??= globalThis.IntersectionObserver;

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: "",
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() { return false; },
  });
}

// A no-op 2D context: canvas-driven components draw on mount, and jsdom has
// no canvas implementation, so every method is a sink and every property sticks.
window.HTMLCanvasElement.prototype.getContext = () =>
  new Proxy(
    {},
    {
      get: (target, prop) =>
        prop in target ? target[prop] : (target[prop] = () => {}),
      set: (target, prop, value) => ((target[prop] = value), true),
    },
  );
window.scrollTo = () => {};

// A contract must never reach the network. Answer benignly rather than
// throwing, so an incidental background request cannot fail the run.
globalThis.fetch = async () =>
  new Response("{}", {
    status: 200,
    headers: { "content-type": "application/json" },
  });
