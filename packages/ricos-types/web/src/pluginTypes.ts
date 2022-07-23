// TODO: refactor this file
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CompositeDecorator,
  ContentBlock,
  DraftDecorator,
  DraftEditorCommand,
  EditorProps,
} from 'draft-js';
import type { ComponentType, ReactElement } from 'react';
import type {
  ACTION_BUTTON_TYPE,
  AUDIO_TYPE,
  CODE_BLOCK_TYPE,
  COLLAPSIBLE_LIST_TYPE,
  DIVIDER_TYPE,
  DraftContent,
  EMOJI_TYPE,
  EXTERNAL,
  EXTERNAL_LINK_TYPE,
  EXTERNAL_MENTIONS_TYPE,
  FILE_UPLOAD_TYPE,
  GALLERY_TYPE,
  GIPHY_TYPE,
  HASHTAG_TYPE,
  HEADERS_MARKDOWN_TYPE,
  HEADINGS_DROPDOWN_TYPE,
  HTML_TYPE,
  IMAGE_TYPE,
  IMAGE_TYPE_LEGACY,
  INDENT_TYPE,
  LINE_SPACING_TYPE,
  LINK_BUTTON_TYPE,
  LINK_PREVIEW_TYPE,
  LINK_TYPE,
  MAP_TYPE,
  MENTION_TYPE,
  POLL_TYPE,
  PREVIEW,
  RICOS_COLLAPSIBLE_LIST_TYPE,
  RICOS_DIVIDER_TYPE,
  RICOS_FILE_TYPE,
  RICOS_GALLERY_TYPE,
  RICOS_GIPHY_TYPE,
  RICOS_HTML_TYPE,
  RICOS_IMAGE_TYPE,
  RICOS_LINK_TYPE,
  RICOS_MAP_TYPE,
  RICOS_MENTION_TYPE,
  RICOS_POLL_TYPE,
  RICOS_VIDEO_TYPE,
  SPOILER_TYPE,
  TABLE_TYPE,
  TEXT_COLOR_TYPE,
  TEXT_HIGHLIGHT_TYPE,
  UNDO_REDO_TYPE,
  UNSUPPORTED_BLOCKS_TYPE,
  VERTICAL_EMBED_TYPE,
  VIDEO_TYPE,
  VIDEO_TYPE_LEGACY,
} from 'ricos-content';
import type {
  AudioData,
  ButtonData,
  CollapsibleListData,
  DividerData,
  FileData,
  GalleryData,
  GIFData,
  HTMLData,
  ImageData,
  LinkPreviewData,
  MapData,
  MentionData as MentionPluginData,
  PollData,
  VideoData,
} from 'ricos-schema';
import { Decoration_Type, LinkData, Node_Type } from 'ricos-schema';
import type {
  ClassNameStrategy,
  ContainerClassNameStrategy,
  EditorContextType,
  GetEditorState,
  GetToolbarSettings,
  PluginButton,
  Pubsub,
  RichContentTheme,
  SetEditorState,
  TextButtonMapper,
  ThemeData,
  ThemeGeneratorFunction,
  ToolbarButtonProps,
} from '.';
import type { EditorCommands } from './editorCommandsType';
import type { ModalConfig } from './modalTypes';
import type { ToolbarType } from './toolbarEnums';
import type { FormattingToolbarButtonConfig, IToolbarItem } from './toolbarTypes';
import type { IUpdateService, IUploadService } from './uploadServicesTypes';

export { Node_Type, Decoration_Type, LinkData };

