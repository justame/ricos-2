import React from 'react';
import LinkModal from './LinkModal';
import { withToolbarContext } from 'ricos-context';
import { withContentQueryContext } from 'ricos-content-query';
import { getLinkModalProps } from '../utils/utils';
import { RICOS_LINK_TYPE, RICOS_ANCHOR_TYPE } from 'wix-rich-content-common';
import type { LinkData } from 'ricos-schema';
import type { EditorCommands } from 'wix-rich-content-common';
import type { DeepPartial } from 'utility-types';
import type { AddLinkData, TranslationFunction } from 'ricos-types';
import type { ToolbarContextType } from 'ricos-context';
import type { ContentQueryService } from 'ricos-content-query';

const onDone = (
  data: LinkData['link'] & { defaultName?: string },
  editorCommands: EditorCommands | void,
  closeModal: () => void
) => {
  if (!editorCommands) {
    console.error('No editor commands available');
  } else if (data?.url) {
    editorCommands.insertDecoration(RICOS_LINK_TYPE, data);
  } else if (data?.anchor) {
    editorCommands.insertDecoration(RICOS_ANCHOR_TYPE, data);
  }
  closeModal();
};

const onDelete = (
  editorCommands: EditorCommands | void,
  linkData: DeepPartial<AddLinkData & { customData?: string }>,
  closeModal: () => void
) => {
  if (!editorCommands) {
    console.error('No editor commands available');
  } else if (linkData?.url) {
    editorCommands.deleteDecoration(RICOS_LINK_TYPE);
  } else if (linkData?.anchor) {
    editorCommands.deleteDecoration(RICOS_ANCHOR_TYPE);
  }
  closeModal();
};

const LinkModalController = ({
  closeModal,
  context,
  contentQueryService,
}: {
  closeModal: () => void;
  context: ToolbarContextType & { t: TranslationFunction };
  contentQueryService: ContentQueryService;
}) => {
  const { isMobile, t, theme, getEditorCommands, linkPanelData, experiments } = context || {};

  const editorCommands = getEditorCommands();
  const { linkSettings = {}, ...rest } = linkPanelData || {};
  const { linkData, anchorableBlocks, linkSettingsData } = getLinkModalProps(
    editorCommands,
    linkSettings,
    contentQueryService,
    experiments
  );

  return (
    <LinkModal
      isMobile={isMobile}
      t={t}
      theme={theme}
      {...rest}
      {...linkSettingsData}
      {...linkData}
      anchorableBlocksData={anchorableBlocks}
      isActive={!!linkData.url || !!linkData.anchor}
      onDone={({ data }) => onDone(data, editorCommands, closeModal)}
      onCancel={closeModal}
      onDelete={() => onDelete(editorCommands, linkData, closeModal)}
    />
  );
};

export default withContentQueryContext(withToolbarContext(LinkModalController));
