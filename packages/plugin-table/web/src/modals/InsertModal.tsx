import React, { useContext } from 'react';
import type { FC } from 'react';
import { tableModals, TABLE_TYPE } from '../types';
import { ModalContext, RicosContext, EditorContext } from 'ricos-context';
import TableSettingsModal from '../toolbar/tableSettingsModal';
import { getDefaultTable } from '../tiptap/defaults';
import { ROW_DEFAULT_HEIGHT, CELL_AUTO_MIN_WIDTH } from '../consts';

interface Props {
  componentData: Record<string, unknown>;
}

const TableInsertModal: FC<Props> = ({ componentData }) => {
  const { theme, t, isMobile } = useContext(RicosContext);
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);

  const closeModal = () => {
    modalService.closeModal(tableModals.insert);
  };

  const onTableAdd = table => {
    const rowNum = table.config.rowsHeight.length;
    const colNum = table.config.colsWidth.length;
    getEditorCommands().insertBlockWithBlankLines(TABLE_TYPE, {
      dimensions: {
        rowsHeight: Array(rowNum).fill(ROW_DEFAULT_HEIGHT),
        colsMinWidth: Array(colNum).fill(CELL_AUTO_MIN_WIDTH),
      },
      content: getDefaultTable(rowNum, colNum),
    });
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
