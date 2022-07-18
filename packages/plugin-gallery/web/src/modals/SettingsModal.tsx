/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import GallerySettings from '../components/gallery-settings-modal';
import { GALLERY_TYPE } from '../types';
import { galleryModals } from '../consts';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import { TIPTAP_GALLERY_TYPE } from 'ricos-content';
import type { IUpdateService, IUploadService } from 'ricos-types';

interface Props {
  nodeId: string;
  handleFileSelection: (uploadService: IUploadService, updateService: IUpdateService) => void;
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
          TIPTAP_GALLERY_TYPE,
          getEditorCommands().getBlockComponentData(nodeId)
        )
      );
    });
  }, []);

  const componentData = converters.tiptapNodeDataToDraft?.(
    TIPTAP_GALLERY_TYPE,
    getEditorCommands().getBlockComponentData(nodeId)
  );

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, GALLERY_TYPE, {
      ...converters.draftBlockDataToTiptap?.(GALLERY_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
  };

  const closeModal = () => {
    modalService.closeModal(galleryModals.settings);
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
      handleFileSelection={handleFileSelection}
      handleFileUpload={handleFileUpload}
      shouldShowSpoiler
      activeTab={activeTab}
    />
  ) : null;
};

export default GallerySettingsModal;
