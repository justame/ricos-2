import type { ReactElement } from 'react';
import type {
  AvailableExperiments,
  RichContentTheme,
  ThemeData,
  RicosTheme,
  WixPalette,
} from 'ricos-types';
import type { BasePlugin } from '../types';
export type RicosCssOverride = RichContentTheme;

export interface ThemeStrategyArgs {
  experiments?: AvailableExperiments;
  plugins?: BasePlugin[];
  cssOverride?: RicosCssOverride;
  ricosTheme?: RicosTheme;
}

export interface ThemeStrategyResult {
  theme: RicosCssOverride;
  html: ReactElement;
  themeData: ThemeData;
}

export type CssVarsObject = Record<string, unknown>;

export { RicosTheme, WixPalette };
