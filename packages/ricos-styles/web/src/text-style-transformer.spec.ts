import { TextStyleTransformer } from './text-style-transformer';
import { ricosPalettes } from '../../../../examples/storybook/src/shared/resources/palettesExample';
import type { RicosTheme } from 'ricos-types';

const theme: RicosTheme = {
  palette: ricosPalettes[0],
  customStyles: {
    h2: { fontFamily: 'Arial', fontSize: '14px', textDecoration: 'underline' },
    p: { fontFamily: 'Comic Sans MS' },
  },
};

describe('Text Style Transformer', () => {
  it('Should fromTheme toTheme match expected', () => {
    const actual = TextStyleTransformer.fromTheme(theme).toTheme();
    expect(actual).toStrictEqual(theme);
  });

  it('Should fromTheme toDocumentStyle match expected', () => {
    const actual = TextStyleTransformer.fromTheme(theme).toDocumentStyle();

    const expected = {
      headerOne: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      headerTwo: {
        decorations: [
          {
            type: 'FONT_SIZE',
            fontSizeData: {
              value: 14,
              unit: 'PX',
            },
          },
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      headerThree: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      headerFour: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      headerFive: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      headerSix: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      paragraph: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      blockquote: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
      codeBlock: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#414141',
              background: '#FFFFFF',
            },
          },
        ],
        nodeStyle: {},
      },
    };

    expect(actual).toStrictEqual(expected);
  });

  //TODO: test fontFamily, fontStyle, textDecoration, minHeight
});
