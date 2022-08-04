import { DashedLineStyle, DottedLineStyle, DoubleLineStyle, SingleLineStyle } from '../../icons';
import { SizeLargeIcon, SizeMediumIcon, SizeSmallIcon } from 'wix-rich-content-plugin-commons';
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
    commandKey: 'MEDIUM',
    icon: SizeMediumIcon,
    dataHook: 'blockSizeButton_sizeMedium',
  },

  {
    text: 'SizeFullWidthButton_Tooltip',
    tooltip: 'SizeFullWidthButton_Tooltip',
    commandKey: 'LARGE',
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

export const alignmentMap = {
  LEFT: AlignLeftIcon,
  CENTER: AlignCenterIcon,
  RIGHT: AlignRightIcon,
};
