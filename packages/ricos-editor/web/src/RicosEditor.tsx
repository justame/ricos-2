/* eslint-disable brace-style */
import type { ContentState, EditorState } from 'draft-js';
import { isEqual } from 'lodash';
import type { ElementType, FunctionComponent } from 'react';
import React, { Component, forwardRef, Fragment, Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
  getBiCallback as getCallback,
  localeStrategy,
  RicosEngine,
  shouldRenderChild,
} from 'ricos-common';
import type { DraftContent } from 'ricos-content';
import { getLangDir, GlobalContext, ToolbarType, Version } from 'wix-rich-content-common';
import type { RichContentEditorProps } from 'wix-rich-content-editor';
import { RichContentEditor } from 'wix-rich-content-editor';
import { getEditorContentSummary } from 'wix-rich-content-editor-common';
import {
  EditorEvents,
  EditorEventsContext,
} from 'wix-rich-content-editor-common/libs/EditorEventsContext';
import {
  convertFromRaw,
  convertToRaw,
  createWithContent,
} from 'wix-rich-content-editor/libs/editorStateConversion';
import type { EditorDataInstance, RicosEditorProps } from '.';
import editorCss from '../statics/styles/styles.scss';
import { DraftEditorStateTranslator } from './content-conversion/draft-editor-state-translator';
import { EditorCommandRunner } from './content-modification/command-runner';
import { coreCommands } from './content-modification/commands/core-commands';
import { DraftEditablesRepository } from './content-modification/services/draft-editables-repository';
import RicosModal from './modals/RicosModal';
import type { RicosEditorRef } from './RicosEditorRef';
import { convertToolbarContext } from './toolbars/convertToolbarContext';
import type { TextFormattingToolbarType } from './toolbars/TextFormattingToolbar';
import { getBiFunctions } from './toolbars/utils/biUtils';
import { createEditorStyleClasses } from './utils/createEditorStyleClasses';
import { createDataConverter, filterDraftEditorSettings } from './utils/editorUtils';
import { hasActiveUploads } from './utils/hasActiveUploads';
import { renderSideBlockComponent } from './utils/renderBlockComponent';
// eslint-disable-next-line
export const PUBLISH_DEPRECATION_WARNING_v9 = `Please provide the postId via RicosEditor biSettings prop and use editorEvents.publish() APIs for publishing.
The getContent(postId, isPublishing) API is deprecated and will be removed in ricos v9.0.0`;
const LinkToolbar = React.lazy(() => import('./toolbars/LinkToolbar'));
interface State {
  StaticToolbar?: ElementType;
  localeData: { locale?: string; localeResource?: Record<string, string> };
  remountKey: boolean;
  editorState?: EditorState;
  activeEditor: RichContentEditor | null;
  error?: string;
  contentId?: string;
  TextFormattingToolbar?: TextFormattingToolbarType | null;
}

export class RicosEditor extends Component<RicosEditorProps, State> implements RicosEditorRef {
  editor!: RichContentEditor;

  useNewFormattingToolbar = false;

  useToolbarsV3 = false;

  detachCommands = false;

  dataInstance!: EditorDataInstance;

  draftEditorStateTranslator!: DraftEditorStateTranslator;

  editorCommandRunner!: EditorCommandRunner;

  isBusy = false;

  initialContentChanged = false;

  getBiCallback: typeof getCallback;

  currentEditorRef!: ElementType;

  textFormattingToolbarRef!: Record<'updateToolbar', () => void>;

  linkToolbarRef!: Record<'updateToolbar', () => void>;

  static getDerivedStateFromError(error: string) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  constructor(props: RicosEditorProps) {
    super(props);
    this.detachCommands = !!props.experiments?.detachCommandsFromEditor?.enabled;
    if (this.detachCommands) {
      this.draftEditorStateTranslator = new DraftEditorStateTranslator();
    }
    this.dataInstance = createDataConverter(
      [this.props.onChange, this.draftEditorStateTranslator?.onChange],
      this.props.content
    );
    this.getBiCallback = getCallback.bind(this);
    this.state = {
      localeData: { locale: props.locale },
      remountKey: false,
      activeEditor: null,
      TextFormattingToolbar: null,
    };
    this.useNewFormattingToolbar = !!props.experiments?.newFormattingToolbar?.enabled;
    this.useToolbarsV3 = !!props.experiments?.toolbarsV3?.enabled;
  }

  static defaultProps = {
    onError: err => {
      throw err;
    },
    locale: 'en',
  };

