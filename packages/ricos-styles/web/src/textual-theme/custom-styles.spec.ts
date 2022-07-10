import CustomStyles from './custom-styles';
import { ricosPalettes } from '../../../../../examples/storybook/src/shared/resources/palettesExample';
import { FONTS } from '../../../../../examples/storybook/src/shared/resources/fontsExample';
import type { RicosTheme } from 'ricos-types';

describe('Custom Styles', () => {
  const theme: RicosTheme = {
    palette: ricosPalettes[0],
    customStyles: FONTS[0],
  };

  it('Should fromTheme empty object match expected', () => {
    const actual = CustomStyles.fromTheme({}).toCustomStyles();
    const expected = {};
    expect(actual).toStrictEqual(expected);
  });

  it('Should fromTheme match expected', () => {
    const actual = CustomStyles.fromTheme(theme).toCustomStyles();
    const expected = {
      p: { backgroundColor: '#FFFFFF', color: '#414141', fontFamily: 'Comic Sans MS' },
      h1: { backgroundColor: '#FFFFFF', color: '#414141' },
      h2: { backgroundColor: '#FFFFFF', color: '#414141', fontFamily: 'Arial' },
      h3: { backgroundColor: '#FFFFFF', color: '#414141' },
      h4: { backgroundColor: '#FFFFFF', color: '#414141' },
      h5: { backgroundColor: '#FFFFFF', color: '#414141' },
      h6: { backgroundColor: '#FFFFFF', color: '#414141' },
      quote: { backgroundColor: '#FFFFFF', color: '#414141' },
      codeBlock: { backgroundColor: '#FFFFFF', color: '#414141' },
    };
    expect(actual).toStrictEqual(expected);
  });

  it('Should fromTheme match expected', () => {
    const actual = CustomStyles.fromTheme({ customStyles: theme.customStyles }).toCustomStyles();
    const expected = {
      p: { fontFamily: 'Comic Sans MS' },
      h2: { fontFamily: 'Arial' },
    };
    expect(actual).toStrictEqual(expected);
  });

  it('Should overrideWith match expected', () => {
    const actual = CustomStyles.fromTheme({ customStyles: theme.customStyles })
      .overrideWith(
        CustomStyles.of({
          h2: { fontFamily: 'Helvetica', color: '#515145' },
          h5: { backgroundColor: 'azure' },
        })
      )
      .toCustomStyles();
    const expected = {
      p: { fontFamily: 'Comic Sans MS' },
      h2: { fontFamily: 'Helvetica', color: '#515145' },
      h5: { backgroundColor: 'azure' },
    };
    expect(actual).toStrictEqual(expected);
  });

  it('Should overrideWith match expected', () => {
    const actual = CustomStyles.fromTheme(theme)
      .overrideWith(
        CustomStyles.of({
          h2: { fontFamily: 'Helvetica', color: '#515145' },
          p: { backgroundColor: 'azure' },
        })
      )
      .toCustomStyles();
    const expected = {
      p: { backgroundColor: 'azure', color: '#414141', fontFamily: 'Comic Sans MS' },
      h1: { backgroundColor: '#FFFFFF', color: '#414141' },
      h2: { backgroundColor: '#FFFFFF', color: '#515145', fontFamily: 'Helvetica' },
      h3: { backgroundColor: '#FFFFFF', color: '#414141' },
      h4: { backgroundColor: '#FFFFFF', color: '#414141' },
      h5: { backgroundColor: '#FFFFFF', color: '#414141' },
      h6: { backgroundColor: '#FFFFFF', color: '#414141' },
      quote: { backgroundColor: '#FFFFFF', color: '#414141' },
      codeBlock: { backgroundColor: '#FFFFFF', color: '#414141' },
    };
    expect(actual).toStrictEqual(expected);
  });
});
