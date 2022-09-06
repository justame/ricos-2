import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { getCurrentTextAlignmentIcon } from 'wix-rich-content-toolbars-modals/libs/getCurrentTextAlignmentIcon';
import { textAlign } from './extension';
import AlignmentPanelComponent from './AlignmentPanelComponent';
import { AlignTextCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from './icons';

const FORMATTING_ALIGNMENT_MODAL_ID = 'TextAlignment.modal';

const getAlignmentIcon = (editorCommands: EditorCommands): ((props) => JSX.Element) => {
  return getCurrentTextAlignmentIcon(editorCommands);
};

export const pluginTextAlignment: TiptapEditorPlugin = {
  type: 'TEXT_ALIGNMENT',
  config: {},
  tiptapExtensions: [textAlign],
  shortcuts: [
    {
      name: 'TextAlignment.LEFT',
      description: 'Align text to the left',
      keys: { macOs: 'Meta+Shift+L', windows: 'Ctrl+Shift+L' },
      command(editorCommands: EditorCommands) {
        editorCommands.setTextAlignment('left');
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'TextAlignment.CENTER',
      description: 'Align text to the center',
      keys: { macOs: 'Meta+Shift+E', windows: 'Ctrl+Shift+E' },
      command(editorCommands: EditorCommands) {
        editorCommands.setTextAlignment('center');
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'TextAlignment.RIGHT',
      description: 'Align text to the right',
      keys: { macOs: 'Meta+Shift+R', windows: 'Ctrl+Shift+R' },
      command(editorCommands: EditorCommands) {
        editorCommands.setTextAlignment('right');
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'TextAlignment.JUSTIFY',
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
      id: 'TextAlignment.ALIGNMENT',
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
    {
      id: 'TextAlignment.LEFT',
      type: 'toggle',
      presentation: {
        dataHook: 'textAlignmentButton_left',
        tooltip: 'AlignTextLeftButton_Tooltip',
        icon: AlignLeftIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_ALIGN_LEFT,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.setTextAlignment('left');
        return true;
      },
    },
    {
      id: 'TextAlignment.CENTER',
      type: 'toggle',
      presentation: {
        dataHook: 'textAlignmentButton_center',
        tooltip: 'AlignTextCenterButton_Tooltip',
        icon: AlignTextCenterIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_ALIGN_CENTER,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.setTextAlignment('center');
        return true;
      },
    },
    {
      id: 'TextAlignment.RIGHT',
      type: 'toggle',
      presentation: {
        dataHook: 'textAlignmentButton_right',
        tooltip: 'AlignTextRightButton_Tooltip',
        icon: AlignRightIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_ALIGN_RIGHT,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.setTextAlignment('right');
        return true;
      },
    },
    {
      id: 'TextAlignment.JUSTIFY',
      type: 'toggle',
      presentation: {
        dataHook: 'textAlignmentButton_justify',
        tooltip: 'AlignTextJustifyButton_Tooltip',
        icon: AlignJustifyIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_ALIGN_JUSTIFY,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.setTextAlignment('justify');
        return true;
      },
    },
  ],
};
