import { isEqual } from 'lodash';
import type { FC } from 'react';
import React, { useContext, useEffect, useRef } from 'react';
import type { RicosTheme } from 'ricos-common';
import type { DocumentStyle } from 'ricos-content';
import { parseDocStyle } from 'ricos-content/libs/parse-doc-style';
import { StylesContext } from 'ricos-context';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const RicosStylesRenderer: FC<{ theme: RicosTheme; documentStyle: DocumentStyle }> = props => {
  const prevTheme = usePrevious(props.theme);
  const prevDocumentStyle = usePrevious(props.documentStyle);
  const styles = useContext(StylesContext);
  styles.setTheme(props.theme).setDocumentStyle(parseDocStyle(props.documentStyle) || {});

  useEffect(() => {
    if (!isEqual(prevTheme, props.theme)) {
      styles.setTheme(props.theme);
      console.log('theme update'); // eslint-disable-line no-console
    }
    if (!isEqual(prevDocumentStyle, props.documentStyle)) {
      const richContentDocStyle = parseDocStyle(props.documentStyle);
      styles.setDocumentStyle(richContentDocStyle || {});
      console.log('doc style update', richContentDocStyle, props.documentStyle); // eslint-disable-line no-console
    }
  });

  return <>{styles.toStyleTags().map((tag, i) => React.cloneElement(tag, { key: i }))}</>;
};

export default RicosStylesRenderer;
