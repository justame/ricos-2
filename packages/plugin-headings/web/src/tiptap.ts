import { Node_Type } from 'ricos-schema';
import headingDataDefaults from 'ricos-schema/dist/statics/heading.defaults.json';
import type { DOMOutputSpec, ExtensionProps, NodeConfig, RicosExtension } from 'ricos-tiptap-types';
import styles from '../statics/styles/headings.scss';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
const HEADER_NAMES = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    heading: {
      /**
       * Set a heading node
       */
      setHeading: (attributes: { level: Level }) => ReturnType;
      /**
       * Toggle a heading node
       */
      toggleHeading: (attributes: { level: Level }) => ReturnType;
    };
  }
}

export const tiptapExtensions = [
  {
    type: 'node' as const,
    groups: ['text-container'],
    name: Node_Type.HEADING,
    reconfigure: (
      config: NodeConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions() {
        return {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {},
          ...settings,
        };
      },
    }),
    createExtensionConfig({ mergeAttributes, textblockTypeInputRule }) {
      return {
        name: this.name,

        content: 'inline*',

        group: 'block',

        defining: true,

        addAttributes() {
          return headingDataDefaults;
        },

        parseHTML() {
          return this.options.levels.map((level: Level) => ({
            tag: `h${level}`,
            attrs: { level },
          }));
        },

        renderHTML({ node, HTMLAttributes }) {
          const hasLevel = this.options.levels.includes(node.attrs.level);
          const level = hasLevel ? node.attrs.level : this.options.levels[0];

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: styles[`header${HEADER_NAMES[level - 1]}`],
            }),
            ['span', { style: 'display: inline-block;' }, 0],
          ] as DOMOutputSpec;
        },

        addCommands() {
          return {
            setHeading:
              attributes =>
              ({ commands }) => {
                if (!this.options.levels.includes(attributes.level)) {
                  return false;
                }

                return commands.setNode(this.name, attributes);
              },
            toggleHeading:
              attributes =>
              ({ commands }) => {
                if (!this.options.levels.includes(attributes.level)) {
                  return false;
                }

                return commands.toggleNode(this.name, Node_Type.PARAGRAPH, attributes);
              },
          };
        },

        addKeyboardShortcuts() {
          return this.options.levels.reduce(
            (items, level) => ({
              ...items,
              ...{
                [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level }),
              },
            }),
            {}
          );
        },

        addInputRules() {
          return this.options.levels.map(level => {
            return textblockTypeInputRule({
              find: new RegExp(`^(#{1,${level}})\\s$`),
              type: this.type,
              getAttributes: {
                level,
              },
            });
          });
        },
      };
    },
  },
];
