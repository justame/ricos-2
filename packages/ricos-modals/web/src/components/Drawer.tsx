/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import type { ReactNode } from 'react';
import type { Modal } from 'ricos-types';
import styles from '../../statics/styles/drawer.scss';
import classNames from 'classnames';
import { FocusManager } from 'wix-rich-content-ui-components';

interface Props {
  children: ReactNode;
  modalConfig: Modal;
  closeModal: () => void;
}

export const Drawer = ({ children, closeModal, modalConfig: { positioning } }: Props) => {
  const onModalClick = e => e.stopPropagation();
  const onOverlayClick = () => closeModal();
  const { placement } = positioning || {};

  return (
    <div onClick={onOverlayClick} className={styles.overlay}>
      <FocusManager
        focusTrapOptions={{
          returnFocusOnDeactivate: false,
        }}
      >
        <div
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          onClick={onModalClick}
          className={classNames(
            styles.content,
            placement && styles[placementClassNameMapper[placement]]
          )}
        >
          {children}
        </div>
      </FocusManager>
    </div>
  );
};

const placementClassNameMapper = {
  right: 'drawerR',
  left: 'drawerL',
  top: 'drawerT',
  bottom: 'drawerB',
};
