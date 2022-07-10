import type { Decoration } from 'ricos-schema';
import { FontSizeData_fontType, Decoration_Type } from 'ricos-schema';
import type { CustomTextualStyle } from 'ricos-types';
import { EmptyDecoration } from './empty-decoration';
import type { TextDecoration } from '../models/decoration';

export class FontSizeDecoration implements TextDecoration {
  type = Decoration_Type.FONT_SIZE;

  private readonly customStyle: CustomTextualStyle;

  private constructor(customStyle: CustomTextualStyle) {
    this.customStyle = customStyle;
  }

  static of(decoration: Decoration) {
    if (decoration.type !== Decoration_Type.FONT_SIZE) {
      throw new TypeError(`invalid decoration initializer ${decoration}`);
    }

    const value = decoration.fontSizeData?.value;
    const unit = decoration.fontSizeData?.unit?.toLocaleLowerCase();

    const customStyle = value
      ? {
          fontSize: `${value}${unit}`,
        }
      : {};

    return new FontSizeDecoration(customStyle);
  }

  getDecoration(): Decoration {
    return {
      type: this.type,
      fontSizeData: {
        value: parseInt(this.customStyle.fontSize as string),
        unit: FontSizeData_fontType.PX,
      },
    };
  }

  static fromCustomStyle(customStyle: CustomTextualStyle): TextDecoration {
    return new FontSizeDecoration(customStyle);
  }

  fromCustomStyle(customStyle: CustomTextualStyle): TextDecoration {
    return FontSizeDecoration.fromCustomStyle(customStyle);
  }

  toCustomStyle(): CustomTextualStyle {
    return this.customStyle;
  }

  overrideWith(decoration: TextDecoration): TextDecoration {
    if (!(decoration instanceof FontSizeDecoration || decoration instanceof EmptyDecoration)) {
      throw new TypeError(`invalid merge decoration ${decoration}`);
    }
    const customStyle = { ...this.customStyle, ...decoration.toCustomStyle() };
    return new FontSizeDecoration(customStyle);
  }
}
