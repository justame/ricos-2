import type { ExtensionProps, RicosExtension, RicosExtensionConfig } from 'ricos-types';
import DraggableHOC from './draggable-HOC';

export const draggable: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'ricos-draggable',
  reconfigure(
    config: RicosExtensionConfig,
    extensions: RicosExtension[],
    _ricosProps: ExtensionProps
  ) {
    const types = extensions
      .filter(extension => extension.groups.includes('draggable'))
      .map(({ name }) => name);

    return {
      ...config,
      priority: 70,
      addNodeHoc: () => {
        return {
          nodeTypes: types,
          nodeHoc: DraggableHOC,
          priority: 70,
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
