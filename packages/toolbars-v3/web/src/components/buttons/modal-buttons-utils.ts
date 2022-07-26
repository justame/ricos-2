import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';

export const onModalKeyDown = (e, closeModal) => {
  if (e.keyCode === KEYS_CHARCODE.ESCAPE) {
    closeModal();
    e.stopPropagation();
  }
};
