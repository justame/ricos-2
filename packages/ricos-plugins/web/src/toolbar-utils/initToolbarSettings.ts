import type { TextButtons, ToolbarSettingsFunctions, ToolbarSettings } from 'ricos-types';
import { desktopTextButtonList, mobileTextButtonList } from './defaultTextFormattingButtons';
import { getDefaultToolbarSettings } from './getDefaultToolbarSettings';
import { mergeToolbarSettings } from './mergeToolbarSettings';
import { INSERT_PLUGIN_BUTTONS } from 'wix-rich-content-editor-common';

export function initToolbarSettings(toolbarSettings: ToolbarSettings): ToolbarSettingsFunctions[] {
  const textButtons: TextButtons = {
    mobile: mobileTextButtonList,
    desktop: desktopTextButtonList,
  };
  const pluginButtonNames = Object.values(INSERT_PLUGIN_BUTTONS);
  if (toolbarSettings?.getToolbarSettings) {
    const defaultSettings = getDefaultToolbarSettings({ textButtons, pluginButtonNames });
    const customSettings = toolbarSettings.getToolbarSettings({
      textButtons,
    });

    const finalToolbarSettings = mergeToolbarSettings({ defaultSettings, customSettings });

    return finalToolbarSettings;
  } else {
    return getDefaultToolbarSettings({ textButtons });
  }
}
