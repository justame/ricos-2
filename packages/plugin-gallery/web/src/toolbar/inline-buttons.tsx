import { BUTTONS, PluginSettingsIcon, Uploader } from 'wix-rich-content-plugin-commons';
import { getModalStyles } from 'wix-rich-content-editor-common';
import { Modals } from '../modals';
import { ManageMediaIcon, UploadIcon } from '../icons';
import { getGalleryLayoutsDropdown, switchLayout, getCurrentLayout } from '../layout-helper';
import type {
  CreateInlineButtons,
  TranslationFunction,
  AnchorTarget,
  RelValue,
  AvailableExperiments,
  UISettings,
  Helpers,
  EditorPluginConfig,
  InlineUploadButton,
} from 'wix-rich-content-common';
import type { GalleryPluginEditorConfig } from '../types';
import { GALLERY_TYPE } from '../types';
import { GalleryPluginService } from './galleryPluginService';

const createInlineButtons: CreateInlineButtons = ({
  t,
  anchorTarget,
  relValue,
  settings,
  experiments = {},
  isMobile,
  uiSettings,
}: {
  t: TranslationFunction;
  settings: GalleryPluginEditorConfig;
  anchorTarget: AnchorTarget;
  relValue: RelValue;
  experiments: AvailableExperiments;
  isMobile: boolean;
  uiSettings: UISettings;
}) => {
  const modalStyles = getModalStyles({ isMobile });
  const icons = settings?.toolbar?.icons || {};
  const { spoilerInInlineToolbar } = experiments;
  const spoilerButton =
    settings.spoiler && spoilerInInlineToolbar?.enabled
      ? [
          {
            keyName: 'spoiler',
            type: BUTTONS.SPOILER,
            mobile: true,
          },
        ]
      : [];

  const addFilesButton: InlineUploadButton = {
    keyName: 'add',
    type: BUTTONS.FILES,
    icon: icons.add || UploadIcon,
    onFilesSelected: (pubsub, files) => {
      if (files.length > 0) {
        pubsub.getBlockHandler('handleFilesSelected')(files);
      }
    },
    mobile: false,
    multiple: true,
    tooltipTextKey: 'UploadMediaButton_Tooltip',
    settings,
  };

  if (experiments?.useUploadContext?.enabled) {
    addFilesButton.mediaPluginService = new GalleryPluginService();
    addFilesButton.getUploader = (
      helpers: Helpers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _: Record<string, any> & EditorPluginConfig
    ) => new Uploader(helpers?.handleFileUpload);
  }

  return [
    addFilesButton,
    { type: BUTTONS.SEPARATOR, mobile: false, keyName: 'separator0' },
    {
      keyName: 'layout',
      type: BUTTONS.DROPDOWN,
      options: getGalleryLayoutsDropdown(t),
      onChange: switchLayout,
      getValue: getCurrentLayout,
      mobile: true,
      tooltipTextKey: 'GalleryPlugin_Layout_Select_Tooltip',
      t,
    },
    { keyName: 'separator1', type: BUTTONS.SEPARATOR, mobile: false },
    { keyName: 'sizeSmallCenter', type: BUTTONS.SIZE_SMALL_CENTER, mobile: false },
    { keyName: 'sizeContent', type: BUTTONS.SIZE_CONTENT, mobile: false },
    { keyName: 'sizeFullWidth', type: BUTTONS.SIZE_FULL_WIDTH, mobile: false },
    { keyName: 'separator2', type: BUTTONS.SEPARATOR, mobile: false },
    { keyName: 'sizeSmallLeft', type: BUTTONS.SIZE_SMALL_LEFT, mobile: false },
    { keyName: 'sizeSmallRight', type: BUTTONS.SIZE_SMALL_RIGHT, mobile: false },
    { keyName: 'separator3', type: BUTTONS.SEPARATOR, mobile: true },
    ...spoilerButton,
    {
      keyName: 'manage_media',
      type: BUTTONS.EXTERNAL_MODAL,
      fullHeight: true,
      icon: icons.manage_media || ManageMediaIcon,
      modalName: Modals.GALLERY_SETTINGS,
      activeTab: 'manage_media',
      modalStyles,
      t,
      mobile: true,
      tooltipTextKey: 'ManageMediaButton_Tooltip',
      anchorTarget,
      relValue,
      accept: settings.accept,
      uiSettings,
    },
    {
      keyName: 'settings',
      type: BUTTONS.EXTERNAL_MODAL,
      fullHeight: true,
      icon: icons.advanced_settings || PluginSettingsIcon,
      modalName: Modals.GALLERY_SETTINGS,
      activeTab: 'settings',
      modalStyles,
      switchLayout,
      t,
      mobile: true,
      tooltipTextKey: 'SettingsButton_Tooltip',
      anchorTarget,
      relValue,
      accept: settings.accept,
      uiSettings,
      triggerSettingsBi: true,
      pluginId: GALLERY_TYPE,
      shouldShowSpoiler: settings.spoiler,
    },
    { keyName: 'delete', type: BUTTONS.DELETE, mobile: true },
  ];
};
export default createInlineButtons;
