import { SizeContentIcon, SizeFullWidthIcon, SizeOriginalIcon, SizeSmallIcon } from '../../icons';

export const sizeMap = {
  CONTENT: {
    text: 'SizeContentButton_Tooltip',
    tooltip: 'SizeContentButton_Tooltip',
    commandKey: 'CONTENT',
    icon: SizeContentIcon,
    dataHook: 'blockAlignmentAndSizeButton_sizeContent',
  },
  SMALL: {
    text: 'SizeSmallCenterButton_Tooltip',
    tooltip: 'SizeSmallCenterButton_Tooltip',
    commandKey: 'SMALL',
    icon: SizeSmallIcon,
    dataHook: 'blockAlignmentAndSizeButton_sizeSmall',
  },
  ORIGINAL: {
    text: 'SizeOriginalButton_Tooltip',
    tooltip: 'SizeOriginalButton_Tooltip',
    commandKey: 'ORIGINAL',
    icon: SizeOriginalIcon,
    dataHook: 'blockAlignmentAndSizeButton_sizeOriginal',
  },
  FULL_WIDTH: {
    text: 'SizeFullWidthButton_Tooltip',
    tooltip: 'SizeFullWidthButton_Tooltip',
    commandKey: 'FULL_WIDTH',
    icon: SizeFullWidthIcon,
    dataHook: 'blockAlignmentAndSizeButton_sizeFullWidth',
  },
};

export const defaultSize = [sizeMap.SMALL, sizeMap.CONTENT, sizeMap.FULL_WIDTH];

export const sizeIconMap = {
  CONTENT: SizeContentIcon,
  SMALL: SizeSmallIcon,
  ORIGINAL: SizeOriginalIcon,
  FULL_WIDTH: SizeFullWidthIcon,
};
