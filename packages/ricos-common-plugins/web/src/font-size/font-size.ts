import { Decoration_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { fontSize } from './extension';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;

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
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedFontSize: RESOLVERS_IDS.GET_FONT_SIZE_IN_SELECTION,
      },
      commands: {
        setFontSize:
          ({ editorCommands }) =>
          value => {
            if (!value) return;
            const fontSize = Math.min(Math.max(MIN_FONT_SIZE, value), MAX_FONT_SIZE);
            editorCommands.chain().focus().setFontSize(fontSize).run();
          },
        setFontSizeWithoutFocus:
          ({ editorCommands }) =>
          value => {
            if (!value) return;
            const fontSize = Math.min(Math.max(MIN_FONT_SIZE, value), MAX_FONT_SIZE);
            editorCommands.chain().setFontSize(fontSize).run();
          },
      },
    },
  ],
};
