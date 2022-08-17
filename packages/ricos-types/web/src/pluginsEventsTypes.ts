export interface IPluginsEvents {
  publishPluginAdd({ pluginId }: { pluginId: string }): boolean;

  publishPluginDelete({ pluginId }: { pluginId: string }): boolean;

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