  updateLocale = async () => {
    const { children } = this.props;
    const locale = children?.props.locale || this.props.locale;
    await localeStrategy(locale)
      .then(localeData => this.setState({ localeData, remountKey: !this.state.remountKey }))
      .catch(error => this.setState({ error }));
  };

  componentDidMount() {
    this.updateLocale();
    this.loadToolbar();
    this.initCommandRunner();
    const { isMobile, toolbarSettings, _rcProps = {} } = this.props;
    const { useStaticTextToolbar } = toolbarSettings || {};
    const contentId = this.getContentId();
    this.setState({ contentId });
    this.getBiCallback('onOpenEditorSuccess')?.(
      Version.currentVersion,
      isMobile
        ? ToolbarType.MOBILE
        : useStaticTextToolbar
        ? ToolbarType.STATIC
        : ToolbarType.INLINE,
      contentId
    );
    this.props.editorEvents?.subscribe(EditorEvents.RICOS_PUBLISH, this.onPublish);
    if (_rcProps.onLoad) {
      const { theme, locale, plugins, linkPanelSettings, linkSettings, experiments, cssOverride } =
        this.props;
      const { onLoad, helpers } = _rcProps;
      onLoad(
        convertToolbarContext({
          contentId,
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
          getEditorCommands: this.getEditorCommands,
        })
      );
    }
  }

  loadToolbar() {
    if (this.useNewFormattingToolbar) {
      import(
        /* webpackChunkName: "./toolbars/TextFormattingToolbar" */
        './toolbars/TextFormattingToolbar'
      ).then(textFormattingToolbarModule => {
        this.setState({ TextFormattingToolbar: textFormattingToolbarModule?.default });
      });
    }
  }

  initCommandRunner = async () => {
    if (this.detachCommands) {
      const repo = await this.initDraftRepository();
      this.editorCommandRunner = new EditorCommandRunner(repo);
      [...coreCommands, ...(this.props?.commands || [])].map(command =>
        this.editorCommandRunner.register(command)
      );
    }
  };

  initDraftRepository = () => {
    return import(
      /* webpackChunkName: "ricos-content/libs/converters" */
      'ricos-content/libs/converters'
    ).then(convertersModule => {
      const { toDraft, fromDraft } = convertersModule;
      return new DraftEditablesRepository(this.draftEditorStateTranslator, toDraft, fromDraft);
    });
  };

  onUpdate = ({ content }: { content: DraftContent }) => {
    const editorState = createWithContent(convertFromRaw(content));
    this.onChange()(editorState);
  };

  componentWillUnmount() {
    this.props.editorEvents?.unsubscribe(EditorEvents.RICOS_PUBLISH, this.onPublish);
  }

  // TODO: remove deprecated postId once getContent(postId) is removed (9.0.0)
  sendPublishBi = async (postId?: string) => {
    const onPublish = this.props._rcProps?.helpers?.onPublish;
    if (!onPublish) {
      return;
    }
    const contentState = this.dataInstance.getContentState();
    const { pluginsCount, pluginsDetails } = getEditorContentSummary(contentState) || {};
    onPublish(postId, pluginsCount, pluginsDetails, Version.currentVersion, this.getContentId());
  };

  onPublish = async () => {
    // TODO: remove this param after getContent(postId) is deprecated
    this.sendPublishBi(undefined as unknown as string);
    console.debug('editor publish callback'); // eslint-disable-line
    return {
      type: 'EDITOR_PUBLISH',
      data: await this.getContent(),
    };
  };

  publish = async () => {
    const publishResponse = await this.onPublish();
    return publishResponse.data;
  };

  componentWillReceiveProps(newProps: RicosEditorProps) {
    if (newProps.locale !== this.props.locale) {
      this.updateLocale();
    }
    if (
      newProps.injectedContent &&
      !isEqual(this.props.injectedContent, newProps.injectedContent)
    ) {
      console.debug('new content provided as editorState'); // eslint-disable-line
      const editorState = createWithContent(convertFromRaw(newProps.injectedContent));
      this.setState({ editorState }, () => {
        this.dataInstance = createDataConverter(
          [
            this.props.onChange,
            this.detachCommands ? this.draftEditorStateTranslator.onChange : undefined,
          ],
          this.props.injectedContent
        );
        this.dataInstance.refresh(editorState);
      });
    }
  }

  onInitialContentChanged = () => {
    const contentId = this.getContentId();
    this.getBiCallback('onContentEdited')?.({ version: Version.currentVersion, contentId });
    this.initialContentChanged = true;
  };

