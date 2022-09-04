import { BULLET_LIST_TYPE } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { bulletedList } from './extension';
import UnorderedListIcon from './UnorderedListIcon';

export const pluginBulletedList: TiptapEditorPlugin = {
  type: Node_Type.BULLETED_LIST,
  config: {},
  tiptapExtensions: [bulletedList],
  shortcuts: [
    {
      name: Node_Type.BULLETED_LIST,
      description: 'Toggles bulleted list to current node',
      keys: { macOs: 'Meta+Shift+8', windows: 'Ctrl+Shift+8' },
      command(editorCommands: EditorCommands) {
        editorCommands.setBlockType(BULLET_LIST_TYPE);
      },
      group: 'formatting',
      enabled: true,
    },
  ],
  textButtons: [
    {
      id: Node_Type.BULLETED_LIST,
      type: 'toggle',
      presentation: {
        dataHook: 'textBlockStyleButton_Bulletedlist',
        tooltip: 'UnorderedListButton_Tooltip',
        icon: UnorderedListIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_UNORDERED_LIST,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.setBlockType(BULLET_LIST_TYPE);
        return true;
      },
    },
  ],
};
