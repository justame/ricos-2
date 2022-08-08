import type {
  AvailableExperiments,
  DebugMode,
  RicosPortal,
  RicosTheme,
  TextDirection,
  TranslationFunction,
} from 'ricos-types';

export interface GeneralContext {
  locale: string;
  localeContent: string;
  experiments: AvailableExperiments;
  isMobile: boolean;
  t: TranslationFunction;
  languageDir: TextDirection;
  theme: RicosTheme;
  portal: RicosPortal;
  debugMode: DebugMode[];
}
