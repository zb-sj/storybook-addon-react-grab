import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function managerEntries(entry: string[] = []): string[] {
  return [...entry, require.resolve('./manager')];
}

export function previewAnnotations(entry: string[] = []): string[] {
  return [...entry, require.resolve('./preview')];
}
