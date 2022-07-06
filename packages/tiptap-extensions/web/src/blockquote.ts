import { generateId } from 'ricos-content';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import blockquoteDataDefaults from 'ricos-schema/dist/statics/blockquote.defaults.json';
import type { DOMOutputSpec, ExtensionProps, NodeConfig, RicosExtension } from 'ricos-tiptap-types';
import styles from './statics/styles.scss';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockQuote: {
      /**
       * Set a blockquote node
       */
      setBlockquote: () => ReturnType;
      /**
       * Toggle a blockquote node
       */
      toggleBlockquote: () => ReturnType;
      /**
       * Unset a blockquote node
       */
      unsetBlockquote: () => ReturnType;
    };
  }
}

export const inputRegex = /^\s*>\s$/;

export const blockquote: RicosExtension = {
  type: 'node' as const,
  groups: ['text-container' as const, 'shortcuts-enabled' as const],
  name: Node_Type.BLOCKQUOTE,
  reconfigure: (
    config: NodeConfig,
    _extensions: RicosExtension[],
    _props: ExtensionProps,
    settings: Record<string, unknown>
  ) => ({
    ...config,
    addOptions() {
      return {
        HTMLAttributes: {
          class: styles.quote,
        },
        ...settings,
      };
    },
  }),

  createExtensionConfig({ mergeAttributes, textblockTypeInputRule }) {
    return {
      name: this.name,

      content: 'text*',

      group: 'block',

      defining: true,

      addAttributes() {
        return {
          ...blockquoteDataDefaults,
          textStyle: {
            textAlignment: TextStyle_TextAlignment.AUTO,
          },
          paragraphId: '',
        };
      },

      parseHTML() {
        return [{ tag: 'blockquote' }];
      },

      renderHTML({ HTMLAttributes }) {
        const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
        const textAlignment = attrs?.textStyle?.textAlignment;
        const shouldAddDir =
          textAlignment === TextStyle_TextAlignment.LEFT ||
          textAlignment === TextStyle_TextAlignment.RIGHT;
        return [
          'blockquote',
          attrs,
          ['span', { ...(shouldAddDir ? { dir: 'auto' } : {}) }, 0],
        ] as DOMOutputSpec;
      },

      addCommands() {
        return {
          setBlockquote:
            () =>
            ({ commands }) => {
              return commands.setNode(this.name, { paragraphId: generateId() });
            },
          toggleBlockquote:
            () =>
            ({ commands }) => {
              return commands.toggleNode(this.name, Node_Type.PARAGRAPH, {
                paragraphId: generateId(),
              });
            },
          unsetBlockquote:
            () =>
            ({ commands }) => {
              return commands.setNode(Node_Type.PARAGRAPH, {});
            },
        };
      },
      addKeyboardShortcuts() {
        return {
          Backspace: () => {
            const { empty, $anchor } = this.editor.state.selection;
            const isAtStart = $anchor.pos === 1;

            if (!empty || $anchor.parent.type.name !== this.name) {
              return false;
            }

            if (isAtStart || !$anchor.parent.textContent.length) {
              return this.editor.commands.clearNodes();
            }

            return false;
          },

          // escape node on triple enter
          Enter: () => {
            const { state } = this.editor;
            const { selection } = state;
            const { $from, empty } = selection;

            if (!empty || $from.parent.type !== this.type) {
              return false;
            }

            const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
            const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n');

            if (!isAtEnd || !endsWithDoubleNewline) {
              return false;
            }

            return this.editor
              .chain()
              .command(({ tr }) => {
                tr.delete($from.pos - 2, $from.pos);

                return true;
              })
              .exitCode()
              .run();
          },
        };
      },

      addInputRules() {
        return [
          textblockTypeInputRule({
            find: inputRegex,
            type: this.type,
            getAttributes: ({ groups }) => groups,
          }),
        ];
      },
    };
  },
};
