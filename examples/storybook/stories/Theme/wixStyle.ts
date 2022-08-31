import { merge } from 'lodash';
import type { RicosTheme } from 'ricos-common';

type WithStyle = (theme?: RicosTheme) => RicosTheme;
const bmActionColor = '#116DFF';

export const withWixStyle: WithStyle = theme =>
  merge<RicosTheme, RicosTheme>(
    {
      palette: {
        actionColor: bmActionColor,
        bgColor: '#FFFFFF',
        textColor: '#000000',
      },
      paletteConfig: {
        focusActionColor: bmActionColor,
        settingsActionColor: bmActionColor,
      },
      settingsStyles: {
        buttons: {
          borderRadius: '18px',
          textColor: '#FFFFFF',
        },
        dividers: {
          color: '#DFE5EB',
          height: '12px',
        },
        icons: {
          color: '#333853',
        },
        inputs: {
          borderColor: '#A8CAFF',
          borderRadius: '6px',
          placeholderColor: '#868AA5',
        },
        text: {
          color: '#333853',
          fontFamily: 'Madefor',
        },
        whitebox: {
          borderRadius: '8px',
          boxShadow: '0 8px 8px 0 rgba(22, 45, 61, 0.12), 0 3px 24px 0 rgba(22, 45, 61, 0.18)',
        },
        colorPaletteSelectedButton: {
          borderRadius: '6px',
        },
        smallButtons: {
          borderRadius: '4px',
        },
        bgColor: {
          backgroundColor: '#D6E6FE',
        },
        disabled: {
          backgroundColor: '#0006244d',
        },
        hover: {
          color: '#33385380',
        },
      },
    },
    theme || {}
  );
