import React, { useState, useContext } from 'react';
import { withToolbarContext, ModalContext } from 'ricos-context';
import { getLinkModalProps } from 'wix-rich-content-toolbars-modals';
import { CUSTOM_LINK } from 'wix-rich-content-common';
import { withContentQueryContext } from 'ricos-content-query';
import { ToolbarButton } from '../ToolbarButton';

const LinkButton = ({ toolbarItem, context, contentQueryService, dataHook }) => {
  const { isMobile, t, getEditorCommands, linkPanelData = {}, experiments } = context || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);

  const editorCommands = getEditorCommands?.();
  const { onLinkAdd, linkSettings = {} } = linkPanelData;
  const { linkData } = getLinkModalProps(
    editorCommands,
    linkSettings,
    contentQueryService,
    experiments
  );

  const onClick = () => {
    const isCustomLinkHandling = !!onLinkAdd;
    if (isCustomLinkHandling) {
      const customLinkData = linkData?.customData;
      const callback = data => editorCommands.insertDecoration(CUSTOM_LINK, data);
      onLinkAdd(customLinkData, callback);
    } else {
      toolbarItem.commands?.click({ referenceElement });
    }
  };

  const tooltip = t(toolbarItem.presentation?.tooltip);
  const isActive = modalService.isModalOpen('formattingLinkModal') || toolbarItem.attributes.active;
  return (
    <ToolbarButton
      ref={setReferenceElement}
      disabled={toolbarItem.attributes.disabled}
      isMobile={isMobile}
      active={isActive}
      tooltip={tooltip}
      onClick={onClick}
      icon={toolbarItem.presentation?.icon}
      dataHook={dataHook}
    />
  );
};

export default withContentQueryContext(withToolbarContext(LinkButton));
