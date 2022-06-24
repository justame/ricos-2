/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { ModalContext } from 'ricos-modals';
import ButtonSettings from '../toolbar/buttonInputModal';
import type { LINK_BUTTON_TYPE, ACTION_BUTTON_TYPE, ButtonPluginEditorConfig } from '../types';
import { buttonsModals } from '../constants';
import { RicosContext, EditorContext } from 'ricos-context';
import { Node_Type } from 'wix-rich-content-common';

interface Props {
  nodeId: string;
  settings: ButtonPluginEditorConfig;
  type: typeof LINK_BUTTON_TYPE | typeof ACTION_BUTTON_TYPE;
}

const ButtonSettingsModal: FC<Props> = ({ nodeId, settings, type }) => {
  const { theme, t, isMobile, languageDir, experiments } = useContext(RicosContext);
  const { modalService } = useContext(ModalContext) || {};
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
        tiptapNodeDataToDraft?.(Node_Type.BUTTON, getEditorCommands().getBlockComponentData(nodeId))
      );
    });
  }, []);

  const componentData = converters.tiptapNodeDataToDraft?.(
    Node_Type.BUTTON,
    getEditorCommands().getBlockComponentData(nodeId)
  );

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, type, {
      ...converters.draftBlockDataToTiptap?.(type, { ...componentData, ...data }),
      id: nodeId,
    });
  };

  const closeModal = () => {
    modalService.closeModal(buttonsModals.settings);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };

  return componentData ? (
    <ButtonSettings
      componentData={componentData}
      helpers={{}}
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
