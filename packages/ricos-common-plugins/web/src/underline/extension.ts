import { mergeAttributes } from '@tiptap/core';
import { Decoration_Type } from 'ricos-schema';
import type { DOMOutputSpec, RicosExtension } from 'ricos-types';
import { Plugin, PluginKey } from 'prosemirror-state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    underline: {
      /**
       * Set an underline mark
       */
      setUnderline: () => ReturnType;
      /**
       * Toggle an underline mark
       */
      toggleUnderline: () => ReturnType;
      /**
       * Unset an underline mark
       */
      unsetUnderline: () => ReturnType;
    };
  }
}

export const underline: RicosExtension = {
  type: 'mark' as const,
  groups: [],
  name: Decoration_Type.UNDERLINE,
  createExtensionConfig() {
    return {
      name: this.name,
      addOptions() {
        return {
          HTMLAttributes: {},
        };
      },

      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('link-underline'),
            priority: 2,
            appendTransaction: (transactions, _oldState, newState) => {
              let from, to;
              transactions.forEach(t => {
                if (t.getMeta('autoLink')) {
                  const steps = t.steps;
                  const autoLinkStep = steps?.[steps.length - 1]?.toJSON() || {};
                  from = autoLinkStep.from;
                  to = autoLinkStep.to;
                  return;
                }
              });
              if (!!from && !!to) {
                return newState.tr
                  .addMark(from, to, this.type.create())
                  .removeStoredMark(this.type);
              }
            },
          }),
        ];
      },

      parseHTML() {
        return [
          {
            tag: 'u',
          },
          {
            style: 'text-decoration',
            consuming: false,
            getAttrs: style => ((style as string).includes('underline') ? {} : false),
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        return [
          'u',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0,
        ] as DOMOutputSpec;
      },

      addCommands() {
        return {
          setUnderline:
            () =>
            ({ commands }) => {
              return commands.setMark(this.name);
            },
          toggleUnderline:
            () =>
            ({ commands }) => {
              return commands.toggleMark(this.name);
            },
          unsetUnderline:
            () =>
            ({ commands }) => {
              return commands.unsetMark(this.name);
            },
        };
      },

      addKeyboardShortcuts() {
        return {
          'Mod-u': () => this.editor.commands.toggleUnderline(),
        };
      },
    };
  },
};
