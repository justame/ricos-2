import type {
  EditorPluginConfig,
  ViewerPluginConfig,
  Helpers,
  RichContentTheme,
  SEOSettings,
  CustomAnchorScroll,
} from 'wix-rich-content-common';

import type { AvailableExperiments } from 'ricos-types';

export const IMAGE_TYPE = 'wix-draft-plugin-image';
export const IMAGE_TYPE_LEGACY = 'IMAGE';

export type ImageEditorWixSettings = {
  initiator: string;
  siteToken: string;
  metaSiteId: string;
  mediaRoot: string;
};

export interface ImageConfig {
  size?: string;
  alignment?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  link?: {
    anchor: unknown;
    url: string;
  };
  width?: number;
  textWrap?: string;
  spoiler?: SpoilerConfig;
}

type SpoilerConfig = {
  buttonContent?: string | undefined;
  description?: string | undefined;
  enabled: boolean | undefined;
};

export interface ImagePluginEditorConfig extends EditorPluginConfig, ImageConfig {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  spoiler?: SpoilerConfig;
  defaultData?: {
    config?: ImageConfig;
    disableExpand?: boolean;
  };
  imageProps?: HTMLImageElement;
  createGalleryForMultipleImages?: boolean;
  imageEditor?: boolean;
  consumer?: string;
  imageEditorWixSettings?: ImageEditorWixSettings;
  onImageEditorOpen?: () => void;
}

type ImageSrc = Record<string, unknown>;
export interface ImagePluginViewerConfig extends ViewerPluginConfig, ImageConfig {
  onExpand?: (blockkey: string) => unknown;
  disableExpand?: boolean;
  imageProps?: ((src: ImageSrc) => HTMLImageElement) | HTMLImageElement;
}

export interface ImageData {
  config: ImageConfig;
  src: { fallback?: string; width: number; height: number; id?: string; file_name?: string };
  metadata?: { caption?: string; alt?: string | undefined };
  [key: string]: unknown;
  disableDownload?: boolean;
  disableExpand?: boolean;
}

export interface TiptapImageData {
  containerData: {
    alignment?: string;
    width?: { size?: string };
    textWrap?: boolean;
    spoiler?: SpoilerConfig;
  };
  link?;
  disableExpand?: boolean;
  disableDownload?: boolean;
  caption?: string;
  altText?: string;
  image: {
    src: {
      id?: string;
    };
    width: number;
    height: number;
  };
}

export type ExtendedBlob = Blob & {
  lastModified: number;
  name: string;
  webkitRelativePath: string;
};

export interface ImageViewerProps {
  componentData: ImageData;
  className?: string;
  dataUrl: string;
  settings: ImagePluginViewerConfig;
  defaultCaption: string;
  onCaptionChange: (caption: string) => void;
  setFocusToBlock: () => void;
  theme: RichContentTheme;
  helpers: Helpers;
  getInPluginEditingMode?: () => unknown;
  setInPluginEditingMode?: () => unknown;
  isMobile: boolean;
  setComponentUrl: (highres?: string) => unknown;
  seoMode?: SEOSettings;
  blockKey: string;
  isLoading: boolean;
  customAnchorScroll?: CustomAnchorScroll;
  experiments?: AvailableExperiments;
}
