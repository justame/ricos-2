import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { textAlign } from './extension';

export const pluginTextAlignment: TiptapEditorPlugin = {
  type: 'TEXT_ALIGNMENT',
  config: {},
  tiptapExtensions: [textAlign],
  shortcuts: [
    {
      name: 'align-left',
      description: 'Align text to the left',
      keys: { macOs: 'Meta+Shift+L', windows: 'Ctrl+Shift+L' },
      command(editorCommands: EditorCommands) {
        editorCommands.setTextAlignment('left');
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'align-center',
      description: 'Align text to the center',
      keys: { macOs: 'Meta+Shift+E', windows: 'Ctrl+Shift+E' },
      command(editorCommands: EditorCommands) {
        editorCommands.setTextAlignment('center');
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'align-right',
      description: 'Align text to the right',
      keys: { macOs: 'Meta+Shift+R', windows: 'Ctrl+Shift+R' },
      command(editorCommands: EditorCommands) {
        editorCommands.setTextAlignment('right');
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'align-justify',
      description: 'Justify text',
      keys: { macOs: 'Meta+Shift+J', windows: 'Ctrl+Shift+J' },
      command(editorCommands: EditorCommands) {
        editorCommands.setTextAlignment('justify');
      },
      group: 'formatting',
      enabled: true,
    },
  ],
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
