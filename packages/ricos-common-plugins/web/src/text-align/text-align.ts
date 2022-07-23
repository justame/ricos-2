import type { TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { textAlign } from './extension';

export const pluginTextAlignment: TiptapEditorPlugin = {
  type: 'TEXT_ALIGNMENT',
  config: {},
  tiptapExtensions: [textAlign],
  textButtons: [
    {
      id: 'alignment',
      type: 'modal',
      presentation: {
        dataHook: 'textDropDownButton_Alignment',
        tooltip: 'AlignTextDropdownButton_Tooltip',
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedAlignment: RESOLVERS_IDS.GET_ALIGNMENT_IN_SELECTION,
      },
      commands: {
        setAlignment:
          ({ editorCommands }) =>
          alignment => {
            editorCommands.chain().focus().setTextAlign(alignment).run();
          },
      },
    },
  ],
};
