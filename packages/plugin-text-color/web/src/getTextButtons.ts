import type { FormattingToolbarButtonConfig, IToolbarItemConfigTiptap } from 'ricos-types';
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
        icon: TextColorIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedTextColor: RESOLVERS_IDS.GET_TEXT_COLOR_IN_SELECTION,
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
        Component: TextColorController,
        layout: 'toolbar',
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
        icon: TextHighlightIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedHighlightColor: RESOLVERS_IDS.GET_HIGHLIGHT_COLOR_IN_SELECTION,
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
    },
  ];
};