  onChange = (childOnChange?: RichContentEditorProps['onChange']) => (editorState: EditorState) => {
    try {
      this.dataInstance.refresh(editorState);
      if (!this.initialContentChanged && this.getContentTraits().isContentChanged) {
        this.onInitialContentChanged();
      }
      childOnChange?.(editorState);
      this.onBusyChange(editorState.getCurrentContent());
      this.useNewFormattingToolbar && this.updateToolbars();
    } catch (err) {
      this.setState({ error: err });
    }
  };

  getToolbarProps = (type: ToolbarType) => this.editor?.getToolbarProps(type);

  focus = () => this.editor.focus();

  blur = () => this.editor.blur();

  getToolbars = () => this.editor.getToolbars();

  getContentTraits = () => this.dataInstance.getContentTraits();

  getContent = async (
    postId?: string,
    forPublish?: boolean,
    shouldRemoveErrorBlocks = true
  ): Promise<DraftContent> => {
    if (postId && forPublish) {
      console.warn(PUBLISH_DEPRECATION_WARNING_v9); // eslint-disable-line
      this.sendPublishBi(postId); //async
    }
    return this.dataInstance.getContentState({ shouldRemoveErrorBlocks });
  };

  getContentPromise = async ({
    publishId,
    flush,
  }: { flush?: boolean; publishId?: string } = {}) => {
    const { getContentStatePromise, waitForUpdate } = this.dataInstance;
    if (flush) {
      waitForUpdate();
      this.blur();
    }
    const res = await getContentStatePromise();
    if (publishId) {
      console.warn(PUBLISH_DEPRECATION_WARNING_v9); // eslint-disable-line
      this.sendPublishBi(publishId);
    }
    return res;
  };

  onBusyChange = (contentState: ContentState) => {
    const { onBusyChange, onChange } = this.props;
    const isBusy = hasActiveUploads(contentState);
    if (this.isBusy !== isBusy) {
      this.isBusy = isBusy;
      onBusyChange?.(isBusy);
      onChange?.(convertToRaw(contentState));
    }
  };

  setActiveEditor = ref => {
    const { activeEditor } = this.state;
    if (ref && ref !== activeEditor) {
      const { MobileToolbar, TextToolbar } = ref.getToolbars();
      this.setState({ StaticToolbar: MobileToolbar || TextToolbar, activeEditor: ref });
    }
  };

  setEditorRef = ref => {
    this.editor = ref;
    this.setActiveEditor(ref);
    if (this.detachCommands && ref) {
      this.draftEditorStateTranslator.setEditorState = ref.setEditorState;
    }
  };

  getEditorCommands = () => this.editor?.getEditorCommands();

  getCommands = () => (this.detachCommands ? this.editorCommandRunner.getCommands() : {});

  getT = () => this.editor.getT();

  getContentId = () => this.dataInstance.getContentState().ID;

  renderToolbarPortal(Toolbar) {
    return (
      <StaticToolbarPortal
        StaticToolbar={Toolbar}
        textToolbarContainer={this.props.toolbarSettings?.textToolbarContainer}
      />
    );
  }

  renderRicosEngine(child, childProps) {
    const { toolbarSettings, draftEditorSettings = {}, localeContent, ...props } = this.props;
    const { isMobile, experiments = {}, cssOverride } = props;
    const supportedDraftEditorSettings = filterDraftEditorSettings(draftEditorSettings);
    const contentProp = this.getContentProp();
    return (
      <RicosEngine
        RicosModal={RicosModal}
        isViewer={false}
        key={'editor'}
        toolbarSettings={toolbarSettings}
        getContentId={this.getContentId}
        editorCommands={this.getEditorCommands()}
        {...contentProp.content}
        {...props}
        {...this.state.localeData}
        experiments={experiments}
      >
        {React.cloneElement(child, {
          editorKey: 'editor',
          setEditorToolbars: this.setActiveEditor,
          editorStyleClasses: createEditorStyleClasses({
            isMobile,
            experiments,
            cssOverride,
            editorCss,
          }),
          ...childProps,
          ...contentProp.editorState,
          ...supportedDraftEditorSettings,
          ...this.state.localeData,
          localeContent,
        })}
      </RicosEngine>
    );
  }

  setTextFormattingToolbarRef = ref => (this.textFormattingToolbarRef = ref);

  setLinkToolbarRef = ref => (this.linkToolbarRef = ref);

  updateToolbars = () => {
    this.textFormattingToolbarRef?.updateToolbar();
    this.linkToolbarRef?.updateToolbar();
  };

