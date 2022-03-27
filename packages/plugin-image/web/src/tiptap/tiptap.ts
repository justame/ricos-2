import imageDataDefaults from 'ricos-schema/dist/statics/image.defaults.json';
import type { CreateRicosExtensions } from 'ricos-tiptap-types';
import { Image as Component } from './component';
import { TIPTAP_IMAGE_TYPE } from 'ricos-content';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Toggle a paragraph
       */
      setImageUrl: (url: string) => ReturnType;
      /**
       * Update Image's loading state
       */
      setImageLoading: (isLoading: boolean) => ReturnType;
    };
  }
}

const name = TIPTAP_IMAGE_TYPE;

export const createRicosExtensions: CreateRicosExtensions = defaultOptions => [
  {
    type: 'node' as const,
    name,
    groups: ['react', 'spoilerable'],
    Component,
    createExtensionConfig() {
      return {
        name: this.name,
        atom: false,
        group: 'block',
        selectable: true,
        draggable: true,
        addAttributes: () => ({
          ...imageDataDefaults,
          loading: {
            default: false,
          },
          loadingPercentage: {
            default: null,
          },
        }),
        addOptions: () => defaultOptions,
        addCommands() {
          return {
            setImageUrl:
              url =>
              ({ commands }) => {
                return commands.updateAttributes(name, { image: { src: { custom: url } } });
              },
            setImageLoading:
              loading =>
              ({ commands }) => {
                return commands.updateAttributes(name, { loading });
              },
          };
        },
      };
    },
  },
];
