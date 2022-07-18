import type { TextStyle as TextStyleRichContent } from 'ricos-schema';
import type { CustomTextualStyle } from 'ricos-types';
import type { TextStyle } from '../models/text-style';

export class RicosTextStyle implements TextStyle {
  textStyle: Omit<TextStyleRichContent, 'textAlignment'>;

  private constructor(textStyle: Omit<TextStyleRichContent, 'textAlignment'>) {
    this.textStyle = textStyle;
  }

  static of(textStyle: Omit<TextStyleRichContent, 'textAlignment'>): RicosTextStyle {
    return new RicosTextStyle(textStyle || {});
  }

  getTextStyle: TextStyle['getTextStyle'] = () => this.textStyle;

  static fromCustomStyle = (customStyle: CustomTextualStyle): TextStyle => {
    const { lineHeight } = customStyle;
    const textStyle = { lineHeight } as TextStyleRichContent;
    return RicosTextStyle.of(textStyle);
  };

  toCustomStyle: TextStyle['toCustomStyle'] = () => {
    return { lineHeight: this.textStyle.lineHeight };
  };

  overrideWith: TextStyle['overrideWith'] = textStyle => {
    return RicosTextStyle.of({ ...this.textStyle, ...textStyle });
  };
}
