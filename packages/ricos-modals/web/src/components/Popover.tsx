import React from 'react';
import type { ReactNode } from 'react';
import type { Modal } from 'ricos-types';
import styles from '../../statics/styles/popover.scss';
import { Popper } from './Popper';

interface Props {
  children: ReactNode;
  modalConfig: Modal;
  closeModal: () => void;
}

export const Popover = ({ children, modalConfig, closeModal }: Props) => {
  return (
    <Popper className={styles.popover} modalConfig={modalConfig} closeModal={closeModal}>
      {children}
    </Popper>
  );
};
