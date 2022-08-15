/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import GallerySettings from '../components/gallery-settings-modal';
import { GALLERY_TYPE } from '../types';
import { galleryModals } from '../consts';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import { TIPTAP_GALLERY_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
  handleFileSelection: (index?: number) => void;
  handleFileUpload: (files, updateEntity) => void;
  accept: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any;
  activeTab?: 'manage_media' | 'advanced_settings' | 'settings';
}

const GallerySettingsModal: FC<Props> = ({
  nodeId,
  handleFileSelection,
  handleFileUpload,
  activeTab = 'settings',
}) => {
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
        TIPTAP_GALLERY_TYPE,
        getEditorCommands().getBlockComponentData(nodeId)
      );
      setInitialData(componentData);
      setComponentData(componentData);
    });
  }, []);

  const addMedia = (index?: number) => {
    handleFileSelection(index);
    setTimeout(() => {
      const data = converters?.tiptapNodeDataToDraft?.(
        TIPTAP_GALLERY_TYPE,
        getEditorCommands().getBlockComponentData(nodeId)
      );
      if (data) {
        setComponentData(data);
      }
    }, 1000);
  };

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, GALLERY_TYPE, {
      ...converters.draftBlockDataToTiptap?.(GALLERY_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
    setComponentData({ ...componentData, ...data });
  };

  const closeModal = () => {
    modalService.closeModal(
      activeTab === 'manage_media' ? galleryModals.manageMedia : galleryModals.settings
    );
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  return componentData ? (
    <GallerySettings
      componentData={componentData}
      helpers={{}}
      experiments={experiments}
      theme={theme}
      t={t}
      isMobile={isMobile}
      updateData={updateData}
      onSave={closeModal}
      onCancel={onCancel}
      handleFileSelection={addMedia}
      handleFileUpload={handleFileUpload}
      shouldShowSpoiler
      activeTab={activeTab}
    />
  ) : null;
};

export default GallerySettingsModal;
