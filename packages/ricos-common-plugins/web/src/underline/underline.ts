import { Decoration_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { underline } from './extension';
import UnderlineIcon from './UnderlineIcon';

export const pluginUnderline: TiptapEditorPlugin = {
  type: Decoration_Type.UNDERLINE,
  config: {},
  tiptapExtensions: [underline],
  textButtons: [
    {
      id: 'underline',
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_Underline',
        tooltip: 'UnderlineButton_Tooltip',
        tooltipShortcut: {
          MacOS: ' (⌘I)',
          Windows: ' (Ctrl+I)',
        },
        icon: UnderlineIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_UNDERLINE,
      },
      commands: {
        toggleUnderline:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleUnderline().run();
          },
      },
    },
  ],
};
