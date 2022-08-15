import { TIPTAP_TABLE_ROW_TYPE, TIPTAP_TABLE_CELL_TYPE } from 'ricos-content';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';

export const tableRowExtension = {
  type: 'node' as const,
  groups: [],
  reconfigure: (
    config: NodeConfig,
    _extensions: RicosExtension[],
    _props: ExtensionProps,
    settings: Record<string, unknown>
  ) => ({
    ...config,
    addOptions: () => settings,
  }),
  name: TIPTAP_TABLE_ROW_TYPE,
  createExtensionConfig() {
    return {
      name: this.name,
      tableRole: 'row',
      content: `(${TIPTAP_TABLE_CELL_TYPE} | tableHeader)*`, //`(tableCell | tableHeader)*`,
      addAttributes: () => ({
        height: {
          default: 47,
          parseHTML: element => element.style.height && parseInt(element.style.height),
          renderHTML: attributes => {
            return {
              style: `height: ${attributes.height}px`,
            };
          },
        },
      }),
      parseHTML() {
        return [{ tag: 'tr' }];
      },

      renderHTML({ HTMLAttributes }) {
        return ['tr', HTMLAttributes, 0];
      },
    };
  },
};
