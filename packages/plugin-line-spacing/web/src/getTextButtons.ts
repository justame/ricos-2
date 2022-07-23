import type { FormattingToolbarButtonConfig } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import LineSpacingIcon from './icons/toolbars-v3/LineSpacingIcon';

export const getTextButtons = (): FormattingToolbarButtonConfig[] => {
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
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        selectedLineSpacing: RESOLVERS_IDS.GET_LINE_SPACING_IN_SELECTION,
        selectedLineSpacingBefore: RESOLVERS_IDS.GET_LINE_SPACING_BEFORE_SELECTION,
        selectedLineSpacingAfter: RESOLVERS_IDS.GET_LINE_SPACING_AFTER_SELECTION,
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
