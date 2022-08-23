import TextualTheme from './textual-theme';
import { ricosPalettes } from '../../../../../examples/storybook/src/shared/resources/palettesExample';
import { FONTS } from '../../../../../examples/storybook/src/shared/resources/fontsExample';
import type { RicosTheme } from 'ricos-types';
import { Decoration_Type } from 'ricos-schema';

describe('Textual Theme', () => {
  const theme: RicosTheme = {
    palette: ricosPalettes[0],
    customStyles: FONTS[0],
  };

  it('Should toStyleTag match expected', () => {
    const styleTag = new TextualTheme(theme).toStyleTag();
    expect(styleTag.type).toStrictEqual('style');
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-text-color: #414141')
    ).toBeTruthy();
  });

  it('Should getDecoration FontSize match expected', () => {
    const decoration = new TextualTheme({
      customStyles: { h1: { fontSize: 18 } },
    })
      .getDecoration('headerOne', Decoration_Type.FONT_SIZE)
      .getDecoration();
    expect(decoration).toStrictEqual({
      fontSizeData: { unit: 'PX', value: 18 },
      type: Decoration_Type.FONT_SIZE,
    });
  });

  it('Should getDecoration Color match expected', () => {
    const decoration = new TextualTheme({
      customStyles: { h2: { color: '#717171', backgroundColor: '#909090' } },
    })
      .getDecoration('headerTwo', Decoration_Type.COLOR)
      .getDecoration();
    expect(decoration).toStrictEqual({
      colorData: { foreground: '#717171', background: '#909090' },
      type: Decoration_Type.COLOR,
    });
  });

  it('Should getDecoration Bold 1 match expected', () => {
    const decoration = new TextualTheme({
      customStyles: { h3: { fontWeight: 700 } },
    })
      .getDecoration('headerThree', Decoration_Type.BOLD)
      .getDecoration();
    expect(decoration).toStrictEqual({
      fontWeightValue: 700,
      type: Decoration_Type.BOLD,
    });
  });

  it('Should getDecoration Bold 2 match expected', () => {
    const decoration = new TextualTheme({
      customStyles: { h3: { fontWeight: 'normal' } },
    })
      .getDecoration('headerThree', Decoration_Type.BOLD)
      .getDecoration();
    expect(decoration).toStrictEqual({
      fontWeightValue: 400,
      type: Decoration_Type.BOLD,
    });
  });

  it('Should getDecoration Bold 3 match expected', () => {
    const decoration = new TextualTheme({
      customStyles: { h3: { fontWeight: 'bold' } },
    })
      .getDecoration('headerThree', Decoration_Type.BOLD)
      .getDecoration();
    expect(decoration).toStrictEqual({
      fontWeightValue: 700,
      type: Decoration_Type.BOLD,
    });
  });

  it('Should getDecoration Italic match expected', () => {
    const decoration = new TextualTheme({
      customStyles: { p: { fontStyle: 'italic' } },
    })
      .getDecoration('paragraph', Decoration_Type.ITALIC)
      .getDecoration();
    expect(decoration).toStrictEqual({
      italicData: true,
      type: Decoration_Type.ITALIC,
    });
  });
});
