import { merge } from 'lodash';
import { DEFAULTS } from './defaults';
import type { CreatePluginsDataMap, LINK_PREVIEW_TYPE } from 'wix-rich-content-common';
import { Node_Type } from 'wix-rich-content-common';
import { convertNodeDataToDraft } from 'ricos-content/libs/toDraftData';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createLinkPreviewData: CreatePluginsDataMap[typeof LINK_PREVIEW_TYPE] | any = (
  pluginData = {},
  isRicosSchema = false
) => {
  const linkPreviewData = isRicosSchema
    ? convertNodeDataToDraft(Node_Type.LINK_PREVIEW, pluginData)
    : pluginData;
  return merge({}, DEFAULTS, linkPreviewData);
};
