/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import { TIPTAP_LINK_PREVIEW_TYPE } from 'ricos-content';
import { LinkModal as LinkPreviewSettings } from 'wix-rich-content-editor-common';
import { LINK_PREVIEW_TYPE } from '../types';
import { linkPreviewModals } from '../consts';
import type { UISettings } from 'wix-rich-content-common';

interface Props {
  nodeId: string;
  uiSettings: UISettings;
}

const LinkPreviewSettingsModal: FC<Props> = ({ nodeId, uiSettings }) => {
  const { theme, t, isMobile } = useContext(RicosContext);
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
          TIPTAP_LINK_PREVIEW_TYPE,
          getEditorCommands().getBlockComponentData(nodeId)
        )
      );
    });
  }, []);
  const getComponentData = () =>
    converters.tiptapNodeDataToDraft?.(
      TIPTAP_LINK_PREVIEW_TYPE,
      getEditorCommands().getBlockComponentData(nodeId)
    );

  const componentData = getComponentData();

  const updateData = data => {
    getEditorCommands().setBlock(nodeId, LINK_PREVIEW_TYPE, {
      ...converters.draftBlockDataToTiptap?.(LINK_PREVIEW_TYPE, { ...componentData, ...data }),
      id: nodeId,
    });
  };

  const { url, target, rel } = componentData?.config?.link || {};

  const closeModal = () => {
    modalService.closeModal(linkPreviewModals.settings);
  };

  const onCancel = () => {
    updateData(initialData);
    closeModal();
  };
  const onDone = ({ url, target, rel }) => {
    const newComponentData = {
      ...componentData,
      config: { ...componentData.config, link: { url, target, rel } },
    };
    updateData(newComponentData);

    closeModal();
  };

  return componentData ? (
    <LinkPreviewSettings
      hideUrlInput
      tooltipText={t('LinkPreview_Settings_Tooltip')}
      helpers={{}}
      anchorTarget={target}
      //   triggerBi
      uiSettings={uiSettings}
      relValue={rel}
      t={t}
      theme={theme}
      onCancel={onCancel}
      onDone={onDone}
      linkTypes={{ anchor: true }}
      isMobile={isMobile}
      isActive
      url={url}
    />
  ) : null;
};

export default LinkPreviewSettingsModal;
