import { Node_Type } from 'ricos-schema';

export const DEFAULTS = Object.freeze({
  config: {
    alignment: 'center',
    size: 'content',
    showTitle: true,
    showDescription: true,
  },
});

export const RICOS_DEFAULTS = Object.freeze({
  containerData: {
    alignment: 'CENTER',
    width: {
      size: 'CONTENT',
    },
    textWrap: true,
  },
});

export const DIVIDER = 'divider';

export const imageModals = {
  settings: `${Node_Type.IMAGE}.settings`,
  imageEditor: `${Node_Type.IMAGE}.imageEditor`,
};

export const IMAGE_BUTTONS = {
  size: `${Node_Type.IMAGE}.size`,
  alignment: `${Node_Type.IMAGE}.alignment`,
};
