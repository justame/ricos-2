/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import type { ReactNode } from 'react';
import type { Modal } from 'ricos-types';
import styles from '../../statics/styles/drawer.scss';
import classNames from 'classnames';

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
      <div
        onClick={onModalClick}
        className={classNames(
          styles.content,
          placement && styles[placementClassNameMapper[placement]]
        )}
      >
        {children}
      </div>
    </div>
  );
};

const placementClassNameMapper = {
  right: 'drawerR',
  left: 'drawerL',
  top: 'drawerT',
  bottom: 'drawerB',
};
