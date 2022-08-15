import { TIPTAP_TABLE_CELL_TYPE } from 'ricos-content';
import tableCellDataDefaults from 'ricos-schema/dist/statics/table_cell.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { cellStatesPlugin } from './plugins';
import styles from './plugins/table.scss';

export const tableCell = {
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
  name: TIPTAP_TABLE_CELL_TYPE,
  createExtensionConfig() {
    return {
      name: this.name,
      tableRole: 'cell',
      isolating: true,
      content: 'block+',
      addAttributes: () => ({
        ...tableCellDataDefaults,
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
        verticalAlignment: {
          default: 'top',
          parseHTML: element => element.style['vertical-align'],
          renderHTML: attributes => {
            return (
              attributes.cellStyle?.verticalAlignment && {
                style: `vertical-align: ${attributes.cellStyle.verticalAlignment.toLowerCase()}`,
              }
            );
          },
        },
        backgroundColor: {
          default: null,
          parseHTML: element => element.style['background-color'],
          renderHTML: attributes => {
            return (
              attributes.cellStyle?.backgroundColor && {
                style: `background-color: ${attributes.cellStyle.backgroundColor}`,
              }
            );
          },
        },
      }),
      parseHTML() {
        return [{ tag: 'td' }];
      },

      renderHTML({ node, HTMLAttributes }) {
        const { borderTop, borderBottom, borderRight, borderLeft } = node.attrs.borderColors || {};
        return [
          'td',
          HTMLAttributes,
          ['div', 0],
          [
            'div',
            {
              class: styles.cellBorderT,
              style: `background: ${borderTop};`,
            },
          ],
          [
            'div',
            {
              class: styles.cellBorderB,
              style: `background: ${borderBottom};`,
            },
          ],
          [
            'div',
            {
              class: styles.cellBorderL,
              style: `background: ${borderLeft};`,
            },
          ],
          [
            'div',
            {
              class: styles.cellBorderR,
              style: `background: ${borderRight};`,
            },
          ],
        ];
      },
      addProseMirrorPlugins() {
        return [cellStatesPlugin(this.editor)];
      },
    };
  },
};
