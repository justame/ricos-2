import type { FC } from 'react';
import React, { useContext } from 'react';
import { ModalContext, RicosContext, EditorContext } from 'ricos-context';
import EmojiPreviewModal from '../toolbar/emojiPreviewModal';
import { emojiModals } from '../types';

interface Props {}

const EmojiInsertModal: FC<Props> = () => {
  const { theme, t } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};

  const closeModal = () => {
    modalService?.closeModal(emojiModals.insert);
  };

  const onEmojiAdd = emoji => {
    getEditorCommands()?.insertText(emoji);
    closeModal();
  };

  return <EmojiPreviewModal onAdd={onEmojiAdd} theme={theme} t={t} />;
};

export default EmojiInsertModal;
