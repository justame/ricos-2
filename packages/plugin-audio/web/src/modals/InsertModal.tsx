import React, { useContext } from 'react';
import type { FC } from 'react';
import { AUDIO_TYPE } from '../types';
import AudioInsertModal from './AudioInsertModal';
import {
  ModalContext,
  RicosContext,
  EditorContext,
  UploadContext,
  PluginsEventsContext,
} from 'ricos-context';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import { generateId } from 'ricos-content';
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentData: Record<string, any>;
  nodeId?: string;
  getAudioUrl: (src) => string;
  handleFileSelection: (updateEntity) => void;
  handleFileUpload: (files, updateEntity) => void;
  fetchData: (url: string) => Promise<unknown>;
  embedType: boolean;
  modalId: string;
}

const InsertModal: FC<Props> = ({
  nodeId,
  componentData,
  handleFileSelection,
  handleFileUpload,
  fetchData,
  embedType,
  modalId,
}) => {
  const { theme, t, isMobile, languageDir } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const pluginsEvents = useContext(PluginsEventsContext);
  const { uploadService, updateService } = useContext(UploadContext);
  const closeModal = () => {
    modalService.closeModal(modalId);
  };

  const addBlockWithFocus = insertBlock => setTimeout(() => insertBlock(), 50);

  const onConfirm = audio => {
    const data = convertBlockDataToRicos(AUDIO_TYPE, audio);
    const id = generateId();
    const insertAudio = () =>
      getEditorCommands().insertBlockWithBlankLines(AUDIO_TYPE, { ...data, id });
    addBlockWithFocus(insertAudio);
    return { newBlock: { key: id } };
  };

  const onReplace = audio => {
    const data = convertBlockDataToRicos(AUDIO_TYPE, audio);
    if (nodeId) {
      const insertAudio = () => getEditorCommands().setBlock(nodeId, AUDIO_TYPE, data);
      addBlockWithFocus(insertAudio);
    }
  };

  const pluginEvents = {
    onPluginsPopOverTabSwitch: data => pluginsEvents.publishPluginPopoverTabSwitch(data),
    onPluginsPopOverClick: data => pluginsEvents.publishPluginPopoverClick(data),
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
      helpers={pluginEvents}
      handleFileSelection={handleFileSelection}
      handleFileUpload={handleFileUpload}
      embedType={embedType}
      fetchData={fetchData}
    />
  );
};

export default InsertModal;
