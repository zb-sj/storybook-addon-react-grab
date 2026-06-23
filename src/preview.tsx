import React from 'react';
import { getGlobalApi, registerPlugin, unregisterPlugin, type Plugin } from 'react-grab';
import { createContextMap } from './context-map';
import { createGrabPlugin } from './plugin';
import { GLOBAL_ENABLED, PARAM_KEY, STORY_ATTR, TOOLBAR_PLUGIN_ID } from './constants';
import type { AddonOptions } from './types';

const map = createContextMap();
let enrichmentRegistered = false;

function ensureEnrichmentRegistered(opts: AddonOptions): void {
  if (enrichmentRegistered) return;
  registerPlugin(createGrabPlugin(map, opts));
  enrichmentRegistered = true;
}

// The toolbar button is react-grab's master on/off for this preview. When OFF we both
// disable grabbing (setEnabled(false) — stops hover/⌘C interception) AND hide react-grab's
// bottom toolbar widget; when ON we re-enable both.
//
// The toolbar is shown/hidden via `theme.toolbar.enabled`, only writable through a
// registered plugin's theme (setOptions excludes theme). SolidJS skips a store update when
// the theme object reference is unchanged, so toggling requires unregister + re-register
// with a fresh theme object. setEnabled() runs every render (idempotent) so it self-heals
// if the react-grab API was not yet ready on the render where the global changed.
let lastActive: boolean | undefined;

function applyReactGrabActive(active: boolean): void {
  getGlobalApi()?.setEnabled(active);
  if (lastActive !== active) {
    unregisterPlugin(TOOLBAR_PLUGIN_ID);
    registerPlugin({
      name: TOOLBAR_PLUGIN_ID,
      theme: { toolbar: { enabled: active } },
    } as Plugin);
    lastActive = active;
  }
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

    // Master on/off for react-grab in the preview (grabbing + toolbar). react-grab re-inits
    // on story navigation, so re-apply from the persisted global on every render.
    const active = context.globals?.[GLOBAL_ENABLED] ?? true;
    applyReactGrabActive(Boolean(active));

    return React.createElement(
      'div',
      { [STORY_ATTR]: context.id, style: { display: 'contents' } },
      StoryFn(),
    );
  },
];

export const initialGlobals = { [GLOBAL_ENABLED]: true };
