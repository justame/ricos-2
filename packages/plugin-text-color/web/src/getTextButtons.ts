import type { EditorCommands, FormattingToolbarButtonConfig } from 'ricos-types';
import { decorateComponentWithProps } from 'wix-rich-content-editor-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import TextColorIcon from './icons/TextColorIcon';
import TextHighlightIcon from './icons/TextHighlightIcon';
import { TextColorController } from './TextColorController';

export const getTextColorTextButtons = (): FormattingToolbarButtonConfig[] => {
  return [
    {
      id: 'textColor',
      type: 'modal',
      presentation: {
        dataHook: 'TextColorButton',
        tooltip: 'TextColorButton_Tooltip',
        getIcon(editorCommands: EditorCommands) {
          const color = editorCommands.getColor('ricos-text-color');
          return () => TextColorIcon({ color });
        },
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedTextColor: RESOLVERS_IDS.GET_TEXT_COLOR_IN_SELECTION,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      commands: {
        setTextColor:
          ({ editorCommands }) =>
          color => {
            editorCommands.chain().focus().setColor(color.color).run();
          },
        resetTextColor:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().unsetColor().run();
          },
      },
      modal: {
        id: 'TEXT_COLOR_PICKER',
        Component: decorateComponentWithProps(TextColorController, { type: 'ricos-text-color' }),
      },
    },
  ];
};

export const getTextHighlightTextButtons = (): FormattingToolbarButtonConfig[] => {
  return [
    {
      id: 'textHighlight',
      type: 'modal',
      presentation: {
        dataHook: 'TextHighlightButton',
        tooltip: 'TextHighlightButton_Tooltip',
        getIcon(editorCommands: EditorCommands) {
          const color = editorCommands.getColor('ricos-text-highlight');
          return () => TextHighlightIcon({ color });
        },
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedHighlightColor: RESOLVERS_IDS.GET_HIGHLIGHT_COLOR_IN_SELECTION,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      commands: {
        setHighlightColor:
          ({ editorCommands }) =>
          color => {
            editorCommands.chain().focus().setHighlight(color.color).run();
          },
        resetHighlightColor:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().unsetHighlight().run();
          },
      },
      modal: {
        id: 'TEXT_HIGHLIGHT_PICKER',
        Component: decorateComponentWithProps(TextColorController, {
          type: 'ricos-text-highlight',
        }),
      },
    },
  ];
};
