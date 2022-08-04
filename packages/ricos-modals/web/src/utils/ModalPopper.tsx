/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { ModalContext, RicosContext } from 'ricos-context';
import { Popover } from '../components/Popover';
import { Drawer } from '../components/Drawer';
import { Fullscreen } from '../components/Fullscreen';
import { Dialog } from '../components/Dialog';
import { Toolbar } from '../components/Toolbar';
import type { Modal } from 'ricos-types';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';

type Props = {
  modalConfig: Modal;
};

const layoutMapper = {
  popover: Popover,
  drawer: Drawer,
  fullscreen: Fullscreen,
  dialog: Dialog,
  toolbar: Toolbar,
};

export const ModalPopper = ({ modalConfig }: Props) => {
  const modalService = useContext(ModalContext) || {};
  const { languageDir, portal } = useContext(RicosContext);

  const closeModal = () => {
    modalService?.closeModal?.(modalConfig.id);
  };

  const onKeyDown = e => {
    if (e.keyCode === KEYS_CHARCODE.ESCAPE) {
      closeModal();
      e.stopPropagation();
    }
  };

  const ModalLayout = layoutMapper[modalConfig.layout];

  const ModalComponent = modalConfig.Component;

  return ReactDOM.createPortal(
    <div dir={languageDir} onKeyDown={onKeyDown}>
      <ModalLayout closeModal={closeModal} modalConfig={modalConfig}>
        <ModalComponent {...(modalConfig.componentProps || {})} />
      </ModalLayout>
    </div>,
    portal
  );
};
