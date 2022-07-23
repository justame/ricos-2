import React from 'react';
import type { Node } from 'prosemirror-model';
import type { Content } from 'wix-rich-content-toolbars-v3';
import {
  FloatingToolbar,
  RicosTiptapToolbar,
  tiptapStaticToolbarConfig,
  linkToolbarItemConfig,
  FloatingAddPluginMenu,
} from 'wix-rich-content-toolbars-v3';
import type { ToolbarSettings } from 'ricos-common';
import {
  desktopTextButtonList,
  mobileTextButtonList,
} from '../toolbars/utils/defaultTextFormattingButtons';
import type { TextButtons, ToolbarSettingsFunctions } from 'wix-rich-content-common';
import { firstRight } from 'wix-rich-content-common';
import { TOOLBARS, mergeToolbarSettings, isiOS } from 'wix-rich-content-editor-common';
import type { RichContentAdapter } from 'wix-tiptap-editor';
import { getDefaultToolbarSettings } from 'wix-rich-content-editor';
import RicosPortal from '../modals/RicosPortal';
import type { Selection } from 'prosemirror-state';
import { ToolbarConfig } from './ricosToolbarConfig';
import type { GeneralContext } from 'ricos-context';
import { withEditorContext, withRicosContext, withPluginsContext } from 'ricos-context';
import { and } from 'ricos-content';
import { not } from 'fp-ts/Predicate';
import PluginsToolbar from '../toolbars/PluginToolbar';
import { FooterToolbar } from '../toolbars/FooterToolbar';
import type { IEditorPlugins, IToolbarItemConfigTiptap } from 'ricos-types';
import { isTextSelection } from '@tiptap/core';

type RicosToolbarProps = {
  content: Content<Node[]>;
  toolbarSettings?: ToolbarSettings;
  plugins?: IEditorPlugins;
};

type RicosToolbarState = {
  finalToolbarSettings?: ToolbarSettingsFunctions[];
};

class RicosToolbars extends React.Component<
  RicosToolbarProps & { ricosContext: GeneralContext; editor: RichContentAdapter },
  RicosToolbarState
