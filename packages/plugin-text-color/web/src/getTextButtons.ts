import {
  alwaysVisibleResolver,
  getTextColorInSelectionResolver,
  getHighlightColorInSelectionResolver,
} from 'wix-rich-content-toolbars-v3';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
import TextColorIcon from './icons/TextColorIcon';
import TextHighlightIcon from './icons/TextHighlightIcon';

export const getTextColorTextButtons = (): IToolbarItemConfigTiptap[] => {
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
        visible: alwaysVisibleResolver,
        selectedTextColor: getTextColorInSelectionResolver,
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
    },
  ];
};

export const getTextHighlightTextButtons = (): IToolbarItemConfigTiptap[] => {
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
        visible: alwaysVisibleResolver,
        selectedHighlightColor: getHighlightColorInSelectionResolver,
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
