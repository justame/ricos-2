import { TOOLBARS, INSERT_PLUGIN_BUTTONS, BUTTON_TYPES } from 'wix-rich-content-editor-common';
import { DEFAULTS } from '../gallery-component';
import { InsertPluginIcon } from '../icons';
import type {
  CreateInsertButtons,
  TranslationFunction,
  AvailableExperiments,
  InsertButton,
} from 'wix-rich-content-common';
import type { GalleryPluginEditorConfig } from '../types';

const createInsertButtons: CreateInsertButtons = ({
  t,
  settings,
  disableDownload,
  disableExpand,
}: {
  t: TranslationFunction;
  settings: GalleryPluginEditorConfig;
  disableDownload?: boolean;
  disableExpand?: boolean;
  experiments?: AvailableExperiments;
}) => {
  const icon = settings?.toolbar?.icons?.InsertPluginButtonIcon || InsertPluginIcon;
  const pluginData = disableDownload !== undefined ? { ...DEFAULTS, disableDownload } : DEFAULTS;
  const componentData = disableExpand !== undefined ? { ...pluginData, disableExpand } : pluginData;

  const galleryInsertButton: InsertButton = {
    type: BUTTON_TYPES.FILE,
    multi: true,
    name: INSERT_PLUGIN_BUTTONS.GALLERY,
    tooltip: t('GalleryPlugin_InsertButton_Tooltip'),
    getIcon: () => icon,
    componentData,
    toolbars: [TOOLBARS.INSERT_PLUGIN, TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
  };

  return [galleryInsertButton];
};

export default createInsertButtons;
