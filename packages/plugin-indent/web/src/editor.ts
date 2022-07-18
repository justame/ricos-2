import { createIndentPlugin } from './createIndentPlugin';
import type { IndentPluginEditorConfig } from './types';
import { INDENT_TYPE } from './types';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { getTextButtons } from './getTextButtons';

export const pluginIndent: EditorPluginCreator<IndentPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: INDENT_TYPE,
    createPlugin: createIndentPlugin,
    textButtons: getTextButtons(),
  };
};
