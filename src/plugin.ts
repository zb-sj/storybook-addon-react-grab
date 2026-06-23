import type { Plugin, ReactGrabAPI } from 'react-grab';
import type { ContextMap } from './context-map';
import type { AddonOptions } from './types';
import { buildStorybookBlock } from './build-block';
import { ADDON_ID } from './constants';

export interface GrabPlugin extends Plugin {
  getApi(): ReactGrabAPI | null;
}

export function createGrabPlugin(map: ContextMap, opts: AddonOptions = {}): GrabPlugin {
  let api: ReactGrabAPI | null = null;
  return {
    name: ADDON_ID,
    hooks: {
      transformCopyContent: (content: string, elements: Element[]) => {
        const ctx = map.getByElement(elements[0] ?? null);
        if (!ctx) return content;
        return content + '\n' + buildStorybookBlock(ctx, opts);
      },
    },
    setup: (grabApi) => {
      api = grabApi;
    },
    getApi: () => api,
  };
}
