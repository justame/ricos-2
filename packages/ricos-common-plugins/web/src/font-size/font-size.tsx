import React from 'react';
import { Decoration_Type } from 'ricos-schema';
import type { TiptapEditorPlugin, EditorCommands } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { fontSize } from './extension';
import FontSizePanelComponent from './FontSizePanelComponent';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;
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
      commands: {
        setFontSizeWithoutFocus:
          ({ editorCommands }) =>
          value => {
            if (!value) return;
            const fontSize = Math.min(Math.max(MIN_FONT_SIZE, value), MAX_FONT_SIZE);
            editorCommands.chain().setFontSize(fontSize).run();
          },
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
