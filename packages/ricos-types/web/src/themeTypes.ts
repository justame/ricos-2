import type { AugmentedRequired } from 'utility-types/dist/mapped-types';
import type { CSSProperties } from 'react';

export interface ThemeUtils {
  isBright: (hexColor: string) => boolean;
  adaptForeground: (actionColor?: string, fallbackColor?: string) => string | undefined;
  toCssRgbA: (hexColor: string | undefined, opacity: number) => string | undefined;
}

/** Colors scheme for `Ricos`.
 *
 * {@link https://wix.github.io/ricos/docs/ricos/ricos-api/#theme Read More}
 * @example
 * ```ts
 * const palette: PaletteColors = {
 *  textColor: '#111111',
 *  actionColor: 'rgb(132, 84, 252)',
 *  bgColor: 'transparent',
 * };
 * ```
 */
export interface PaletteColors {
  actionColor?: string;
  bgColor?: string;
  textColor?: string;
  textColorLow?: string;
  disabledColor?: string;
  /** Default is black.
   * When `ActionColor` is too bright, it is replaced with `FallbackColor` when used on bright backgrounds (e.g modals, toolbars).
   * Therefore this color should remain relatively dark. */
  fallbackColor?: string;
}

export interface ThemeData {
  colors?: PaletteColors;
  utils: ThemeUtils;
  customStyles?: RicosCustomStyles;
}
export interface ThemeGeneratorFunction {
  (themeData: AugmentedRequired<ThemeData, 'colors'>): void;
}

export interface CustomTextualStyle {
  fontSize?: CSSProperties['fontSize'];
  fontFamily?: CSSProperties['fontFamily'];
  fontWeight?: CSSProperties['fontWeight'];
  fontStyle?: CSSProperties['fontStyle'];
  textDecoration?: CSSProperties['textDecoration'];
  lineHeight?: CSSProperties['lineHeight'];
  minHeight?: CSSProperties['minHeight'];
  color?: CSSProperties['color'];
  backgroundColor?: CSSProperties['backgroundColor'];
  paddingTop?: CSSProperties['paddingTop'];
  paddingBottom?: CSSProperties['paddingBottom'];
}

export interface CustomQuoteStyle extends CustomTextualStyle {
  borderColor?: CSSProperties['borderColor'];
  borderWidth?: CSSProperties['borderWidth'];
  paddingInlineStart?: CSSProperties['paddingInlineStart'];
}

export interface CustomCodeBlockStyle {
  margin?: CSSProperties['margin'];
  padding?: CSSProperties['padding'];
  fontSize?: CSSProperties['fontSize'];
  lineHeight?: CSSProperties['lineHeight'];
}

export interface CustomMentionStyle {
  color: CSSProperties['color'];
  backgroundColor: CSSProperties['backgroundColor'];
}

export interface CustomFooterToolbarStyle {
  marginTop?: CSSProperties['marginTop'];
}

export interface RicosCustomStyles {
  h1?: CustomTextualStyle;
  h2?: CustomTextualStyle;
  h3?: CustomTextualStyle;
  h4?: CustomTextualStyle;
  h5?: CustomTextualStyle;
  h6?: CustomTextualStyle;
  p?: CustomTextualStyle;
  quote?: CustomQuoteStyle;
  link?: CustomTextualStyle;
  hashtag?: CustomTextualStyle;
  button?: Pick<CustomTextualStyle, 'color'>;
  codeBlock?: CustomCodeBlockStyle;
  mention?: CustomMentionStyle;
  footerToolbar?: CustomFooterToolbarStyle;
}

