import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { ADDON_ID, TOOL_ID, GLOBAL_ENABLED } from './constants';
import { ReactGrabIcon } from './react-grab-icon';

function GrabToggle() {
  const [globals, updateGlobals] = useGlobals();
  // active = react-grab is on (grabbing enabled + toolbar shown).
  const enabled = globals[GLOBAL_ENABLED] ?? true;
  return React.createElement(
    IconButton,
    {
      active: Boolean(enabled),
      title: enabled ? 'React Grab: on (click to disable)' : 'React Grab: off (click to enable)',
      onClick: () => updateGlobals({ [GLOBAL_ENABLED]: !enabled }),
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
