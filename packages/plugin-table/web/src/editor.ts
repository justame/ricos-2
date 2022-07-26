import { createTablePlugin } from './createTablePlugin';
import { ModalsMap } from './modals';
import { theme, DEFAULTS } from './defaults';
import type { TablePluginEditorConfig } from './types';
import { TABLE_TYPE } from './types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';

export const pluginTable: EditorPluginCreator<TablePluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: TABLE_TYPE,
    createPlugin: createTablePlugin,
    ModalsMap,
    theme,
    getAddButtons: () => getAddButtons(),
    toolbar: { getButtons: config => getToolbarButtons(config) },
  };
};
