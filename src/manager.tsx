import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { ADDON_ID, TOOL_ID, GLOBAL_ENABLED } from './constants';

function GrabToggle() {
  const [globals, updateGlobals] = useGlobals();
  const active = Boolean(globals[GLOBAL_ENABLED]);
  return React.createElement(
    IconButton,
    {
      active,
      title: active ? 'React Grab: on' : 'React Grab: off',
      onClick: () => updateGlobals({ [GLOBAL_ENABLED]: !active }),
    },
    '🤏 Grab',
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
