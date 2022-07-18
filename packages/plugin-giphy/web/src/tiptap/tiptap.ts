import { TIPTAP_GIF_TYPE } from 'ricos-content';
import gifDataDefaults from 'ricos-schema/dist/statics/gif.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Gif as Component } from './component';

const name = TIPTAP_GIF_TYPE;

export const tiptapExtensions = [
  {
    type: 'node' as const,
    name,
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
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        selectable: true,
        draggable: true,
        addAttributes: () => gifDataDefaults,
        addCommands() {
          return {};
        },
      };
    },
  },
];
