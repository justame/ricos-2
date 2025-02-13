import type { TextStyle as TextStyleRichContent } from 'ricos-schema';
import type { CustomTextualStyle } from 'ricos-types';
import type { TextStyle } from '../models/text-style';
import { pickBy } from 'lodash';

export class RicosTextStyle implements TextStyle {
  textStyle: Omit<TextStyleRichContent, 'textAlignment'>;

  private constructor(textStyle: Omit<TextStyleRichContent, 'textAlignment'>) {
    this.textStyle = this.preprocess(textStyle);
  }

  private preprocess(textStyle: Omit<TextStyleRichContent, 'textAlignment'>) {
    let lineHeight = textStyle.lineHeight;
    if (lineHeight && !Number(lineHeight)) {
      if (lineHeight.includes('px') || lineHeight.includes('em')) {
        lineHeight = lineHeight.slice(0, lineHeight.length - 2);
      }
    }
    return pickBy({ ...textStyle, lineHeight });
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
