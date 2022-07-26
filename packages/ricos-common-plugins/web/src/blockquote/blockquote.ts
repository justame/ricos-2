import { BLOCKQUOTE } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import BlockQuoteIcon from './BlockQuoteIcon';
import { blockquote } from './extension';

export const pluginBlockquote: TiptapEditorPlugin = {
  type: Node_Type.BLOCKQUOTE,
  config: {},
  tiptapExtensions: [blockquote],
  shortcuts: [
    {
      name: 'blockquote',
      description: 'Toggles quote to current node',
      keys: 'Meta+Shift+9',
      command(editorCommands: EditorCommands) {
        editorCommands.setBlockType(BLOCKQUOTE);
      },
      group: 'formatting',
      keyCombinationText: 'Cmd+Shift+9',
      enabled: true,
    },
  ],
  textButtons: [
    {
      id: 'blockquote',
      type: 'toggle',
      presentation: {
        dataHook: 'textBlockStyleButton_Quote',
        tooltip: 'QuoteButton_Tooltip',
        icon: BlockQuoteIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_QUOTE,
      },
      command(editorCommands: EditorCommands) {
        editorCommands.setBlockType(BLOCKQUOTE);
        return true;
      },
    },
  ],
};
