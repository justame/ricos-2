import type { Node, Decoration_Type, Decoration, DocumentStyle } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { RicosExtension } from 'ricos-tiptap-types';
import type { Styles } from 'ricos-styles';
import { DocumentStyle as RicosDocumentStyle } from 'ricos-styles';
import { fromTiptapNode } from 'ricos-converters';
import type { ParagraphNode, HeadingNode } from 'ricos-content';
import type { Command, CommandProps } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands {
    styles: {
      /**
       * returns decoration object from selected node according to ricos-styles
       */
      getStylesDecorationBySelectedNode: (
        styles: Styles,
        decorationType: Decoration_Type
      ) => (props: CommandProps) => Decoration;
      /**
       * updates the document style
       */
      updateDocumentStyle: (documentStyle: DocumentStyle) => Command;
    };
  }
}

export const ricosStyles: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'ricos-styles-commands',
  createExtensionConfig() {
    return {
      name: this.name,
      addCommands() {
        return {
          getStylesDecorationBySelectedNode:
            (styles: Styles, decorationType: Decoration_Type) =>
            ({ state }) => {
              const { from, to } = state.selection;
              let node: Node | undefined;
              state.doc.nodesBetween(from, to, currNode => {
                if ([Node_Type.PARAGRAPH, Node_Type.HEADING].includes(currNode?.type?.name)) {
                  node = fromTiptapNode(currNode.toJSON());
                  return false;
                }
              });
              return styles.getDecoration(node as ParagraphNode | HeadingNode, decorationType);
            },
          updateDocumentStyle:
            (documentStyle: DocumentStyle) =>
            ({ state }) => {
              const updatedDocumentStyle = new RicosDocumentStyle(state.doc.attrs.documentStyle)
                .overrideWith(documentStyle)
                .toContent();
              state.doc.attrs.documentStyle = updatedDocumentStyle;
              return true;
            },
        };
      },
    };
  },
};
