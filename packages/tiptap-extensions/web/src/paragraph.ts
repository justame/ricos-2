import styles from './statics/styles.scss';
import { mergeAttributes } from '@tiptap/core';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import paragraphDataDefaults from 'ricos-schema/dist/statics/paragraph.defaults.json';
import type { RicosExtension, DOMOutputSpec } from 'ricos-tiptap-types';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';

export interface ParagraphOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraph: {
      /**
       * Toggle a paragraph
       */
      setParagraph: () => ReturnType;
    };
  }
}

const createStyleAttribute = (node: ProsemirrorNode) => {
  const attrLineHeight = node.attrs.textStyle?.lineHeight;

  const lineHeight = attrLineHeight ? `line-height: ${attrLineHeight};` : '';
  const style = lineHeight;
  return { style };
};

export const paragraph: RicosExtension = {
  type: 'node' as const,
  groups: ['text-container'],
  name: Node_Type.PARAGRAPH,
  createExtensionConfig() {
    return {
      name: this.name,
      priority: 1000,

      addOptions() {
        return {
          HTMLAttributes: { class: styles.text },
        };
      },

      group: 'block',

      content: 'inline*',

      addAttributes() {
        return paragraphDataDefaults;
      },

      parseHTML() {
        return [{ tag: 'div' }];
      },

      renderHTML({ HTMLAttributes, node }) {
        const styles = createStyleAttribute(node);
        const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, styles);
        const textAlignment = attrs?.textStyle?.textAlignment;
        const shouldAddDir =
          textAlignment === TextStyle_TextAlignment.LEFT ||
          textAlignment === TextStyle_TextAlignment.RIGHT;
        return [
          'div',
          attrs,
          [
            'span',
            { style: 'display: inline-block;', ...(shouldAddDir ? { dir: 'auto' } : {}) },
            0,
          ],
        ] as DOMOutputSpec;
      },

      addCommands() {
        return {
          setParagraph:
            () =>
            ({ commands }) => {
              return commands.setNode(this.name);
            },
        };
      },

      addKeyboardShortcuts() {
        return {
          'Mod-Alt-0': () => this.editor.commands.setParagraph(),
        };
      },
    };
  },
};
