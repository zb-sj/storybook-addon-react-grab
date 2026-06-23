import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { ADDON_ID, TOOL_ID, GLOBAL_TOOLBAR } from './constants';
import { ReactGrabIcon } from './react-grab-icon';

function GrabToggle() {
  const [globals, updateGlobals] = useGlobals();
  // active = react-grab's bottom toolbar is currently shown.
  const shown = globals[GLOBAL_TOOLBAR] ?? true;
  return React.createElement(
    IconButton,
    {
      active: Boolean(shown),
      title: shown ? 'Hide React Grab toolbar' : 'Show React Grab toolbar',
      onClick: () => updateGlobals({ [GLOBAL_TOOLBAR]: !shown }),
    },
    React.createElement(ReactGrabIcon, null),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'React Grab',
    match: ({ viewMode }: { viewMode?: string }) => viewMode === 'story' || viewMode === 'docs',
    render: () => React.createElement(GrabToggle),
  });
});
