// reference for values is in consts.scss in common package
import type { RicosCustomStyles } from 'ricos-types';

const defaultThemeValues = { fontWeight: 'normal', fontStyle: 'normal', lineHeight: '1.5' };

export const THEME_DEFAULTS: {
  desktop: { customStyles: RicosCustomStyles };
  mobile: { customStyles: RicosCustomStyles };
} = {
  desktop: {
    customStyles: {
      p: {
        ...defaultThemeValues,
        fontSize: '16px',
      },
      h1: {
        ...defaultThemeValues,
        fontSize: '80px',
      },
      h2: {
        ...defaultThemeValues,
        fontSize: '28px',
      },
      h3: {
        ...defaultThemeValues,
        fontSize: '24px',
      },
      h4: {
        ...defaultThemeValues,
        fontSize: '20px',
      },
      h5: {
        ...defaultThemeValues,
        fontSize: '18px',
      },
      h6: {
        ...defaultThemeValues,
        fontSize: '16px',
      },
    },
  },
  mobile: {
    customStyles: {
      p: {
        ...defaultThemeValues,
        fontSize: '16px',
      },
      h1: {
        ...defaultThemeValues,
        fontSize: '32px',
      },
      h2: {
        ...defaultThemeValues,
        fontSize: '24px',
      },
      h3: {
        ...defaultThemeValues,
        fontSize: '20px',
      },
      h4: {
        ...defaultThemeValues,
        fontSize: '20px',
      },
      h5: {
        ...defaultThemeValues,
        fontSize: '16px',
      },
      h6: {
        ...defaultThemeValues,
        fontSize: '14px',
      },
    },
  },
};
