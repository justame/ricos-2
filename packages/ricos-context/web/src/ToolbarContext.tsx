/* eslint-disable func-call-spacing */
import React, { useContext } from 'react';
import type {
  AvailableExperiments,
  Helpers,
  EditorCommands,
  EditorPlugin,
  LinkPanelSettings,
  RicosTheme,
  RicosPortal,
  AddLinkData,
  IRicosToolbars,
} from 'ricos-types';
import type { LinkSettings, ToolbarSettings, RicosCssOverride } from 'ricos-common';
import { RicosContext } from './RicosContext';

export type LinkPanelData = {
  linkTypes: { anchor: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLinkAdd: (customLinkData: any, saveData: (customLinkData: any) => void) => void;
  uiSettings: { linkPanel: LinkPanelSettings };
  linkSettings: LinkSettings | undefined;
  isMobile: boolean;
  onAddPluginLink: (data: AddLinkData) => void;
};

export type ToolbarContextType = {
  contentId: string;
  isMobile: boolean;
  theme: RicosTheme;
  locale: string;
  helpers: Helpers;
  plugins: EditorPlugin[];
  linkPanelData: LinkPanelData | undefined;
  linkSettings: LinkSettings;
  experiments: AvailableExperiments;
  toolbarSettings: ToolbarSettings;
  cssOverride: RicosCssOverride;
  getEditorCommands: () => EditorCommands;
  portal: RicosPortal;
  toolbars: IRicosToolbars;
  colorPickerData: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TEXT_COLOR: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TEXT_HIGHLIGHT: Record<string, any>;
  };
  defaultLineSpacing: { 'line-height'?: string; 'padding-top'?: string; 'padding-bottom'?: string };
};

export const ToolbarContext = React.createContext<ToolbarContextType>({
  contentId: '',
  isMobile: false,
  theme: {},
  locale: 'en',
  helpers: {},
  plugins: [],
  linkPanelData: undefined,
  linkSettings: {},
  experiments: {},
  toolbarSettings: {},
  cssOverride: {},
  getEditorCommands: () => ({} as EditorCommands),
  portal: null as unknown as RicosPortal,
  toolbars: null as unknown as IRicosToolbars,
  colorPickerData: {} as unknown as ToolbarContextType['colorPickerData'],
  defaultLineSpacing: {},
});

export const withToolbarContext = WrappedComponent => {
  return props => {
    const { t } = useContext(RicosContext);
    return (
      <ToolbarContext.Consumer>
        {contexts => <WrappedComponent {...props} context={{ ...contexts, t }} />}
      </ToolbarContext.Consumer>
    );
  };
};
