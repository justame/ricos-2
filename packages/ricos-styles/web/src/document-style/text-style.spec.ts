import { RicosTextStyle } from './text-style';
import { textStyle as customStyle } from '../tests/test-cases';

describe('Text Style', () => {
  it('Should fromCustomStyle match expected', () => {
    const textStyle = RicosTextStyle.fromCustomStyle(customStyle);
    expect(textStyle.getTextStyle()).toStrictEqual(customStyle);
  });

  it('Should fromCustomStyle match expected', () => {
    const textStyle = RicosTextStyle.fromCustomStyle(customStyle);
    expect(textStyle.toCustomStyle()).toStrictEqual(customStyle);
  });

  it('Should overrideWith match expected', () => {
    const textStyle = RicosTextStyle.fromCustomStyle(customStyle);
    expect(textStyle.overrideWith({ lineHeight: '6px' }).getTextStyle()).toStrictEqual({
      ...customStyle,
      lineHeight: '6px',
    });
  });
});
