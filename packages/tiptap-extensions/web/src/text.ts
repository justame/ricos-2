import type { RicosExtension } from 'ricos-types';

export const text: RicosExtension = {
  type: 'node' as const,
  groups: ['text'],
  name: 'text',
  createExtensionConfig() {
    return {
      name: this.name,
      group: 'inline',
    };
  },
};
