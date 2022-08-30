import React, { useContext } from 'react';
import type { FC } from 'react';
import { VIDEO_TYPE } from '../types';
import VideoInsertModal from '../toolbar/NewVideoInsertModal';
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
  modalId: string;
  nodeId?: string;
  enableCustomUploadOnMobile?: boolean;
  getVideoUrl: (src) => string;
  handleFileSelection: (updateEntity) => void;
  handleFileUpload: (files, updateEntity) => void;
}

const InsertModal: FC<Props> = ({
  nodeId,
  modalId,
  componentData,
  handleFileSelection,
  handleFileUpload,
  enableCustomUploadOnMobile,
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

  const onReplace = video => {
    const data = convertBlockDataToRicos(VIDEO_TYPE, video);
    const insertVideo = () => getEditorCommands().setBlock(nodeId as string, VIDEO_TYPE, data);
    addBlockWithFocus(insertVideo);
    return { newBlock: { key: nodeId } };
  };

  const onConfirm = video => {
    if (nodeId) {
      onReplace(video);
    } else {
      const id = generateId();
      const data = convertBlockDataToRicos(VIDEO_TYPE, video);
      const insertVideo = () =>
        getEditorCommands().insertBlockWithBlankLines(VIDEO_TYPE, { ...data, id });
      addBlockWithFocus(insertVideo);
      return { newBlock: { key: id } };
    }
  };

  const pluginEvents = {
    onPluginsPopOverTabSwitch: data => pluginsEvents.publishPluginPopoverTabSwitch(data),
    onPluginsPopOverClick: data => pluginsEvents.publishPluginPopoverClick(data),
  };

  return (
    <VideoInsertModal
      componentData={componentData}
      theme={theme}
      t={t}
      isMobile={isMobile}
      languageDir={languageDir}
      closeModal={closeModal}
      onReplace={onReplace}
      onConfirm={!nodeId && onConfirm}
      uploadService={uploadService}
      updateService={updateService}
      helpers={pluginEvents}
      handleFileSelection={handleFileSelection}
      handleFileUpload={handleFileUpload}
      enableCustomUploadOnMobile={enableCustomUploadOnMobile}
      blockKey={nodeId}
    />
  );
};

export default InsertModal;
