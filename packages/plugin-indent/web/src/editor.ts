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
        name: 'increaseIndent',
        description: 'Indents the current node',
        keys: 'Meta+]',
        command(editorCommands: EditorCommands) {
          editorCommands.insertDecoration(RICOS_INDENT_TYPE);
        },
        group: 'formatting',
        keyCombinationText: 'Meta+]',
        enabled: true,
      },
      {
        name: 'decreaseIndent',
        description: 'Unindents the current node',
        keys: 'Meta+[',
        command(editorCommands: EditorCommands) {
          editorCommands.deleteDecoration(RICOS_INDENT_TYPE);
        },
        group: 'formatting',
        keyCombinationText: 'Meta+[',
        enabled: true,
      },
    ],
    textButtons: [
      {
        id: 'increaseIndent',
        type: 'toggle',
        presentation: {
          dataHook: 'increaseIndentButton',
          tooltip: 'increaseIndentButton_Tooltip',
          icon: increaseIndentPluginIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        },
        commands: {
          increaseIndent:
            ({ editorCommands }) =>
            () => {
              editorCommands.chain().indent().run();
            },
          decreaseIndent: () => () => {},
        },
      },
      {
        id: 'decreaseIndent',
        type: 'toggle',
        presentation: {
          dataHook: 'decreaseIndentButton',
          tooltip: 'decreaseIndentButton_Tooltip',
          icon: decreaseIndentPluginIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        },
        commands: {
          increaseIndent: () => () => {},
          decreaseIndent:
            ({ editorCommands }) =>
            () => {
              editorCommands.chain().outdent().run();
            },
        },
      },
    ],
    tiptapExtensions: [indent],
  };
};
