/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import GallerySettings from '../components/gallery-settings-modal';
import { GALLERY_TYPE } from '../types';
import { galleryModals } from '../consts';
import { RicosContext, EditorContext, ModalContext, PluginsContext } from 'ricos-context';
import { TIPTAP_GALLERY_TYPE, SPOILER_TYPE } from 'ricos-content';

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

  const plugins = useContext(PluginsContext);
  const spoilerPlugin = plugins.asArray().find(plugin => plugin.getType() === SPOILER_TYPE);
  const shouldShowSpoiler =
    spoilerPlugin &&
    (!spoilerPlugin.getConfig().supportedPlugins ||
      spoilerPlugin.getConfig().supportedPlugins.includes(GALLERY_TYPE));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialData, setInitialData] = useState<Record<string, any>>();
  const [converters, setConverters] = useState<{
    tiptapNodeDataToDraft?: Function;
    draftBlockDataToTiptap?: Function;
  }>({});

  const componentData = converters.tiptapNodeDataToDraft?.(
    TIPTAP_GALLERY_TYPE,
    getEditorCommands().getBlockComponentData(nodeId)
  );

  useEffect(() => {
    import(
      /* webpackChunkName:"ricos-converters" */
      'ricos-converters'
    ).then(convertersModule => {
      const { draftBlockDataToTiptap, tiptapNodeDataToDraft } = convertersModule;
      setConverters({ tiptapNodeDataToDraft, draftBlockDataToTiptap });
      setInitialData(
        tiptapNodeDataToDraft(
          TIPTAP_GALLERY_TYPE,
          getEditorCommands().getBlockComponentData(nodeId)
        )
      );
    });
  }, []);

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, GALLERY_TYPE, {
      ...converters.draftBlockDataToTiptap?.(GALLERY_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
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
      handleFileSelection={handleFileSelection}
      handleFileUpload={handleFileUpload}
      shouldShowSpoiler={shouldShowSpoiler}
      activeTab={activeTab}
    />
  ) : null;
};

export default GallerySettingsModal;
