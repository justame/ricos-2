import { NUMBERED_LIST_TYPE } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { orderedList } from './extension';
import OrderedListIcon from './OrderedListIcon';

export const pluginOrderedList: TiptapEditorPlugin = {
  type: Node_Type.ORDERED_LIST,
  config: {},
  shortcuts: [
    {
      name: 'orderedList',
      description: 'Toggles ordered list to current node',
      keys: 'Meta+Shift+7',
      command(editorCommands: EditorCommands) {
        editorCommands.setBlockType(NUMBERED_LIST_TYPE);
      },
      group: 'formatting',
      keyCombinationText: 'Cmd+Shift+7',
      enabled: true,
    },
  ],
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
      command(editorCommands: EditorCommands) {
        editorCommands.setBlockType(NUMBERED_LIST_TYPE);
        return true;
      },
    },
  ],
};
