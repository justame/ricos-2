import { TIPTAP_VIDEO_TYPE } from 'ricos-content';
import videoDataDefaults from 'ricos-schema/dist/statics/video.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Video as Component } from './component';

const name = TIPTAP_VIDEO_TYPE;

export const tiptapExtensions = [
  {
    type: 'node' as const,
    groups: ['react', 'spoilerable', 'overlay'],
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
          ...videoDataDefaults,
          loading: {
            default: false,
          },
          loadingPercentage: {
            default: null,
          },
        }),
        addCommands() {
          return {};
        },
      };
    },
  },
];
