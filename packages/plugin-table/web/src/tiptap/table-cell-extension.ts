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
  createExtensionConfig({ Plugin, PluginKey }) {
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
        const { top, bottom, right, left } = node.attrs.borderColors || {};
        return [
          'td',
          HTMLAttributes,
          ['div', 0],
          [
            'div',
            {
              class: styles.cellBorderT,
              style: `background: ${top};`,
            },
          ],
          [
            'div',
            {
              class: styles.cellBorderB,
              style: `background: ${bottom};`,
            },
          ],
          [
            'div',
            {
              class: styles.cellBorderL,
              style: `background: ${left};`,
            },
          ],
          [
            'div',
            {
              class: styles.cellBorderR,
              style: `background: ${right};`,
            },
          ],
        ];
      },
      addProseMirrorPlugins() {
        return [cellStatesPlugin(Plugin, PluginKey, this.editor)];
      },
    };
  },
};
