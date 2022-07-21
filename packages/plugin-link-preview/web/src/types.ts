import type {
  EditorPluginConfig,
  ViewerPluginConfig,
  LinkPreviewData,
  UISettings,
} from 'wix-rich-content-common';
import type { LinkPreviewProviders } from './consts';

export const LINK_PREVIEW_TYPE = 'wix-draft-plugin-link-preview';

export interface LinkPreviewPluginEditorConfig extends EditorPluginConfig {
  alignment?: string;
  size?: string;
  link?: {
    target?: string;
    rel?: string;
  };
  fetchData?: (url: string) => Promise<LinkPreviewData>;
  enableEmbed?: boolean | LinkPreviewProviders[];
  exposeEmbedButtons?: LinkPreviewProviders[];
  enableLinkPreview?: boolean;
  linkPanelSettings?: UISettings['linkPanel'];
}
export interface LinkPreviewPluginViewerConfig extends ViewerPluginConfig {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
