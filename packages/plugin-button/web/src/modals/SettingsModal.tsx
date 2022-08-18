/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext, EditorContext, PluginsEventsContext } from 'ricos-context';
import ButtonSettings from '../toolbar/buttonInputModal';
import type { LINK_BUTTON_TYPE, ACTION_BUTTON_TYPE, ButtonPluginEditorConfig } from '../types';
import { Node_Type } from 'wix-rich-content-common';

interface Props {
  nodeId: string;
  modalId: string;
  settings: ButtonPluginEditorConfig;
  type: typeof LINK_BUTTON_TYPE | typeof ACTION_BUTTON_TYPE;
}

const ButtonSettingsModal: FC<Props> = ({ nodeId, settings, type, modalId }) => {
  const { theme, t, isMobile, languageDir, experiments } = useContext(RicosContext);
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);
  const pluginsEvents = useContext(PluginsEventsContext);

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
        Node_Type.BUTTON,
        getEditorCommands().getBlockComponentData(nodeId)
      );
      setInitialData(componentData);
      setComponentData(componentData);
    });
  }, []);

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, type, {
      ...converters.draftBlockDataToTiptap?.(type, { ...componentData, ...data }),
      id: nodeId,
    });
    setComponentData({ ...componentData, ...data });
  };

  const closeModal = () => {
    modalService.closeModal(modalId);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  const pluginEvents = {
    onPluginAction: (_, { plugin_id, params }) =>
      pluginsEvents.publishPluginLinkable({ pluginId: plugin_id, ...params }),
  };

  return componentData ? (
    <ButtonSettings
      componentData={componentData}
      helpers={pluginEvents}
      experiments={experiments}
      theme={theme}
      t={t}
      settings={settings}
      isMobile={isMobile}
      languageDir={languageDir}
      onCloseRequested={closeModal}
      updateData={updateData}
      shouldShowSpoiler
      onSave={closeModal}
      onCancel={onCancel}
    />
  ) : null;
};

export default ButtonSettingsModal;