> {
  state: Readonly<RicosToolbarState> = {
    finalToolbarSettings: undefined,
  };

  onSelectionUpdate = ({ editor }) => {
    const { content } = this.props;
    const getSelectedNodes = ({ editor }) => {
      const selection = editor.state.selection;
      const nodes: Node[] = [];
      editor.state.doc.nodesBetween(selection.from, selection.to, (node: Node) => {
        nodes.push(node);
      });

      return nodes;
    };
    const selectedNodes = getSelectedNodes({ editor });
    content.update(selectedNodes);
  };

  shouldRenderStaticFormattingToolbar() {
    const { toolbarSettings } = this.props;
    return !!toolbarSettings?.useStaticTextToolbar;
  }

  getToolbarConfig(finaltoolbarSettings: ToolbarSettingsFunctions[], toolbarType: TOOLBARS) {
    const toolbarConfig = finaltoolbarSettings.find(setting => setting.name === toolbarType);
    return toolbarConfig;
  }

  initToolbarSettings() {
    const { toolbarSettings, plugins } = this.props;
    if (toolbarSettings?.getToolbarSettings) {
      const textButtons: TextButtons = {
        mobile: mobileTextButtonList,
        desktop: desktopTextButtonList,
      };

      const pluginButtons = plugins
        ?.getAddButtons()
        .asArray()
        .map(b => b.toToolbarButtonSettings());

      const defaultSettings = getDefaultToolbarSettings({
        pluginButtons,
        // pluginButtonNames,
        textButtons,
        // pluginTextButtons: pluginTextButtonMap,
        // pluginButtonProps,
        // tablePluginMenu,
      });
      const customSettings = toolbarSettings.getToolbarSettings({
        textButtons,
      });

      const finalToolbarSettings = mergeToolbarSettings({ defaultSettings, customSettings });

      if (plugins) {
        const toolbarConfig = this.getToolbarConfig(finalToolbarSettings, TOOLBARS.SIDE);
        plugins.getAddButtons().registerPluginMenuModal(toolbarConfig?.addPluginMenuConfig);
      }
      this.setState({
        finalToolbarSettings,
      });
    }
  }

  componentDidMount() {
    const {
      editor: { tiptapEditor },
    } = this.props;

    tiptapEditor.on('selectionUpdate', this.onSelectionUpdate);
    tiptapEditor.on('update', this.onSelectionUpdate);

    this.initToolbarSettings();
  }

  componentWillUnmount() {
    const {
      editor: { tiptapEditor },
    } = this.props;
    tiptapEditor.off('selectionUpdate', this.onSelectionUpdate);
    tiptapEditor.off('update', this.onSelectionUpdate);
  }

  isSelectionCollapsed = (selection: Selection): boolean => {
    const { from, to } = selection;
    return to - from <= 0;
  };

  isLinkInCollapsedSelection = (selection: Selection, editor: RichContentAdapter): boolean => {
    const isCollapsed = this.isSelectionCollapsed(selection);
    const isLinkInSelection = editor.getEditorCommands().hasLinkInSelection();
    return isCollapsed && isLinkInSelection;
  };

  isFormattingToolbarVisible: (selection: Selection) => boolean = and([
    isTextSelection,
    not(this.isSelectionCollapsed),
  ]);

  isLinkToolbarVisible = (selection: Selection) =>
    this.isLinkInCollapsedSelection(selection, this.props.editor);

  floatingToolbarChildren = (
    dataHook: string,
    maxWidth: number,
    toolbarItemsConfig: IToolbarItemConfigTiptap[]
  ): JSX.Element => {
    return (
      <div toolbar-type="floating" data-hook={dataHook}>
        <div style={{ width: maxWidth, maxWidth: 'fit-content' }}>
          {this.renderToolbar(toolbarItemsConfig, { maxWidth })}
        </div>
      </div>
    );
  };

  getShouldCreate(
    isMobile: boolean,
    shouldCreateFn: ToolbarSettingsFunctions['shouldCreate']
  ): boolean {
    const config = shouldCreateFn?.() || { desktop: true, mobile: { ios: true, android: true } };
    const shouldCreate = true;
    return (
      firstRight(shouldCreate, true, [
        [() => !isMobile, () => config.desktop],
        [() => isMobile && isiOS(), () => config.mobile?.ios],
        [() => isMobile && !isiOS(), () => config.mobile?.android],
      ]) ?? true
    );
  }

  getTextToolbarButtonsConfig = plugins => {
    const textButtonsFromPlugins = plugins?.getTextButtons();

    return textButtonsFromPlugins
      ? [...tiptapStaticToolbarConfig, ...textButtonsFromPlugins]
      : tiptapStaticToolbarConfig;
  };

  renderFormattingToolbar(finaltoolbarSettings: ToolbarSettingsFunctions[]) {
    const {
      ricosContext,
      editor: { tiptapEditor },
      toolbarSettings,
      plugins,
    } = this.props;

    const toolbarButtonsConfig = this.getTextToolbarButtonsConfig(plugins);

    const toolbarType = TOOLBARS.INLINE;
    const toolbarConfig = this.getToolbarConfig(finaltoolbarSettings, toolbarType);
    const toolbarItemsConfig = ToolbarConfig.toTiptapToolbarItemsConfig(
      toolbarConfig,
      toolbarButtonsConfig,
      toolbarType,
      'desktop'
    );

    const shouldCreate = this.getShouldCreate(ricosContext.isMobile, toolbarConfig?.shouldCreate);

    if (!ricosContext.isMobile && shouldCreate && !toolbarSettings?.useStaticTextToolbar) {
      return (
        <FloatingToolbar
          editor={tiptapEditor}
          portal={ricosContext.portal}
          isVisible={this.isFormattingToolbarVisible}
        >
          {() =>
            this.floatingToolbarChildren(
              'floating-formatting-toolbar',
              tiptapEditor.view.dom.clientWidth,
              toolbarItemsConfig
            )
          }
        </FloatingToolbar>
      );
    } else {
      return null;
    }
  }

  renderLinkToolbar(finaltoolbarSettings: ToolbarSettingsFunctions[]) {
    const {
      ricosContext,
      editor: { tiptapEditor },
    } = this.props;

    const toolbarType = TOOLBARS.INLINE;
    const toolbarConfig = this.getToolbarConfig(finaltoolbarSettings, toolbarType);

    const shouldCreate = this.getShouldCreate(ricosContext.isMobile, toolbarConfig?.shouldCreate);

    if (shouldCreate) {
      return (
        <FloatingToolbar
          editor={tiptapEditor}
          portal={ricosContext.portal}
          isVisible={this.isLinkToolbarVisible}
        >
          {() =>
            this.floatingToolbarChildren(
              'linkPluginToolbar',
              tiptapEditor.view.dom.clientWidth,
              linkToolbarItemConfig
            )
          }
        </FloatingToolbar>
      );
    } else {
      return null;
    }
  }

  renderMobileToolbar(finaltoolbarSettings: ToolbarSettingsFunctions[]) {
    const { ricosContext, plugins } = this.props;

    const toolbarButtonsConfig = this.getTextToolbarButtonsConfig(plugins);

    const toolbarType = TOOLBARS.MOBILE;
    const toolbarConfig = this.getToolbarConfig(finaltoolbarSettings, toolbarType);
    const toolbarItemsConfig = ToolbarConfig.toTiptapToolbarItemsConfig(
      toolbarConfig,
      toolbarButtonsConfig,
      toolbarType,
      'mobile'
    );
    const shouldCreate = this.getShouldCreate(ricosContext.isMobile, toolbarConfig?.shouldCreate);

    if (ricosContext.isMobile && shouldCreate) {
      return (
        <div data-hook="mobileToolbar" dir={ricosContext.languageDir}>
          {this.renderToolbar(toolbarItemsConfig)}
        </div>
      );
    } else {
      return null;
    }
  }

  renderStaticToolbar(finaltoolbarSettings: ToolbarSettingsFunctions[]) {
    const { toolbarSettings, ricosContext, plugins } = this.props;
    const { isMobile } = ricosContext;

    const toolbarButtonsConfig = this.getTextToolbarButtonsConfig(plugins);

    const toolbarType = TOOLBARS.STATIC;
    const toolbarConfig = this.getToolbarConfig(finaltoolbarSettings, toolbarType);
    const htmlContainer = toolbarSettings?.textToolbarContainer;
    const toolbarItemsConfig = ToolbarConfig.toTiptapToolbarItemsConfig(
      toolbarConfig,
      toolbarButtonsConfig,
      toolbarType,
      'desktop'
    );
    const shouldCreate = this.getShouldCreate(isMobile, toolbarConfig?.shouldCreate);

    if (htmlContainer && shouldCreate) {
      return (
        <RicosPortal
          languageDir={ricosContext.languageDir}
          className={ricosContext.theme?.parentClass}
          container={htmlContainer}
        >
          <div toolbar-type="static">{this.renderToolbar(toolbarItemsConfig)}</div>
        </RicosPortal>
      );
    }
    if (toolbarSettings?.useStaticTextToolbar && shouldCreate) {
      return (
        <div toolbar-type="static" dir={ricosContext.languageDir}>
          {this.renderToolbar(toolbarItemsConfig)}
        </div>
      );
    }

    return null;
  }

  renderPluginsToolbar = (finaltoolbarSettings: ToolbarSettingsFunctions[]) => {
    const { content, ricosContext } = this.props;
    const toolbarType = TOOLBARS.PLUGIN;
    const toolbarConfig = this.getToolbarConfig(finaltoolbarSettings, toolbarType);
    const shouldCreateToolbar = this.getShouldCreate(
      ricosContext.isMobile,
      toolbarConfig?.shouldCreate
    );

    if (shouldCreateToolbar) {
      return <PluginsToolbar content={content} />;
    }
  };

  renderFooterToolbar = (finaltoolbarSettings: ToolbarSettingsFunctions[]) => {
    const { ricosContext } = this.props;
    const toolbarType = TOOLBARS.FOOTER;
    const toolbarConfig = this.getToolbarConfig(finaltoolbarSettings, toolbarType);

    const shouldCreate = this.getShouldCreate(ricosContext.isMobile, toolbarConfig?.shouldCreate);

    if (!ricosContext.isMobile && shouldCreate) {
      return <FooterToolbar />;
    }
  };

  renderFloatingPluginMenu = (finaltoolbarSettings: ToolbarSettingsFunctions[]) => {
    const {
      ricosContext: { isMobile },
      plugins,
    } = this.props;
    const toolbarType = TOOLBARS.SIDE;
    const toolbarConfig = this.getToolbarConfig(finaltoolbarSettings, toolbarType);

    const shouldCreate = this.getShouldCreate(isMobile, toolbarConfig?.shouldCreate);

    if (!isMobile && shouldCreate) {
      return (
        <FloatingAddPluginMenu
          addPluginMenuConfig={toolbarConfig?.addPluginMenuConfig || {}}
          plugins={plugins}
        />
      );
    }
  };

  renderToolbar(toolbarItemsConfig, options = {} as { maxWidth: number }) {
    const {
      content,
      editor: { tiptapEditor },
      ricosContext,
    } = this.props;
    const { maxWidth } = options;

    return (
      <RicosTiptapToolbar
        isMobile={ricosContext.isMobile}
        content={content}
        editorCommands={tiptapEditor}
        toolbarItemsConfig={toolbarItemsConfig}
        maxWidth={maxWidth}
      />
    );
  }

  render() {
    const { toolbarSettings } = this.props;
    if (!toolbarSettings?.getToolbarSettings) {
      console.error('RicosToolbars: getToolbarSettings is missing');
      return null;
    }
    const { finalToolbarSettings } = this.state;
    if (!finalToolbarSettings) {
      return null;
    }
    return (
      <>
        {this.renderStaticToolbar(finalToolbarSettings)}
        {this.renderMobileToolbar(finalToolbarSettings)}
        {this.renderFormattingToolbar(finalToolbarSettings)}
        {this.renderPluginsToolbar(finalToolbarSettings)}
        {this.renderFooterToolbar(finalToolbarSettings)}
        {this.renderFloatingPluginMenu(finalToolbarSettings)}
        {this.renderLinkToolbar(finalToolbarSettings)}
      </>
    );
  }
}
const RicosToolbarsWithContext = withRicosContext<RicosToolbarProps>(
  withEditorContext<RicosToolbarProps>(withPluginsContext(RicosToolbars))
);
export default RicosToolbarsWithContext;
