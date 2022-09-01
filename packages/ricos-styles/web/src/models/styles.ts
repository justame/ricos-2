import type { ReactElement } from 'react';
import type {
  Decoration_Type,
  DocumentStyle as RichContentDocumentStyle,
  TextNodeStyle,
} from 'ricos-schema';
import type { AmbientStyles, PaletteColors } from 'ricos-types';
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
  /**
   * Returns palette colors for the current theme
   *
   * @returns  {PaletteColors}
   * @memberof TextualTheme
   */
  getColors(): PaletteColors;
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
   * @param {TextNodeStyle} textNodeStyle
   * @returns  {DocumentStyle}
   * @memberof DocumentStyle
   */
  setStyle(type: TextNodeType, textNodeStyle: TextNodeStyle): DocumentStyle;
  /**
   * DocumentStyle modification
   *
   * @param {RichContentDocumentStyle} documentStyle
   * @returns  {DocumentStyle}
   * @memberof DocumentStyle
   */
  mergeWith(documentStyle: RichContentDocumentStyle): DocumentStyle;
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
export interface Styles extends AmbientStyles {
  /**
   * Exposes TextualTheme
   *
   * @returns  {TextualTheme}
   * @memberof Styles
   */
  getTheme(): TextualTheme;
  /**
   * Exposes DocumentStyle
   *
   * @returns  {DocumentStyle}
   * @memberof Styles
   */
  getDocumentStyle(): DocumentStyle;
}
