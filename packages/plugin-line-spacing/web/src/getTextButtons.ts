import {
  alwaysVisibleResolver,
  getLineSpacingInSelectionResolver,
  getLineSpacingBeforeSelectionResolver,
  getLineSpacingAfterSelectionResolver,
} from 'wix-rich-content-toolbars-v3';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
import LineSpacingIcon from './icons/toolbars-v3/LineSpacingIcon';

export const getTextButtons = (): IToolbarItemConfigTiptap[] => {
  return [
    {
      id: 'lineSpacing',
      type: 'modal',
      presentation: {
        dataHook: 'LineSpacingButton',
        tooltip: 'LineSpacingButton_Tooltip',
        icon: LineSpacingIcon,
      },
      attributes: {
        visible: alwaysVisibleResolver,
        selectedLineSpacing: getLineSpacingInSelectionResolver,
        selectedLineSpacingBefore: getLineSpacingBeforeSelectionResolver,
        selectedLineSpacingAfter: getLineSpacingAfterSelectionResolver,
      },
      commands: {
        setLineSpacing:
          ({ editorCommands }) =>
          value => {
            if (!value) return;
            const {
              'line-height': stringLineHeight,
              'padding-bottom': stringPaddingBottom,
              'padding-top': stringPaddingTop,
            } = value;

            const lineHeight = parseFloat(stringLineHeight);
            const paddingBottom = parseFloat(stringPaddingBottom);
            const paddingTop = parseFloat(stringPaddingTop);

            editorCommands
              .chain()
              .focus()
              .setLineSpacing(lineHeight)
              .setLineSpacingBefore(paddingTop)
              .setLineSpacingAfter(paddingBottom)
              .run();
          },
        setLineSpacingWithoutFocus:
          ({ editorCommands }) =>
          value => {
            if (!value) return;
            const {
              'line-height': stringLineHeight,
              'padding-bottom': stringPaddingBottom,
              'padding-top': stringPaddingTop,
            } = value;

            const lineHeight = parseFloat(stringLineHeight);
            const paddingBottom = parseFloat(stringPaddingBottom);
            const paddingTop = parseFloat(stringPaddingTop);

            editorCommands
              .chain()
              .setLineSpacing(lineHeight)
              .setLineSpacingBefore(paddingTop)
              .setLineSpacingAfter(paddingBottom)
              .run();
          },
      },
    },
  ];
};
