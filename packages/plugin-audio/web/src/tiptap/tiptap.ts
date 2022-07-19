import { TIPTAP_AUDIO_TYPE } from 'ricos-content';
import audioDataDefaults from 'ricos-schema/dist/statics/audio.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Audio as Component } from './component';

const name = TIPTAP_AUDIO_TYPE;

export const tiptapExtensions = [
  {
    type: 'node' as const,
    groups: ['react', 'overlay'],
    name,
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
        addAttributes: () => ({
          ...audioDataDefaults,
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
