import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { decorateComponentWithProps } from 'wix-rich-content-editor-common';
import {
  withToolbarContext,
  ModalContext,
  RicosContext,
  PluginsEventsContext,
} from 'ricos-context';
import { withContentQueryContext } from 'ricos-content-query';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { LinkModal, getLinkModalProps } from 'wix-rich-content-toolbars-modals';
import type { IToolbarItem } from 'ricos-types';
import type { ContentQueryService } from 'ricos-content-query';
import { convertRelObjectToString } from 'wix-rich-content-common';

type Props = {
  toolbarItem: IToolbarItem;
  contentQueryService: ContentQueryService;
  context;
  dataHook?: string;
};

const LINK_MODAL_ID = 'linkModal';

const NodeLinkButton: FC<Props> = ({ toolbarItem, context, contentQueryService, dataHook }) => {
  const { isMobile, t, theme, experiments } = useContext(RicosContext);
  const { getEditorCommands, linkPanelData } = context || {};
  const modalService = useContext(ModalContext);
  const pluginsEvents = useContext(PluginsEventsContext);

  const [referenceElement, setReferenceElement] = useState();

  useEffect(() => {
    !modalService.getModal(LINK_MODAL_ID) &&
      modalService.register({
        Component: decorateComponentWithProps(LinkModal, { isMobile, t, theme }),
        id: LINK_MODAL_ID,
      });
  }, []);

  const editorCommands = getEditorCommands?.();
  const { anchorableBlocks, linkSettingsData } = getLinkModalProps(
    editorCommands,
    linkPanelData.linkSettings || {},
    contentQueryService,
    experiments
  );

  const linkData = toolbarItem.attributes.linkData || {};

  const onDelete = () => {
    if (linkData.url) {
      toolbarItem.commands?.removeLink();
    } else if (linkData.anchor) {
      toolbarItem.commands?.removeAnchor();
    }
    modalService.closeModal(LINK_MODAL_ID);
  };

  const onDone = ({ data }) => {
    pluginsEvents.publishPluginLinkable({
      pluginId: toolbarItem.attributes.selectedNode.type.name,
      link: data?.url,
      newTab: data.target === '_blank',
      nofollow: data.rel,
    });

    if (data.url) {
      toolbarItem.commands?.insertLink(data);
    } else if (data.anchor) {
      toolbarItem.commands?.insertAnchor(data);
    }
    modalService.closeModal(LINK_MODAL_ID);
  };

  const onClick = () => {
    const isModalOpen = modalService.isModalOpen(LINK_MODAL_ID);
    const rel = convertRelObjectToString(linkData.rel);
    isModalOpen
      ? modalService.closeModal(LINK_MODAL_ID)
      : modalService.openModal(LINK_MODAL_ID, {
          componentProps: {
            onDelete,
            onCancel: () => modalService.closeModal(LINK_MODAL_ID),
            onDone,
            isActive: !!linkData.url || !!linkData.anchor,
            anchorableBlocksData: anchorableBlocks,
            ...linkSettingsData,
            ...linkData,
            ...linkPanelData,
            rel,
            relValue: rel,
            target: linkData.target && `_${linkData.target.toLowerCase()}`,
          },
          positioning: { placement: 'bottom', referenceElement },
          layout: isMobile ? 'drawer' : 'popover',
        });
  };
  return (
    <ToggleButton
      active={toolbarItem.attributes.active}
      Icon={toolbarItem.presentation?.icon}
      tooltip={t(toolbarItem.presentation?.tooltip)}
      onClick={onClick}
      dataHook={dataHook}
      setRef={setReferenceElement}
    />
  );
};

export default withContentQueryContext(withToolbarContext(NodeLinkButton));