export type CreatePluginData<PluginData> = (
  pluginData?: PluginData,
  isRicosSchema?: boolean
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
Record<string, any>;

export type MentionData = { mention: MentionPluginData; trigger: string };

export interface CreatePluginsDataMap {
  [RICOS_DIVIDER_TYPE]?: CreatePluginData<DividerData>;
  [DIVIDER_TYPE]?: CreatePluginData<DividerData>;
  [RICOS_GIPHY_TYPE]?: CreatePluginData<GIFData>;
  [GIPHY_TYPE]?: CreatePluginData<GIFData>;
  [RICOS_HTML_TYPE]?: CreatePluginData<HTMLData>;
  [HTML_TYPE]?: CreatePluginData<HTMLData>;
  [RICOS_GALLERY_TYPE]?: CreatePluginData<GalleryData>;
  [GALLERY_TYPE]?: CreatePluginData<GalleryData>;
  [RICOS_POLL_TYPE]?: CreatePluginData<PollData>;
  [POLL_TYPE]?: CreatePluginData<PollData>;
  [RICOS_VIDEO_TYPE]?: CreatePluginData<VideoData>;
  [VIDEO_TYPE]?: CreatePluginData<VideoData>;
  [AUDIO_TYPE]?: CreatePluginData<AudioData>;
  [RICOS_FILE_TYPE]?: CreatePluginData<FileData>;
  [FILE_UPLOAD_TYPE]?: CreatePluginData<FileData>;
  [RICOS_IMAGE_TYPE]?: CreatePluginData<ImageData>;
  [IMAGE_TYPE]?: CreatePluginData<ImageData>;
  [RICOS_LINK_TYPE]?: CreatePluginData<LinkData>;
  [LINK_TYPE]?: CreatePluginData<LinkData>;
  [RICOS_MENTION_TYPE]?: CreatePluginData<MentionData>;
  [MENTION_TYPE]?: CreatePluginData<MentionData>;
  [EXTERNAL]?: CreatePluginData<Record<string, any>>;
  [LINK_BUTTON_TYPE]?: CreatePluginData<ButtonData>;
  [ACTION_BUTTON_TYPE]?: CreatePluginData<ButtonData>;
  [RICOS_MAP_TYPE]?: CreatePluginData<MapData>;
  [RICOS_COLLAPSIBLE_LIST_TYPE]?: CreatePluginData<CollapsibleListData>;
  [LINK_PREVIEW_TYPE]?: CreatePluginData<LinkPreviewData>;
}

import type { EditorPlugin as DraftEditorPlugin, PluginFunctions } from 'draft-js-plugins-editor';
import type { KeyboardShortcut } from './shortcuts';

export type PluginMapping = Partial<{
  [type: string]: {
    component: ComponentType;
    classNameStrategies?: {
      size?: ClassNameStrategy;
      alignment?: ClassNameStrategy;
      textWrap?: ClassNameStrategy;
      container?: ContainerClassNameStrategy;
    };
    elementType?: 'inline' | 'block';
  };
}>;

export type PluginTypeMapper = (...args) => PluginMapping;

export type PluginType =
  | typeof LINK_BUTTON_TYPE
  | typeof ACTION_BUTTON_TYPE
  | typeof CODE_BLOCK_TYPE
  | typeof DIVIDER_TYPE
  | typeof EMOJI_TYPE
  | typeof FILE_UPLOAD_TYPE
  | typeof GALLERY_TYPE
  | typeof GIPHY_TYPE
  | typeof HASHTAG_TYPE
  | typeof HEADERS_MARKDOWN_TYPE
  | typeof HTML_TYPE
  | typeof IMAGE_TYPE
  | typeof IMAGE_TYPE_LEGACY
  | typeof INDENT_TYPE
  | typeof LINE_SPACING_TYPE
  | typeof HEADINGS_DROPDOWN_TYPE
  | typeof SPOILER_TYPE
  | typeof EXTERNAL_LINK_TYPE
  | typeof LINK_TYPE
  | typeof LINK_PREVIEW_TYPE
  | typeof MAP_TYPE
  | typeof EXTERNAL_MENTIONS_TYPE
  | typeof MENTION_TYPE
  | typeof TEXT_COLOR_TYPE
  | typeof TEXT_HIGHLIGHT_TYPE
  | typeof UNDO_REDO_TYPE
  | typeof VERTICAL_EMBED_TYPE
  | typeof VIDEO_TYPE
  | typeof AUDIO_TYPE
  | typeof VIDEO_TYPE_LEGACY
  | typeof POLL_TYPE
  | typeof COLLAPSIBLE_LIST_TYPE
  | typeof TABLE_TYPE
  | typeof UNSUPPORTED_BLOCKS_TYPE;

export type BlockRendererFn = (
  contentBlock: ContentBlock,
  {
    getEditorState,
    setEditorState,
  }: { getEditorState: GetEditorState; setEditorState: SetEditorState }
) => {
  component?: ComponentType;
  editable: boolean;
  props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: () => any;
    setData: (newData) => void;
    deleteBlock: () => void;
  };
} | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CreatePluginFunction<PluginConfig extends EditorPluginConfig = Record<string, any>> = {
  (config: CreatePluginConfig<PluginConfig>): {
    InlinePluginToolbar?: ComponentType;
    Toolbar?: ComponentType;
    InsertPluginButtons: Pick<PluginButton, 'buttonSettings' | 'component'>[];
    externalizedButtonProps?: ToolbarButtonProps[];
    blockType: string;
    InlineModals?: ComponentType[];
    TextButtonMapper?: TextButtonMapper;
    pubsub: Pubsub;
    customStyleFn?: EditorProps['customStyleFn'];
    decoratorTrigger?: string;
    blockRendererFn: BlockRendererFn;
    underlyingPlugin?: {
      handleKeyCommand: EditorProps['handleKeyCommand'];
      keyBindingFn: EditorProps['keyBindingFn'];
    };
  };
  functionName?: string;
};

export type ModalsMap = Record<string, ComponentType>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RicosDecorator = (theme: RichContentTheme, config: Record<string, unknown>) => any;

interface BasePluginConfig {
  type: string;
  theme?: ThemeGeneratorFunction;
}

