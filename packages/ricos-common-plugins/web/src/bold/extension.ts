import { isMarkActive, markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core';
import type { Decoration } from 'ricos-schema';
import { Decoration_Type } from 'ricos-schema';
import type { DOMOutputSpec, RicosExtension } from 'ricos-types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bold: {
      /**
       * Set a bold mark
       */
      setBold: () => ReturnType;
      /**
       * Toggle a bold mark
       */
      toggleBold: () => ReturnType;
      /**
       * Unset a bold mark
       */
      unsetBold: () => ReturnType;
    };
  }
}

const FONT_WEIGHT_BOLD = 700;
const FONT_WEIGHT_NORMAL = 400;

export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/;
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/;
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;

export const bold: RicosExtension = {
  type: 'mark' as const,
  groups: [],
  name: Decoration_Type.BOLD,
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
          fontWeightValue: { default: FONT_WEIGHT_BOLD },
        };
      },

      parseHTML() {
        return [
          {
            tag: 'strong',
          },
          {
            tag: 'b',
            getAttrs: node => (node as HTMLElement).style.fontWeight !== 'normal' && null,
          },
          {
            style: 'font-weight',
            getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        const { fontWeightValue, ..._ } = mergeAttributes(
          this.options.HTMLAttributes,
          HTMLAttributes
        );

        return ['strong', { style: `font-weight: ${fontWeightValue}` }, 0] as DOMOutputSpec;
      },

      addCommands() {
        return {
          setBold:
            () =>
            ({ commands }) => {
              return commands.setMark(this.name);
            },
          toggleBold:
            () =>
            ({ commands, state }) => {
              const decoration: Decoration | undefined = commands.getStylesDecorationBySelectedNode(
                this.name
              );
              const hasBoldWeightInStyle =
                decoration && decoration.fontWeightValue === FONT_WEIGHT_BOLD;
              const hasBoldWeightInMark = isMarkActive(state, this.name, {
                fontWeightValue: FONT_WEIGHT_BOLD,
              });

              return commands.toggleMark(this.name, {
                fontWeightValue:
                  hasBoldWeightInMark || !hasBoldWeightInStyle
                    ? FONT_WEIGHT_BOLD
                    : FONT_WEIGHT_NORMAL,
              });
            },
          unsetBold:
            () =>
            ({ commands }) => {
              return commands.unsetMark(this.name);
            },
        };
      },

      addKeyboardShortcuts() {
        return {
          'Mod-b': () => this.editor.commands.toggleBold(),
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
