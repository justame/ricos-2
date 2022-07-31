import type { ExtensionProps, RicosExtension, RicosExtensionConfig } from 'ricos-types';
import Resizer from './resizer';

export const resizable: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'ricos-resizable',
  reconfigure(
    config: RicosExtensionConfig,
    extensions: RicosExtension[],
    _ricosProps: ExtensionProps
  ) {
    const types = extensions
      .filter(extension => extension.groups.includes('resizable'))
      .map(({ name }) => name);

    return {
      ...config,
      priority: 80,
      addNodeHoc: () => {
        return {
          nodeTypes: types,
          nodeHoc: Resizer,
          priority: 80,
        };
      },
    };
  },
  createExtensionConfig() {
    return {
      name: this.name,
    };
  },
};
