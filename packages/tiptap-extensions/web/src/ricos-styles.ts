import type { Node, Decoration, DocumentStyle } from 'ricos-schema';
import { Node_Type, Decoration_Type } from 'ricos-schema';
import type { ExtensionProps, RicosExtension, RicosServices } from 'ricos-types';
import { DocumentStyle as RicosDocumentStyle } from 'ricos-styles';
import { fromTiptapNode } from 'ricos-converters';
import type { ParagraphNode, HeadingNode } from 'ricos-content';
import { getMarksBetween } from '@tiptap/core';
import type { CommandProps, ExtensionConfig } from '@tiptap/core';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import { omit } from 'lodash';

const { Step, StepResult } = require('prosemirror-transform');

const STEP_TYPE = 'setDocAttr';

const DOCUMENT_STYLES_MARKS = [
  Decoration_Type.BOLD,
  Decoration_Type.ITALIC,
  Decoration_Type.COLOR,
  Decoration_Type.FONT_SIZE,
] as string[];

// adapted from https://discuss.prosemirror.net/t/changing-doc-attrs/784
class SetDocAttrStep extends Step {
  constructor(key, value) {
    super();
    this.key = key;
    this.value = value;
  }

  get stepType() {
    return STEP_TYPE;
  }

  apply(doc) {
    this.prevValue = doc.attrs[this.key];
    // avoid clobbering doc.type.defaultAttrs
    if (doc.attrs === doc.type.defaultAttrs) doc.attrs = Object.assign({}, doc.attrs);
    doc.attrs[this.key] = this.value;
    return StepResult.ok(doc);
  }

  invert() {
    return new SetDocAttrStep(this.key, this.prevValue);
  }

  // position never changes so map should always return same step
  map() {
    return this;
  }

  toJSON() {
    return {
      stepType: this.stepType,
      key: this.key,
      value: this.value,
    };
  }

  static fromJSON(schema, json) {
    return new SetDocAttrStep(json.key, json.value);
  }

  static register() {
    try {
      Step.jsonID(STEP_TYPE, SetDocAttrStep);
    } catch (err) {
      if (err.message !== `Duplicate use of step JSON ID ${STEP_TYPE}`) throw err;
    }
    return true;
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
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
      updateDocumentStyle: (documentStyle: DocumentStyle) => ReturnType;
      /**
       * updates the document style according to the selected node
       */
      updateDocumentStyleBySelectedNode: () => ReturnType;
      /**
       * remove all marks that are defined in the document style (bold, italic, color, font size)
       */
      unsetAllDocumentStyleMarksByNode: (node: ProseMirrorNode) => ReturnType;
      /**
       * remove all attibutes that are defined in the document style (paddingTop,paddingBottom,lineHeight)
       */
      unsetAllDocumentStyleAttrsByNode: (node: ProseMirrorNode, pos: number) => ReturnType;
      /**
       * reset the document style of a given nodeType
       */
      resetDocumentStyleByNodeType: (nodeType: string) => ReturnType;
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
          updateDocumentStyleBySelectedNode:
            () =>
            ({ state, chain }) => {
              const { from, to } = state.selection;
              let node, proseNode;

              state.doc.nodesBetween(from, to, currNode => {
                if ([Node_Type.PARAGRAPH, Node_Type.HEADING].includes(currNode?.type?.name)) {
                  node = fromTiptapNode(currNode.toJSON());
                  proseNode = currNode;

                  return false;
                }
              });
              if (node) {
                const documentStyleEntity = RicosDocumentStyle.fromNode(node);

                return chain()
                  .focus()
                  .updateDocumentStyle(documentStyleEntity.toContent())
                  .command(({ state, commands }) => {
                    state.doc.descendants((node, pos) => {
                      if (node.isTextblock && node.type.name === proseNode.type.name) {
                        commands.unsetAllDocumentStyleMarksByNode(node);
                        commands.unsetAllDocumentStyleAttrsByNode(node, pos);
                      }
                    });
                    return true;
                  })

                  .run();
              }
            },
          unsetAllDocumentStyleMarksByNode:
            (node: ProseMirrorNode) =>
            ({ editor, tr, state }) => {
              const nodeElement = document.body.querySelector(`[data-ricos-id="${node.attrs.id}"]`);
              if (nodeElement) {
                const start = editor.view.posAtDOM(nodeElement);
                const end = start + node.content.size;

                getMarksBetween(start, end, state.doc).forEach(markRang => {
                  if (DOCUMENT_STYLES_MARKS.includes(markRang.mark.type.name)) {
                    tr.removeMark(start, end, markRang.mark);
                  }
                });
              }
              return true;
            },
          unsetAllDocumentStyleAttrsByNode:
            (node: ProseMirrorNode, pos: number) =>
            ({ tr }) => {
              const attrs = omit(node.attrs, ['style', 'textStyle.lineHeight']);
              tr.setNodeMarkup(pos, undefined, attrs);
              return true;
            },
          resetDocumentStyleByNodeType:
            nodeType =>
            ({ state }) => {
              const updatedDocumentStyle = new RicosDocumentStyle(state.doc.attrs.documentStyle)
                .resetStyle(nodeType)
                .toContent();

              state.tr.step(new SetDocAttrStep('documentStyle', updatedDocumentStyle));
              this.options.styles.setDocumentStyle(updatedDocumentStyle);
              return true;
            },
          updateDocumentStyle:
            (documentStyle: DocumentStyle) =>
            ({ state }) => {
              const updatedDocumentStyle = new RicosDocumentStyle(state.doc.attrs.documentStyle)
                .mergeWith(documentStyle)
                .toContent();
              state.tr.step(new SetDocAttrStep('documentStyle', updatedDocumentStyle));
              this.options.styles.setDocumentStyle(updatedDocumentStyle);
              return true;
            },
        };
      },
    };
  },
};
