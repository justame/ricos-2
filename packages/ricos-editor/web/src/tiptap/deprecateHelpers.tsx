import { IMAGE_TYPE, GALLERY_TYPE, VIDEO_TYPE, LINK_PREVIEW_TYPE } from 'ricos-content';

export const deprecateHelpers = (
  config,
  { linkPanelSettings, handleFileUpload, handleFileSelection }
) => {
  config[IMAGE_TYPE] = {
    ...(config[IMAGE_TYPE] || {}),
    handleFileUpload,
    handleFileSelection,
  };
  config[GALLERY_TYPE] = {
    ...(config[GALLERY_TYPE] || {}),
    handleFileUpload,
    handleFileSelection,
  };
  // TODO: Remove this after find solution - this is not related to deprecate helpers
  config[LINK_PREVIEW_TYPE] = {
    ...(config[LINK_PREVIEW_TYPE] || {}),
    linkPanelSettings,
  };
};
