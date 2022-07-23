import { createIndentPlugin } from './createIndentPlugin';
import type { IndentPluginEditorConfig } from './types';
import { INDENT_TYPE } from './types';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import increaseIndentPluginIcon from './icons/toolbars-v3/increaseIndentPluginIcon';
import decreaseIndentPluginIcon from './icons/toolbars-v3/decreaseIndentPluginIcon';
import { indent } from './tiptap';

export const pluginIndent: EditorPluginCreator<IndentPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: INDENT_TYPE,
    createPlugin: createIndentPlugin,
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
              editorCommands.chain().focus().indent().run();
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
              editorCommands.chain().focus().outdent().run();
            },
        },
      },
    ],
    tiptapExtensions: [indent],
  };
};
