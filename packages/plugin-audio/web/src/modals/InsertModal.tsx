import React, { useContext } from 'react';
import type { FC } from 'react';
import { AUDIO_TYPE } from '../types';
import { audioModals } from '../consts';
import AudioInsertModal from './AudioInsertModal';
import { ModalContext, RicosContext, EditorContext } from 'ricos-context';
import { UploadServiceContext } from 'wix-rich-content-common';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentData: Record<string, any>;
  nodeId?: string;
  getAudioUrl: (src) => string;
  handleFileSelection: (updateEntity) => void;
  handleFileUpload: (files, updateEntity) => void;
  fetchData: (url: string) => Promise<unknown>;
  embedType: boolean;
}

const InsertModal: FC<Props> = ({
  nodeId,
  componentData,
  handleFileSelection,
  handleFileUpload,
  fetchData,
  embedType,
}) => {
  const { theme, t, isMobile, languageDir } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const { uploadService, updateService } = useContext(UploadServiceContext);
  const closeModal = () => {
    modalService.closeModal(audioModals.insert);
  };

  const onConfirm = audio => {
    const data = convertBlockDataToRicos(AUDIO_TYPE, audio);
    const nodeId = getEditorCommands().insertBlock(AUDIO_TYPE, data);
    return { newBlock: { key: nodeId } };
  };

  const onReplace = audio => {
    const data = convertBlockDataToRicos(AUDIO_TYPE, audio);
    nodeId && getEditorCommands().setBlock(nodeId, AUDIO_TYPE, data);
  };

  return (
    <AudioInsertModal
      componentData={componentData}
      theme={theme}
      t={t}
      isMobile={isMobile}
      languageDir={languageDir}
      closeModal={closeModal}
      onReplace={onReplace}
      onConfirm={!nodeId ? onConfirm : undefined}
      uploadService={uploadService}
      updateService={updateService}
      helpers={{}}
      handleFileSelection={handleFileSelection}
      handleFileUpload={handleFileUpload}
      embedType={embedType}
      fetchData={fetchData}
    />
  );
};

export default InsertModal;
