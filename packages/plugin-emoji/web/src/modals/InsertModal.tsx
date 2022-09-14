import type { FC } from 'react';
import React, { useContext } from 'react';
import { ModalContext, RicosContext, EditorContext, PluginsEventsContext } from 'ricos-context';
import { EMOJI_TYPE } from 'wix-rich-content-common';
import EmojiPreviewModal from '../toolbar/emojiPreviewModal';
import { emojiModals } from '../types';

interface Props {}

const EmojiInsertModal: FC<Props> = () => {
  const { theme, t } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const pluginsEvents = useContext(PluginsEventsContext);
  const modalService = useContext(ModalContext) || {};

  const closeModal = () => {
    modalService?.closeModal(emojiModals.insert);
  };

  const onEmojiAdd = emoji => {
    getEditorCommands()?.insertText(emoji);
    pluginsEvents.publishPluginAddSuccess({ pluginId: EMOJI_TYPE, params: { emoji } });
    closeModal();
  };

  return <EmojiPreviewModal onAdd={onEmojiAdd} theme={theme} t={t} />;
};

export default EmojiInsertModal;
