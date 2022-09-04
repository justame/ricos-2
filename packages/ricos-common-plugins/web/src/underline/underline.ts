import { Decoration_Type } from 'ricos-schema';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { underline } from './extension';
import UnderlineIcon from './UnderlineIcon';

export const pluginUnderline: TiptapEditorPlugin = {
  type: Decoration_Type.UNDERLINE,
  config: {},
  tiptapExtensions: [underline],
  shortcuts: [
    {
      name: Decoration_Type.UNDERLINE,
      description: 'Toggles underline style of selected text',
      keys: { macOs: 'Meta+U', windows: 'Ctrl+U' },
      command(editorCommands: EditorCommands) {
        editorCommands.toggleInlineStyle('underline');
      },
      group: 'formatting',
      enabled: true,
    },
  ],
  textButtons: [
    {
      id: Decoration_Type.UNDERLINE,
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_Underline',
        tooltip: 'UnderlineButton_Tooltip',
        icon: UnderlineIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_UNDERLINE,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.toggleInlineStyle('underline');
        return true;
      },
    },
  ],
};
