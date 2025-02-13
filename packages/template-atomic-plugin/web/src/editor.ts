/*
  This module exports the required CreatePluginFunction for RicosEditor.
  If your plugin uses a modal, then make sure to uncomment 'ModalsMap'.
*/

import { createYourPluginNamePlugin } from './createYourPluginNamePlugin';
import type { YourPluginNamePluginEditorConfig } from './types';
import { YOUR_PLUGIN_NAME_TYPE } from './types';
// import { ModalsMap } from './modals'; // Optional
// import { theme } from './defaults'; // Optional
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';

export const pluginYourPluginName: EditorPluginCreator<
  YourPluginNamePluginEditorConfig
> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: YOUR_PLUGIN_NAME_TYPE,
    createPlugin: createYourPluginNamePlugin,
    // ModalsMap,
    // theme,
  };
};
