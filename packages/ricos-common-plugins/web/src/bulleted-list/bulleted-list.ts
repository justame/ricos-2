import { Node_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { bulletedList } from './extension';
import UnorderedListIcon from './UnorderedListIcon';

export const pluginBulletedList: TiptapEditorPlugin = {
  type: Node_Type.BULLETED_LIST,
  config: {},
  tiptapExtensions: [bulletedList],
  textButtons: [
    {
      id: 'unorderedList',
      type: 'toggle',
      presentation: {
        dataHook: 'textBlockStyleButton_Bulletedlist',
        tooltip: 'UnorderedListButton_Tooltip',
        icon: UnorderedListIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_UNORDERED_LIST,
      },
      commands: {
        toggleUnorderedList:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleBulletList().run();
          },
      },
    },
  ],
};
