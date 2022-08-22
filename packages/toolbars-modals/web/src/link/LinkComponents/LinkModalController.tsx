import React from 'react';
import LinkModal from './LinkModal';
import { withToolbarContext } from 'ricos-context';
import { withContentQueryContext } from 'ricos-content-query';
import { getLinkModalProps } from '../utils/utils';
import {
  RICOS_LINK_TYPE,
  RICOS_ANCHOR_TYPE,
  convertRelObjectToString,
  convertRelStringToObject,
} from 'wix-rich-content-common';
import type { EditorCommands } from 'wix-rich-content-common';
import type { DeepPartial } from 'utility-types';
import type { AddLinkData, TranslationFunction } from 'ricos-types';
import type { ToolbarContextType } from 'ricos-context';
import type { ContentQueryService } from 'ricos-content-query';
import { createLink } from 'ricos-content/libs/nodeUtils';

type LinkDataFromPanel = {
  isValid?: boolean;
  rel?: string;
  sponsored?: boolean;
  target?: string;
  url?: string;
  anchor?: string;
  defaultName?: string;
};

const onDone = (
  data: LinkDataFromPanel,
  editorCommands: EditorCommands | void,
  closeModal: () => void
) => {
  if (!editorCommands) {
    console.error('No editor commands available');
  } else if (data?.url) {
    const { rel, target, url } = data;
    const relValue = convertRelObjectToString(convertRelStringToObject(rel));
    const link = createLink({ url, rel: relValue, target });
    editorCommands.insertDecoration(RICOS_LINK_TYPE, link);
  } else if (data?.anchor) {
    const anchorData = { anchor: data.anchor, defaultName: data.defaultName };
    editorCommands.insertDecoration(RICOS_ANCHOR_TYPE, anchorData);
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
