import type { EditorCommands, EditorPluginCreator } from 'wix-rich-content-common';
import { RICOS_INDENT_TYPE } from 'wix-rich-content-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { createIndentPlugin } from './createIndentPlugin';
import { DEFAULTS } from './defaults';
import decreaseIndentPluginIcon from './icons/toolbars-v3/decreaseIndentPluginIcon';
import increaseIndentPluginIcon from './icons/toolbars-v3/increaseIndentPluginIcon';
import { indent } from './tiptap';
import type { IndentPluginEditorConfig } from './types';
import { INDENT_TYPE } from './types';

export const pluginIndent: EditorPluginCreator<IndentPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: INDENT_TYPE,
    createPlugin: createIndentPlugin,
    shortcuts: [
      {
        name: `${INDENT_TYPE}.increase`,
        description: 'Indents the current node',
        keys: { macOs: 'Meta+]', windows: 'Ctrl+]' },
        command(editorCommands: EditorCommands) {
          editorCommands.insertDecoration(RICOS_INDENT_TYPE);
        },
        group: 'formatting',
        enabled: true,
      },
      {
        name: `${INDENT_TYPE}.decrease`,
        description: 'Unindents the current node',
        keys: { macOs: 'Meta+[', windows: 'Ctrl+[' },
        command(editorCommands: EditorCommands) {
          editorCommands.deleteDecoration(RICOS_INDENT_TYPE);
        },
        group: 'formatting',
        enabled: true,
      },
    ],
    textButtons: [
      {
        id: `${INDENT_TYPE}.increase`,
        type: 'toggle',
        presentation: {
          dataHook: 'increaseIndentButton',
          tooltip: 'increaseIndentButton_Tooltip',
          icon: increaseIndentPluginIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
          disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
        },
        command: (editorCommands: EditorCommands) => () => {
          editorCommands.insertDecoration(RICOS_INDENT_TYPE);
          return true;
        },
      },
      {
        id: `${INDENT_TYPE}.decrease`,
        type: 'toggle',
        presentation: {
          dataHook: 'decreaseIndentButton',
          tooltip: 'decreaseIndentButton_Tooltip',
          icon: decreaseIndentPluginIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
          disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
        },
        command: (editorCommands: EditorCommands) => () => {
          editorCommands.deleteDecoration(RICOS_INDENT_TYPE);
          return true;
        },
      },
    ],
    tiptapExtensions: [indent],
  };
};
