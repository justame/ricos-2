/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import VideoSettings from '../toolbar/VideoSettings';
import { VIDEO_TYPE } from '../types';
import { videoModals } from '../constants';
import { RicosContext, EditorContext, ModalContext, PluginsContext } from 'ricos-context';
import { TIPTAP_VIDEO_TYPE, SPOILER_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
}

const VideoSettingsModal: FC<Props> = ({ nodeId }) => {
  const { theme, t, isMobile, experiments } = useContext(RicosContext);
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);

  const plugins = useContext(PluginsContext);
  const spoilerPlugin = plugins.asArray().find(plugin => plugin.getType() === SPOILER_TYPE);
  const shouldShowSpoiler =
    spoilerPlugin &&
    (!spoilerPlugin.getConfig().supportedPlugins ||
      spoilerPlugin.getConfig().supportedPlugins.includes(VIDEO_TYPE));

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
        TIPTAP_VIDEO_TYPE,
        getEditorCommands().getBlockComponentData(nodeId)
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      componentData && (componentData.isCustomVideo = (componentData.src as any).pathname);
      setInitialData(componentData);
      setComponentData(componentData);
    });
  }, []);

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, VIDEO_TYPE, {
      ...converters.draftBlockDataToTiptap?.(VIDEO_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
    setComponentData({ ...componentData, ...data });
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
      shouldShowSpoiler={shouldShowSpoiler}
    />
  ) : null;
};

export default VideoSettingsModal;
