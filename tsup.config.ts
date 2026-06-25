import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/manager.tsx', 'src/preview.tsx'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-grab', 'storybook'],
  splitting: false,
});
