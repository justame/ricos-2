/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext, EditorContext } from 'ricos-context';
import ImageSettings from '../toolbar/image-settings';
import { IMAGE_TYPE } from '../types';
import { imageModals } from '../consts';
import { TIPTAP_IMAGE_TYPE } from 'ricos-content';

interface Props {
  nodeId: string;
}

const ImageSettingsModal: FC<Props> = ({ nodeId }) => {
  const { theme, t, isMobile, languageDir, experiments } = useContext(RicosContext);
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
          TIPTAP_IMAGE_TYPE,
          getEditorCommands().getBlockComponentData(nodeId)
        )
      );
    });
  }, []);

  const componentData = converters.tiptapNodeDataToDraft?.(
    TIPTAP_IMAGE_TYPE,
    getEditorCommands().getBlockComponentData(nodeId)
  );

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, IMAGE_TYPE, {
      ...converters.draftBlockDataToTiptap?.(IMAGE_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
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
      shouldShowSpoiler
      onSave={closeModal}
      onCancel={onCancel}
    />
  ) : null;
};

export default ImageSettingsModal;
