/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import ReactDOM from 'react-dom';
import { ModalContext, RicosContext, EditorContext, ZIndexContext } from 'ricos-context';
import { Popover } from '../components/Popover';
import { Drawer } from '../components/Drawer';
import { Fullscreen } from '../components/Fullscreen';
import { Dialog } from '../components/Dialog';
import { Toolbar } from '../components/Toolbar';
import type { Layout, Modal } from 'ricos-types';
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
  const zIndexService = useContext(ZIndexContext);

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
  let zIndex = zIndexService.getZIndex('NOTIFICATION');

  const { layout }: { layout: Layout } = modalConfig;
  switch (layout) {
    case 'popover':
      zIndex = zIndexService.getZIndex('POPUP');
      break;
    case 'drawer':
      zIndex = zIndexService.getZIndex('DRAWER');
      break;
    case 'dialog':
      zIndex = zIndexService.getZIndex('DIALOG');
      break;
    case 'toolbar':
      zIndex = zIndexService.getZIndex('TOOLBAR');
      break;
    case 'fullscreen':
      zIndex = zIndexService.getZIndex('DIALOG');
      break;

    default:
      zIndex = 1;
      break;
  }
  return ReactDOM.createPortal(
    <div
      data-hook="modal-popper"
      dir={languageDir}
      onKeyDown={onKeyDown}
      className={styles.container}
      style={{ zIndex }}
    >
      <ModalLayout closeModal={closeModal} modalConfig={modalConfig}>
        <ModalComponent {...(modalConfig.componentProps || {})} />
      </ModalLayout>
    </div>,
    portal
  );
};
