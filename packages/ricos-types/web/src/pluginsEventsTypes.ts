import type { PluginType } from './pluginTypes';

export interface IPluginsEvents {
  publishPluginAdd({ pluginId }: { pluginId: PluginType }): boolean;

  publishPluginDelete({ pluginId }: { pluginId: PluginType }): boolean;

  publishPluginToolbarClick({
    pluginId,
    buttonName,
    value,
    nodeId,
  }: {
    pluginId: string;
    buttonName: string;
    nodeId: string;
    value?: string;
  }): boolean;

  publishPluginPopoverClick({
    pluginId,
    buttonName,
  }: {
    pluginId: string;
    buttonName: string;
  }): boolean;

  publishPluginPopoverTabSwitch({
    pluginId,
    buttonName,
  }: {
    pluginId: string;
    buttonName: string;
  }): boolean;

  publishPluginChangeSettings({
    pluginId,
    actionName,
    value,
  }: {
    pluginId: string;
    actionName: string;
    value: string;
  }): boolean;
}
