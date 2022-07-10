import type {
  Decoration_Type,
  DocumentStyle as RichContentDocumentStyle,
  TextNodeStyle,
} from 'ricos-schema';
import { Decorations } from '../decorations';
import type { TextDecoration } from '../models/decoration';
import type { DocumentStyle, TextNodeType } from '../models/styles';
import { TextStyleTransformer } from '../text-style-transformer';
import RicosTextualTheme from '../textual-theme/textual-theme';
import TextStyle from './text-style';
import NodeStyle from './node-style';
import { TextNodeTransformer } from '../text-node-transformer';
import type { ParagraphNode, HeadingNode } from 'ricos-content';

export default class RicosDocumentStyle implements DocumentStyle {
  documentStyle: RichContentDocumentStyle;

  constructor(documentStyle: RichContentDocumentStyle) {
    this.documentStyle = documentStyle;
  }

  static fromNode(node: ParagraphNode | HeadingNode): RicosDocumentStyle {
    return new RicosDocumentStyle(new TextNodeTransformer(node).toDocumentStyle());
  }

  getDecoration(nodeType: TextNodeType, decorationType: Decoration_Type): TextDecoration {
    return Decorations.of(this.documentStyle[nodeType]?.decorations || []).byType(decorationType);
  }

  getTextStyle(nodeType: TextNodeType) {
    return new TextStyle({ lineHeight: this.documentStyle[nodeType]?.lineHeight });
  }

  getNodeStyle(nodeType: TextNodeType) {
    return new NodeStyle(this.documentStyle[nodeType]?.nodeStyle || {});
  }

  toStyleTag() {
    const theme = TextStyleTransformer.fromDocumentStyle(this.documentStyle).toTheme();
    return new RicosTextualTheme(theme).toStyleTag();
  }

  toContent() {
    return this.documentStyle;
  }

  setStyle(nodeType: TextNodeType, textNodeStyle: TextNodeStyle) {
    return new RicosDocumentStyle({ ...this.documentStyle, [nodeType]: { ...textNodeStyle } });
  }

  overrideWith(documentStyle: RichContentDocumentStyle) {
    return (
      Object.entries(documentStyle) as [keyof RichContentDocumentStyle, TextNodeStyle][]
    ).reduce(
      (acc, [key, style]) => acc.setStyle(key, style),
      new RicosDocumentStyle(this.documentStyle)
    );
  }
}
