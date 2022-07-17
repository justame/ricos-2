import { TOOLBARS, BUTTON_TYPES, INSERT_PLUGIN_BUTTONS } from 'wix-rich-content-editor-common';
import { DEFAULTS } from '../consts';
import { InsertPluginIcon } from '../icons';
import type {
  CreateInsertButtons,
  TranslationFunction,
  AvailableExperiments,
  InsertButton,
} from 'wix-rich-content-common';
import type { ImagePluginEditorConfig } from '../types';

const createInsertButtons: CreateInsertButtons = ({
  t,
  settings,
  disableDownload,
  disableExpand,
}: {
  t: TranslationFunction;
  settings: ImagePluginEditorConfig;
  disableDownload: boolean | undefined;
  disableExpand: boolean | undefined;
  experiments?: AvailableExperiments;
}) => {
  const icon = settings?.toolbar?.icons?.InsertPluginButtonIcon || InsertPluginIcon;
  const PluginData = disableDownload !== undefined ? { ...DEFAULTS, disableDownload } : DEFAULTS;
  const componentData = disableExpand !== undefined ? { ...DEFAULTS, disableExpand } : PluginData;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageInsertButton: InsertButton = {
    type: BUTTON_TYPES.FILE,
    multi: true,
    name: INSERT_PLUGIN_BUTTONS.IMAGE,
    tooltip: t('ImagePlugin_InsertButton_Tooltip'),
    toolbars: [TOOLBARS.INSERT_PLUGIN, TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
    getIcon: () => icon,
    componentData,
  };

  return [imageInsertButton];
};

export default createInsertButtons;
