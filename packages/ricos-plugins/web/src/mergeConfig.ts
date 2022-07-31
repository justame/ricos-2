import type { EditorPlugin, LegacyEditorPluginConfig } from 'ricos-types';

export const mergeConfig = (config?: LegacyEditorPluginConfig) => (plugins: EditorPlugin[]) => {
  if (!config) {
    return plugins;
  }

  const types = Object.keys(config);
  const pluginsWithStrategy =
    plugins
      .filter(plugin => types.includes(plugin.type))
      .map(plugin => ({
        ...plugin,
        config: { ...plugin.config, ...config[plugin.type] },
      })) || [];
  const pluginsWithoutStrategy = plugins.filter(plugin => !types.includes(plugin.type)) || [];

  return [...pluginsWithStrategy, ...pluginsWithoutStrategy];
};
