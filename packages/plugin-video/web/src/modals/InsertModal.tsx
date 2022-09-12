import React, { useContext, useState } from 'react';
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
  onVideoSelected: (url: string, updateEntity: (metadata: Record<string, unknown>) => void) => void;
}

const InsertModal: FC<Props> = ({
  nodeId,
  modalId,
  componentData,
  handleFileSelection,
  handleFileUpload,
  enableCustomUploadOnMobile,
  onVideoSelected,
}) => {
  const { theme, t, isMobile, languageDir, experiments } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const pluginsEvents = useContext(PluginsEventsContext);
  const { uploadService, updateService } = useContext(UploadContext);

  const [newNodeId, setNewNodeId] = useState(generateId());
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
      const id = newNodeId;
      const data = convertBlockDataToRicos(VIDEO_TYPE, video);
      const insertVideo = () =>
        getEditorCommands().insertBlockWithBlankLines(VIDEO_TYPE, { ...data, id });
      addBlockWithFocus(insertVideo);
      return { newBlock: { key: id } };
    }
  };

  const updateVideoMetadata = metadata => {
    getEditorCommands().updateBlock?.(newNodeId, VIDEO_TYPE, {
      thumbnail: {
        src: { url: metadata.thumbnail_url },
        width: metadata.thumbnail_width,
        height: metadata.thumbnail_height,
      },
    });
  };

  const pluginEvents = {
    onPluginsPopOverTabSwitch: data => pluginsEvents.publishPluginPopoverTabSwitch(data),
    onPluginsPopOverClick: data => pluginsEvents.publishPluginPopoverClick(data),
    onVideoSelected,
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
      updateVideoMetadata={updateVideoMetadata}
      experiments={experiments}
    />
  );
};

export default InsertModal;
