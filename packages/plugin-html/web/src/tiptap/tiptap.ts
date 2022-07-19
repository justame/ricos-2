import { TIPTAP_HTML_TYPE } from 'ricos-content';
import htmlDataDefaults from 'ricos-schema/dist/statics/html.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Html as Component } from './component';

export const tiptapExtensions = [
  {
    type: 'node' as const,
    name: TIPTAP_HTML_TYPE,
    groups: ['react', 'overlay'],
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
    createExtensionConfig() {
      return {
        name: this.name,
        atom: false,
        group: 'block',
        selectable: true,
        draggable: true,
        addAttributes: () => htmlDataDefaults,
      };
    },
  },
];
