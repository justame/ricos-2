import { firstRight } from 'ricos-content';
import type { Decoration } from 'ricos-schema';
import { Decoration_Type } from 'ricos-schema';
import type { CustomTextualStyle } from 'ricos-types';
import { BoldDecoration } from './bold-decoration';
import { ColorDecoration } from './color-decoration';
import { EmptyDecoration } from './empty-decoration';
import { FontSizeDecoration } from './font-size-decoration';
import { ItalicDecoration } from './italic-decoration';
import type { TextDecoration, TextDecorations } from '../models/decoration';

export class Decorations implements TextDecorations {
  private readonly decorations: TextDecoration[];

  private static readonly empty = new EmptyDecoration();

  private constructor(textDecorations: TextDecoration[]) {
    this.decorations = textDecorations;
  }

  static of(decorations: Decoration[]): Decorations {
    const textDecorations = (decorations || []).map(Decorations.toTextDecoration);
    return new Decorations(textDecorations);
  }

  static fromCustomStyle(customStyle: CustomTextualStyle): Decorations {
    const { color, backgroundColor, ...rest } = customStyle;
    const colorStyle = { color, backgroundColor };
    // TODO refactor to splitStyles method
    const styles = Object.entries(rest)
      .map(([k, v]) => ({ [k]: v }))
      .concat([colorStyle]);
    const textDecorations = styles.map(Decorations.styleToDecoration);
    return new Decorations(textDecorations);
  }

  private static styleToDecoration(style: CustomTextualStyle): TextDecoration {
    return firstRight(style, Decorations.empty, [
      [s => !!s.fontWeight, s => BoldDecoration.fromCustomStyle(s)],
      [s => !!s.fontSize, s => FontSizeDecoration.fromCustomStyle(s)],
      [s => !!s.fontStyle, s => ItalicDecoration.fromCustomStyle(s)],
      [s => !!s.color, s => ColorDecoration.fromCustomStyle(s)],
    ]);
  }

  private static toTextDecoration(decoration: Decoration): TextDecoration {
    return firstRight(decoration, Decorations.empty, [
      [d => d.type === Decoration_Type.BOLD, d => BoldDecoration.of(d)],
      [d => d.type === Decoration_Type.ITALIC, d => ItalicDecoration.of(d)],
      [d => d.type === Decoration_Type.FONT_SIZE, d => FontSizeDecoration.of(d)],
      [d => d.type === Decoration_Type.COLOR, d => ColorDecoration.of(d)],
    ]);
  }

  toDecorationArray() {
    return this.decorations.map(d => d.getDecoration());
  }

  byType(type: Decoration_Type): TextDecoration {
    return this.decorations.find(d => d.type === type) || Decorations.empty;
  }

  toCustomStyle() {
    return this.decorations.reduce(
      (style, decoration) => ({
        ...style,
        ...decoration.toCustomStyle(),
      }),
      {} as CustomTextualStyle
    );
  }

  overrideWith(decorations: Decoration[]): Decorations {
    const textDecorations = decorations.map(Decorations.toTextDecoration);
    const overridenDecorations = textDecorations.map(decoration =>
      this.byType(decoration.type).overrideWith(decoration)
    );
    const types = overridenDecorations.map(decoration => decoration.type);
    const mergedDecorations = this.decorations
      .filter(decoration => !types.includes(decoration.type))
      .concat(overridenDecorations);
    return new Decorations(mergedDecorations);
  }
}
