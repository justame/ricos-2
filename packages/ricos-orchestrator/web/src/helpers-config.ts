import type { RicosEditorProps } from 'ricos-common';
import { GALLERY_TYPE, IMAGE_TYPE, LINK_PREVIEW_TYPE } from 'ricos-content';

// TODO: move these configs to proper plugins
export const getHelpersConfig = (props: RicosEditorProps) => ({
  [IMAGE_TYPE]: {
    handleFileUpload: props._rcProps?.helpers?.handleFileUpload,
    handleFileSelection: props._rcProps?.helpers?.handleFileSelection,
  },
  [GALLERY_TYPE]: {
    handleFileUpload: props._rcProps?.helpers?.handleFileUpload,
    handleFileSelection: props._rcProps?.helpers?.handleFileSelection,
  },
  [LINK_PREVIEW_TYPE]: {
    linkPanelSettings: props.linkPanelSettings,
  },
});
