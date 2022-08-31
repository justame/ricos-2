import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import type { RicosTheme } from 'ricos-common';
import type { DocumentStyle } from 'ricos-schema';
import { StylesContext } from 'ricos-context';
import { THEME_DEFAULTS } from './theme-defaults';
import { merge } from 'lodash';

const useForceUpdate = () => {
  const [_, setValue] = useState(0);
  return () => setValue(value => value + 1);
};

const RicosStylesRenderer: FC<{
  theme: RicosTheme;
  documentStyle: DocumentStyle;
  isMobile: boolean;
}> = props => {
  const styles = useContext(StylesContext);
  const forceUpdate = useForceUpdate();

  let themeWithDefaults;
  if (props.isMobile) {
    themeWithDefaults = merge({}, THEME_DEFAULTS.mobile, props.theme);
  } else {
    themeWithDefaults = merge({}, THEME_DEFAULTS.desktop, props.theme);
  }

  useEffect(() => {
    const documentStyleSubscription = styles.onDocumentStyleUpdate(forceUpdate);
    const themeSubscription = styles.onThemeUpdate(forceUpdate);
    styles.setTheme(themeWithDefaults).setDocumentStyle(props.documentStyle);
    console.log('theme update', themeWithDefaults); // eslint-disable-line no-console
    console.log('doc style update', props.documentStyle); // eslint-disable-line no-console

    return () => {
      documentStyleSubscription.cancel();
      themeSubscription.cancel();
    };
  }, []);

  return <>{styles.toStyleTags().map((tag, i) => React.cloneElement(tag, { key: i }))}</>;
};

export default RicosStylesRenderer;
