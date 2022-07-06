import React, { useContext } from 'react';
import type { FC } from 'react';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import { ModalContext, RicosContext, EditorContext } from 'ricos-context';
import SocialEmbedInsertModal from '../toolbar/SocialEmbedInsertModal';
import { socialModals } from '../consts';
import { EMBED_TYPE } from 'wix-rich-content-common';

interface Props {
  fetchData: string;
  socialType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentData: Record<string, any>;
  nodeId?: string;
}

const InsertModal: FC<Props> = ({ componentData, fetchData, nodeId, socialType }) => {
  const { theme, t, isMobile, languageDir, experiments } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const closeModal = () => {
    modalService.closeModal(socialModals[socialType]);
  };

  const onConfirm = embedData => {
    const editorCommands = getEditorCommands();
    const data = convertBlockDataToRicos(EMBED_TYPE, embedData);
    if (nodeId) {
      editorCommands?.setBlock(nodeId, EMBED_TYPE, data);
    } else {
      editorCommands?.insertBlock(EMBED_TYPE, data);
    }
  };

  return (
    <SocialEmbedInsertModal
      componentData={componentData}
      theme={theme}
      t={t}
      isMobile={isMobile}
      languageDir={languageDir}
      onConfirm={onConfirm}
      closeModal={closeModal}
      fetchData={fetchData}
      socialType={socialType}
      experiments={experiments}
    />
  );
};

export default InsertModal;
