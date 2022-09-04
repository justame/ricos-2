import { Node_Type } from 'ricos-schema';

const modalContentStyles: React.CSSProperties = {
  width: 363,
  padding: 20,
  boxSizing: 'border-box',
  border: 'solid 1px rgba(51, 51, 51, 0.1)',
  borderRadius: 'var(--ricos-settings-whitebox-border-radius, 2px)',
  boxShadow: 'var(--ricos-settings-whitebox-box-shadow, 0 0 10px 0 rgba(0, 0, 0, 0.06))',
};

export const videoModalContentStyles: React.CSSProperties = {
  height: 232,
  ...modalContentStyles,
};

export const embedModalContentStyles: React.CSSProperties = {
  height: 180,
  ...modalContentStyles,
};

export const videoModals = {
  insertVideo: `${Node_Type.VIDEO}.insertVideo`,
  insertYoutube: `${Node_Type.VIDEO}.insertYoutube`,
  replace: `${Node_Type.VIDEO}.replace`,
  settings: `${Node_Type.VIDEO}.settings`,
};

export const VIDEO_BUTTONS = {
  alignment: `${Node_Type.VIDEO}.alignment`,
  size: `${Node_Type.VIDEO}.size`,
};
