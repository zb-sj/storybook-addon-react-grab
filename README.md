# storybook-addon-react-grab

Brings [react-grab](https://github.com/nicholasgasior/react-grab) into Storybook so that hovering a story element and pressing ⌘C (or Ctrl+C on Windows/Linux) copies element context enriched with the current story's identity and args — giving AI agents a precise, actionable description of exactly which component variant you are looking at.

## What gets copied

react-grab produces its own base context line; this addon appends a Storybook block:

```
[<button> in Button (at src/Button.tsx:12:5)]

--- Storybook ---
Story: Components/Button › Primary (components-button--primary)
Args: { variant: "primary", size: "md" }
```

The first line is react-grab's own output. Everything from `--- Storybook ---` down is added by this addon.

## Requirements

- Storybook 9 (no other versions supported)
- `react-grab` as a peer dependency

## Install

```bash
pnpm add -D storybook-addon-react-grab react-grab
```

Then add the addon to `.storybook/main.ts`:

```ts
// .storybook/main.ts
export default {
  addons: [
    'storybook-addon-react-grab',
    // ...other addons
  ],
};
```

## Toolbar toggle

A **🤏 Grab** button appears in the Storybook toolbar. Click it to enable or disable grabbing. When disabled, the addon's enrichment is inactive and react-grab behaves as if the plugin were not registered.

## Options

Configure via the `reactGrab` parameter on a story or in `preview.ts`:

```ts
// .storybook/preview.ts
export default {
  parameters: {
    reactGrab: {
      enabled: true,       // default: true
      includeArgs: true,   // default: true — include story args in the Storybook block
      maxDepth: 10,        // forwarded to react-grab context generation
      maxStringLength: 200,
      maxArrayItems: 10,
    },
  },
};
```

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Master switch for the addon |
| `includeArgs` | `boolean` | `true` | Append current story args to the Storybook block |
| `maxDepth` | `number` | — | Max element tree depth passed to react-grab |
| `maxStringLength` | `number` | — | Max string length for serialized values |
| `maxArrayItems` | `number` | — | Max items shown for array args |
| `includeUsage` | — | — | **Reserved for v1.1** — not implemented in v1 |

## Roadmap (v1.1)

- CSF story source snippet in the copied payload
- Usage JSX reconstruction
- More precise docs-mode multi-story handling (currently the nearest `data-sb-story-id` ancestor is used, which may not be the intended story in a docs canvas with multiple rendered stories)

## License

MIT © 2026 Jeong, Sejun
