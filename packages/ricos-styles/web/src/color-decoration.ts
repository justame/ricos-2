import type { Decoration } from 'ricos-schema';
import { Decoration_Type } from 'ricos-schema';
import type { CustomTextualStyle } from 'ricos-types';
import { EmptyDecoration } from './empty-decoration';
import type { TextDecoration } from './models/decoration';

export class ColorDecoration implements TextDecoration {
  type = Decoration_Type.COLOR;

  private readonly customStyle: CustomTextualStyle;

  private constructor(customStyle: CustomTextualStyle) {
    this.customStyle = customStyle;
  }

  static of(decoration: Decoration) {
    if (decoration.type !== Decoration_Type.COLOR) {
      throw new TypeError(`invalid decoration initializer ${decoration}`);
    }

    // TODO: add backgroundColor
    return new ColorDecoration(
      decoration.colorData?.foreground ? { color: decoration.colorData.foreground } : {}
    );
  }

  getDecoration(): Decoration {
    return {
      type: this.type,
      colorData: {
        foreground: this.customStyle.color,
        // background: this.customStyle.backgroundColor
      },
    };
  }

  static fromCustomStyle(customStyle: CustomTextualStyle): TextDecoration {
    return new ColorDecoration(customStyle);
  }

  fromCustomStyle(customStyle: CustomTextualStyle): TextDecoration {
    return ColorDecoration.fromCustomStyle(customStyle);
  }

  toCustomStyle(): CustomTextualStyle {
    return this.customStyle;
  }

  overrideWith(decoration: TextDecoration): TextDecoration {
    if (!(decoration instanceof ColorDecoration || decoration instanceof EmptyDecoration)) {
      throw new TypeError(`invalid merge decoration ${decoration}`);
    }
    const customStyle = { ...this.customStyle, ...decoration.toCustomStyle() };
    return new ColorDecoration(customStyle);
  }
}
