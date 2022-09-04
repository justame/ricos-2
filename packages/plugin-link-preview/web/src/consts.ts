import { Node_Type } from 'ricos-schema';

export const REMOVE_LINK_PREVIEW = 'remove-link-preview';

export enum LinkPreviewProviders {
  Instagram = 'Instagram',
  Twitter = 'Twitter',
  YouTube = 'YouTube',
  TikTok = 'TikTok',
}

export const modalContentStyles: React.CSSProperties = {
  width: 363,
  height: 180,
  padding: 20,
  boxSizing: 'border-box',
  border: 'solid 1px rgba(51, 51, 51, 0.1)',
  borderRadius: 'var(--ricos-settings-whitebox-border-radius, 2px)',
  boxShadow: 'var(--ricos-settings-whitebox-box-shadow, 0 0 10px 0 rgba(0, 0, 0, 0.06))',
};

export const socialModals = {
  instagram: `${Node_Type.LINK_PREVIEW}.instagram`,
  facebook: `${Node_Type.LINK_PREVIEW}.facebook`,
  tiktok: `${Node_Type.LINK_PREVIEW}.tiktok`,
  twitter: `${Node_Type.LINK_PREVIEW}.twitter`,
  pinterest: `${Node_Type.LINK_PREVIEW}.pinterest`,
};

export const linkPreviewModals = {
  settings: `${Node_Type.LINK_PREVIEW}.settings`,
};
