import {
  convertRelStringToObject,
  convertRelObjectToString,
} from 'wix-rich-content-common/libs/linkConverters';
import { parseLink } from 'ricos-content/libs/nodeUtils';
import type { AddLinkData } from 'ricos-types';
import type { DeepPartial } from 'utility-types';
import { getAnchorableBlocksFromAnchorableNodes } from './anchorAdapter';
import { getAnchorableNodesQuery } from 'ricos-content-query/libs/getAnchorableNodesQuery';
import type { ContentQueryService } from 'ricos-content-query';

type LinkData = AddLinkData & { customData?: string };

const handleLinkSettings = linkSettings => {
  const { anchorTarget = '_blank', customAnchorScroll } = linkSettings;
  let { relValue, rel } = linkSettings;
  if (relValue) {
    console.warn(`relValue is deprecated, Please use rel prop instead.`);
    rel = convertRelStringToObject(relValue) || rel;
  }
  relValue = convertRelObjectToString(rel);
  return { relValue, anchorTarget, customAnchorScroll };
};

const getLinkFromRawData = rawLinkData => {
  let linkData: DeepPartial<LinkData> = { customData: rawLinkData?.customData };
  if (rawLinkData) {
    const { anchor, url } = rawLinkData;
    if (url) {
      const { url = '', rel = '', target = '_self' } = parseLink(rawLinkData);
      linkData = { ...linkData, url, rel, target };
    } else if (anchor) {
      linkData = { ...linkData, anchor };
    }
  }
  return linkData;
};

const getAnchorableBlocks = (
  experiments,
  contentQueryService: ContentQueryService,
  editorCommands
) => {
  if (experiments.tiptapEditor.enabled) {
    const contentExtractor = contentQueryService.getContentExtractor();
    if (contentExtractor) {
      const selectedNodeId = editorCommands.getSelection().startKey;
      const anchorableNodes = getAnchorableNodesQuery(contentExtractor, selectedNodeId);
      return getAnchorableBlocksFromAnchorableNodes(anchorableNodes);
    }
  } else {
    return editorCommands?.getAnchorableBlocks();
  }
};

export const getLinkModalProps = (
  editorCommands,
  linkSettings,
  contentQueryService: ContentQueryService,
  experiments
) => {
  const rawLinkData = editorCommands?.getLinkDataInSelection();
  const linkData = getLinkFromRawData(rawLinkData);

  const anchorableBlocks = getAnchorableBlocks(experiments, contentQueryService, editorCommands);

  const linkSettingsData = handleLinkSettings(linkSettings);

  return { linkData, anchorableBlocks, linkSettingsData };
};
