import { LAYOUTS, PLACEMENTS } from 'ricos-modals';
import type { TextDirection } from 'wix-rich-content-common';

export const calcPluginModalLayout = (isMobile: boolean) =>
  isMobile ? LAYOUTS.FULLSCREEN : LAYOUTS.POPOVER;

export const calcPluginModalPlacement = (isMobile: boolean, languageDir: TextDirection) =>
  isMobile
    ? PLACEMENTS.BOTTOM
    : languageDir === 'ltr'
    ? PLACEMENTS.RIGHT_START
    : PLACEMENTS.LEFT_START;
