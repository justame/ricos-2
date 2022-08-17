/* eslint-disable brace-style */
import type { ElementType, FunctionComponent } from 'react';
import React, { Component, Fragment, Suspense, forwardRef } from 'react';
import {
  RicosEngine,
  shouldRenderChild,
  localeStrategy,
  getBiCallback as getCallback,
} from 'ricos-common';
import type { DraftContent } from 'ricos-content';
import type { RichContentEditorProps } from 'wix-rich-content-editor';
import { RichContentEditor } from 'wix-rich-content-editor';
import { createDataConverter, filterDraftEditorSettings } from './utils/editorUtils';
import ReactDOM from 'react-dom';
import type { EditorState, ContentState } from 'draft-js';
import RicosModal from './modals/RicosModal';
import editorCss from '../statics/styles/styles.scss';
import type { RicosEditorProps, EditorDataInstance } from '.';
import type { RicosEditorRef } from './RicosEditorRef';
import { hasActiveUploads } from './utils/hasActiveUploads';
import {
  convertToRaw,
  convertFromRaw,
  createWithContent,
} from 'wix-rich-content-editor/libs/editorStateConversion';
import { isEqual, compact } from 'lodash';
import {
  EditorEventsContext,
  EditorEvents,
} from 'wix-rich-content-editor-common/libs/EditorEventsContext';
import {
  ToolbarType,
  Version,
  RicosTranslate,
  getLangDir,
  GlobalContext,
} from 'wix-rich-content-common';
import { getEmptyDraftContent, getEditorContentSummary } from 'wix-rich-content-editor-common';
import englishResources from 'wix-rich-content-common/dist/statics/locale/messages_en.json';
import type { TextFormattingToolbarType } from './toolbars/TextFormattingToolbar';
import { getBiFunctions } from './toolbars/utils/biUtils';
import { renderSideBlockComponent } from './utils/renderBlockComponent';
import type { TiptapEditorPlugin } from 'ricos-types';
import { createEditorStyleClasses } from './utils/createEditorStyleClasses';
import { DraftEditorStateTranslator } from './content-conversion/draft-editor-state-translator';
import { TiptapEditorStateTranslator } from './content-conversion/tiptap-editor-state-translator';
import { DraftEditablesRepository } from './content-modification/services/draft-editables-repository';
import { TiptapEditablesRepository } from './content-modification/services/tiptap-editables-repository';
import { EditorCommandRunner } from './content-modification/command-runner';
import { convertToolbarContext } from './toolbars/convertToolbarContext';
import { coreCommands } from './content-modification/commands/core-commands';
import { Node_Type } from 'ricos-schema';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tiptapEditorModule: Record<string, any> | null;
  tiptapToolbar: unknown;
  error?: string;
  contentId?: string;
  TextFormattingToolbar?: TextFormattingToolbarType | null;
}

// controller between tiptap extensions to ricos editor
// extracts data from  Ricos Extensions
// gives context (Ricos editor context)
// awares of tiptap
// sort , filter

export class RicosEditor extends Component<RicosEditorProps, State> implements RicosEditorRef {
  editor!: RichContentEditor;

  useTiptap = false;

  useNewFormattingToolbar = false;

  useToolbarsV3 = false;

  detachCommands = false;

  dataInstance!: EditorDataInstance;

  draftEditorStateTranslator!: DraftEditorStateTranslator;

