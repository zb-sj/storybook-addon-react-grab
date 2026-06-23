// @vitest-environment jsdom
import { beforeEach, expect, test } from 'vitest';
import { createGrabPlugin } from './plugin';
import { createContextMap } from './context-map';
import { STORY_ATTR, ADDON_ID } from './constants';

beforeEach(() => { document.body.innerHTML = ''; });

function setup() {
  const map = createContextMap();
  map.set('btn--primary', { storyId: 'btn--primary', title: 'Button', name: 'Primary', args: { variant: 'primary' } });
  document.body.innerHTML = `<div ${STORY_ATTR}="btn--primary"><button id="b">x</button></div>`;
  return { map, el: document.getElementById('b')! };
}

test('plugin has the addon name and a transformCopyContent hook', () => {
  const plugin = createGrabPlugin(createContextMap());
  expect(plugin.name).toBe(ADDON_ID);
  expect(typeof plugin.hooks?.transformCopyContent).toBe('function');
});

test('transformCopyContent appends the storybook block', async () => {
  const { map, el } = setup();
  const plugin = createGrabPlugin(map);
  const out = await plugin.hooks!.transformCopyContent!('[base]', [el]);
  expect(out).toBe('[base]\n\n--- Storybook ---\nStory: Button › Primary (btn--primary)\nArgs: { variant: "primary" }');
});

test('transformCopyContent returns base unchanged when story not found', async () => {
  const plugin = createGrabPlugin(createContextMap());
  document.body.innerHTML = '<button id="b">x</button>';
  const out = await plugin.hooks!.transformCopyContent!('[base]', [document.getElementById('b')!]);
  expect(out).toBe('[base]');
});

test('setup captures the react-grab api for getApi', () => {
  const plugin = createGrabPlugin(createContextMap());
  expect(plugin.getApi()).toBeNull();
  const fakeApi = { setEnabled() {}, activate() {}, deactivate() {}, toggle() {}, isActive: () => false, isEnabled: () => true } as any;
  plugin.setup!(fakeApi, {} as any);
  expect(plugin.getApi()).toBe(fakeApi);
});
