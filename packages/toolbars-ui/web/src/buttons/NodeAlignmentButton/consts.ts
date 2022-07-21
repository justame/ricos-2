import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from '../../icons';

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

export const defaultAlignments = [alignmentsMap.LEFT, alignmentsMap.CENTER, alignmentsMap.RIGHT];
