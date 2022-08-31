import type { FormattingToolbarButtonConfig } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import LineSpacingIcon from './icons/toolbars-v3/LineSpacingIcon';
import LineSpacingPanelComponent from './LineSpacingPanelComponent';

const FORMATTING_LINE_SPACING_MODAL_ID = 'formattingLineSpacingModal';

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
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      modal: {
        id: FORMATTING_LINE_SPACING_MODAL_ID,
        Component: LineSpacingPanelComponent,
      },
    },
  ];
};
