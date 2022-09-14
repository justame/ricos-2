import { EXTERNAL_LINK_TYPE, LINK_TYPE, CUSTOM_LINK_TYPE, ANCHOR_TYPE } from './types';
import LinkViewer from './LinkViewer';
import type { PluginTypeMapper } from 'wix-rich-content-common';

export const typeMapper: PluginTypeMapper = () => ({
  [EXTERNAL_LINK_TYPE]: { component: LinkViewer, elementType: 'inline' },
  [LINK_TYPE]: { component: LinkViewer, elementType: 'inline' },
  [ANCHOR_TYPE]: { component: LinkViewer, elementType: 'inline' },
  [CUSTOM_LINK_TYPE]: { component: LinkViewer, elementType: 'inline' },
});
