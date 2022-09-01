import type { ReactElement } from 'react';
import type { RichTextNode } from 'ricos-content';
import type {
  Decoration_Type,
  Decoration,
  TextStyle,
  NodeStyle,
  DocumentStyle,
} from 'ricos-schema';
import type { Subscription } from './events';
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
  onThemeUpdate(callback: (theme: RicosTheme) => void): Subscription;

  onDocumentStyleUpdate(callback: (documentStyle: DocumentStyle) => void): Subscription;
  /**
   * Extracts given decoration settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {RichTextNode} type
   * @param {Decoration_Type} decoration type
   * @returns  {Decoration}
   * @memberof AmbientStyles
   */
  getDecoration(type: RichTextNode, decoration: Decoration_Type): Decoration;
  /**
   * Extracts given text style (line height) settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {RichTextNode} type
   * @returns  {Omit<TextStyle, 'textAlignment'>}
   * @memberof AmbientStyles
   */
  getTextStyle(type: RichTextNode): Omit<TextStyle, 'textAlignment'>;
  /**
   * Extracts given node style (margins) settings for specific node type from the current Document Style and Theme conjunction
   *
   *
   * @param {RichTextNode} type
   * @returns  {NodeStyle}
   * @memberof AmbientStyles
   */
  getNodeStyle(type: RichTextNode): NodeStyle;
  /**
   * Sets new theme
   *
   * @param {RicosTheme} theme
   * @memberof AmbientStyles
   */
  setTheme(theme: RicosTheme, isMobile?: boolean): AmbientStyles;

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
