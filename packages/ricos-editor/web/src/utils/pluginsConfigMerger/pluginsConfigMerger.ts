import type { RicosEditorProps } from 'ricos-common';
import type { LegacyEditorPluginConfig } from 'ricos-types';

export const pluginsConfigMerger =
  (config?: LegacyEditorPluginConfig) =>
  (plugins: RicosEditorProps['plugins']): RicosEditorProps['plugins'] => {
    if (!config) {
      return plugins;
    }

    const types = Object.keys(config);
    const pluginsWithStrategy =
      plugins
        ?.filter(plugin => types.includes(plugin.type))
        ?.map(plugin => ({
          ...plugin,
          config: { ...plugin.config, ...config[plugin.type] },
        })) || [];
    const pluginsWithoutStrategy = plugins?.filter(plugin => !types.includes(plugin.type)) || [];

    return [...pluginsWithStrategy, ...pluginsWithoutStrategy];
  };
