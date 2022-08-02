/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import CollapsibleListSettings from '../components/modal-components/CollapsibleListSettingsModal';
import { COLLAPSIBLE_LIST_TYPE } from '../types';
import { collapsibleModals } from '../consts';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import { TIPTAP_COLLAPSIBLE_LIST_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
}

const CollapsibleListSettingsModal: FC<Props> = ({ nodeId }) => {
  const { theme, t, isMobile, experiments, languageDir } = useContext(RicosContext);
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialData, setInitialData] = useState<Record<string, any>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [componentData, setComponentData] = useState<any>();
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
        TIPTAP_COLLAPSIBLE_LIST_TYPE,
        getEditorCommands().getBlockComponentData(nodeId)
      );
      setInitialData(componentData);
      setComponentData(componentData);
    });
  }, []);

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, COLLAPSIBLE_LIST_TYPE, {
      ...converters.draftBlockDataToTiptap?.(COLLAPSIBLE_LIST_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
    setComponentData({ ...componentData, ...data });
  };

  const closeModal = () => {
    modalService.closeModal(collapsibleModals.settings);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  return componentData ? (
    <CollapsibleListSettings
      componentData={componentData}
      experiments={experiments}
      theme={theme}
      t={t}
      isMobile={isMobile}
      updateData={updateData}
      onSave={closeModal}
      onCancel={onCancel}
      languageDir={languageDir}
    />
  ) : null;
};

export default CollapsibleListSettingsModal;
