import React from 'react';
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
      },
      modal: {
        id: FONT_SIZE_MODAL_ID,
        Component: FontSizePanelComponent,
        layout: 'toolbar',
        autoFocus: false,
      },
    },
  ],
};
