// @vitest-environment jsdom
import { beforeEach, expect, test } from 'vitest';
import { createContextMap } from './context-map';
import { STORY_ATTR } from './constants';

const ctx = { storyId: 'btn--primary', title: 'Button', name: 'Primary', args: {} };

beforeEach(() => { document.body.innerHTML = ''; });

test('get returns context by id', () => {
  const map = createContextMap();
  map.set(ctx.storyId, ctx);
  expect(map.get('btn--primary')).toEqual(ctx);
  expect(map.get('missing')).toBeUndefined();
});

test('getByElement resolves via closest story root', () => {
  const map = createContextMap();
  map.set(ctx.storyId, ctx);
  document.body.innerHTML =
    `<div ${STORY_ATTR}="btn--primary"><span><button id="b">x</button></span></div>`;
  const button = document.getElementById('b')!;
  expect(map.getByElement(button)).toEqual(ctx);
});

test('getByElement returns undefined when no story root', () => {
  const map = createContextMap();
  document.body.innerHTML = '<button id="b">x</button>';
  expect(map.getByElement(document.getElementById('b'))).toBeUndefined();
  expect(map.getByElement(null)).toBeUndefined();
});
