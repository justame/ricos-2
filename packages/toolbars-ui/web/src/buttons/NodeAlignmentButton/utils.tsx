import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from '../../icons';

export const getDefaultAlignment = langDir => {
  return langDir === 'rtl' ? 'RIGHT' : 'LEFT';
};

export const alignmentMap = {
  LEFT: AlignLeftIcon,
  CENTER: AlignCenterIcon,
  RIGHT: AlignRightIcon,
};
