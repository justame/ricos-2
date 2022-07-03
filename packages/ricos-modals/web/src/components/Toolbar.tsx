import React from 'react';
import type { ReactNode } from 'react';
import type { Modal } from 'ricos-types';
import styles from '../../statics/styles/toolbar.scss';
import { Popper } from './Popper';

interface Props {
  children: ReactNode;
  modalConfig: Modal;
  closeModal: () => void;
}

export const Toolbar = ({ children, modalConfig, closeModal }: Props) => {
  return (
    <Popper className={styles.toolbar} modalConfig={modalConfig} closeModal={closeModal}>
      {children}
    </Popper>
  );
};
