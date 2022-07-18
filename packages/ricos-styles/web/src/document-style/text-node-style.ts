import type { TextNodeStyle } from 'ricos-schema';
import { Decorations } from '../decorations';
import type { ITextNodeStyle } from '../models/text-node-style';
import { RicosNodeStyle } from './node-style';
import { RicosTextStyle } from './text-style';

export default class RicosTextNodeStyle implements ITextNodeStyle {
  private style: TextNodeStyle;

  constructor(style: TextNodeStyle) {
    this.style = style;
  }

  getTextNodeStyle: ITextNodeStyle['getTextNodeStyle'] = () => this.style;

  overrideWith: ITextNodeStyle['overrideWith'] = style => {
    const decorations = Decorations.of(this.style.decorations)
      .overrideWith(style.decorations)
      .toDecorationArray();
    const nodeStyle = RicosNodeStyle.of(this.style.nodeStyle)
      .overrideWith(style.nodeStyle || {})
      .getNodeStyle();
    const lineHeight = RicosTextStyle.of({ lineHeight: this.style.lineHeight })
      .overrideWith({
        lineHeight: style.lineHeight,
      })
      .getTextStyle().lineHeight;

    const textNodeStyle = JSON.parse(JSON.stringify({ decorations, nodeStyle, lineHeight }));
    return new RicosTextNodeStyle(textNodeStyle);
  };
}
