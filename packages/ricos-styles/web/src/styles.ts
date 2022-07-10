import type { ReactElement } from 'react';
import { Node_Type } from 'ricos-schema';
import type {
  Decoration_Type,
  DocumentStyle as RichContentDocumentStyle,
  Decoration,
} from 'ricos-schema';
import type { RicosTheme } from 'ricos-types';
import DocumentStyle from './document-style/document-style';
import type { Styles } from './models/styles';
import TextualTheme from './textual-theme/textual-theme';
import { TextNodeTransformer } from './text-node-transformer';
import type { ParagraphNode, HeadingNode, BlockquoteNode, CodeBlockNode } from 'ricos-content';

export type TextNodeContainer = ParagraphNode | HeadingNode | BlockquoteNode | CodeBlockNode;

export class RicosStyles implements Styles {
  private theme!: TextualTheme;

  private documentStyle!: DocumentStyle;

  toStyleTags(): ReactElement[] {
    return [this.theme.toStyleTag(), this.documentStyle.toStyleTag()];
  }

  getDecoration(node: TextNodeContainer, decorationType: Decoration_Type) {
    if (
      ![
        Node_Type.PARAGRAPH,
        Node_Type.HEADING,
        Node_Type.BLOCKQUOTE,
        Node_Type.CODE_BLOCK,
      ].includes(node.type)
    ) {
      // Wrong node type
      return {} as Decoration;
    }

    const nodeType = new TextNodeTransformer(node).getDocumentStyleKey();
    const documentStyleDecoration = this.documentStyle.getDecoration(nodeType, decorationType);
    const themeDecoration = this.theme.getDecoration(nodeType, decorationType);
    return themeDecoration.overrideWith(documentStyleDecoration).getDecoration();
  }

  getTextStyle(node: TextNodeContainer) {
    const nodeType = new TextNodeTransformer(node).getDocumentStyleKey();
    const documentStyleTextStyle = this.documentStyle.getTextStyle(nodeType);
    const themeTextStyle = this.theme.getTextStyle(nodeType);
    return themeTextStyle.overrideWith(documentStyleTextStyle.getTextStyle()).getTextStyle();
  }

  getNodeStyle(node: TextNodeContainer) {
    const nodeType = new TextNodeTransformer(node).getDocumentStyleKey();
    const documentStyleNodeStyle = this.documentStyle.getNodeStyle(nodeType);
    const themeTextStyle = this.theme.getNodeStyle(nodeType);
    return themeTextStyle.overrideWith(documentStyleNodeStyle.getNodeStyle()).getNodeStyle();
  }

  getTheme() {
    return this.theme;
  }

  setTheme(theme: RicosTheme) {
    this.theme = new TextualTheme(theme);
    return this;
  }

  getDocumentStyle() {
    return this.documentStyle;
  }

  setDocumentStyle(documentStyle: RichContentDocumentStyle) {
    this.documentStyle = new DocumentStyle(documentStyle);
    return this;
  }
}
