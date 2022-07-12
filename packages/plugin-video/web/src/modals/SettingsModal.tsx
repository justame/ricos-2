/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import VideoSettings from '../toolbar/VideoSettings';
import { VIDEO_TYPE } from '../types';
import { videoModals } from '../constants';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import { TIPTAP_VIDEO_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
}

const VideoSettingsModal: FC<Props> = ({ nodeId }) => {
  const { theme, t, isMobile, experiments } = useContext(RicosContext);
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialData, setInitialData] = useState<Record<string, any>>();
  const [converters, setConverters] = useState<{
    tiptapNodeDataToDraft?: Function;
    draftBlockDataToTiptap?: Function;
  }>({});

  useEffect(() => {
    import(
      /* webpackChunkName:"ricos-converters" */
      'ricos-converters'
    ).then(convertersModule => {
      const { draftBlockDataToTiptap, tiptapNodeDataToDraft } = convertersModule;
      setConverters({ tiptapNodeDataToDraft, draftBlockDataToTiptap });
      setInitialData(
        tiptapNodeDataToDraft?.(
          TIPTAP_VIDEO_TYPE,
          getEditorCommands().getBlockComponentData(nodeId)
        )
      );
    });
  }, []);

  const componentData = converters.tiptapNodeDataToDraft?.(
    TIPTAP_VIDEO_TYPE,
    getEditorCommands().getBlockComponentData(nodeId)
  );

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, VIDEO_TYPE, {
      ...converters.draftBlockDataToTiptap?.(VIDEO_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
  };

  const closeModal = () => {
    modalService.closeModal(videoModals.settings);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  return componentData ? (
    <VideoSettings
      componentData={componentData}
      helpers={{}}
      experiments={experiments}
      theme={theme}
      t={t}
      isMobile={isMobile}
      updateData={updateData}
      onSave={closeModal}
      onCancel={onCancel}
      shouldShowSpoiler
    />
  ) : null;
};

export default VideoSettingsModal;
