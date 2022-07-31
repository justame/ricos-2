import type { ToolbarSettingsFunctions, ToolbarType } from 'ricos-types';

export function getToolbarConfig(
  finaltoolbarSettings: ToolbarSettingsFunctions[],
  toolbarType: ToolbarType
): ToolbarSettingsFunctions | undefined {
  const toolbarConfig = finaltoolbarSettings.find(setting => setting.name === toolbarType);
  return toolbarConfig;
}
