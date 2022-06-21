import type { ReactElement } from 'react';
import type { Decoration_Type, DocumentStyle as RichContentDocumentStyle } from 'ricos-schema';
import type { RicosTheme } from 'ricos-types';
import DocumentStyle from './document-style/document-style';
import type { Styles } from './models/styles';
import TextualTheme from './textual-theme/textual-theme';
import { TextNodeTransformer } from './text-node-transformer';
import type { ParagraphNode, HeadingNode } from 'ricos-content';

export default class RicosStyles implements Styles {
  private theme!: TextualTheme;

  private documentStyle!: DocumentStyle;

  toStyleTags(): ReactElement[] {
    return [this.theme.toStyleTag(), this.documentStyle.toStyleTag()];
  }

  getDecoration(node: ParagraphNode | HeadingNode, decorationType: Decoration_Type) {
    const nodeType = new TextNodeTransformer(node).getDocumentStyleKey();
    const documentStyleDecoration = this.documentStyle.getDecoration(nodeType, decorationType);
    const themeDecoration = this.theme.getDecoration(nodeType, decorationType);
    return themeDecoration.overrideWith(documentStyleDecoration).getDecoration();
  }

  getTextStyle(node: ParagraphNode | HeadingNode) {
    const nodeType = new TextNodeTransformer(node).getDocumentStyleKey();
    const documentStyleTextStyle = this.documentStyle.getTextStyle(nodeType);
    const themeTextStyle = this.theme.getTextStyle(nodeType);
    return themeTextStyle.overrideWith(documentStyleTextStyle.getTextStyle()).getTextStyle();
  }

  getNodeStyle(node: ParagraphNode | HeadingNode) {
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
