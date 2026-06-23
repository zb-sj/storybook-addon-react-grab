import type { AddonOptions, StoryGrabContext } from './types';
import { serializeArgs } from './serialize-args';

export function buildStorybookBlock(ctx: StoryGrabContext, opts: AddonOptions = {}): string {
  const lines = ['', '--- Storybook ---', `Story: ${ctx.title} › ${ctx.name} (${ctx.storyId})`];
  if (opts.includeArgs !== false) {
    lines.push(`Args: ${serializeArgs(ctx.args, opts)}`);
  }
  return lines.join('\n');
}
