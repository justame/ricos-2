/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { SettingsModal as PollSettings } from '../settings';
import { POLL_TYPE } from '../../types';
import { pollModals } from '../../consts';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import { TIPTAP_POLL_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
  activeTab?: string;
}

const PollSettingsModal: FC<Props> = ({ nodeId, activeTab }) => {
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
        tiptapNodeDataToDraft?.(TIPTAP_POLL_TYPE, getEditorCommands().getBlockComponentData(nodeId))
      );
    });
  }, []);

  const componentData = converters.tiptapNodeDataToDraft?.(
    TIPTAP_POLL_TYPE,
    getEditorCommands().getBlockComponentData(nodeId)
  );

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, POLL_TYPE, {
      ...converters.draftBlockDataToTiptap?.(POLL_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
  };

  const closeModal = () => {
    modalService.closeModal(pollModals.settings);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  return componentData ? (
    <PollSettings
      componentData={componentData}
      activeTab={activeTab}
      helpers={{}}
      experiments={experiments}
      theme={theme}
      t={t}
      isMobile={isMobile}
      updateData={updateData}
      onSave={closeModal}
      onCancel={onCancel}
    />
  ) : null;
};

export default PollSettingsModal;