  renderNewToolbars() {
    const { TextFormattingToolbar, activeEditor, contentId } = this.state;
    const {
      isMobile = false,
      theme,
      locale,
      _rcProps: { helpers } = {},
      plugins,
      linkPanelSettings,
      linkSettings,
      toolbarSettings,
      cssOverride,
      experiments = {},
    } = this.props;
    const getEditorContainer = this.editor?.getContainer;
    const { useStaticTextToolbar } = toolbarSettings || {};
    const activeEditorIsTableCell = activeEditor?.isInnerRCERenderedInTable();
    const textToolbarType = isMobile
      ? ToolbarType.MOBILE
      : useStaticTextToolbar
      ? ToolbarType.STATIC
      : ToolbarType.INLINE;
    const biFunctions = helpers && getBiFunctions(helpers, contentId);
    const toolbarsProps = {
      textToolbarType,
      isMobile,
      theme,
      toolbarSettings,
      locale,
      plugins,
      linkPanelSettings,
      linkSettings,
      ...biFunctions,
      cssOverride,
      getEditorContainer,
    };
    const baseStyles = { flex: 'none', webkitTapHighlightColor: 'transparent' };
    const baseMobileStyles = { ...baseStyles, position: 'sticky', top: 0, zIndex: 9 };
    const linkPluginInstalled = !!plugins?.find(plugin => plugin.type === 'LINK');
    return (
      !activeEditorIsTableCell &&
      activeEditor && (
        <GlobalContext.Provider value={{ experiments, isMobile }}>
          <div
            data-hook={'ricos-editor-toolbars'}
            style={isMobile ? baseMobileStyles : baseStyles}
            dir={getLangDir(locale)}
          >
            {TextFormattingToolbar && (
              <TextFormattingToolbar
                ref={this.setTextFormattingToolbarRef}
                activeEditor={activeEditor}
                {...toolbarsProps}
              />
            )}
            {linkPluginInstalled && (
              <Suspense fallback={''}>
                <LinkToolbar
                  ref={this.setLinkToolbarRef}
                  activeEditor={activeEditor}
                  {...toolbarsProps}
                />
              </Suspense>
            )}
          </div>
        </GlobalContext.Provider>
      )
    );
  }

  renderToolbars() {
    if (this.useToolbarsV3) {
      return null;
    }
    const { StaticToolbar } = this.state;
    return this.useNewFormattingToolbar
      ? this.renderNewToolbars()
      : this.renderToolbarPortal(StaticToolbar);
  }

  renderSideBlocksComponents = () => {
    const { sideBlockComponent, locale } = this.props;
    if (!sideBlockComponent) {
      return null;
    }
    const dir = getLangDir(locale);
    const nodes = this.getEditorCommands()?.getAllBlocksKeys();
    return (
      <div dir={dir} style={{ position: 'absolute' }}>
        {nodes?.map(id => renderSideBlockComponent(id, dir, sideBlockComponent))}
      </div>
    );
  };

  renderDraftEditor() {
    const { remountKey } = this.state;
    const child =
      this.props.children && shouldRenderChild('RichContentEditor', this.props.children) ? (
        this.props.children
      ) : (
        <RichContentEditor />
      );

    return (
      <Fragment key={`${remountKey}`}>
        {this.renderToolbars()}
        {this.renderSideBlocksComponents()}
        {this.renderRicosEngine(child, {
          onChange: this.onChange(child.props.onChange),
          ref: this.setEditorRef,
        })}
      </Fragment>
    );
  }

  updateNewFormattingToolbar = () => this.useNewFormattingToolbar && this.updateToolbars();

  getContentProp() {
    const { editorState } = this.state;
    const { content } = this.props;
    return editorState
      ? { editorState: { editorState }, content: {} }
      : { editorState: {}, content: { content } };
  }

  render() {
    try {
      if (this.state.error) {
        this.props.onError?.(this.state.error);
        return null;
      }

      return this.renderDraftEditor();
    } catch (e) {
      this.props.onError?.(e);
      return null;
    }
  }
}

export default forwardRef<RicosEditor, RicosEditorProps>((props, ref) => (
  <EditorEventsContext.Consumer>
    {contextValue => <RicosEditor editorEvents={contextValue} {...props} ref={ref} />}
  </EditorEventsContext.Consumer>
));

const StaticToolbarPortal: FunctionComponent<{
  StaticToolbar?: ElementType;
  textToolbarContainer?: HTMLElement;
}> = ({ StaticToolbar, textToolbarContainer }) => {
  if (!StaticToolbar) return null;

  if (textToolbarContainer) {
    return ReactDOM.createPortal(<StaticToolbar />, textToolbarContainer);
  }
  return <StaticToolbar />;
};
