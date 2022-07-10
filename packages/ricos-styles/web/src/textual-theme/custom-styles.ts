import type { RicosCustomStyles, RicosTheme } from 'ricos-types';
import type { ICustomStyles } from '../models/custom-styles';
import type { CustomStyleKey } from './custom-style';
import EmptyCustomStyle from './empty-custom-style';
import CustomStyle from './custom-style';
import { createPalette } from 'ricos-common';
import { isEmpty } from 'lodash';

const textCustomStylesKeys = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote', 'codeBlock'];

export default class CustomStyles implements ICustomStyles {
  private customStyles: CustomStyle[];

  private static readonly empty = new EmptyCustomStyle();

  private constructor(customStyles: CustomStyle[]) {
    this.customStyles = customStyles;
  }

  static of(rawCustomStyles: RicosCustomStyles): CustomStyles {
    const customStyles = Object.entries(rawCustomStyles).map(
      ([key, value]) => new CustomStyle(key as CustomStyleKey, value)
    );
    return new CustomStyles(customStyles);
  }

  static fromTheme(theme: RicosTheme): CustomStyles {
    const customStyles = theme.customStyles || {};
    const { colors } = createPalette(theme.palette, theme.paletteConfig);
    const { textColor: color, bgColor: backgroundColor } = colors || {};
    if (colors?.textColor || colors?.bgColor) {
      const colorsCustomStyles: RicosCustomStyles = textCustomStylesKeys.reduce(
        (acc, key) => ({ ...acc, [key]: { color, backgroundColor } }),
        {}
      );
      return CustomStyles.of(colorsCustomStyles).overrideWith(CustomStyles.of(customStyles));
    }
    return CustomStyles.of(customStyles);
  }

  toCustomStyles(): RicosCustomStyles {
    return this.customStyles.reduce((acc, style) => {
      const customStyle = style.toCustomStyle();
      return {
        ...acc,
        ...(!isEmpty(customStyle) ? { [style.getKey()]: customStyle } : {}),
      };
    }, {});
  }

  byKey(key: CustomStyle['key']): CustomStyle {
    return this.customStyles.find(style => style.getKey() === key) || CustomStyles.empty;
  }

  overrideWith(customStyles: CustomStyles): CustomStyles {
    const genericCustomStyles: RicosCustomStyles = textCustomStylesKeys.reduce(
      (acc, key) => ({ ...acc, [key]: {} }),
      {}
    );
    const overridenCustomStyles = CustomStyles.of(genericCustomStyles).customStyles.map(style =>
      style
        .overrideWith(this.byKey(style.getKey()))
        .overrideWith(customStyles.byKey(style.getKey()))
    );
    return new CustomStyles(overridenCustomStyles);
  }
}
