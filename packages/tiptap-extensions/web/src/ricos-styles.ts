import type { Node, Decoration_Type, Decoration } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { RicosExtension } from 'ricos-tiptap-types';
import type { Styles } from 'ricos-styles';
import { fromTiptapNode } from 'ricos-converters';
import type { ParagraphNode, HeadingNode } from 'ricos-content';
import type { CommandProps } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands {
    styles: {
      /**
       *
       */
      getStylesDecorationBySelectedNode: (
        styles: Styles,
        decorationType: Decoration_Type
      ) => (props: CommandProps) => Decoration;
    };
  }
}

export const ricosStyles: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'ricos-styles',
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
        };
      },
    };
  },
};
