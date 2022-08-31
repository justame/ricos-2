import React from 'react';
import { RICOS_FONT_SIZE_TYPE } from 'ricos-content';
import { Decoration_Type } from 'ricos-schema';
import type { TiptapEditorPlugin, EditorCommands } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { fontSize } from './extension';
import FontSizePanelComponent from './FontSizePanelComponent';

const FONT_SIZE_MODAL_ID = 'fontSizeModal';

const getFontSize = (editorCommands: EditorCommands): ((props) => JSX.Element) => {
  const currentFontSize = editorCommands.getFontSize() || '';
  return () => <div>{currentFontSize}</div>;
};

export const pluginFontSize: TiptapEditorPlugin = {
  type: Decoration_Type.FONT_SIZE,
  config: {},
  tiptapExtensions: [fontSize],
  shortcuts: [
    {
      name: 'increaseFontSize',
      description: 'Increases size of selected text',
      keys: { macOs: 'Meta+Alt+.', windows: 'Ctrl+Alt+.' },
      command(editorCommands: EditorCommands) {
        const currentFontSize = editorCommands.getFontSize();
        const newFontSize = currentFontSize && parseInt(currentFontSize, 10) + 1;
        if (newFontSize) {
          editorCommands.insertDecoration(RICOS_FONT_SIZE_TYPE, {
            fontSize: newFontSize.toString(),
          });
        }
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'decreaseFontSize',
      description: 'Decreases size of selected text',
      keys: { macOs: 'Meta+Alt+,', windows: 'Ctrl+Alt+,' },
      command(editorCommands: EditorCommands) {
        const currentFontSize = editorCommands.getFontSize();
        const newFontSize = currentFontSize && parseInt(currentFontSize, 10) - 1;
        if (newFontSize) {
          editorCommands.insertDecoration(RICOS_FONT_SIZE_TYPE, {
            fontSize: newFontSize.toString(),
          });
        }
      },
      group: 'formatting',
      enabled: true,
    },
  ],
  textButtons: [
    {
      id: 'fontSize',
      type: 'modal',
      presentation: {
        dataHook: 'customFontSizeButton',
        tooltip: 'FormattingToolbar_CustomFontSizeButton_Tooltip',
        getIcon: getFontSize,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedFontSize: RESOLVERS_IDS.GET_FONT_SIZE_IN_SELECTION,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      modal: {
        id: FONT_SIZE_MODAL_ID,
        Component: FontSizePanelComponent,
        autoFocus: false,
      },
    },
  ],
};
