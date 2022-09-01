import type { RichTextNode } from 'ricos-content';
import type { Decoration, DocumentStyle, NodeStyle, TextStyle } from 'ricos-schema';
import { Decorations } from './decorations';
import { Node_Type } from 'ricos-schema';

type DocumentStyleKey = keyof DocumentStyle;

const nodeTypeToDocumentKeyMap: Record<string, DocumentStyleKey> = {
  [(Node_Type.HEADING, 1)]: 'headerOne',
  [(Node_Type.HEADING, 2)]: 'headerTwo',
  [(Node_Type.HEADING, 3)]: 'headerThree',
  [(Node_Type.HEADING, 4)]: 'headerFour',
  [(Node_Type.HEADING, 5)]: 'headerFive',
  [(Node_Type.HEADING, 6)]: 'headerSix',
  [Node_Type.PARAGRAPH]: 'paragraph',
  [Node_Type.BLOCKQUOTE]: 'blockquote',
  [Node_Type.CODE_BLOCK]: 'codeBlock',
};

const nodeTypeToNodeDataKey: Record<string, string> = {
  [Node_Type.HEADING]: 'headingData',
  [Node_Type.PARAGRAPH]: 'paragraphData',
  [Node_Type.BLOCKQUOTE]: 'blockquoteData',
  [Node_Type.CODE_BLOCK]: 'codeBlockData',
};

const getTextNodes = (node: RichTextNode) =>
  node.type === Node_Type.BLOCKQUOTE ? node.nodes[0].nodes : node.nodes;

export class TextNodeTransformer {
  private node: RichTextNode;

  constructor(node: RichTextNode) {
    this.node = node;
  }

  private getDecorations(): Decoration[] {
    return getTextNodes(this.node)
      .reduce((acc, node) => acc.overrideWith(node.textData.decorations), Decorations.of([]))
      .toDecorationArray();
  }

  private getNodeStyle(): NodeStyle | undefined {
    return this.node.style;
  }

  private getTextStyle(): Omit<TextStyle, 'textAlignment'> {
    const dataKey = nodeTypeToNodeDataKey[this.node.type];
    return this.node[dataKey].textStyle || {};
  }

  getDocumentStyleKey = () => {
    const level = this.node.type === Node_Type.HEADING ? this.node.headingData.level : undefined;
    return nodeTypeToDocumentKeyMap[level ? (this.node.type, level) : this.node.type];
  };

  toDocumentStyle(): DocumentStyle {
    const type = this.getDocumentStyleKey();
    return {
      [type]: {
        decorations: this.getDecorations(),
        nodeStyle: this.getNodeStyle(),
        lineHeight: this.getTextStyle().lineHeight,
      },
    };
  }
}
