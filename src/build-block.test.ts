import { expect, test } from 'vitest';
import { buildStorybookBlock } from './build-block';

const ctx = {
  storyId: 'components-button--primary',
  title: 'Components/Button',
  name: 'Primary',
  args: { variant: 'primary', size: 'md' },
};

test('includes identity and args by default', () => {
  expect(buildStorybookBlock(ctx)).toBe(
    '\n--- Storybook ---\n' +
      'Story: Components/Button › Primary (components-button--primary)\n' +
      'Args: { variant: "primary", size: "md" }',
  );
});

test('omits args when includeArgs is false', () => {
  expect(buildStorybookBlock(ctx, { includeArgs: false })).toBe(
    '\n--- Storybook ---\n' +
      'Story: Components/Button › Primary (components-button--primary)',
  );
});
