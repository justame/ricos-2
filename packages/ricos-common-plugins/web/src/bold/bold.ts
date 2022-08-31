import { Decoration_Type } from 'ricos-schema';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import BoldIcon from './BoldIcon';
import { bold } from './extension';

export const pluginBold: TiptapEditorPlugin = {
  type: Decoration_Type.BOLD,
  config: {},
  tiptapExtensions: [bold],
  shortcuts: [
    {
      name: 'bold',
      description: 'Toggles bold style of selected text',
      keys: { macOs: 'Meta+B', windows: 'Ctrl+B' },
      command(editorCommands: EditorCommands) {
        editorCommands.toggleInlineStyle('bold');
      },
      group: 'formatting',
      enabled: true,
    },
  ],

  textButtons: [
    {
      id: 'bold',
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_Bold',
        tooltip: 'BoldButton_Tooltip',
        icon: BoldIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_BOLD,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.toggleInlineStyle('bold');
        return true;
      },
    },
  ],
};
