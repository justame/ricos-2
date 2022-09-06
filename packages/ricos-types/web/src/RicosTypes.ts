import type { ReactElement, FC } from 'react';
import type { DraftContent } from 'ricos-content';
import type { OnErrorFunction } from './editorTypes';
import type {
  AnchorTarget,
  AvailableExperiments,
  CustomAnchorScroll,
  Link_Rel,
  onAtomicBlockFocus,
  RelValue,
  TextAlignment,
} from './commonTypes';
import type { EditorPlugin, LinkPanelSettings } from './pluginTypes';
import type { GetToolbarSettings } from './toolbarSettingsTypes';
import type { CommandDescriptor } from './commands';
import type { RicosTheme } from './themeTypes';

export interface CommonProps {
  children?: ReactElement;
  content?: DraftContent;
  isMobile?: boolean;
  linkSettings?: LinkSettings;
  locale?: string;
  localeContent?: string;
  mediaSettings?: MediaSettings;
  onError?: OnErrorFunction;
  theme?: RicosTheme;
  textAlignment?: TextAlignment;
  onAtomicBlockFocus?: onAtomicBlockFocus;
  experiments?: AvailableExperiments;
  iframeSandboxDomain?: string;
  textWrap?: boolean;
}

interface EditorEvents {
  subscribe: (
    event: string,
    callback: () => Promise<{ type: string; data: unknown }>
  ) => (event: string, callback: () => Promise<{ type: string; data: unknown }>) => void;
  unsubscribe: (event: string, callback: () => Promise<{ type: string; data: unknown }>) => void;
  dispatch: (event: string) => Promise<unknown>;
  publish: () => Promise<DraftContent>;
}

export interface EditorProps extends CommonProps {
  plugins?: EditorPlugin[];
  linkPanelSettings?: LinkPanelSettings;
  modalSettings?: ModalSettings;
  onChange?: OnContentChangeFunction;
  placeholder?: string;
  toolbarSettings?: ToolbarSettings;
  onBusyChange?: OnBusyChangeFunction;
  injectedContent?: DraftContent;
  maxTextLength?: number;
  editorEvents?: EditorEvents;
  sideBlockComponent?: FC<{ id: string }>;
  commands?: CommandDescriptor<unknown>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad?: (editor: any) => void;
  container?: HTMLElement | (() => HTMLElement | null);
}

export type OnContentChangeFunction = (content: DraftContent) => void;

export type OnBusyChangeFunction = (isBusy: boolean) => void;

export interface ModalSettings {
  openModal?: (data: Record<string, unknown>) => void;
  closeModal?: () => void;
  ariaHiddenId?: string;
  container?: HTMLElement;
  onModalOpen?: (data: Record<string, unknown>) => void;
  onModalClose?: () => void;
}

export interface ToolbarSettings {
  getToolbarSettings?: GetToolbarSettings;
  textToolbarContainer?: HTMLElement;
  useStaticTextToolbar?: boolean | { disabled: boolean };
}

export type FullscreenProps = { backgroundColor?: string; foregroundColor?: string };

export interface MediaSettings {
  pauseMedia?: boolean;
  disableRightClick?: boolean;
  disableDownload?: boolean;
  fullscreenProps?: FullscreenProps;
}

export interface LinkSettings {
  anchorTarget?: AnchorTarget;
  relValue?: RelValue;
  rel?: Link_Rel;
  customAnchorScroll?: CustomAnchorScroll;
}

export type RicosPortal = HTMLDivElement;
