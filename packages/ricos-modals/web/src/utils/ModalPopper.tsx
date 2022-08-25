/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import ReactDOM from 'react-dom';
import { ModalContext, RicosContext, EditorContext } from 'ricos-context';
import { Popover } from '../components/Popover';
import { Drawer } from '../components/Drawer';
import { Fullscreen } from '../components/Fullscreen';
import { Dialog } from '../components/Dialog';
import { Toolbar } from '../components/Toolbar';
import type { Modal } from 'ricos-types';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import styles from '../../statics/styles/popper.scss';

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

const useForceUpdate = () => {
  const [_, setValue] = useState(0);
  return () => setValue(value => value + 1);
};

export const ModalPopper: FC<Props> = ({ modalConfig }: Props) => {
  const forceUpdate = useForceUpdate();
  const modalService = useContext(ModalContext) || {};
  const {
    adapter: { tiptapEditor },
  } = useContext(EditorContext);
  const { languageDir, portal } = useContext(RicosContext);

  useEffect(() => {
    tiptapEditor.on('update', forceUpdate);
  }, []);

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
    <div dir={languageDir} onKeyDown={onKeyDown} className={styles.container}>
      <ModalLayout closeModal={closeModal} modalConfig={modalConfig}>
        <ModalComponent {...(modalConfig.componentProps || {})} />
      </ModalLayout>
    </div>,
    portal
  );
};
