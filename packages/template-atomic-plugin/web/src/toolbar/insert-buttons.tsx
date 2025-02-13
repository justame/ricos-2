import { DEFAULTS } from '../yourDpluginDname-component';
import { TOOLBARS, BUTTON_TYPES } from 'wix-rich-content-editor-common';
import InsertPluginIcon from '../icons/InsertPluginIcon';
import type { CreateInsertButtons, TranslationFunction } from 'wix-rich-content-common';
import type { YourPluginNamePluginEditorConfig } from '../types';

const createInsertButtons: CreateInsertButtons = ({
  t,
  settings,
}: {
  t: TranslationFunction;
  settings: YourPluginNamePluginEditorConfig;
}) => {
  const icon = settings?.toolbar?.icons?.InsertPluginButtonIcon || InsertPluginIcon;
  return [
    {
      type: BUTTON_TYPES.BUTTON,
      name: 'yourPluginName_InsertButton',
      getLabel: () => t('yourPluginName_InsertButton'),
      tooltip: t('yourPluginName_Tooltip'),
      getIcon: () => icon,
      isActive: () => false,
      isDisabled: () => false,
      componentData: DEFAULTS,
      toolbars: [TOOLBARS.INSERT_PLUGIN, TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
    },
  ];
};
export default createInsertButtons;
