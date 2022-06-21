import { markInputRule, markPasteRule } from '@tiptap/core';
import { Decoration_Type } from 'ricos-schema';
import type { Styles } from 'ricos-styles';
import type { DOMOutputSpec, RicosExtension } from 'ricos-tiptap-types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    italic: {
      /**
       * Set an italic mark
       */
      setItalic: () => ReturnType;
      /**
       * Toggle an italic mark
       */
      toggleItalic: (styles: Styles) => ReturnType;
      /**
       * Unset an italic mark
       */
      unsetItalic: () => ReturnType;
    };
  }
}

export const starInputRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/;
export const starPasteRegex = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g;
export const underscoreInputRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/;
export const underscorePasteRegex = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g;

export const italic: RicosExtension = {
  type: 'mark' as const,
  groups: [],

  name: Decoration_Type.ITALIC,
  createExtensionConfig() {
    return {
      name: this.name,
      addOptions() {
        return {
          HTMLAttributes: {},
        };
      },

      addAttributes() {
        return {
          italicData: true,
        };
      },

      parseHTML() {
        return [
          {
            tag: 'em',
          },
          {
            tag: 'i',
            getAttrs: node => (node as HTMLElement).style.fontStyle !== 'normal' && null,
          },
          {
            style: 'font-style=italic',
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        const { italicData } = HTMLAttributes;
        return [
          'em',
          { style: `font-style: ${italicData ? 'italic' : 'normal'}` },
          0,
        ] as DOMOutputSpec;
      },

      addCommands() {
        return {
          setItalic:
            () =>
            ({ commands }) => {
              return commands.setMark(this.name);
            },
          toggleItalic:
            (styles: Styles) =>
            ({ commands }) => {
              const italicData = !commands.getStylesDecorationBySelectedNode(styles, this.name)
                .italicData;
              return commands.toggleMark(this.name, {
                italicData,
              });
            },
          unsetItalic:
            () =>
            ({ commands }) => {
              return commands.unsetMark(this.name);
            },
        };
      },

      addKeyboardShortcuts() {
        return {
          'Mod-i': () => this.editor.commands.toggleItalic(),
        };
      },

      addInputRules() {
        return [
          markInputRule({
            find: starInputRegex,
            type: this.type,
          }),
          markInputRule({
            find: underscoreInputRegex,
            type: this.type,
          }),
        ];
      },

      addPasteRules() {
        return [
          markPasteRule({
            find: starPasteRegex,
            type: this.type,
          }),
          markPasteRule({
            find: underscorePasteRegex,
            type: this.type,
          }),
        ];
      },
    };
  },
};
