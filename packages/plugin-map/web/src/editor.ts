import { createMapPlugin } from './createMapPlugin';
import { DEFAULTS } from './defaults';
import { createMapData } from './createMapData';
import type { MapPluginEditorConfig } from './types';
import { MAP_TYPE } from './types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { getToolbarButtons } from './getToolbarButtons';

export const pluginMap: EditorPluginCreator<MapPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: MAP_TYPE,
    createPlugin: createMapPlugin,
    ModalsMap: {},
    createPluginData: createMapData,
    toolbar: { buttons: getToolbarButtons(config) },
  };
};
