import type { FC } from 'react';
import React, { useContext } from 'react';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import { ModalContext, RicosContext, EditorContext } from 'ricos-context';
import { POLL_TYPE } from '../../types';
import { pollModals } from '../../consts';
import { PollPresetSelector } from '../settings/preset-selector/PollPresetSelector.jsx';
import styles from '../../../statics/styles/poll.scss';

interface Props {
  componentData: Record<string, unknown>;
}

const PollsInsertModal: FC<Props> = ({ componentData }) => {
  const { theme, t, isMobile } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const addBlockWithFocus = insertBlock => setTimeout(() => insertBlock(), 50);

  const closeModal = () => {
    modalService.closeModal(pollModals.insert);
  };

  const onPollAdd = poll => {
    const editorCommands = getEditorCommands();
    const data = convertBlockDataToRicos(POLL_TYPE, poll);
    const insertPoll = () => editorCommands?.insertBlockWithBlankLines(POLL_TYPE, data);
    addBlockWithFocus(insertPoll);
    closeModal();
  };

  return (
    <div className={styles.insertModalWrapper}>
      <PollPresetSelector
        componentData={componentData}
        theme={theme}
        t={t}
        isMobile={isMobile}
        onPollAdd={onPollAdd}
        closeModal={closeModal}
      />
    </div>
  );
};

export default PollsInsertModal;
