import { DEFAULTS } from '../video-component';
import {
  getModalStyles,
  TOOLBARS,
  INSERT_PLUGIN_BUTTONS,
  BUTTON_TYPES,
  decorateComponentWithProps,
  getBottomToolbarModalStyles,
} from 'wix-rich-content-editor-common';
import VideoModal from './videoModal';
import { VideoInsertPluginIcon, SoundCloudInsertPluginIcon, YoutubeIcon } from '../icons';
import {
  SelectionModalCustomStyle,
  ExtendedSelectionModalCustomStyle,
} from './selectionModalCustomStyles';
import type {
  CreateInsertButtons,
  TranslationFunction,
  AvailableExperiments,
} from 'wix-rich-content-common';
import type { VideoPluginEditorConfig } from '../types';
import { videoButtonsTypes } from '../types';
import {
  DesktopFlyOutModalStyles,
  MOBILE_FULL_SCREEN_CUSTOM_STYLE,
  DesktopOverlayModalStyles,
} from 'wix-rich-content-ui-components';
import { videoModalContentStyles, embedModalContentStyles } from '../constants';

const createInsertButtons: CreateInsertButtons = ({
  t,
  settings,
  isMobile,
  disableDownload,
  experiments = {},
}: {
  t: TranslationFunction;
  settings: VideoPluginEditorConfig;
  isMobile: boolean;
  disableDownload?: boolean;
  experiments: AvailableExperiments;
}) => {
  //apply the extended input modal styles if handleFileSelection is avilable in plugin config
  //& on mobile if enableCustomUploadOnMobile is set to true, otherwise the normal modal styles is applied
  const componentData = disableDownload !== undefined ? { ...DEFAULTS, disableDownload } : DEFAULTS;
  const { newVideoVerticalAndSocialModals } = experiments;
  const useNewModal = newVideoVerticalAndSocialModals?.enabled;

  const {
    exposeButtons = [videoButtonsTypes.video],
    toolbar,
    enableCustomUploadOnMobile,
    handleFileSelection,
    handleFileUpload,
  } = settings || {};

  const icon = toolbar?.icons?.InsertPluginButtonIcon || VideoInsertPluginIcon;

  const videoModalCustomStyles = isMobile
    ? MOBILE_FULL_SCREEN_CUSTOM_STYLE
    : { ...DesktopFlyOutModalStyles, content: videoModalContentStyles };

  const embedModalCustomStyles = isMobile
    ? MOBILE_FULL_SCREEN_CUSTOM_STYLE
    : { ...DesktopFlyOutModalStyles, content: embedModalContentStyles };

  const defaultCustomStyles =
    (!isMobile || enableCustomUploadOnMobile) && (handleFileSelection || handleFileUpload)
      ? ExtendedSelectionModalCustomStyle
      : SelectionModalCustomStyle;

  const customStyles = useNewModal ? videoModalCustomStyles : defaultCustomStyles;

  const modalsStyle = getModalStyles({
    customStyles,
    fullScreen: !!useNewModal,
    isMobile,
  });

  const newModalStyles = isMobile ? modalsStyle : undefined;
  const modalStyles = useNewModal ? newModalStyles : modalsStyle;

  const baseButtonProps = {
    type: BUTTON_TYPES.MODAL,
    modalElement: decorateComponentWithProps(VideoModal, settings),
  };

  const buttonsMap = {
    [videoButtonsTypes.video]: {
      name: INSERT_PLUGIN_BUTTONS.VIDEO,
      tooltip: t('VideoPlugin_InsertButton_Tooltip'),
      getIcon: () => icon,
      componentData,
    },
    [videoButtonsTypes.soundCloud]: {
      name: INSERT_PLUGIN_BUTTONS.SOUND_CLOUD,
      tooltip: t('SoundCloudPlugin_InsertButton_Tooltip'),
      getIcon: () => SoundCloudInsertPluginIcon,
      componentData: { ...DEFAULTS, type: videoButtonsTypes.soundCloud },
    },
    [videoButtonsTypes.youTube]: {
      name: INSERT_PLUGIN_BUTTONS.YOUTUBE,
      tooltip: t('YouTubePlugin_InsertButton_Tooltip'),
      getIcon: () => YoutubeIcon,
      componentData: { ...DEFAULTS, type: videoButtonsTypes.youTube },
      section: 'BlockToolbar_Section_Embed_Anywhere',
    },
  };

  const toolbars = useNewModal
    ? [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE]
    : [TOOLBARS.INSERT_PLUGIN, TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE];

  let videoButtons = exposeButtons.map(buttonType => ({
    ...buttonsMap[buttonType],
    toolbars,
    modalStyles,
    modalStylesFn: useNewModal
      ? ({ buttonRef, toolbarName }) => {
          const isSoundCloud = buttonType === videoButtonsTypes.soundCloud;
          return getBottomToolbarModalStyles(
            buttonRef,
            {
              customStyles: isSoundCloud ? embedModalCustomStyles : videoModalCustomStyles,
            },
            toolbarName
          );
        }
      : undefined,
    ...baseButtonProps,
  }));

  if (useNewModal) {
    //open modals with overlay when opened from external-toolbar
    const externalToolbarButtons = exposeButtons.map(buttonType => {
      const isSoundCloud = buttonType === videoButtonsTypes.soundCloud;
      const styles = isSoundCloud ? DesktopFlyOutModalStyles : videoModalCustomStyles;
      return {
        ...buttonsMap[buttonType],
        modalStyles: getModalStyles({
          customStyles: {
            ...styles,
            ...DesktopOverlayModalStyles,
          },
          fullScreen: isMobile,
          isMobile,
        }),
        toolbars: [TOOLBARS.INSERT_PLUGIN],
        ...baseButtonProps,
      };
    });

    videoButtons = [...videoButtons, ...externalToolbarButtons];
  }

  return videoButtons;
};

export default createInsertButtons;