export type MenuGroups = 'basic' | 'advanced' | 'embed' | 'embed_wix';

type MenuConfig = {
  group?: MenuGroups;
  tags?: string;
};

export type AddButton = {
  id: string;
  icon: ComponentType;
  command: (
    editorCommands: EditorCommands,
    uploadService?: IUploadService,
    updateService?: IUpdateService
  ) => boolean;
  tooltip: string;
  toolbars: ToolbarType[];
  dataHook: string;
  label?: string;
  modal?: ModalConfig;
  menuConfig?: MenuConfig;
  shortcuts?: KeyboardShortcut[];
};

export type Resolver = Record<string, (content) => boolean | string>;

export type ToolbarButton = {
  id: string;
  type?: 'toggle' | 'modal' | 'separator';
  renderer?: (toolbarItem: IToolbarItem) => ReactElement;
  modal?: ModalConfig;
  icon?: ComponentType;
  tooltip?: string;
  dataHook?: string;
  command?: (args: Record<string, any>) => void;
  attributes?: Record<string, { id: string; resolve: (content) => any }>;
};

export interface EditorPlugin<PluginConfig extends EditorPluginConfig = Record<string, any>>
  extends BasePluginConfig {
  config: PluginConfig;
  createPlugin?: CreatePluginFunction<PluginConfig>;
  ModalsMap?: ModalsMap;
  createPluginData?: CreatePluginData<PluginConfig>;
  addButtons?: AddButton[];
  textButtons?: FormattingToolbarButtonConfig[];
  toolbar?: {
    buttons: ToolbarButton[];
    isVisible?: (selection) => boolean;
  };
  reconfigure?: (config: PluginConfig) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ViewerPlugin<PluginConfig = Record<string, any>> extends BasePluginConfig {
  config: PluginConfig;
  typeMapper?: PluginTypeMapper;
  inlineStyleMapper?: InlineStyleMapperFunction;
  decorator?: RicosDecorator;
}

export type EditorPluginCreator<PluginConfig> = (
  config?: PluginConfig
) => EditorPlugin<PluginConfig>;

export type ViewerPluginCreator<PluginConfig> = (
  config?: PluginConfig
) => ViewerPlugin<PluginConfig>;

export interface EditorPluginConfig {
  toolbar?: {
    hidden?: string[];
    icons?: {
      [key: string]: (props) => JSX.Element;
    };
  };
  getIsVisiblePromise?: (...args) => Promise<boolean>;
  innerRCEPlugins?: CreatePluginFunction[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ViewerPluginConfig {}

export type LegacyEditorPluginConfig<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PluginConfig extends EditorPluginConfig = Record<string, any>
> = Partial<{
  [key in PluginType]: PluginConfig;
}> & {
  uiSettings?: UISettings;
  getToolbarSettings?: GetToolbarSettings;
  themeData?: ThemeData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LegacyViewerPluginConfig<PluginConfig = Record<string, any>> = Partial<{
  [key in PluginType]: PluginConfig;
}> & {
  uiSettings?: UISettings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [PREVIEW]?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type PluginsDecorator = (component: ComponentType) => ComponentType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CreatePluginConfig<PluginConfig extends EditorPluginConfig = Record<string, any>>
  extends EditorContextType,
    LegacyEditorPluginConfig<PluginConfig> {
  decorator: PluginsDecorator;
  commonPubsub: Pubsub;
  pluginDefaults: Record<string, unknown>;
  spoilerWrapper?: (component: ComponentType) => ComponentType;
  supportedBlockTypes: string[];
}

export interface LinkPanelSettings {
  blankTargetToggleVisibilityFn?: () => boolean;
  nofollowRelToggleVisibilityFn?: () => boolean;
  showNewTabCheckbox?: boolean;
  showNoFollowCheckbox?: boolean;
  showSponsoredCheckbox?: boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dropDown?: any;
  externalPopups?: boolean;
}

export type UISettings = {
  linkPanel?: LinkPanelSettings;
  disableRightClick?: boolean;
  disableDownload?: boolean;
};

export interface UnderlyingPlugin
  extends Pick<
    DraftEditorPlugin,
    'handleKeyCommand' | 'onChange' | 'handleReturn' | 'handleBeforeInput'
  > {
  decorators?: Decorator[];
  keyBindingFn?(
    e: KeyboardEvent,
    pluginFunctions: PluginFunctions
  ): DraftEditorCommand | 'remove-link-preview' | null;
}

export type Decorator = DraftDecorator | CompositeDecorator;

export type InlineStyleMapper = Record<string, (children, { key }) => JSX.Element>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InlineStyleMapperFunction<PluginConfig = Record<string, any>> = (
  config: LegacyViewerPluginConfig<PluginConfig>,
  raw: DraftContent
) => () => InlineStyleMapper;
