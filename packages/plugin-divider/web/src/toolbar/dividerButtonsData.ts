import { DashedLineStyle, DottedLineStyle, DoubleLineStyle, SingleLineStyle } from '../icons';
import { SizeLargeIcon, SizeMediumIcon, SizeSmallIcon } from 'wix-rich-content-plugin-commons';
import { SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE } from '../defaults';
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from 'wix-rich-content-toolbars-ui';

export const dividerSizeData = [
  {
    text: 'SizeSmallButton_Tooltip',
    tooltip: 'SizeSmallButton_Tooltip',
    commandKey: 'SMALL',
    icon: SizeSmallIcon,
    dataHook: 'blockSizeButton_sizeSmall',
  },
  {
    text: 'SizeContentButton_Tooltip',
    tooltip: 'SizeContentButton_Tooltip',
    commandKey: 'CONTENT',
    icon: SizeMediumIcon,
    dataHook: 'blockSizeButton_sizeMedium',
  },

  {
    text: 'SizeFullWidthButton_Tooltip',
    tooltip: 'SizeFullWidthButton_Tooltip',
    commandKey: 'FULL_WIDTH',
    icon: SizeLargeIcon,
    dataHook: 'blockSizeButton_sizeLarge',
  },
];

export const dividerStyleData = [
  {
    commandKey: 'SINGLE',
    icon: SingleLineStyle,
    dataHook: 'single_dropdown_option',
  },
  {
    commandKey: 'DOUBLE',
    icon: DoubleLineStyle,
    dataHook: 'double_dropdown_option',
  },

  {
    commandKey: 'DASHED',
    icon: DashedLineStyle,
    dataHook: 'dashed_dropdown_option',
  },
  {
    commandKey: 'DOTTED',
    icon: DottedLineStyle,
    dataHook: 'dotted_dropdown_option',
  },
];

export const alignmentsMap = {
  LEFT: {
    text: 'AlignObject_Left_Tooltip',
    tooltip: 'AlignObject_Left_Tooltip',
    commandKey: 'LEFT',
    icon: AlignLeftIcon,
    dataHook: 'blockAlignmentButton_alignLeft',
  },
  CENTER: {
    text: 'AlignObject_Center_Tooltip',
    tooltip: 'AlignObject_Center_Tooltip',
    commandKey: 'CENTER',
    icon: AlignCenterIcon,
    dataHook: 'blockAlignmentButton_alignCenter',
  },
  RIGHT: {
    text: 'AlignObject_Right_Tooltip',
    tooltip: 'AlignObject_Right_Tooltip',
    commandKey: 'RIGHT',
    icon: AlignRightIcon,
    dataHook: 'blockAlignmentButton_alignRight',
  },
};

export const alignmentMap = {
  LEFT: AlignLeftIcon,
  CENTER: AlignCenterIcon,
  RIGHT: AlignRightIcon,
};

export const DIVIDER_SIZES = { SMALL: SIZE_SMALL, CONTENT: SIZE_MEDIUM, FULL_WIDTH: SIZE_LARGE };

export const defaultAlignments = [alignmentsMap.LEFT, alignmentsMap.CENTER, alignmentsMap.RIGHT];
