import { TIPTAP_POLL_TYPE } from 'ricos-content';
import pollDataDefaults from 'ricos-schema/dist/statics/poll.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Poll as Component } from './component';

const name = TIPTAP_POLL_TYPE;

export const tiptapExtensions = [
  {
    type: 'node' as const,
    name,
    groups: ['react'],
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
        addAttributes: () => ({
          ...pollDataDefaults,
          loading: {
            default: false,
          },
        }),
        addCommands() {
          return {};
        },
      };
    },
  },
];
