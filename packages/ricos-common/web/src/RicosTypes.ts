import type { EditorState, EditorProps as DraftEditorProps } from 'draft-js';
import type { PreviewConfig } from 'wix-rich-content-preview';
import type { RicosCssOverride } from './types';
import type { DRAFT_EDITOR_PROPS } from './consts';
import type { RichContentEditorProps } from 'wix-rich-content-editor';
import type { RichContentViewerProps } from 'wix-rich-content-viewer';
import type {
  CommonProps,
  DraftContent,
  EditorProps,
  LinkPreviewData,
  OnErrorFunction,
  SEOSettings,
  ViewerPlugin,
} from 'ricos-types';

export type RichContentProps = Partial<RichContentEditorProps | RichContentViewerProps>;

export interface RicosProps extends CommonProps {
  _rcProps?: RichContentProps; // For internal use by WixRicos only
  cssOverride?: RicosCssOverride;
}

export interface RicosEditorProps extends RicosProps, EditorProps {
  draftEditorSettings?: DraftEditorSettings;
  rceNext?: boolean;
}

// TODO: move Viewer public types to ricos-types
export interface RicosViewerProps extends RicosProps, Pick<RichContentViewerProps, 'addAnchors'> {
  /* Changes to this interface should also be reflected in the API docs */
  plugins?: ViewerPlugin[];
  preview?: PreviewConfig;
  seoSettings?: boolean | SEOSettings;
  textSelectionToolbar?: boolean;
  linkPreviewPopoverFetchData?: (url: string) => Promise<LinkPreviewData>;
  /* Changes to this interface should also be reflected in the API docs */
}

export interface ContentStateGetterArgs {
  shouldRemoveErrorBlocks?: boolean;
}

export type ContentStateGetter = (args?: ContentStateGetterArgs) => DraftContent;

export interface EditorDataInstance {
  getContentState: ContentStateGetter;
  getContentTraits: () => {
    isEmpty: boolean;
    isContentChanged: boolean;
    isLastChangeEdit: boolean;
  };
  getEditorState: () => EditorState;
  refresh: (editorState: EditorState, onError?: OnErrorFunction | undefined) => void;
  waitForUpdate: () => void;
  getContentStatePromise: () => Promise<DraftContent>;
}

// draft-js props - https://draftjs.org/docs/api-reference-editor
export type DraftEditorSettings = Pick<DraftEditorProps, typeof DRAFT_EDITOR_PROPS[number]>;
