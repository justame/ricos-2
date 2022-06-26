import React, { useContext } from 'react';
import type { FC } from 'react';
import { tableModals } from '../types';
import { ModalContext, RicosContext } from 'ricos-context';
import TableSettingsModal from '../toolbar/tableSettingsModal';

interface Props {
  componentData: Record<string, unknown>;
}

const TableInsertModal: FC<Props> = ({ componentData }) => {
  const { theme, t, isMobile } = useContext(RicosContext);
  const modalService = useContext(ModalContext) || {};

  const closeModal = () => {
    modalService.closeModal(tableModals.insert);
  };

  const onTableAdd = table => {
    closeModal();
  };

  return (
    <TableSettingsModal
      componentData={componentData}
      theme={theme}
      t={t}
      isMobile={isMobile}
      onTableAdd={onTableAdd}
      onCloseRequested={closeModal}
    />
  );
};

export default TableInsertModal;
