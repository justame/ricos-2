import type { FC } from 'react';
import React, { useEffect, useContext, useState } from 'react';
import type { Modal } from 'ricos-types';
import { ModalContext } from 'ricos-context';
import { ModalPopper } from './ModalPopper';

export const ModalRenderer: FC = () => {
  const [openModals, setOpenModals] = useState<Modal[]>([]);
  const modalService = useContext(ModalContext);
  const updateOpenModals = () => setOpenModals([...modalService.getOpenModals()]);

  useEffect(() => {
    const modalOpenedSubscription = modalService.onModalOpened(updateOpenModals);
    const modalClosedSubscription = modalService.onModalClosed(updateOpenModals);
    return () => {
      modalOpenedSubscription.cancel();
      modalClosedSubscription.cancel();
    };
  }, []);

  return (
    <>
      {openModals.map(modalConfig => {
        return <ModalPopper key={modalConfig.id} modalConfig={modalConfig} />;
      })}
    </>
  );
};
