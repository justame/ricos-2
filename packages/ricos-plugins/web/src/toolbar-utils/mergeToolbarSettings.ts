import { merge } from 'lodash';
import type { ToolbarSettingsFunctions } from 'ricos-types';

export function mergeToolbarSettings({
  defaultSettings,
  customSettings,
}: {
  defaultSettings: ToolbarSettingsFunctions[];
  customSettings: ToolbarSettingsFunctions[];
}) {
  return defaultSettings.reduce<ToolbarSettingsFunctions[]>((mergedSettings, defaultSetting) => {
    const customSettingsByName = customSettings.filter(s => s.name === defaultSetting.name);
    if (customSettingsByName.length > 0) {
      mergedSettings.push(merge(defaultSetting, customSettingsByName[0]));
    } else {
      mergedSettings.push(defaultSetting);
    }
    return mergedSettings;
  }, []);
}
