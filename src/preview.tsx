import React from 'react';
import { registerPlugin } from 'react-grab';
import { createContextMap } from './context-map';
import { createGrabPlugin, type GrabPlugin } from './plugin';
import { GLOBAL_ENABLED, PARAM_KEY, STORY_ATTR } from './constants';
import type { AddonOptions } from './types';

const map = createContextMap();
let plugin: GrabPlugin | null = null;

function ensureRegistered(opts: AddonOptions): GrabPlugin {
  if (!plugin) {
    plugin = createGrabPlugin(map, opts);
    registerPlugin(plugin);
  }
  return plugin;
}

// SB9 decorator signature: (StoryFn, context) => renderable.
// `context` carries id, title, name, args, globals, parameters.
export const decorators = [
  (StoryFn: () => React.ReactNode, context: any) => {
    const opts: AddonOptions = context.parameters?.[PARAM_KEY] ?? {};
    const p = ensureRegistered(opts);

    map.set(context.id, {
      storyId: context.id,
      title: context.title,
      name: context.name,
      args: (context.args ?? {}) as Record<string, unknown>,
    });

    const enabled = context.globals?.[GLOBAL_ENABLED] ?? opts.enabled ?? true;
    p.getApi()?.setEnabled(Boolean(enabled));

    return React.createElement(
      'div',
      { [STORY_ATTR]: context.id, style: { display: 'contents' } },
      StoryFn(),
    );
  },
];

export const initialGlobals = { [GLOBAL_ENABLED]: true };
