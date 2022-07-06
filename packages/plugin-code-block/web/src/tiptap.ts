import { TextSelection } from 'prosemirror-state';
import codeBlockDataDefaults from 'ricos-schema/dist/statics/code_block.defaults.json';
import type { DOMOutputSpec, NodeConfig, ExtensionProps, RicosExtension } from 'ricos-tiptap-types';
import { Node_Type } from 'ricos-schema';
import styles from '../statics/styles/code-block.scss';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeBlock: {
      /**
       * Set a code block
       */
      setCodeBlock: (attributes?: { language: string }) => ReturnType;
      /**
       * Toggle a code block
       */
      toggleCodeBlock: (attributes?: { language: string }) => ReturnType;
    };
  }
}

const backtickInputRegex = /^```(?<language>[a-z]*)?[\s\n]$/;
const tildeInputRegex = /^~~~(?<language>[a-z]*)?[\s\n]$/;

export const tiptapExtensions: RicosExtension[] = [
  {
    type: 'node' as const,
    groups: ['text-container', 'shortcuts-enabled'],
    name: Node_Type.CODE_BLOCK,
    reconfigure: (
      config: NodeConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions() {
        return {
          languageClassPrefix: 'language-',
          HTMLAttributes: {
            class: styles.code,
          },
          ...settings,
        };
      },
    }),

    createExtensionConfig({ Plugin, PluginKey, textblockTypeInputRule, mergeAttributes }) {
      return {
        name: this.name,

        content: 'text*',

        group: 'block',

        code: true,

        defining: true,

        addAttributes() {
          return {
            ...codeBlockDataDefaults,
            language: {
              default: null,
              renderHTML: attributes => {
                if (!attributes.language) {
                  return null;
                }

                return {
                  class: this.options.languageClassPrefix + attributes.language,
                };
              },
            },
          };
        },

        parseHTML() {
          return [
            {
              tag: 'pre',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              preserveWhitespace: 'full' as any,
            },
          ];
        },

        renderHTML({ HTMLAttributes }) {
          return [
            'pre',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
          ] as DOMOutputSpec;
        },

        addCommands() {
          return {
            setCodeBlock:
              attributes =>
              ({ commands }) => {
                return commands.setNode(this.name, attributes);
              },
            toggleCodeBlock:
              attributes =>
              ({ commands }) => {
                return commands.toggleNode(this.name, Node_Type.PARAGRAPH, attributes);
              },
          };
        },

        addKeyboardShortcuts() {
          return {
            // 'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),

            // remove code block when at start of document or code block is empty
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
            Enter: ({ editor }) => {
              const { state } = editor;
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

              return editor
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
              find: backtickInputRegex,
              type: this.type,
              getAttributes: ({ groups }) => groups,
            }),
            textblockTypeInputRule({
              find: tildeInputRegex,
              type: this.type,
              getAttributes: ({ groups }) => groups,
            }),
          ];
        },

        addProseMirrorPlugins() {
          return [
            // this plugin creates a code block for pasted content from VS Code
            // we can also detect the copied code language
            new Plugin({
              key: new PluginKey('codeBlockVSCodeHandler'),
              props: {
                handlePaste: (view, event) => {
                  if (!event.clipboardData) {
                    return false;
                  }

                  // don’t create a new code block within code blocks
                  if (this.editor.isActive(this.type.name)) {
                    return false;
                  }

                  const text = event.clipboardData.getData('text/plain');
                  const vscode = event.clipboardData.getData('vscode-editor-data');
                  const vscodeData = vscode ? JSON.parse(vscode) : undefined;
                  const language = vscodeData?.mode;

                  if (!text || !language) {
                    return false;
                  }

                  const { tr } = view.state;

                  // create an empty code block
                  tr.replaceSelectionWith(this.type.create({ language }));

                  // put cursor inside the newly created code block
                  tr.setSelection(
                    TextSelection.near(tr.doc.resolve(Math.max(0, tr.selection.from - 2)))
                  );

                  // add text to code block
                  // strip carriage return chars from text pasted as code
                  // see: https://github.com/ProseMirror/prosemirror-view/commit/a50a6bcceb4ce52ac8fcc6162488d8875613aacd
                  tr.insertText(text.replace(/\r\n?/g, '\n'));

                  // store meta information
                  // this is useful for other plugins that depends on the paste event
                  // like the paste rule plugin
                  tr.setMeta('paste', true);

                  view.dispatch(tr);

                  return true;
                },
              },
            }),
          ];
        },
      };
    },
  },
];
