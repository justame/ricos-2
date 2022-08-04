import React from 'react';
import type { ReactNode } from 'react';
import type { Modal } from 'ricos-types';
import styles from '../../statics/styles/popover.scss';
import { Popper } from './Popper';
import { FocusManager } from 'wix-rich-content-ui-components';

interface Props {
  children: ReactNode;
  modalConfig: Modal;
  closeModal: () => void;
}

export const Popover = ({ children, modalConfig, closeModal }: Props) => {
  return (
    <FocusManager
      focusTrapOptions={{
        returnFocusOnDeactivate: false,
      }}
    >
      <Popper className={styles.popover} modalConfig={modalConfig} closeModal={closeModal}>
        {children}
      </Popper>
    </FocusManager>
  );
};
