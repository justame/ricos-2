// reference for values is in consts.scss in common package
import type { RicosTheme } from 'ricos-types';

const defaultCustomStyle = { fontWeight: 'normal', fontStyle: 'normal', lineHeight: '1.5' };
const defaultPalette = { bgColor: '#ffffff', textColor: '#000000' };

export const THEME_DEFAULTS: {
  desktop: RicosTheme;
  mobile: RicosTheme;
} = {
  desktop: {
    customStyles: {
      p: {
        ...defaultCustomStyle,
        fontSize: '16px',
      },
      h1: {
        ...defaultCustomStyle,
        fontSize: '80px',
      },
      h2: {
        ...defaultCustomStyle,
        fontSize: '28px',
      },
      h3: {
        ...defaultCustomStyle,
        fontSize: '24px',
      },
      h4: {
        ...defaultCustomStyle,
        fontSize: '20px',
      },
      h5: {
        ...defaultCustomStyle,
        fontSize: '18px',
      },
      h6: {
        ...defaultCustomStyle,
        fontSize: '16px',
      },
    },
    palette: defaultPalette,
  },
  mobile: {
    customStyles: {
      p: {
        ...defaultCustomStyle,
        fontSize: '16px',
      },
      h1: {
        ...defaultCustomStyle,
        fontSize: '32px',
      },
      h2: {
        ...defaultCustomStyle,
        fontSize: '24px',
      },
      h3: {
        ...defaultCustomStyle,
        fontSize: '20px',
      },
      h4: {
        ...defaultCustomStyle,
        fontSize: '20px',
      },
      h5: {
        ...defaultCustomStyle,
        fontSize: '16px',
      },
      h6: {
        ...defaultCustomStyle,
        fontSize: '14px',
      },
    },
    palette: defaultPalette,
  },
};
