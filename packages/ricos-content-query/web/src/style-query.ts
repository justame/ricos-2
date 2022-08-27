import type { Decoration_Type, Decoration, TextStyle } from 'ricos-schema';
import type { RicosStyles } from 'ricos-styles';
import { isEmpty, camelCase } from 'lodash';
import type { IStylesQuery, ITreeNodeQuery } from 'ricos-types';

export class StylesQuery implements IStylesQuery {
  // eslint-disable-next-line no-useless-constructor
  constructor(private styles: RicosStyles) {}

  /**
   * It returns the decoration of a text block.
   * @param {ITreeNodeQuery} node - ITreeNodeQuery - the node you want to get the decoration from
   * @param {Decoration_Type} decorationType - Decoration_Type
   * @returns A Decoration object
   */
  getTextBlockDecoration(
    node: ITreeNodeQuery,
    decorationType: Decoration_Type
  ): Decoration | undefined {
    if (!node.isTextBlock()) {
      throw 'getTextBlockDecoration: node is not a text block';
    }
    const ricosNode = node.toNode();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoration = this.styles.getDecoration(ricosNode as any, decorationType);
    if (isEmpty(decoration)) {
      return undefined;
    }
    return decoration;
  }

  /**
   * `getTextDecoration` returns the decoration of the given type found in the given node
   * @param {ITreeNodeQuery} node - ITreeNodeQuery - the node you want to get the decoration from
   * @param {Decoration_Type} decorationType - Decoration_Type - The type of decoration you want to
   * get.
   * @returns A Decoration object
   */
  getTextDecoration(node: ITreeNodeQuery, decorationType: Decoration_Type): Decoration | undefined {
    if (!node.isText()) {
      throw 'getTextDecoration: node is not a text';
    }
    const ricosNode = node.toNode();
    return ricosNode.textData?.decorations?.find(decoration => decoration.type === decorationType);
  }

  /**
   * It returns the text style of a text block node
   * @param {ITreeNodeQuery} node - ITreeNodeQuery - the node that you want to get the style for
   * @returns A partial of the TextStyle object.
   */
  getTextBlockStyle(node: ITreeNodeQuery): Partial<TextStyle> | undefined {
    const ricosNode = node.toNode();

    if (!node.isTextBlock()) {
      throw 'getTextBlockStyle: node is not a textBlock';
    }

    const dataProperty = `${camelCase(ricosNode.type)}Data`;
    const textStyleInline = ricosNode?.[dataProperty]?.textStyle;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textStyle = this.styles.getTextStyle(ricosNode as any);
    return textStyleInline || textStyle;
  }

  /**
   * "If the node is a text node, return the text style property of the closest text block parent."
   *
   * The function is a bit more complicated than that, but that's the gist of it
   * @param {ITreeNodeQuery} node - ITreeNodeQuery - The node you want to get the style from.
   * @param {string} textStylePropery - The property of the text style you want to get.
   * @returns The computed text style of the node.
   */
  getComputedTextStyle(
    node: ITreeNodeQuery,
    textStylePropery: string
  ): Partial<TextStyle> | undefined {
    if (node.isText()) {
      const parent = node.closest(node => node.isTextBlock());
      if (parent) {
        return this.getTextBlockStyle(parent)?.[textStylePropery];
      }
    }
  }

  /**
   * If the node is a text node, get the decoration for that node. If the node is not a text node, get
   * the decoration for the closest text block parent
   * @param {ITreeNodeQuery} node - ITreeNodeQuery - The node you want to get the decoration for.
   * @param {Decoration_Type} decorationType - Decoration_Type
   * @returns The computed decoration for the node.
   */
  getComputedDecoration(
    node: ITreeNodeQuery,
    decorationType: Decoration_Type
  ): Decoration | undefined {
    let parentNodeDecoration;
    let decoration;

    const parentNode = node.parent?.closest(node => node.isTextBlock());

    if (node.isText()) {
      decoration = this.getTextDecoration(node, decorationType);
    }

    if (!parentNode) {
      return decoration;
    } else {
      parentNodeDecoration = this.getTextBlockDecoration(parentNode, decorationType);
    }

    return decoration || parentNodeDecoration;
  }
}
