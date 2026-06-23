import React from 'react';
import { registerPlugin, unregisterPlugin, type Plugin } from 'react-grab';
import { createContextMap } from './context-map';
import { createGrabPlugin } from './plugin';
import { GLOBAL_TOOLBAR, PARAM_KEY, STORY_ATTR, TOOLBAR_PLUGIN_ID } from './constants';
import type { AddonOptions } from './types';

const map = createContextMap();
let enrichmentRegistered = false;

function ensureEnrichmentRegistered(opts: AddonOptions): void {
  if (enrichmentRegistered) return;
  registerPlugin(createGrabPlugin(map, opts));
  enrichmentRegistered = true;
}

// react-grab's own bottom toolbar widget is shown/hidden via `theme.toolbar.enabled`,
// which is only writable through a registered plugin's theme (setOptions excludes theme).
// SolidJS skips a store update when the theme object reference is unchanged, so toggling
// requires unregister + re-register with a fresh theme object each time.
let lastToolbarVisible: boolean | undefined;

function applyToolbarVisibility(visible: boolean): void {
  if (lastToolbarVisible === visible) return;
  unregisterPlugin(TOOLBAR_PLUGIN_ID);
  registerPlugin({
    name: TOOLBAR_PLUGIN_ID,
    theme: { toolbar: { enabled: visible } },
  } as Plugin);
  lastToolbarVisible = visible;
}

// SB9 decorator signature: (StoryFn, context) => renderable.
// `context` carries id, title, name, args, globals, parameters.
export const decorators = [
  (StoryFn: () => React.ReactNode, context: any) => {
    const opts: AddonOptions = context.parameters?.[PARAM_KEY] ?? {};
    ensureEnrichmentRegistered(opts);

    map.set(context.id, {
      storyId: context.id,
      title: context.title,
      name: context.name,
      args: (context.args ?? {}) as Record<string, unknown>,
    });

    // The toolbar button toggles react-grab's bottom toolbar visibility, NOT grabbing
    // itself — grabbing (hover + ⌘C) and the addon's enrichment stay active either way.
    // react-grab re-inits on story navigation, so re-apply from the persisted global.
    const toolbarVisible = context.globals?.[GLOBAL_TOOLBAR] ?? true;
    applyToolbarVisibility(Boolean(toolbarVisible));

    return React.createElement(
      'div',
      { [STORY_ATTR]: context.id, style: { display: 'contents' } },
      StoryFn(),
    );
  },
];

export const initialGlobals = { [GLOBAL_TOOLBAR]: true };
