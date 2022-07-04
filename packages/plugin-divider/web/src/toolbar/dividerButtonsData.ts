import { DashedLineStyle, DottedLineStyle, DoubleLineStyle, SingleLineStyle } from '../icons';
import { SizeLargeIcon, SizeMediumIcon, SizeSmallIcon } from 'wix-rich-content-plugin-commons';

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
