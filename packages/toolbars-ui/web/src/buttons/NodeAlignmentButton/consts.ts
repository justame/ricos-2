import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from '../../icons';

export const alignmentsMap = {
  LEFT: {
    text: 'AlignObject_Left_Tooltip',
    tooltip: 'AlignObject_Left_Tooltip',
    commandKey: 'LEFT',
    icon: AlignLeftIcon,
    dataHook: 'blockAlignmentAndSizeButton_alignLeft',
  },
  CENTER: {
    text: 'AlignObject_Center_Tooltip',
    tooltip: 'AlignObject_Center_Tooltip',
    commandKey: 'CENTER',
    icon: AlignCenterIcon,
    dataHook: 'blockAlignmentAndSizeButton_alignCenter',
  },
  RIGHT: {
    text: 'AlignObject_Right_Tooltip',
    tooltip: 'AlignObject_Right_Tooltip',
    commandKey: 'RIGHT',
    icon: AlignRightIcon,
    dataHook: 'blockAlignmentAndSizeButton_alignRight',
  },
};

export const defaultAlignments = [alignmentsMap.LEFT, alignmentsMap.CENTER, alignmentsMap.RIGHT];
