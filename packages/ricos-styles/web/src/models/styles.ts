import type { ReactElement } from 'react';
import type { HeadingNode, ParagraphNode } from 'ricos-content';
import type {
  DocumentStyle as RichContentDocumentStyle,
  Decoration,
  Decoration_Type,
  TextStyle,
  NodeStyle,
} from 'ricos-schema';
import type { RicosTheme } from 'ricos-types';
import type { TextDecoration } from './decoration';

export type TextNodeType = keyof Required<RichContentDocumentStyle>;

/**
 * Represents textual portion of Ricos Theme
 *
 * @export
 * @interface TextualTheme
 */
export interface TextualTheme {
  /**
   * Extracts given decoration settings for specific node type from the current theme.
   *
   * @param {TextNodeType} type
   * @param {Decoration_Type} decoration type
   * @returns  {Decoration}
   * @memberof TextualTheme
   */
  getDecoration(type: TextNodeType, decoration: Decoration_Type): TextDecoration;
  /**
   * Translates RicosTheme to HTML style tag with CSS variable definitions
   *
   * @returns  {ReactElement}
   * @memberof TextualTheme
   */
  toStyleTag(): ReactElement;
}

/**
 * Represents Document Style
 *
 * @export
 * @interface DocumentStyle
 */
export interface DocumentStyle {
  /**
   * Extracts given decoration settings for specific node type from the current Document Style.
   *
   * @param {TextNodeType} type
   * @param {Decoration_Type} decoration type
   * @returns  {Decoration}
   * @memberof DocumentStyle
   */
  getDecoration(type: TextNodeType, decoration: Decoration_Type): TextDecoration;
  /**
   * Translates DocumentStyle to HTML style tag with CSS variable definitions
   *
   * @returns  {ReactElement}
   * @memberof DocumentStyle
   */
  toStyleTag(): ReactElement;
  /**
   * Translates DocumentStyle entity to RichContent compatible DocumentStyle object
   *
   * @returns  {RichContentDocumentStyle}
   * @memberof DocumentStyle
   */
  toContent(): RichContentDocumentStyle;
  /**
   * DocumentStyle modification
   *
   * @param {TextNodeType} type
   * @param {Decoration[]} decorations
   * @returns  {DocumentStyle}
   * @memberof DocumentStyle
   */
  setStyle(type: TextNodeType, decorations: Decoration[]): DocumentStyle;
}

/**
 * Aggregates Theme and DocumentStyle
 *
 * Responsibilities:
 * - ensures DocumentStyle precedence over Theme
 * - extracts summarized decorations per node type
 *
 * @export
 * @interface Styles
 */
export interface Styles {
  /**
   * Extracts given decoration settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {TextNodeType} type
   * @param {Decoration_Type} decoration type
   * @returns  {Decoration}
   * @memberof Styles
   */
  getDecoration(type: ParagraphNode | HeadingNode, decoration: Decoration_Type): Decoration;
  /**
   * Extracts given text style (line height) settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {TextNodeType} type
   * @returns  {Omit<TextStyle, 'textAlignment'>}
   * @memberof Styles
   */
  getTextStyle(type: ParagraphNode | HeadingNode): Omit<TextStyle, 'textAlignment'>;
  /**
   * Extracts given node style (margins) settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {TextNodeType} type
   * @returns  {NodeStyle}
   * @memberof Styles
   */
  getNodeStyle(type: ParagraphNode | HeadingNode): NodeStyle;
  /**
   * Exposes TextualTheme
   *
   * @returns  {TextualTheme}
   * @memberof Styles
   */
  getTheme(): TextualTheme;
  /**
   * Sets new theme
   *
   * @param {RicosTheme} theme
   * @memberof Styles
   */
  setTheme(theme: RicosTheme): Styles;
  /**
   * Exposes DocumentStyle
   *
   * @returns  {DocumentStyle}
   * @memberof Styles
   */
  getDocumentStyle(): DocumentStyle;
  /**
   * Sets new Document Style
   *
   * @param {RichContentDocumentStyle} documentStyle
   * @memberof Styles
   */
  setDocumentStyle(documentStyle: RichContentDocumentStyle): Styles;
  /**
   * Produces HTML style tags for DocumentStyle and Theme, guarantees correct precedence
   *
   * @returns  {ReactElement[]} style tag elements
   * @memberof Styles
   */
  toStyleTags(): ReactElement[];
}
