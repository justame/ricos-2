import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';

export const tableHeaderExtension = {
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
  name: 'tableHeader',
  createExtensionConfig() {
    return {
      name: this.name,
      tableRole: 'header_cell',
      isolating: true,
      content: 'block+',
      addAttributes: () => ({
        colspan: {
          default: 1,
        },
        rowspan: {
          default: 1,
        },
        colwidth: {
          default: null,
          parseHTML: element => {
            const colwidth = element.getAttribute('colwidth');
            const value = colwidth ? [parseInt(colwidth, 10)] : null;

            return value;
          },
        },
      }),
      parseHTML() {
        return [{ tag: 'th' }];
      },

      renderHTML({ HTMLAttributes }) {
        return ['th', HTMLAttributes, 0];
      },
    };
  },
};
