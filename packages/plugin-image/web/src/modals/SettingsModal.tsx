/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext, EditorContext, PluginsContext } from 'ricos-context';
import ImageSettings from '../toolbar/image-settings';
import { IMAGE_TYPE } from '../types';
import { imageModals } from '../consts';
import { TIPTAP_IMAGE_TYPE, SPOILER_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
}

const ImageSettingsModal: FC<Props> = ({ nodeId }) => {
  const { theme, t, isMobile, languageDir, experiments } = useContext(RicosContext);

  const plugins = useContext(PluginsContext);
  const spoilerPlugin = plugins.asArray().find(plugin => plugin.getType() === SPOILER_TYPE);
  const shouldShowSpoiler =
    spoilerPlugin &&
    (!spoilerPlugin.getConfig().supportedPlugins ||
      spoilerPlugin.getConfig().supportedPlugins.includes(IMAGE_TYPE));

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
        TIPTAP_IMAGE_TYPE,
        getEditorCommands().getBlockComponentData(nodeId)
      );
      setInitialData(componentData);
      setComponentData(componentData);
    });
  }, []);

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, IMAGE_TYPE, {
      ...converters.draftBlockDataToTiptap?.(IMAGE_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
    setComponentData({ ...componentData, ...data });
  };

  const closeModal = () => {
    modalService.closeModal(imageModals.settings);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  return componentData ? (
    <ImageSettings
      componentData={componentData}
      helpers={{}}
      experiments={experiments}
      theme={theme}
      t={t}
      isMobile={isMobile}
      languageDir={languageDir}
      onCloseRequested={closeModal}
      updateData={updateData}
      shouldShowSpoiler={shouldShowSpoiler}
      onSave={closeModal}
      onCancel={onCancel}
    />
  ) : null;
};

export default ImageSettingsModal;
