import type { FC } from 'react';
import React, { useContext, useState } from 'react';
import type { Modal } from 'ricos-types';
import { ModalContext } from 'ricos-context';
import { ModalPopper } from './ModalPopper';

export const ModalRenderer: FC = () => {
  const [openModals, setOpenModals] = useState<Modal[]>([]);
  const modalService = useContext(ModalContext);
  const updateOpenModals = () => setOpenModals([...modalService.getOpenModals()]);
  modalService.onModalOpened(updateOpenModals);
  modalService.onModalClosed(updateOpenModals);

  return (
    <>
      {openModals.map(modalConfig => {
        return <ModalPopper key={modalConfig.id} modalConfig={modalConfig} />;
      })}
    </>
  );
};
