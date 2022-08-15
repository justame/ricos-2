import { createTablePlugin } from './createTablePlugin';
import { ModalsMap } from './modals';
import { theme, DEFAULTS } from './defaults';
import type { TablePluginEditorConfig } from './types';
import { TABLE_TYPE } from './types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { tiptapExtensions } from './tiptap/tiptap';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';
import { TIPTAP_TABLE_TYPE } from 'ricos-content';
import { isTextSelection } from '@tiptap/core';

export const pluginTable: EditorPluginCreator<TablePluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: TABLE_TYPE,
    createPlugin: createTablePlugin,
    ModalsMap,
    theme,
    tiptapExtensions,
    getAddButtons: (config, services) => getAddButtons(config, services),
    toolbar: {
      getButtons: (config, services) => getToolbarButtons(config, services),
      isVisible: selection =>
        !isTextSelection(selection) &&
        selection.$anchor?.path?.find(node => node?.type?.name === TIPTAP_TABLE_TYPE),
    },
  };
};
