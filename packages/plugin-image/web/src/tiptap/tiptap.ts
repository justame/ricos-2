import { TIPTAP_IMAGE_TYPE, generateId } from 'ricos-content';
import imageDataDefaults from 'ricos-schema/dist/statics/image.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Image as Component } from './component';
import type { RicosServices } from 'ricos-types';
import { ImagePluginService } from '../toolbar/imagePluginService';

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

export const tiptapExtensions = [
  {
    type: 'node' as const,
    name,
    groups: ['react', 'spoilerable', 'overlay'],
    reconfigure: (
      config: NodeConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>,
      services: RicosServices
    ) => ({
      ...config,
      addOptions: () => ({
        services,
        imagePluginService: new ImagePluginService(),
        ...settings,
      }),
    }),
    Component,
    createExtensionConfig({ Plugin, PluginKey }) {
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
          tempData: {
            default: null,
          },
        }),
        addProseMirrorPlugins() {
          return [
            new Plugin({
              key: new PluginKey('handlePasteImage'),
              props: {
                handlePaste: (view, event) => {
                  let hasFiles = false;
                  Array.from(event?.clipboardData?.files || [])
                    .filter((file: File) => file.type.startsWith('image'))
                    .forEach(file => {
                      const nodeId = generateId();
                      this.editor.commands.insertContent({
                        type: TIPTAP_IMAGE_TYPE,
                        attrs: { id: nodeId },
                      });
                      this.options.services?.uploadService?.uploadFile(
                        file,
                        nodeId,
                        this.options.uploader,
                        TIPTAP_IMAGE_TYPE,
                        this.options.imagePluginService
                      );
                      hasFiles = true;
                    });
                  if (hasFiles) {
                    event.preventDefault();
                    return true;
                  }
                  return false;
                },
              },
            }),
          ];
        },
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
