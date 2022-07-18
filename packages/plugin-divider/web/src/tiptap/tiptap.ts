import { TIPTAP_DIVIDER_TYPE } from 'ricos-content';
import dividerDataDefaults from 'ricos-schema/dist/statics/divider.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Divider as Component } from './component';

export const tiptapExtensions = [
  {
    type: 'node' as const,
    groups: ['overlay', 'react'],
    reconfigure: (
      config: NodeConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions: () => settings,
    }),
    Component,
    name: TIPTAP_DIVIDER_TYPE,
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        selectable: true,
        draggable: true,
        addAttributes: () => dividerDataDefaults,
      };
    },
  },
];
