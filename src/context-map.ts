import { STORY_ATTR } from './constants';
import type { StoryGrabContext } from './types';

export interface ContextMap {
  set(id: string, ctx: StoryGrabContext): void;
  get(id: string): StoryGrabContext | undefined;
  getByElement(el: Element | null): StoryGrabContext | undefined;
}

export function createContextMap(): ContextMap {
  const map = new Map<string, StoryGrabContext>();
  return {
    set: (id, ctx) => { map.set(id, ctx); },
    get: (id) => map.get(id),
    getByElement: (el) => {
      if (!el) return undefined;
      const host = el.closest(`[${STORY_ATTR}]`);
      const id = host?.getAttribute(STORY_ATTR);
      return id ? map.get(id) : undefined;
    },
  };
}
