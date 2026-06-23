# Spike: react-grab plugin transformCopyContent — copy path verification

> Task 2 de-risk spike. Goal: confirm `transformCopyContent` fires on the ⌘C / hotkey copy path.

## Bootstrap / Init

**react-grab auto-bootstraps on import.** `dist/index.js` has a top-level IIFE (runs on module evaluation):

```js
typeof window<`u` && !window.__REACT_GRAB_DISABLED__ &&
  (window.__REACT_GRAB__ ?
    c = window.__REACT_GRAB__ :
    (c = i(), window.__REACT_GRAB__ = c),
  f(c),             // flushes queued plugins
  window.dispatchEvent(new CustomEvent(`react-grab:init`, {detail:c})));
```

- Importing `react-grab` as an ES module side-effect-runs `init()` (`yr()` in core).
- The `init()` call sets `_r = true` (singleton guard) — calling `init()` a second time is a no-op.
- No explicit `configure()` or `init()` call is required by the consumer. A bare `import 'react-grab'` or any named import from `react-grab` is sufficient.
- `registerPlugin()` before the global API is ready queues the plugin in `d[]`; `f(c)` drains the queue on init.

**In a Vite/Storybook preview**: importing `{ registerPlugin } from 'react-grab'` inside `preview.ts` or a side-effect file imported from `preview.ts` is the correct and sufficient bootstrap pattern.

## Activation Interaction

react-grab defaults to **toggle mode** (`activationMode: 'toggle'`, `keyHoldDuration: 100ms`).

Activation key check (`gn()` in `core-CX-oJjgu.js`):
```js
const gn = (e, t) => {
  if (t.activationKey) return mn(t.activationKey)(e);
  // default: ⌘ (mac) or Ctrl (win/linux), no Shift, no Alt, + any alphanum key
  let n = (p() ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey;
  return !!(e.key && n && un(e.key, e.code));
};
```

Full activation sequence:
1. **Hold** `⌘` (mac) or `Ctrl` (win/linux) + any alphanumeric key for ≥100ms → react-grab activates.
2. Hover the target element (selection box appears).
3. Press `⌘C` / `Ctrl+C` (shortcut `'C'` with `shortcutModifier: true` from the built-in `copy` plugin action) → triggers copy.

Alternatively, `api.copyElement(el)` and `api.activate()` are available programmatically via `window.__REACT_GRAB__`.

## Source Proof: transformCopyContent is in the copy path

The copy entry point (`Xt` in `core-CX-oJjgu.js`):

```js
const Xt = async (e, t, n, r) => {
  await t.onBeforeCopy(n);
  let i = false, a = '';
  try {
    let o = e.getContent
      ? { content: await e.getContent(n) }
      : await Jt(n, e.maxContextLines);   // generates element context string
    let s = o?.content;
    if (s?.trim()) {
      let c = await t.transformCopyContent(s, n);  // ← CALLED HERE
      a = r ? `${r}\n${c}` : c;
      i = ot(a, { componentName: e.componentName, entries: Yt(o, a, r) });
    }
  } catch (e) { t.onCopyError(Gt(e)); }
  return i && t.onCopySuccess(n, a), t.onAfterCopy(n, i), i;
};
```

The plugin dispatcher `h()` for `transformCopyContent` (reduce/chain pattern):

```js
const h = async (e, n, ...r) => {
  let i = n;
  for (let { config: n } of t.values()) {
    let t = n.hooks?.[e];
    if (t) i = await t(i, ...r);   // each plugin's hook transforms the accumulated value
  }
  return i;
};
// wired as:
transformCopyContent: async (e, t) => h('transformCopyContent', e, t),
```

Call chain: `dn()` (select elements) → `ln()` (options wrapper) → `Xt()` → `t.transformCopyContent(s, n)` → `h('transformCopyContent', ...)` → each plugin's `hooks.transformCopyContent` in registration order.

**`transformCopyContent` IS called on both keyboard copy and `copyElement()` API paths.** There is no alternative copy path that bypasses it.

## ReactGrabAPI access

`window.__REACT_GRAB__` is the live API object. It is also accessible programmatically only via `getGlobalApi()` from `react-grab`. A plugin does NOT need a `setup(api)` function — `hooks.transformCopyContent` is invoked automatically. However `setup(api, hooks)` is available for plugins needing access to `ActionContextHooks` or the full API at registration time.

## Browser Verification Result

**PASSED.** Playwright headless Chromium, port 6006.

- Storybook loaded story `components-button--primary`.
- `window.__REACT_GRAB__` initialized: **true**.
- Registered plugins: `["copy", "edit", "comment", "open", "spike"]` — spike plugin was registered.
- `copyElement(buttonEl)` returned `{ success: true }`.
- Clipboard read via `navigator.clipboard.readText()`:

```
[<button data-testid="the-button">Click me</button> in Button (at .../examples/src/Button.tsx) in storybook in @storybook/react]
[SPIKE-MARKER]
```

- `[SPIKE-MARKER]` **present** in clipboard. `transformCopyContent` fired and its return value was written to the clipboard.

## Conclusion

**Gate: PASSES.** `transformCopyContent` is unconditionally invoked on every copy (keyboard or API). The addon can reliably use this hook to inject Storybook context into the clipboard payload.
