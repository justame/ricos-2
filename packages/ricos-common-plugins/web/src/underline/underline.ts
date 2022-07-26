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
      name: 'underline',
      description: 'Toggles underline style of selected text',
      keys: 'Meta+U',
      command(editorCommands: EditorCommands) {
        editorCommands.toggleInlineStyle('underline');
      },
      group: 'formatting',
      keyCombinationText: 'Cmd+U',
      enabled: true,
    },
  ],
  textButtons: [
    {
      id: 'underline',
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_Underline',
        tooltip: 'UnderlineButton_Tooltip',
        tooltipShortcut: {
          MacOS: ' (⌘U)',
          Windows: ' (Ctrl+U)',
        },
        icon: UnderlineIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_UNDERLINE,
      },
      command: (editorCommands: EditorCommands) => {
        editorCommands.toggleInlineStyle('underline');
        return true;
      },
    },
  ],
};
