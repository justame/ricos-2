import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { getCurrentTextAlignmentIcon } from 'wix-rich-content-toolbars-modals/libs/getCurrentTextAlignmentIcon';
import { textAlign } from './extension';
import AlignmentPanelComponent from './AlignmentPanelComponent';

const FORMATTING_ALIGNMENT_MODAL_ID = 'formattingAlignmentModal';

const getAlignmentIcon = (editorCommands: EditorCommands): ((props) => JSX.Element) => {
  return getCurrentTextAlignmentIcon(editorCommands);
};

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
        getIcon: getAlignmentIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedAlignment: RESOLVERS_IDS.GET_ALIGNMENT_IN_SELECTION,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      modal: {
        id: FORMATTING_ALIGNMENT_MODAL_ID,
        Component: AlignmentPanelComponent,
      },
    },
  ],
};
