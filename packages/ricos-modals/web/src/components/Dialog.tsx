/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import type { ReactNode } from 'react';
import styles from '../../statics/styles/drawer.scss';
import classNames from 'classnames';
import { FocusManager } from 'wix-rich-content-ui-components';

interface Props {
  children: ReactNode;
  closeModal: () => void;
}

export const Dialog = ({ children, closeModal }: Props) => {
  const onModalClick = e => e.stopPropagation();
  const onOverlayClick = () => closeModal();

  return (
    <FocusManager
      focusTrapOptions={{
        returnFocusOnDeactivate: false,
      }}
    >
      <div onClick={onOverlayClick} className={styles.overlay} tabIndex={0}>
        <div onClick={onModalClick} className={classNames(styles.content, styles.dialog)}>
          {children}
        </div>
      </div>
    </FocusManager>
  );
};
