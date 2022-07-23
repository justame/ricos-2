import { Node_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { orderedList } from './extension';
import OrderedListIcon from './OrderedListIcon';

export const pluginOrderedList: TiptapEditorPlugin = {
  type: Node_Type.ORDERED_LIST,
  config: {},
  tiptapExtensions: [orderedList],
  textButtons: [
    {
      id: 'orderedList',
      type: 'toggle',
      presentation: {
        dataHook: 'textBlockStyleButton_Numberedlist',
        tooltip: 'OrderedListButton_Tooltip',
        icon: OrderedListIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_ORDERED_LIST,
      },
      commands: {
        toggleOrderedList:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleOrderedList().run();
          },
      },
    },
  ],
};
