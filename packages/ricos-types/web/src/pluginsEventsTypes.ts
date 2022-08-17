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
}
