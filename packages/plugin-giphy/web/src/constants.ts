import type { ModalStyles } from 'wix-rich-content-common';

export const PAGE_SIZE = 25;
export const WAIT_INTERVAL = 300;
export const SEARCH_TYPE = 'gifs';

export const DEFAULTS = Object.freeze({
  config: {
    size: 'content',
    alignment: 'center',
  },
  configViewer: {
    sizes: { desktop: 'original', mobile: 'original' }, // original or downsizedSmall are supported
  },
});

export const DEFAULT_RESOLUTION = Object.freeze({ desktop: 'original', mobile: 'original' });

export const MOBILE_FULL_SCREEN_CUSTOM_STYLE: ModalStyles = Object.freeze({
  overlay: {
    backgroundColor: 'transparent',
  },
  content: {
    top: 0,
    left: 0,
    overflow: 'hidden',
    paddingRight: '6px',
  },
});

const commonDesktopModalStyles: React.CSSProperties = {
  width: '320px',
  boxSizing: 'border-box',
  height: '364px',
  overflow: 'visible',
  paddingRight: '12px',
  paddingLeft: '12px',
  display: 'block',
  position: 'absolute',
  zIndex: 6,
  paddingTop: '12px',
};

export const DESKTOP_FLY_OUT_MODAL_STYLES: ModalStyles = Object.freeze({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 5,
  },
  content: {
    ...commonDesktopModalStyles,
    border: 'solid 1px rgba(51, 51, 51, 0.1)',
    boxShadow: 'var(--ricos-settings-whitebox-box-shadow, 0 0 10px 0 rgba(0, 0, 0, 0.06))',
    borderRadius: 'var(--ricos-settings-whitebox-border-radius, 2px)',
  },
});

export const EXTERNAL_POPUP_STYLES: ModalStyles = Object.freeze({
  content: commonDesktopModalStyles,
});

export const gifModals = {
  insert: 'gifInsertModal',
  replace: 'gifReplaceModal',
};
