import type { Node, Decoration_Type, Decoration, DocumentStyle } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { ExtensionProps, RicosExtension, RicosServices } from 'ricos-types';
import { DocumentStyle as RicosDocumentStyle } from 'ricos-styles';
import { fromTiptapNode } from 'ricos-converters';
import type { ParagraphNode, HeadingNode } from 'ricos-content';
import type { CommandProps, ExtensionConfig } from '@tiptap/core';

const { Step, StepResult } = require('prosemirror-transform');

const STEP_TYPE = 'setDocAttr';

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
                    state.doc.descendants(node => {
                      if (node.isTextblock && node.type.name === proseNode.type.name) {
                        commands.unsetAllMarksByNode(node);
                      }
                    });
                    return true;
                  })

                  .run();
              }
            },

          unsetAllMarksByNode:
            node =>
            ({ editor, tr }) => {
              const nodeElement = document.body.querySelector(`[data-ricos-id="${node.attrs.id}"]`);
              if (nodeElement) {
                const start = editor.view.posAtDOM(nodeElement);
                const end = start + node.nodeSize;

                try {
                  tr.removeMark(start, end);
                } catch (e) {}
                return true;
              }
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
