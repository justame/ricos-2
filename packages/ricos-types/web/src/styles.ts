import type { ReactElement } from 'react';
import type { ParagraphNode, HeadingNode } from 'ricos-content';
import type {
  Decoration_Type,
  Decoration,
  TextStyle,
  NodeStyle,
  DocumentStyle,
} from 'ricos-schema';
import type { RicosTheme } from './themeTypes';

/**
 * Aggregates Theme and DocumentStyle
 *
 * Responsibilities:
 * - ensures DocumentStyle precedence over Theme
 * - extracts summarized decorations per node type
 *
 * @export
 * @interface AmbientStyles
 */
export interface AmbientStyles {
  /**
   * Extracts given decoration settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {TextNodeType} type
   * @param {Decoration_Type} decoration type
   * @returns  {Decoration}
   * @memberof AmbientStyles
   */
  getDecoration(type: ParagraphNode | HeadingNode, decoration: Decoration_Type): Decoration;
  /**
   * Extracts given text style (line height) settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {TextNodeType} type
   * @returns  {Omit<TextStyle, 'textAlignment'>}
   * @memberof AmbientStyles
   */
  getTextStyle(type: ParagraphNode | HeadingNode): Omit<TextStyle, 'textAlignment'>;
  /**
   * Extracts given node style (margins) settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {TextNodeType} type
   * @returns  {NodeStyle}
   * @memberof AmbientStyles
   */
  getNodeStyle(type: ParagraphNode | HeadingNode): NodeStyle;
  /**
   * Sets new theme
   *
   * @param {RicosTheme} theme
   * @memberof AmbientStyles
   */
  setTheme(theme: RicosTheme): AmbientStyles;
  /**
   * Sets new Document Style
   *
   * @param {RichContentDocumentStyle} documentStyle
   * @memberof AmbientStyles
   */
  setDocumentStyle(documentStyle: DocumentStyle): AmbientStyles;
  /**
   * Produces HTML style tags for DocumentStyle and Theme, guarantees correct precedence
   *
   * @returns  {ReactElement[]} style tag elements
   * @memberof AmbientStyles
   */
  toStyleTags(): ReactElement[];
}
