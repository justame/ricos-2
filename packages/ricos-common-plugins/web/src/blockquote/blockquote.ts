import { Node_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import BlockQuoteIcon from './BlockQuoteIcon';
import { blockquote } from './extension';

export const pluginBlockquote: TiptapEditorPlugin = {
  type: Node_Type.BLOCKQUOTE,
  config: {},
  tiptapExtensions: [blockquote],
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
      commands: {
        toggleQuote:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleBlockquote().run();
          },
      },
    },
  ],
};
