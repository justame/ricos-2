/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import AudioSettings from './AudioSettings';
import type { handleFileSelectionType, handleFileUploadType } from '../types';
import { AUDIO_TYPE } from '../types';
import { audioModals } from '../consts';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import { TIPTAP_AUDIO_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
  handleFileSelection: handleFileSelectionType;
  handleFileUpload: handleFileUploadType;
}

const AudioSettingsModal: FC<Props> = ({ nodeId, handleFileSelection, handleFileUpload }) => {
  const { theme, t, isMobile, experiments } = useContext(RicosContext);
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialData, setInitialData] = useState<Record<string, any>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [componentData, setComponentData] = useState<Record<string, any>>();

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

      const componentData = tiptapNodeDataToDraft(
        TIPTAP_AUDIO_TYPE,
        getEditorCommands().getBlockComponentData(nodeId)
      );
      setInitialData(componentData);
      setComponentData(componentData);
    });
  }, []);

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, AUDIO_TYPE, {
      ...converters.draftBlockDataToTiptap?.(AUDIO_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
    setComponentData({ ...componentData, ...data });
  };

  const closeModal = () => {
    modalService.closeModal(audioModals.settings);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  return componentData ? (
    <AudioSettings
      componentData={componentData}
      helpers={{}}
      experiments={experiments}
      theme={theme}
      t={t}
      isMobile={isMobile}
      updateData={updateData}
      onSave={closeModal}
      onCancel={onCancel}
      handleFileSelection={handleFileSelection}
      handleFileUpload={handleFileUpload}
      blockKey={nodeId}
    />
  ) : null;
};

export default AudioSettingsModal;
