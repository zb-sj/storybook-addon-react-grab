import { expect, test } from 'vitest';
import { ADDON_ID, GLOBAL_ENABLED, STORY_ATTR, TOOL_ID, TOOLBAR_PLUGIN_ID, PARAM_KEY } from './constants';

test('constants have stable values', () => {
  expect(ADDON_ID).toBe('@zigbang/storybook-addon-react-grab');
  expect(GLOBAL_ENABLED).toBe('reactGrabEnabled');
  expect(STORY_ATTR).toBe('data-sb-story-id');
  expect(TOOL_ID).toBe('@zigbang/storybook-addon-react-grab/tool');
  expect(TOOLBAR_PLUGIN_ID).toBe('@zigbang/storybook-addon-react-grab/toolbar-visibility');
  expect(PARAM_KEY).toBe('reactGrab');
});
