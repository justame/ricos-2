import type { SuggestionOptions } from '@tiptap/suggestion';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import mentionDataDefaults from 'ricos-schema/dist/statics/mention.defaults.json';
import type { ExtensionProps, MarkConfig, RicosExtension, DOMOutputSpec } from 'ricos-types';
import { Decoration_Type } from 'ricos-schema';
import styles from '../../statics/mentions.scss';
import suggestion from './suggestion';

export type MentionOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: { options: MentionOptions; node: ProseMirrorNode }) => string;
  suggestion: Omit<SuggestionOptions, 'editor'>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mention: {
      /**
       * Add text with mention mark
       */
      insertMention: (attributes, pos?: { from: number; to: number }) => ReturnType;
    };
  }
}

const findMention = (editor, char) => {
  const mentionRegex = new RegExp(`(?:^)?${char}[^\\s${char}]*`, 'gm');
  const { nodeBefore, pos } = editor.state.selection.$from;
  const { text, nodeSize: nodeBeforeSize } = nodeBefore || {};
  const mention = text?.match(mentionRegex)?.[0];
  const mentionIndex: number = text ? text.search(mentionRegex) : -1;
  if (nodeBeforeSize && mention && mentionIndex !== -1) {
    return { from: pos - nodeBeforeSize + mentionIndex, to: pos };
  }
};

export const tiptapExtensions = [
  {
    type: 'mark' as const,
    groups: ['shortcuts-enabled'],
    name: Decoration_Type.MENTION,
    reconfigure: (
      config: MarkConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions: () => ({
        settings,
        HTMLAttributes: {},
        renderLabel({ node }) {
          return `${settings.mentionTrigger}${node.attrs.label ?? node.attrs.id}`;
        },
      }),
    }),

    createExtensionConfig({ PluginKey }) {
      return {
        name: this.name,

        group: 'inline',

        inline: true,

        selectable: false,

        atom: true,

        addAttributes() {
          return { ...mentionDataDefaults.mentionData, mentionId: { default: null } };
        },

        renderHTML() {
          return ['span', { class: styles.mention }, 0] as DOMOutputSpec;
        },

        addKeyboardShortcuts() {
          return {
            Backspace: () =>
              this.editor.commands.command(({ dispatch, tr, state }) => {
                let isMention = false;
                const { selection } = state;
                const { empty, anchor } = selection;

                if (!empty) {
                  return false;
                }

                state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                  if (node.text === this.options.settings.mentionTrigger) {
                    isMention = true;
                    dispatch(tr.replaceWith(pos, pos + 1, ''));
                  }
                });

                return isMention;
              }),
          };
        },

        addProseMirrorPlugins() {
          return [suggestion(this.editor, this.options.settings, PluginKey)];
        },

        addCommands() {
          return {
            insertMention:
              (attributes, pos) =>
              ({ view, tr, editor }) => {
                // increase range.to by one when the next node is of type "text"
                // and starts with a space character
                const nodeAfter = view.state.selection.$to.nodeAfter;
                const overrideSpace = nodeAfter?.text?.startsWith(' ');
                const { mentionTrigger } = this.options.settings;
                const range = pos ||
                  findMention(editor, mentionTrigger) || {
                    from: tr.selection.from,
                    to: tr.selection.to,
                  };

                if (overrideSpace) {
                  range.to += 1;
                }

                return editor
                  .chain()
                  .focus()
                  .insertContentAt(range, [
                    {
                      type: 'text',
                      text: `${mentionTrigger}${attributes.name}`,
                      marks: [
                        {
                          type: Decoration_Type.MENTION,
                          attrs: {
                            name: attributes.name,
                            slug: attributes.name,
                            mentionId: attributes.id,
                          },
                        },
                      ],
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ])
                  .run();
              },
          };
        },
      };
    },
  },
];
