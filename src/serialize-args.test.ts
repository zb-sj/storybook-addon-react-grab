// @vitest-environment jsdom
import { describe, expect, test } from 'vitest';
import React from 'react';
import { serializeArgs } from './serialize-args';

describe('serializeArgs', () => {
  test('primitives and strings', () => {
    expect(serializeArgs({ variant: 'primary', size: 'md', disabled: false, count: 3 }))
      .toBe('{ variant: "primary", size: "md", disabled: false, count: 3 }');
  });

  test('functions become [Function]', () => {
    expect(serializeArgs({ onClick: () => {} })).toBe('{ onClick: [Function] }');
  });

  test('React elements become [ReactElement]', () => {
    expect(serializeArgs({ children: React.createElement('span', null, 'hi') }))
      .toBe('{ children: [ReactElement] }');
  });

  test('long strings are truncated', () => {
    const long = 'x'.repeat(100);
    expect(serializeArgs({ label: long }, { maxStringLength: 10 }))
      .toBe('{ label: "xxxxxxxxxx…" }');
  });

  test('arrays cap items and report overflow', () => {
    expect(serializeArgs({ items: [1, 2, 3, 4] }, { maxArrayItems: 2 }))
      .toBe('{ items: [1, 2, …(+2)] }');
  });

  test('depth cap collapses nested objects', () => {
    expect(serializeArgs({ a: { b: { c: { d: 1 } } } }, { maxDepth: 2 }))
      .toBe('{ a: { b: [Object] } }');
  });

  test('empty object', () => {
    expect(serializeArgs({})).toBe('{}');
  });

  test('null and undefined', () => {
    expect(serializeArgs({ a: null, b: undefined })).toBe('{ a: null, b: undefined }');
  });

  test('undefined opts do not disable caps (default maxDepth=3 applies)', () => {
    expect(serializeArgs({ a: { b: { c: { d: 1 } } } }, { maxDepth: undefined }))
      .toBe('{ a: { b: { c: [Object] } } }');
  });

  test('circular reference guard returns [Circular] without stack overflow', () => {
    const o: any = {};
    o.self = o;
    expect(serializeArgs({ o })).toBe('{ o: { self: [Circular] } }');
  });
});
