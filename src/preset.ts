import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// NOTE: Storybook 9 auto-loads the addon's `./manager` entry from the package `exports`
// map, so we must NOT also register it via `managerEntries` — doing so loads the manager
// twice ("storybook-addon-react-grab was loaded twice" + duplicate toolbar registration).
// The `./preview` entry is NOT auto-loaded, so it must be registered here.
export function previewAnnotations(entry: string[] = []): string[] {
  return [...entry, require.resolve('./preview')];
}
