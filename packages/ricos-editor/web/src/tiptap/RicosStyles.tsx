import { isEqual, merge } from 'lodash';
import type { FC } from 'react';
import React, { useContext, useEffect, useRef } from 'react';
import type { RicosTheme } from 'ricos-common';
import type { DocumentStyle } from 'ricos-schema';
import { StylesContext } from 'ricos-context';
import { THEME_DEFAULTS } from './theme-defaults';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const RicosStylesRenderer: FC<{
  theme: RicosTheme;
  documentStyle: DocumentStyle;
  isMobile: boolean;
}> = props => {
  const prevTheme = usePrevious(props.theme);
  const prevDocumentStyle = usePrevious(props.documentStyle);
  const styles = useContext(StylesContext);
  let themeWithDefaults;
  if (props.isMobile) {
    themeWithDefaults = merge({}, THEME_DEFAULTS.mobile, props.theme);
  } else {
    themeWithDefaults = merge({}, THEME_DEFAULTS.desktop, props.theme);
  }

  styles.setTheme(themeWithDefaults).setDocumentStyle(props.documentStyle);

  useEffect(() => {
    if (!isEqual(prevTheme, props.theme)) {
      styles.setTheme(themeWithDefaults);
      console.log('theme update', themeWithDefaults); // eslint-disable-line no-console
    }
    if (!isEqual(prevDocumentStyle, props.documentStyle)) {
      styles.setDocumentStyle(props.documentStyle);
      console.log('doc style update', props.documentStyle); // eslint-disable-line no-console
    }
  });

  return <>{styles.toStyleTags().map((tag, i) => React.cloneElement(tag, { key: i }))}</>;
};

export default RicosStylesRenderer;
