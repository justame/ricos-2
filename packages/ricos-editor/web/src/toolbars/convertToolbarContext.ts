import { ToolbarType } from 'wix-rich-content-common';
import type { AddLinkData } from 'wix-rich-content-common';
import { getBiFunctions } from './utils/biUtils';

const getLinkPanelData = ({
  helpers,
  contentId,
  plugins,
  linkPanelSettings,
  linkSettings,
  isMobile,
}) => {
  const biFunctions = helpers && getBiFunctions(helpers, contentId);

  const onAddPluginLink = (data: AddLinkData) => {
    biFunctions?.onAddPluginLink?.(data, 'TEXT');
  };

  const linkConfig = plugins.getConfig('LINK');

  const linkPanelData = {
    linkTypes: linkConfig?.linkTypes,
    onLinkAdd: linkConfig?.onLinkAdd,
    uiSettings: { linkPanel: linkPanelSettings },
    linkSettings,
    isMobile,
    onAddPluginLink,
  };

  return linkPanelData;
};

export const convertToolbarContext = ({
  contentId = '',
  isMobile,
  theme,
  locale,
  helpers,
  plugins,
  linkPanelSettings,
  linkSettings,
  experiments,
  toolbarSettings,
  cssOverride,
  getEditorCommands,
  editorQuery = {},
}) => {
  const { useStaticTextToolbar } = toolbarSettings || {};
  const textToolbarType = isMobile
    ? ToolbarType.MOBILE
    : useStaticTextToolbar
    ? ToolbarType.STATIC
    : ToolbarType.INLINE;

  const defaultLineSpacing = plugins.getConfig('line-spacing')?.defaultSpacing;

  const headingsData = {
    ...plugins.getConfig('wix-rich-content-plugin-headings'),
  };

  const colorPickerData = {
    TEXT_COLOR: plugins.getConfig('wix-rich-content-text-color'),
    TEXT_HIGHLIGHT: plugins.getConfig('wix-rich-content-text-highlight'),
  };

  const linkPanelData = getLinkPanelData({
    helpers,
    contentId,
    plugins,
    linkPanelSettings,
    linkSettings,
    isMobile,
  });

  const toolbarsContextData = {
    theme,
    isMobile,
    linkPanelData,
    colorPickerData,
    headingsData,
    experiments,
    defaultLineSpacing,
    cssOverride,
    textToolbarType,
    toolbarSettings,
    locale,
    getEditorCommands,
    editorQuery,
  };
  return toolbarsContextData;
};
