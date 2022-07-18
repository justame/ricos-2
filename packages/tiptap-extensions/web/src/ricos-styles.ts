import type { Node, Decoration_Type, Decoration, DocumentStyle } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { ExtensionProps, RicosExtension } from 'ricos-tiptap-types';
import type { RicosServices } from 'ricos-types';
import { DocumentStyle as RicosDocumentStyle } from 'ricos-styles';
import { fromTiptapNode } from 'ricos-converters';
import type { ParagraphNode, HeadingNode } from 'ricos-content';
import type { Command, CommandProps, ExtensionConfig } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands {
    styles: {
      /**
       * returns decoration object from selected node according to ricos-styles
       */
      getStylesDecorationBySelectedNode: (
        decorationType: Decoration_Type
      ) => (props: CommandProps) => Decoration | undefined;
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
  reconfigure: (
    config: ExtensionConfig,
    _extensions: RicosExtension[],
    _ricosProps: ExtensionProps,
    _settings: Record<string, unknown>,
    services: RicosServices
  ) => {
    return {
      ...config,
      addOptions() {
        return {
          styles: services.styles,
        };
      },
    };
  },
  createExtensionConfig() {
    return {
      name: this.name,
      addCommands() {
        return {
          getStylesDecorationBySelectedNode:
            (decorationType: Decoration_Type) =>
            ({ state }) => {
              const { from, to } = state.selection;
              let node: Node | undefined;
              state.doc.nodesBetween(from, to, currNode => {
                if ([Node_Type.PARAGRAPH, Node_Type.HEADING].includes(currNode?.type?.name)) {
                  node = fromTiptapNode(currNode.toJSON());
                  return false;
                }
              });
              return (
                node &&
                this.options.styles.getDecoration(
                  node as ParagraphNode | HeadingNode,
                  decorationType
                )
              );
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
