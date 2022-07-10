import type { ICustomStyle } from '../models/custom-style';
import type { CustomTextualStyle, RicosCustomStyles } from 'ricos-types';

export type CustomStyleKey =
  | keyof Pick<
      RicosCustomStyles,
      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'quote' | 'codeBlock'
    >
  | 'empty';

export default class CustomStyle implements ICustomStyle {
  private key: CustomStyleKey;

  private customStyle: CustomTextualStyle;

  constructor(key: CustomStyleKey, customStyle: CustomTextualStyle) {
    this.key = key;
    this.customStyle = customStyle;
  }

  getKey() {
    return this.key;
  }

  toCustomStyle() {
    return this.customStyle;
  }

  overrideWith(customStyle: CustomStyle): CustomStyle {
    if (customStyle.key !== 'empty' && this.key !== customStyle.key) {
      throw new Error(`Different keys, ${this.key} doesn't equal to ${customStyle.key}`);
    }
    return new CustomStyle(this.key, { ...this.customStyle, ...customStyle.customStyle });
  }
}
