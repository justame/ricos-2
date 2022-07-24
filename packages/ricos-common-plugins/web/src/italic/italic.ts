import { Decoration_Type } from 'ricos-schema';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { italic } from './extension';
import ItalicIcon from './ItalicIcon';

export const pluginItalic: TiptapEditorPlugin = {
  type: Decoration_Type.ITALIC,
  config: {},
  tiptapExtensions: [italic],
  shortcuts: [
    {
      name: 'italic',
      description: 'Toggles italic style of selected text',
      keys: 'Meta+I',
      command(editorCommands: EditorCommands) {
        editorCommands.toggleInlineStyle('italic');
      },
      group: 'formatting',
      keyCombinationText: 'Cmd+I',
      enabled: true,
    },
  ],
  textButtons: [
    {
      id: 'italic',
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_Italic',
        tooltip: 'ItalicButton_Tooltip',
        tooltipShortcut: {
          MacOS: ' (⌘I)',
          Windows: ' (Ctrl+I)',
        },
        icon: ItalicIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_ITALIC,
      },
      commands: {
        toggleItalic:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleItalic().run();
          },
      },
    },
  ],
};
