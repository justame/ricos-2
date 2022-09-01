import type {
  RicosServices,
  ExtensionProps,
  RicosExtension,
  RicosExtensionConfig,
} from 'ricos-types';
import { Node_Type } from 'ricos-schema';
import Resizer from './resizer';

export const resizable: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'ricos-resizable',
  reconfigure(
    config: RicosExtensionConfig,
    extensions: RicosExtension[],
    _ricosProps: ExtensionProps,
    _settings: Record<string, unknown>,
    services: RicosServices
  ) {
    const types = extensions
      .filter(extension => !(services.context.isMobile && extension.name === Node_Type.IMAGE))
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
