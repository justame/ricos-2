import type {
  Decoration_Type,
  DocumentStyle as RichContentDocumentStyle,
  TextNodeStyle,
  Decoration,
} from 'ricos-schema';
import { Decorations } from '../decorations';
import type { TextDecoration } from '../models/decoration';
import type { DocumentStyle, TextNodeType } from '../models/styles';
import { TextStyleTransformer } from '../text-style-transformer';
import RicosTextualTheme from '../textual-theme/textual-theme';
import { RicosTextStyle } from './text-style';
import { RicosNodeStyle } from './node-style';
import { TextNodeTransformer } from '../text-node-transformer';
import RicosTextNodeStyle from './text-node-style';
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

  getDecorations(node: ParagraphNode | HeadingNode): Decoration[] {
    const documentStyleKey = new TextNodeTransformer(node).getDocumentStyleKey();
    return Decorations.of(
      this.documentStyle[documentStyleKey]?.decorations || []
    ).toDecorationArray();
  }

  getTextStyle(nodeType: TextNodeType) {
    return RicosTextStyle.of({ lineHeight: this.documentStyle[nodeType]?.lineHeight });
  }

  getNodeStyle(nodeType: TextNodeType) {
    return RicosNodeStyle.of(this.documentStyle[nodeType]?.nodeStyle);
  }

  toStyleTag() {
    const theme = TextStyleTransformer.fromDocumentStyle(this.documentStyle).toTheme();
    return new RicosTextualTheme(theme).toStyleTag();
  }

  toContent() {
    return this.documentStyle;
  }

  setStyle(nodeType: TextNodeType, textNodeStyle: TextNodeStyle) {
    const style = new RicosTextNodeStyle(this.documentStyle[nodeType] || { decorations: [] })
      .overrideWith(textNodeStyle)
      .getTextNodeStyle();
    return new RicosDocumentStyle({ ...this.documentStyle, [nodeType]: style });
  }

  resetStyle(nodeType: TextNodeType) {
    return new RicosDocumentStyle({ ...this.documentStyle, [nodeType]: {} });
  }

  mergeWith(documentStyle: RichContentDocumentStyle) {
    return (
      Object.entries(documentStyle) as [keyof RichContentDocumentStyle, TextNodeStyle][]
    ).reduce(
      (acc, [key, style]) => acc.setStyle(key, style),
      new RicosDocumentStyle(this.documentStyle)
    );
  }
}
