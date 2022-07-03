import { TIPTAP_APP_EMBED_TYPE } from 'ricos-content';
import appEmbedDataDefaults from 'ricos-schema/dist/statics/app_embed.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-tiptap-types';
import { AppEmbed as Component } from './component';

export const tiptapExtensions = [
  {
    type: 'node' as const,
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
    name: TIPTAP_APP_EMBED_TYPE,
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        selectable: false,
        draggable: true,
        addAttributes: () => appEmbedDataDefaults,
      };
    },
  },
];
