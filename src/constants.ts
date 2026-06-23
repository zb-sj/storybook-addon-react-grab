export const ADDON_ID = 'storybook-addon-react-grab';
export const TOOL_ID = `${ADDON_ID}/tool`;
// Plugin that carries only a theme override to show/hide react-grab's own toolbar widget.
export const TOOLBAR_PLUGIN_ID = `${ADDON_ID}/toolbar-visibility`;
// SB global: whether react-grab is active in the preview. When on, grabbing works and
// react-grab's bottom toolbar is shown; when off, grabbing is disabled and the toolbar hidden.
export const GLOBAL_ENABLED = 'reactGrabEnabled';
export const PARAM_KEY = 'reactGrab';
export const STORY_ATTR = 'data-sb-story-id';