export interface RicosSettingsStyles {
  text?: {
    fontFamily?: CSSProperties['fontFamily'];
    color?: CSSProperties['color'];
  };
  whitebox?: {
    borderRadius?: CSSProperties['borderRadius'];
    boxShadow?: CSSProperties['boxShadow'];
  };
  buttons?: {
    borderRadius?: CSSProperties['borderRadius'];
    textColor?: CSSProperties['color'];
  };
  inputs?: {
    borderColor?: CSSProperties['borderColor'];
    borderRadius?: CSSProperties['borderRadius'];
    placeholderColor?: CSSProperties['color'];
  };
  icons?: {
    color?: CSSProperties['color'];
  };
  dividers?: {
    color?: CSSProperties['color'];
    height?: CSSProperties['height'];
  };
  colorPaletteSelectedButton?: {
    borderRadius?: CSSProperties['borderRadius'];
  };
  smallButtons?: {
    borderRadius?: CSSProperties['borderRadius'];
  };
  bgColor?: {
    backgroundColor?: CSSProperties['backgroundColor'];
  };
  disabled?: {
    backgroundColor?: CSSProperties['backgroundColor'];
  };
  hover?: {
    color?: CSSProperties['color'];
  };
}
export interface RicosOneAppStyles {
  text?: {
    fontFamily?: CSSProperties['fontFamily'];
    color?: CSSProperties['color'];
  };
  bgColor?: {
    backgroundColor?: CSSProperties['backgroundColor'];
  };
  primaryText?: {
    fontWeight?: CSSProperties['fontWeight'];
  };
  secondary?: {
    backgroundColor?: CSSProperties['backgroundColor'];
  };
  whitebox?: {
    borderRadius?: CSSProperties['borderRadius'];
  };
  coverImage?: {
    width?: CSSProperties['width'];
    height?: CSSProperties['height'];
    border?: CSSProperties['border'];
    margin?: CSSProperties['margin'];
  };
}

export interface WixColor {
  name: string;
  reference: string;
  value: string;
}

/** Ricos can work with a Wix Palette object */
export type WixPalette = WixColor[];

export type PalettePreset = 'darkTheme';

export interface RicosTypography {
  /**
   * WixTypography - work in progress.
   * This field is ineffective at the moment.
   */
  wixTypography?: WixTypography;
  fontFamily?: CSSProperties['fontFamily'];
}

export interface WixTypography {
  Title: WixTypographyDefinition;
  Menu: WixTypographyDefinition;
  'Page-title': WixTypographyDefinition;
  'Heading-XL': WixTypographyDefinition;
  'Heading-L': WixTypographyDefinition;
  'Heading-M': WixTypographyDefinition;
  'Heading-S': WixTypographyDefinition;
  'Body-L': WixTypographyDefinition;
  'Body-M': WixTypographyDefinition;
  'Body-S': WixTypographyDefinition;
  'Body-XS': WixTypographyDefinition;
}

export interface WixTypographyDefinition {
  editorKey: string;
  lineHeight: string;
  style: string;
  weight: string;
  size: string;
  fontFamily: string;
  value: string; // contains all of the above information (except editorKey), ready for css `font` value
}

export interface RicosTheme {
  /** You'll have to specify a parent `className` if you plan to apply different palettes for multiple
   * Ricos instances living next to each other.
   * {@link https://wix.github.io/ricos/docs/ricos/ricos-api/#theme Read More}.
   *
   * Otherwise, you can ignore this field.
   * @example
   * ```js
   * <div className='class1'>
   *  <RicosEditor theme={{ parentClass: 'class1', palette: lightPalette }} />
   * </div>
   * <div className='class2'>
   *  <RicosEditor theme={{ parentClass: 'class2', palette: darkPalette }} />
   * </div>
   * ```
   * */
  parentClass?: string;
  palette?: PaletteColors | WixPalette | PalettePreset;
  paletteConfig?: PaletteConfig;
  typography?: RicosTypography;
  customStyles?: RicosCustomStyles;
  settingsStyles?: RicosSettingsStyles;
  oneAppStyles?: RicosOneAppStyles;
}

export interface PaletteConfig {
  /**
   * When `true`, attribute `bgColor` provided in `palette` will be the
   * `background-color` of the inner content container of Ricos.
   *
   * Default: `false`
   */
  contentBgColor?: boolean;
  /** Override the `actionColor` of floating panels, toolbars & settings modals.
   *
   * **Note:** `RicosEditor` only.
   * @default actionColor
   */
  settingsActionColor?: string;
  /** Override the `actionColor` of plugin when focused / clicked.
   *
   * **Note:** `RicosEditor` only.
   * @default actionColor
   */
  focusActionColor?: string;
}
