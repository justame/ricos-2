import type { TranslationFunction, AvailableExperiments, TextDirection } from './commonTypes';
import type { DebugMode } from './debug-mode';
import type { RicosPortal } from './RicosTypes';
import type { RicosTheme } from './themeTypes';

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
  editorExternalContainer?: HTMLElement | (() => HTMLElement);
}