  tiptapEditorStateTranslator!: TiptapEditorStateTranslator;

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
      this.tiptapEditorStateTranslator = new TiptapEditorStateTranslator();
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
      tiptapEditorModule: null,
      tiptapToolbar: null,
      TextFormattingToolbar: null,
    };
    this.useTiptap = !!props.experiments?.tiptapEditor?.enabled;
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
    this.loadEditor();
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

  loadEditor() {
    if (this.useTiptap) {
      import(
        /* webpackChunkName: "wix-tiptap-editor" */
        'wix-tiptap-editor'
      ).then(tiptapEditorModule => {
        this.setState({ tiptapEditorModule });
      });
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
      const repo = await (this.useTiptap
        ? this.initTiptapRepository()
        : this.initDraftRepository());
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

  initTiptapRepository() {
    return import(
      /* webpackChunkName:"ricos-converters" */
      'ricos-converters'
    ).then(convertersModule => {
      const { toTiptap, fromTiptap } = convertersModule;
      return new TiptapEditablesRepository(this.tiptapEditorStateTranslator, toTiptap, fromTiptap);
    });
  }

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
    if (this.detachCommands && ref && !this.useTiptap) {
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
    const activeEditorIsTableCell = !this.useTiptap && activeEditor?.isInnerRCERenderedInTable();
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

  renderTiptapEditor() {
    const { tiptapEditorModule } = this.state;
    if (!tiptapEditorModule) {
      return null;
    }
    const { RicosTiptapEditor, RichContentAdapter, draftToTiptap, TIPTAP_TYPE_TO_RICOS_TYPE } =
      tiptapEditorModule;
    const { content, injectedContent, plugins, onAtomicBlockFocus, experiments } = this.props;
    const { tiptapToolbar } = this.state;
    // TODO: Enforce Content ID's existance (or generate it)
    // when tiptap will eventually be released (ask @Barackos, @talevy17)
    const initialContent = draftToTiptap(content ?? injectedContent ?? getEmptyDraftContent());
    const { localeData } = this.state;
    const { locale, localeResource } = localeData;
    const extensions =
      compact(plugins?.flatMap((plugin: TiptapEditorPlugin) => plugin.tiptapExtensions)) || [];
    return (
      <Fragment>
        {this.renderToolbars()}
        {tiptapToolbar && this.renderToolbarPortal(tiptapToolbar)}
        {
          <RicosTranslate locale={locale} localeResource={localeResource || englishResources}>
            {t => {
              const tiptapEditor = (
                <RicosTiptapEditor
                  ricosProps={this.props}
                  placeholder={this.props.placeholder}
                  extensions={extensions}
                  content={initialContent}
                  t={t}
                  onLoad={editor => {
                    const richContentAdapter = new RichContentAdapter(editor, t, plugins);
                    this.setEditorRef(richContentAdapter);
                    if (this.detachCommands) {
                      this.tiptapEditorStateTranslator.onChange(editor);
                    }
                    const TextToolbar = richContentAdapter.getToolbars().TextToolbar;
                    this.setState({ tiptapToolbar: TextToolbar });
                  }}
                  onUpdate={this.onUpdate}
                  onBlur={this.updateNewFormattingToolbar}
                  onSelectionUpdate={({ selectedNodes, content }) => {
                    //TODO: add 'textContainer' to group field of this extension config
                    const textContainers = [
                      Node_Type.PARAGRAPH,
                      Node_Type.CODE_BLOCK,
                      Node_Type.HEADING,
                    ];
                    const parentNodes =
                      selectedNodes.length === 1
                        ? selectedNodes
                        : selectedNodes.filter(node => textContainers.includes(node.type.name));
                    if (parentNodes.length === 1 && parentNodes[0].isBlock) {
                      const firstNode = parentNodes[0];
                      const blockKey = firstNode.attrs.id;
                      const type = TIPTAP_TYPE_TO_RICOS_TYPE[firstNode.type.name] || 'text';
                      const data = firstNode.attrs;
                      onAtomicBlockFocus?.({ blockKey, type, data });
                    } else {
                      onAtomicBlockFocus?.({
                        blockKey: undefined,
                        type: undefined,
                        data: undefined,
                      });
                    }
                    this.updateNewFormattingToolbar();

                    this.onUpdate({ content });
                  }}
                />
              );
              return this.renderRicosEngine(tiptapEditor, {});
            }}
          </RicosTranslate>
        }
      </Fragment>
    );
  }

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

      return this.useTiptap ? this.renderTiptapEditor() : this.renderDraftEditor();
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
