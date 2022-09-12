import { RICOS_DEFAULTS } from './video-component';
import { VideoInsertPluginIcon, YoutubeIcon } from './icons';
import {
  INSERT_PLUGIN_BUTTONS,
  decorateComponentWithProps,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import type { AddButton } from 'ricos-types';
import { Node_Type } from 'ricos-types';
import { videoButtonsTypes } from './types';
import { videoModals } from './constants';
import { compact } from 'lodash';

export const getAddButtons = (config, services): AddButton[] => {
  const {
    enableCustomUploadOnMobile,
    getVideoUrl,
    exposeButtons = [videoButtonsTypes.video],
    handleFileSelection,
    handleFileUpload,
    disableDownload,
    onVideoSelected,
  } = config || {};

  const modalBaseProps = {
    enableCustomUploadOnMobile,
    getVideoUrl,
    handleFileSelection,
    handleFileUpload,
    onVideoSelected,
  };

  const buttonsMap: Record<string, AddButton> = {
    [videoButtonsTypes.video]: {
      id: `${Node_Type.VIDEO}.video`,
      label: INSERT_PLUGIN_BUTTONS.VIDEO,
      dataHook: INSERT_PLUGIN_BUTTONS.VIDEO,
      icon: VideoInsertPluginIcon,
      tooltip: 'VideoPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: editorCommands => true,
      modal: {
        id: videoModals.insertVideo,
        Component: decorateComponentWithProps(InsertModal, {
          componentData: { ...RICOS_DEFAULTS, disableDownload },
          modalId: videoModals.insertVideo,
          ...modalBaseProps,
        }),
      },
      menuConfig: {
        tags: 'Video_plugin_search_tags',
      },
    },
    [videoButtonsTypes.youTube]: {
      id: `${Node_Type.VIDEO}.youTube`,
      label: INSERT_PLUGIN_BUTTONS.YOUTUBE,
      dataHook: INSERT_PLUGIN_BUTTONS.YOUTUBE,
      icon: YoutubeIcon,
      tooltip: 'YouTubePlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],

      command: editorCommands => true,
      modal: {
        id: videoModals.insertYoutube,
        Component: decorateComponentWithProps(InsertModal, {
          componentData: { ...RICOS_DEFAULTS, type: videoButtonsTypes.youTube },
          modalId: videoModals.insertYoutube,
          ...modalBaseProps,
        }),
      },
      menuConfig: {
        tags: 'YouTube_plugin_search_tags',
        group: 'embed',
      },
    },
  };

  return compact(exposeButtons.map(buttonType => buttonsMap[buttonType]));
};
