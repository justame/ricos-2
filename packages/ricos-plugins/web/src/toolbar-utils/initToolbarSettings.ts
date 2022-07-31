import type { TextButtons, ToolbarSettingsFunctions, ToolbarSettings } from 'ricos-types';
import { desktopTextButtonList, mobileTextButtonList } from './defaultTextFormattingButtons';
import { getDefaultFormattingToolbarSettings } from './getDefaultFormattingToolbarSettings';
import { mergeToolbarSettings } from './mergeToolbarSettings';

export function initToolbarSettings(toolbarSettings: ToolbarSettings): ToolbarSettingsFunctions[] {
  const textButtons: TextButtons = {
    mobile: mobileTextButtonList,
    desktop: desktopTextButtonList,
  };
  if (toolbarSettings?.getToolbarSettings) {
    const defaultSettings = getDefaultFormattingToolbarSettings({ textButtons });
    const customSettings = toolbarSettings.getToolbarSettings({
      textButtons,
    });

    const finalToolbarSettings = mergeToolbarSettings({ defaultSettings, customSettings });

    return finalToolbarSettings;
  } else {
    return getDefaultFormattingToolbarSettings({ textButtons });
  }
}
