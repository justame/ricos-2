import type { RicosExtension, RicosExtensionConfig } from 'ricos-types';
import type { Transaction } from 'prosemirror-state';
import { AllSelection } from 'prosemirror-state';
import { isTextSelection } from '@tiptap/core';
import type { Node } from 'prosemirror-model';
import { Node_Type } from 'ricos-schema';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indentation: {
      applyIndentation: (direction: number) => ReturnType;
      /**
       * Increase text indent
       */
      indent: () => ReturnType;
      /**
       * Decrease text indent
       */
      outdent: () => ReturnType;
    };
  }
}

const INDENT_SIZE = 24;

export const indent: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'indent',
  reconfigure(config: RicosExtensionConfig, extensions: RicosExtension[]) {
    const types = extensions
      .filter(extension => extension.groups.includes('text-container'))
      .filter(extension => extension.name !== Node_Type.CODE_BLOCK)
      .map(({ name }) => name);
    const minLevel = 0;
    const maxLevel = 4;
    return {
      ...config,
      addGlobalAttributes() {
        return [
          {
            types,
            attributes: {
              indentation: {
                renderHTML: attributes => {
                  if (attributes.indentation === 0) {
                    return {};
                  }

                  return {
                    style: `margin-inline-start: ${attributes.indentation * INDENT_SIZE}px`,
                  };
                },
              },
            },
          },
        ];
      },
      addCommands() {
        const setNodeIndentMarkup = (tr: Transaction, pos: number, delta: number): Transaction => {
          const node = tr?.doc?.nodeAt(pos);

          if (node) {
            const nextLevel = (node.attrs.indentation || 0) + delta;
            const indent =
              nextLevel < minLevel ? minLevel : nextLevel > maxLevel ? maxLevel : nextLevel;

            if (indent !== node.attrs.indentation) {
              const { indentation: _, ...currentAttrs } = node.attrs;
              const nodeAttrs =
                indent > minLevel ? { ...currentAttrs, indentation: indent } : currentAttrs;
              return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
            }
          }
          return tr;
        };

        const updateIndentationLevel = (tr: Transaction, delta: number): Transaction => {
          const { doc, selection } = tr;

          if (
            doc &&
            selection &&
            (isTextSelection(selection) || selection instanceof AllSelection)
          ) {
            const { from, to } = selection;
            doc.nodesBetween(from, to, (node, pos) => {
              if (types.includes(node.type.name)) {
                tr = setNodeIndentMarkup(tr, pos, delta);
                return false;
              }

              return true;
            });
          }

          return tr;
        };

        const isListNode = state => {
          let isListNode = false;
          state.doc.nodesBetween(state.selection.from, state.selection.to, (node: Node) => {
            node.attrs.id &&
              (node.type.name === Node_Type.ORDERED_LIST ||
                node.type.name === Node_Type.BULLETED_LIST) &&
              (isListNode = true);
          });
          return isListNode;
        };

        return {
          applyIndentation:
            direction =>
            ({ tr, state, dispatch }) => {
              const { selection } = state;
              tr = tr.setSelection(selection);
              tr = updateIndentationLevel(tr, direction);

              if (tr.docChanged) {
                dispatch?.(tr);
                return true;
              }

              return false;
            },
          indent:
            () =>
            ({ state, commands }) =>
              isListNode(state) ? commands.indentList() : commands.applyIndentation(1),

          outdent:
            () =>
            ({ state, commands }) =>
              isListNode(state) ? commands.outdentList() : commands.applyIndentation(-1),
        };
      },
    };
  },
  createExtensionConfig() {
    return {
      name: this.name,

      addKeyboardShortcuts() {
        return {
          Tab: () => this.editor.commands.indent(),
          'Shift-Tab': () => this.editor.commands.outdent(),
        };
      },
    };
  },
};
