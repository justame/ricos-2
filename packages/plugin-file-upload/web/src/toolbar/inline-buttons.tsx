import { BUTTONS, PluginSettingsIcon } from 'wix-rich-content-plugin-commons';
import { MediaReplaceIcon } from '../icons';
import type {
  CreateInlineButtons,
  TranslationFunction,
  AvailableExperiments,
} from 'wix-rich-content-common';
import type { FilePluginEditorConfig } from '../types';
import { get } from 'lodash';
import { getModalStyles } from 'wix-rich-content-editor-common';
import { FILE_UPLOAD_TYPE } from '../types';
import { Modals } from '../modals';

const createInlineButtons: CreateInlineButtons = ({
  t,
  isMobile,
  settings = {},
  experiments,
}: {
  t: TranslationFunction;
  settings: FilePluginEditorConfig;
  isMobile: boolean;
  experiments?: AvailableExperiments;
}) => {
  const icons = get(settings, 'toolbar.icons', {});
  const modalStyles = getModalStyles({ isMobile });

  const settingsButton = experiments?.enableFilePluginPDFViewer?.enabled
    ? [
        {
          keyName: 'settings',
          type: BUTTONS.FILE_UPLOAD_SETTINGS,
          fullHeight: true,
          icon: icons.settings || PluginSettingsIcon,
          modalName: Modals.FILE_UPLOAD_SETTINGS,
          modalStyles,
          t,
          mobile: true,
          tooltipTextKey: 'SettingsButton_Tooltip',
          triggerSettingsBi: true,
          pluginId: FILE_UPLOAD_TYPE,
        },
      ]
    : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const replaceButton: any = {
    keyName: 'replace',
    type: BUTTONS.FILES,
    icon: icons?.replace || MediaReplaceIcon,
    settings,
    tooltipTextKey: t('FileUploadReplaceButton_tooltip'),
  };

  return [
    { keyName: 'sizeSmall', type: BUTTONS.SIZE_SMALL_CENTER, mobile: false },
    { keyName: 'sizeContent', type: BUTTONS.SIZE_CONTENT, mobile: false },
    { keyName: 'separator2', type: BUTTONS.SEPARATOR, mobile: false },
    { keyName: 'sizeSmallLeft', type: BUTTONS.SIZE_SMALL_LEFT, mobile: false },
    { keyName: 'alignCenter', type: BUTTONS.ALIGN_CENTER, mobile: false },
    { keyName: 'sizeSmallRight', type: BUTTONS.SIZE_SMALL_RIGHT, mobile: false },
    { keyName: 'separator3', type: BUTTONS.SEPARATOR, mobile: false },
    replaceButton,
    ...settingsButton,
    { keyName: 'delete', type: BUTTONS.DELETE, mobile: true },
  ];
};

export default createInlineButtons;
