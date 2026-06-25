import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'],
  addons: ['@zigbang/storybook-addon-react-grab', '@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
};
export default config;
