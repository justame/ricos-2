import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { isSSR } from 'wix-rich-content-common';
import type { TextDirection } from 'ricos-types';
import classNames from 'classnames';
import styles from '../../statics/styles/ricos-portal.scss';

interface Props {
  className?: string;
  container?: HTMLElement;
  children?: ReactNode;
  languageDir?: TextDirection;
  zIndex?: number;
}

const RicosPortal = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div
      dir={props?.languageDir}
      ref={ref}
      data-hook="ricos-portal"
      className={classNames(props?.className, styles.container)}
    >
      {props?.children}
    </div>
  );
});

export default forwardRef<HTMLDivElement, Props>((props, ref) => {
  if (!isSSR()) {
    const container = props?.container ?? document?.body;
    return ReactDOM.createPortal(<RicosPortal {...props} ref={ref} />, container);
  }
  return <RicosPortal {...props} ref={ref} />;
});
