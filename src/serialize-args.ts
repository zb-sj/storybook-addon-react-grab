import type { AddonOptions } from './types';

type Cfg = Required<Pick<AddonOptions, 'maxDepth' | 'maxStringLength' | 'maxArrayItems'>>;
const DEFAULTS: Cfg = { maxDepth: 3, maxStringLength: 80, maxArrayItems: 10 };

function isReactElement(v: unknown): boolean {
  return (
    typeof v === 'object' &&
    v !== null &&
    '$$typeof' in v &&
    typeof (v as { $$typeof?: unknown }).$$typeof === 'symbol'
  );
}

function serializeValue(value: unknown, cfg: Cfg, depth: number, seen: WeakSet<object> = new WeakSet()): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  const t = typeof value;
  if (t === 'function') return '[Function]';
  if (t === 'symbol') return '[Symbol]';
  if (t === 'bigint') return `${String(value)}n`;
  if (t === 'number' || t === 'boolean') return String(value);
  if (t === 'string') {
    const s = value as string;
    const out = s.length > cfg.maxStringLength ? `${s.slice(0, cfg.maxStringLength)}…` : s;
    return JSON.stringify(out);
  }
  if (isReactElement(value)) return '[ReactElement]';
  if (Array.isArray(value)) {
    if (depth >= cfg.maxDepth) return '[Array]';
    if (seen.has(value)) return '[Circular]';
    seen.add(value);
    const shown = value.slice(0, cfg.maxArrayItems).map((v) => serializeValue(v, cfg, depth + 1, seen));
    const overflow = value.length > cfg.maxArrayItems ? `, …(+${value.length - cfg.maxArrayItems})` : '';
    return `[${shown.join(', ')}${overflow}]`;
  }
  if (t === 'object') {
    if (depth >= cfg.maxDepth) return '[Object]';
    if (seen.has(value as object)) return '[Circular]';
    seen.add(value as object);
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return `{ ${entries.map(([k, v]) => `${k}: ${serializeValue(v, cfg, depth + 1, seen)}`).join(', ')} }`;
  }
  return String(value);
}

export function serializeArgs(
  args: Record<string, unknown>,
  opts: Pick<AddonOptions, 'maxDepth' | 'maxStringLength' | 'maxArrayItems'> = {},
): string {
  const cfg: Cfg = {
    maxDepth: opts.maxDepth ?? DEFAULTS.maxDepth,
    maxStringLength: opts.maxStringLength ?? DEFAULTS.maxStringLength,
    maxArrayItems: opts.maxArrayItems ?? DEFAULTS.maxArrayItems,
  };
  return serializeValue(args, cfg, 0);
}
