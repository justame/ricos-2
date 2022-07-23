import { Decoration_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import BoldIcon from './BoldIcon';
import { bold } from './extension';

export const pluginBold: TiptapEditorPlugin = {
  type: Decoration_Type.BOLD,
  config: {},
  tiptapExtensions: [bold],
  textButtons: [
    {
      id: 'bold',
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_Bold',
        tooltip: 'BoldButton_Tooltip',
        tooltipShortcut: {
          MacOS: ' (⌘B)',
          Windows: ' (Ctrl+B)',
        },
        icon: BoldIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_BOLD,
      },
      commands: {
        toggleBold:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleBold().run();
          },
      },
    },
  ],
};
