import type { TextNodeStyle } from 'ricos-schema';

export interface ITextNodeStyle {
  getTextNodeStyle: () => TextNodeStyle;
  overrideWith: (style: TextNodeStyle) => ITextNodeStyle;
}
