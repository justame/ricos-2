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

  it('Should fromCustomStyle 2 match expected', () => {
    const textStyle = RicosTextStyle.fromCustomStyle({ lineHeight: '1.4em' });
    expect(textStyle.toCustomStyle()).toStrictEqual({ lineHeight: '1.4' });
  });

  it('Should fromCustomStyle 3 match expected', () => {
    const textStyle = RicosTextStyle.fromCustomStyle({ lineHeight: 7 });
    expect(textStyle.toCustomStyle()).toStrictEqual({ lineHeight: 7 });
  });

  it('Should overrideWith match expected', () => {
    const textStyle = RicosTextStyle.fromCustomStyle(customStyle);
    expect(textStyle.overrideWith({ lineHeight: '6px' }).getTextStyle()).toStrictEqual({
      ...customStyle,
      lineHeight: '6',
    });
  });
});
