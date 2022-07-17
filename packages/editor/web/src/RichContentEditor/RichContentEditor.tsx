/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { CSSProperties, FocusEvent } from 'react';
import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import { get, includes, debounce, cloneDeep } from 'lodash';
import type { BoundingRect, ContentRect } from 'react-measure';
import Measure from 'react-measure';
import createEditorToolbars from './Toolbars/createEditorToolbars';
import createPlugins from './createPlugins';
import { createEditorCommands } from './EditorCommands';
import { createKeyBindingFn, initPluginKeyBindings } from './keyBindings';
import handleKeyCommand from './handleKeyCommand';
import handleReturnCommand from './handleReturnCommand';
import handlePastedText from './handlePastedText';
import blockStyleFn from './blockStyleFn';
import { combineStyleFns } from './combineStyleFns';
import { getStaticTextToolbarId } from './Toolbars/toolbar-id';
import type { ContentBlock, EditorProps } from '@wix/draft-js';
import type { ContentState, SelectionState } from 'wix-rich-content-editor-common';
import {
  EditorState,
  TOOLBARS,
  getBlockInfo,
  getFocusedBlockKey,
  createCalcContentDiff,
  getBlockType,
  COMMANDS,
  MODIFIERS,
  undo,
  redo,
  setSelectionToBlock,
  getEmptyDraftContent,
  getCustomStyleFns,
} from 'wix-rich-content-editor-common';
import { convertFromRaw, convertToRaw, createWithContent } from '../../lib/editorStateConversion';
import type { EditorProps as DraftEditorProps, DraftHandleValue } from 'draft-js';
import type { DraftContent } from 'ricos-content';
import { HEADINGS_DROPDOWN_TYPE, DEFAULT_HEADINGS, DEFAULT_TITLE_HEADINGS } from 'ricos-content';
import type {
  AvailableExperiments,
  RicosContent,
  RichContentTheme,
  Helpers,
  TranslationFunction,
  CreatePluginFunction,
  onAtomicBlockFocus,
  OnErrorFunction,
  NormalizeConfig,
  ModalStyles,
  LegacyEditorPluginConfig,
  BICallbacks,
  AnchorTarget,
  RelValue,
  CustomAnchorScroll,
  EditorContextType,
  PluginButton,
  PluginTextButtons,
  ToolbarButtonProps,
  TextToolbarType,
  Pubsub,
  GetEditorState,
  SetEditorState,
  TextDirection,
  CreatePluginsDataMap,
  EditorCommands,
  DocumentStyle,
  PluginKeyBindings,
  CommandHandler,
  KeyCommand,
  EditorStyleClasses,
} from 'wix-rich-content-common';
import {
  AccessibilityListener,
  normalizeInitialState,
  getLangDir,
  Version,
  HTML_TYPE,
  GlobalContext,
  simplePubsub,
  IMAGE_TYPE,
  DOC_STYLE_TYPES,
} from 'wix-rich-content-common';
import draftStyles from '../../statics/styles/draft.rtlignore.scss';
import InnerRCE from './InnerRCE';
import { deprecateHelpers } from 'wix-rich-content-common/libs/deprecateHelpers';
import InnerModal from './InnerModal';
import { onCut, onCopy } from './utils/onCutAndCopy';
import preventWixFocusRingAccessibility from './preventWixFocusRingAccessibility';
import { RCEErrorToast } from './Components';
import { getBiButtonName } from './utils/biUtils';
import { DOC_STYLE_CLASSES } from './utils/consts';
import classNames from 'classnames';
import type { TextAlignment } from 'ricos-types';

type PartialDraftEditorProps = Pick<
  Partial<DraftEditorProps>,
  | 'tabIndex'
  | 'placeholder'
  | 'stripPastedStyles'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'ariaActiveDescendantID'
  | 'ariaAutoComplete'
  | 'ariaControls'
  | 'ariaDescribedBy'
  | 'ariaExpanded'
  | 'ariaLabel'
  | 'ariaMultiline'
  | 'onBlur'
  | 'onFocus'
  | 'handleBeforeInput'
  | 'handlePastedText'
  | 'readOnly'
> &
  // defaultProps
  Pick<Required<DraftEditorProps>, 'spellCheck' | 'customStyleFn'>;

type ToolbarsToIgnore = (
  | 'InlineTextToolbar'
  | 'InlineToolbar'
  | 'SideToolbar'
  | 'FooterToolbar'
  | 'MobileToolbar'
  | 'StaticTextToolbar'
  | 'StaticToolbar'
  | 'InlinePluginToolbar'
)[];

export interface RichContentEditorProps extends PartialDraftEditorProps {
  /** This is a legacy API, chagnes should be made also in the new Ricos Editor API **/
  onLoad?: (any) => void;
  editorKey?: string;
  editorState?: EditorState;
  initialState?: RicosContent;
  theme?: RichContentTheme;
  isMobile?: boolean;
  helpers?: Helpers;
  t: TranslationFunction;
  textToolbarType?: TextToolbarType;
  plugins: CreatePluginFunction[];
  createPluginsDataMap: CreatePluginsDataMap;
  config: LegacyEditorPluginConfig;
  anchorTarget?: AnchorTarget;
  relValue?: RelValue;
  customAnchorScroll?: CustomAnchorScroll;
  style?: CSSProperties;
  editorStyleClasses?: EditorStyleClasses;
  locale: string;
  localeContent?: string;
  shouldRenderOptimizedImages?: boolean;
  onChange?(editorState: EditorState): void;
  onAtomicBlockFocus?: onAtomicBlockFocus;
  siteDomain?: string;
  iframeSandboxDomain?: string;
  onError: OnErrorFunction;
  toolbarsToIgnore?: ToolbarsToIgnore;
  showToolbars?: boolean;
  normalize: NormalizeConfig;
  isInnerRCE?: boolean;
  innerRCERenderedIn?: string;
  direction?: TextDirection;
  onBackspace?(editorState: EditorState): void;
  setEditorToolbars?(ref: RichContentEditor): void;
  handleReturn?: (
    updateEditorStateCallback: (editorState: EditorState) => void
  ) => DraftEditorProps['handleReturn'];
  handleUndoCommand?: (editorState?: EditorState) => EditorState;
  handleRedoCommand?: (editorState?: EditorState) => EditorState;
  tablePluginMenu?: boolean;
  callOnChangeOnNewEditorState?: boolean;
  localeResource?: Record<string, string>;
  maxTextLength?: number;
  experiments?: AvailableExperiments;
  disableKeyboardEvents?: (shouldEnable: boolean) => void;
  textWrap: boolean;
  textAlignment: TextAlignment;
  getDocumentStyle?: EditorCommands['getDocumentStyle'];
  updateDocumentStyle?: EditorCommands['updateDocumentStyle'];
  /** This is a legacy API, chagnes should be made also in the new Ricos Editor API **/
}

interface RichContentEditorState {
  editorState: EditorState;
  editorBounds?: BoundingRect;
  innerModal: { modalProps: Record<string, unknown>; modalStyles?: ModalStyles } | null;
  toolbarsToIgnore: ToolbarsToIgnore;
  theme?: RichContentTheme;
  textToolbarType?: TextToolbarType;
  error?: string;
  readOnly: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: {
    experiments: AvailableExperiments;
    isMobile: boolean;
    t?: TranslationFunction;
  };
  undoRedoStackChanged: boolean;
}

class RichContentEditor extends Component<RichContentEditorProps, RichContentEditorState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refId: number;

  commonPubsub: Pubsub;

  handleCallbacks: (newState: EditorState, biCallbacks?: BICallbacks) => void | undefined;

  contextualData!: EditorContextType;

  editor!: Editor & { setMode: (mode: 'render' | 'edit') => void };

  editorWrapper!: Element;

  lastFocusedAtomicPlugin?: ContentBlock;

  updateBounds!: (editorBounds?: BoundingRect) => void;

  plugins;

  focusedBlockKey!: string;

  pluginKeyBindings!: PluginKeyBindings;

  customStyleFn: DraftEditorProps['customStyleFn'];

  toolbars;

  innerRCECustomStyleFn;

  EditorCommands!: EditorCommands;

  getSelectedText!: (editorState: EditorState) => string;

  static defaultProps: Partial<RichContentEditorProps> = {
    config: {},
    spellCheck: true,
    customStyleFn: () => ({}),
    locale: 'en',
    onError: err => {
      throw err;
    },
    normalize: {},
    plugins: [],
  };

  static getDerivedStateFromError(error: string) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  constructor(props: RichContentEditorProps) {
    super(props);
    const initialEditorState = this.getInitialEditorState();
    const { experiments = {}, isMobile = false, t } = props;
    this.state = {
      editorState: initialEditorState,
      innerModal: null,
      toolbarsToIgnore:
        experiments?.newFormattingToolbar?.enabled || experiments?.toolbarsV3?.enabled
          ? ['InlineTextToolbar', 'InlinePluginToolbar']
          : [],
      readOnly: false,
      context: { experiments, isMobile, t },
      undoRedoStackChanged: false,
    };
    this.refId = Math.floor(Math.random() * 9999);
    this.commonPubsub = simplePubsub();
    this.handleCallbacks = this.createContentMutationEvents(
      this.state.editorState,
      Version.currentVersion
    );
    this.deprecateSiteDomain();
    this.initContext();
    this.initPlugins();
    this.initEditorCommands();
    this.fixDraftSelectionExtend();
  }

  fixDraftSelectionExtend = () => {
    if (typeof Selection !== 'undefined' && !this.props.isInnerRCE) {
      const nativeSelectionExtend = Selection.prototype.extend;
      Selection.prototype.extend = function (...args) {
        try {
          return nativeSelectionExtend.apply(this, args);
        } catch (error) {}
      };
    }
  };

  componentDidUpdate() {
    this.handleBlockFocus(this.state.editorState);
  }

  componentDidMount() {
    preventWixFocusRingAccessibility(this.editorWrapper);
    this.reportDebuggingInfo();
    this.preloadLibs();
    document?.addEventListener('beforeinput', this.preventDefaultKeyCommands);
  }

  componentWillMount() {
    this.updateBounds = (editorBounds?: BoundingRect) => {
      this.setState({ editorBounds });
    };
  }

  componentWillUnmount() {
    this.updateBounds = () => '';
    document?.removeEventListener('beforeinput', this.preventDefaultKeyCommands);
  }

  preventDefaultKeyCommands = event => {
    if (['historyUndo', 'historyRedo'].includes(event.inputType)) {
      event.preventDefault();
    }
  };

  // imports dynamic chunks conditionally
  preloadLibs() {
    if (this.props.maxTextLength && this.props.maxTextLength > 0) {
      import(
        /* webpackChunkName: "getSelectedText" */ 'wix-rich-content-editor-common/libs/getSelectedText'
      ).then(({ getSelectedText }) => (this.getSelectedText = getSelectedText));
    }
  }

  reportDebuggingInfo() {
    if (typeof window === 'undefined') {
      return;
    }
    if (/debug/i.test(window.location.search) && !window.__RICOS_INFO__) {
      import(
        /* webpackChunkName: "debugging-info" */
        'wix-rich-content-common/libs/debugging-info'
      ).then(({ reportDebuggingInfo }) => {
        reportDebuggingInfo({
          version: Version.currentVersion,
          reporter: 'Rich Content Editor',
          plugins: this.plugins.reduce(
            (list, { blockType }) => (blockType ? [...list, blockType] : list),
            []
          ),
          getContent: () => convertToRaw(this.getEditorState().getCurrentContent()),
          getConfig: () => this.props.config,
        });
      });
    }
  }

  handleBlockFocus(editorState: EditorState) {
    const focusedBlockKey = getFocusedBlockKey(editorState);
    if (focusedBlockKey && focusedBlockKey !== this.focusedBlockKey) {
      this.focusedBlockKey = focusedBlockKey;
      this.onChangedFocusedBlock(focusedBlockKey);
    }
  }

  deprecateSiteDomain = () => {
    const { config, siteDomain } = this.props;
    if (config[HTML_TYPE] && siteDomain) {
      config[HTML_TYPE] = { ...config[HTML_TYPE], siteDomain };
    }
  };

  onChangedFocusedBlock = (blockKey: string) => {
    const { onAtomicBlockFocus } = this.props;
    if (onAtomicBlockFocus) {
      if (blockKey) {
        const { type, entityData: data } = getBlockInfo(this.getEditorState(), blockKey);
        onAtomicBlockFocus({ blockKey, type, data });
      }
      onAtomicBlockFocus({});
    }
  };

  getEditorState: GetEditorState = () => this.state.editorState;

  setEditorState: SetEditorState = (editorState: EditorState) => this.setState({ editorState });

  initContext = () => {
    const {
      theme,
      t,
      locale,
      localeContent,
      anchorTarget,
      relValue,
      customAnchorScroll,
      helpers = {},
      config,
      isMobile = false,
      shouldRenderOptimizedImages,
      siteDomain,
      iframeSandboxDomain,
      innerRCERenderedIn,
      experiments,
      textWrap,
    } = this.props;

    this.fixHelpers(helpers);
    this.contextualData = {
      theme: theme || {},
      t,
      locale,
      localeContent,
      anchorTarget,
      relValue,
      customAnchorScroll,
      helpers,
      config,
      isMobile,
      setEditorState: editorState => {
        this.commonPubsub.get('setEditorState')?.(editorState);
      },
      getEditorState: this.getEditorState,
      getEditorBounds: this.getEditorBounds,
      languageDir: getLangDir(locale),
      shouldRenderOptimizedImages,
      siteDomain,
      iframeSandboxDomain,
      setInPluginEditingMode: this.setInPluginEditingMode,
      getInPluginEditingMode: this.getInPluginEditingMode,
      innerModal: { openInnerModal: this.openInnerModal, closeInnerModal: this.closeInnerModal },
      renderInnerRCE: this.renderInnerRCE,
      innerRCERenderedIn,
      disableKeyboardEvents: this.disableKeyboardEvents,
      experiments,
      textWrap,
      onKeyboardShortcutClick: this.onKeyboardShortcutClick,
    };
  };

  disableKeyboardEvents = shouldDisable => {
    if (!this.props.isInnerRCE && shouldDisable !== this.state.readOnly) {
      this.setState({ readOnly: shouldDisable });
    }
  };

  getEditorBounds = () => this.state.editorBounds;

  initPlugins() {
    const { plugins, customStyleFn } = this.props;

    const {
      pluginInstances,
      pluginButtons,
      pluginTextButtons,
      pluginStyleFns,
      externalizedButtonProps,
    } = createPlugins({
      plugins,
      context: this.contextualData,
      commonPubsub: this.commonPubsub,
    });

    this.initEditorToolbars(pluginButtons, pluginTextButtons, externalizedButtonProps);
    this.pluginKeyBindings = initPluginKeyBindings(pluginTextButtons);
    this.plugins = [...pluginInstances, ...Object.values(this.toolbars)];
    this.customStyleFn = combineStyleFns([
      ...pluginStyleFns,
      customStyleFn,
      ...getCustomStyleFns(this.props.config),
    ]);
    this.innerRCECustomStyleFn = combineStyleFns([...pluginStyleFns, customStyleFn]);
  }

  initEditorCommands = () => {
    const { createPluginsDataMap = {}, getDocumentStyle, updateDocumentStyle } = this.props;
    this.EditorCommands = createEditorCommands(
      createPluginsDataMap,
      this.plugins,
      this.getEditorState,
      this.updateEditorState,
      {
        getDocumentStyle,
        updateDocumentStyle,
      }
    );
  };

  initEditorToolbars(
    pluginButtons: PluginButton[],
    pluginTextButtons: PluginTextButtons[],
    pluginButtonProps: ToolbarButtonProps[]
  ) {
    const { textAlignment, isInnerRCE, tablePluginMenu, experiments } = this.props;
    const buttons = { pluginButtons, pluginTextButtons };

    this.toolbars = createEditorToolbars({
      buttons,
      textAlignment,
      refId: this.refId,
      context: this.contextualData,
      pluginButtonProps,
      isInnerRCE,
      tablePluginMenu,
      pubsub: this.commonPubsub,
      experiments,
      focusEditor: this.focus,
    });
  }

  getToolbars = () => ({
    MobileToolbar: this.toolbars[TOOLBARS.MOBILE] ? this.toolbars[TOOLBARS.MOBILE].Toolbar : null,
    TextToolbar:
      this.props.textToolbarType === 'static' ? this.toolbars[TOOLBARS.STATIC].Toolbar : null,
  });

  isInnerRCERenderedInTable = () => {
    const { innerRCERenderedIn } = this.props;
    return innerRCERenderedIn === 'wix-rich-content-plugin-table';
  };

  getInitialEditorState() {
    const {
      editorState,
      initialState,
      anchorTarget,
      relValue,
      normalize: { disableInlineImages = false, removeInvalidInlinePlugins = false },
    } = this.props;
    if (editorState) {
      return editorState;
    }
    if (initialState) {
      const rawContentState = normalizeInitialState(initialState, {
        anchorTarget,
        relValue,
        disableInlineImages,
        removeInvalidInlinePlugins,
      });
      return createWithContent(convertFromRaw(rawContentState));
    } else {
      //this is needed for ssr. Otherwise the key will be generated randomly on both server and client.
      const emptyContentState = convertFromRaw(getEmptyDraftContent());
      return createWithContent(emptyContentState);
    }
  }

  forceRender = () => {
    const { editorState } = this.state;
    this.setState({ editorState: cloneDeep(editorState) });
  };

  componentWillReceiveProps(nextProps: RichContentEditorProps) {
    if (this.props.direction !== nextProps.direction) {
      this.forceRender();
    }
    if (nextProps.editorState && this.props.editorState !== nextProps.editorState) {
      if (this.props.callOnChangeOnNewEditorState) {
        this.updateEditorState(nextProps.editorState);
      } else {
        this.setState({ editorState: nextProps.editorState });
      }
    }
    if (this.props.theme !== nextProps.theme) {
      this.setState({ theme: nextProps.theme });
    }
    if (this.props.textToolbarType !== nextProps.textToolbarType) {
      this.setState({ textToolbarType: nextProps.textToolbarType });
    }
    this.fixHelpers(nextProps.helpers);
  }

  fixHelpers(helpers) {
    if (helpers?.onFilesChange) {
      // console.warn('helpers.onFilesChange is deprecated. Use helpers.handleFileUpload');
      helpers.handleFileUpload = helpers.onFilesChange;
      // eslint-disable-next-line fp/no-delete
      delete helpers.onFilesChange;
    }
    deprecateHelpers(helpers, this.props.config);
  }

  // TODO: get rid of this ASAP!
  // Currently, there's no way to get a static toolbar ref without consumer interference
  findFocusableChildForElement(id: string): HTMLElement | null {
    const element = document.getElementById(id);
    return element && element.querySelector('*[tabindex="0"]');
  }

  getContentId = () => (this.state.editorState.getCurrentContent() as unknown as DraftContent).ID;

  createContentMutationEvents = (initialEditorState: EditorState, version: string) => {
    const calculate = createCalcContentDiff(initialEditorState);
    return (newState: EditorState, { onPluginDelete }: BICallbacks = {}) =>
      calculate(newState, {
        shouldCalculate: !!onPluginDelete,
        onCallbacks: ({ pluginsDeleted = [] }) => {
          pluginsDeleted.forEach(pluginId =>
            onPluginDelete?.({
              pluginId,
              version,
              contentId: this.getContentId(),
              pluginDetails: undefined,
            })
          );
        },
      });
  };

  didUndoRedoStackChange = (newEditorState: EditorState) => {
    const { editorState } = this.state;
    return (
      editorState.getUndoStack().isEmpty() !== newEditorState.getUndoStack().isEmpty() ||
      editorState.getRedoStack().isEmpty() !== newEditorState.getRedoStack().isEmpty()
    );
  };

  preserveNonDraftProperties = (editorState: EditorState) => {
    const documentStyle = this.EditorCommands.getDocumentStyle();
    type Content = ContentState & {
      documentStyle: DocumentStyle;
      ID: string;
    };
    const currentContent = editorState.getCurrentContent() as Content;
    const contentId = (this.state.editorState.getCurrentContent() as Content).ID;
    if (documentStyle) {
      currentContent.documentStyle = {
        ...documentStyle,
        ...currentContent.documentStyle,
      };
    }
    !currentContent.ID && (currentContent.ID = contentId);
  };

  updateEditorState = (editorState: EditorState) => {
    if (!this.props.isInnerRCE) {
      this.preserveNonDraftProperties(editorState);
    }
    const undoRedoStackChanged = this.didUndoRedoStackChange(editorState);
    this.setState({ editorState, undoRedoStackChanged }, () => {
      this.handleCallbacks(this.state.editorState, this.props.helpers);
      this.props.onChange?.(this.state.editorState);
    });
  };

  handleTabCommand = () => {
    if (this.getToolbars().TextToolbar) {
      const staticToolbarButton = this.findFocusableChildForElement(
        `${getStaticTextToolbarId(this.refId)}`
      );
      staticToolbarButton && staticToolbarButton.focus();
    } else {
      this.editor.blur();
    }
  };

  focusOnToolbar = () => {
    const pluginToolbar = document.querySelectorAll(`[data-hook*=PluginToolbar]`)[0] as HTMLElement;
    const formattingToolbar = document.querySelectorAll(
      `[data-hook=inlineToolbar]`
    )[0] as HTMLElement;
    if (pluginToolbar && pluginToolbar.dataset.hook !== 'linkPluginToolbar') {
      const editorState = this.getEditorState();
      const focusedAtomicPluginKey = editorState.getSelection().getFocusKey();
      this.lastFocusedAtomicPlugin = editorState
        .getCurrentContent()
        .getBlockForKey(focusedAtomicPluginKey);
    }
    const toolbar = pluginToolbar || formattingToolbar;
    if (toolbar) {
      const buttonToFocus = toolbar.querySelectorAll('Button')[0] as HTMLElement;
      buttonToFocus.focus();
      setTimeout(() => {
        // fix bug - selection of text with atomic blocks
        if (buttonToFocus !== document.activeElement) {
          buttonToFocus.focus();
        }
      });
    }
  };

  openPluginMenu = () => {
    const pluginMenuButton = this.editorWrapper.querySelectorAll(
      `[data-hook="addPluginFloatingToolbar"]`
    )[0] as HTMLElement;
    pluginMenuButton?.click?.();
  };

  getHeadings = config => {
    const { [HEADINGS_DROPDOWN_TYPE]: headingsPluginSettings } = config;

    const customHeadings = headingsPluginSettings
      ? headingsPluginSettings?.customHeadings || DEFAULT_HEADINGS
      : DEFAULT_TITLE_HEADINGS;

    return customHeadings;
  };

  createPluginFromBlobs = (blobs: Blob[]): DraftHandleValue => {
    if (blobs.length > 0) {
      const blob = blobs[0];
      if (blob.type.startsWith('image/')) {
        const imagePluginSettings = this.plugins.find(({ blockType }) => blockType === IMAGE_TYPE);
        if (imagePluginSettings) {
          const blockKey = this.EditorCommands.insertBlock(IMAGE_TYPE);
          if (blockKey) {
            this.commonPubsub.set('initialState_' + blockKey, {
              userSelectedFiles: { files: [blob] },
            });
            return 'handled';
          }
        }
      }
    }
    return 'not-handled';
  };

  handlePastedFiles = (blobs: Blob[]): DraftHandleValue => {
    return this.createPluginFromBlobs(blobs);
  };

  handleDroppedFiles = (_selection: SelectionState, blobs: Blob[]): DraftHandleValue => {
    return this.createPluginFromBlobs(blobs);
  };

  isPluginInstalled = (pluginType: string) =>
    this.plugins.some(plugin => plugin.blockType === pluginType);

  handlePastedText: DraftEditorProps['handlePastedText'] = (text, html, editorState) => {
    if (this.props.handlePastedText) {
      const handled = this.props.handlePastedText(text, html, editorState);
      if (handled !== 'not-handled') {
        return handled;
      }
    }

    const { config, isInnerRCE, maxTextLength } = this.props;
    const resultEditorState = handlePastedText({
      isPluginInstalled: this.isPluginInstalled,
      text,
      html,
      editorState,
      pasteWithoutAtomic: isInnerRCE,
      customHeadings: this.getHeadings(config),
      maxTextLength,
      getSelectedText: this.getSelectedText,
    });
    this.updateEditorState(resultEditorState);

    return 'handled';
  };

  handleEscCommand = (_, event) => {
    this.blur();
    event?.preventDefault();
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: should be a CommandHandler
  handleUndoCommand: CommandHandler = (editorState: EditorState, event) => {
    event?.preventDefault();
    if (this.props.isInnerRCE) {
      this.props.handleUndoCommand?.();
    } else {
      this.updateEditorState(undo(editorState || this.state.editorState));
      this.setState({ readOnly: false });
    }
    return 'handled';
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: should be a CommandHandler
  handleRedoCommand: CommandHandler = (editorState: EditorState, event) => {
    event?.preventDefault();
    if (this.props.isInnerRCE) {
      this.props.handleRedoCommand?.();
    } else {
      this.updateEditorState(redo(editorState || this.state.editorState));
      this.setState({ readOnly: false });
    }
    return 'handled';
  };

  getTabCommands = (): KeyCommand[] =>
    !this.props.isInnerRCE
      ? [
          {
            command: COMMANDS.TAB,
            modifiers: [],
            key: 'Tab',
          },
          {
            command: COMMANDS.SHIFT_TAB,
            modifiers: [MODIFIERS.SHIFT],
            key: 'Tab',
          },
        ]
      : [];

  customCommands: KeyCommand[] = [
    {
      command: COMMANDS.OPEN_PLUGIN_MENU,
      modifiers: [MODIFIERS.CTRL, MODIFIERS.ALT],
      keyCode: 80,
    },
    {
      command: COMMANDS.OPEN_PLUGIN_MENU,
      modifiers: [MODIFIERS.COMMAND, MODIFIERS.CTRL],
      keyCode: 80,
    },
    {
      command: COMMANDS.FOCUS_TOOLBAR,
      modifiers: [MODIFIERS.ALT],
      keyCode: 84,
    },
    {
      command: COMMANDS.FOCUS_TOOLBAR,
      modifiers: [MODIFIERS.CTRL],
      keyCode: 84,
    },
    ...this.getTabCommands(),
    {
      command: COMMANDS.ESC,
      modifiers: [],
      key: 'Escape',
    },
    {
      command: COMMANDS.UNDO,
      modifiers: [MODIFIERS.COMMAND],
      key: 'z',
    },
    {
      command: COMMANDS.REDO,
      modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
      key: 'z',
    },
  ] as KeyCommand[];

  customCommandHandlers: Record<string, CommandHandler> = {
    openPluginMenu: this.openPluginMenu,
    focusToolbar: this.focusOnToolbar,
    tab: this.handleTabCommand,
    shiftTab: this.handleTabCommand,
    esc: this.handleEscCommand,
    ricosUndo: this.handleUndoCommand,
    ricosRedo: this.handleRedoCommand,
  };

  getCustomCommandHandlers = (): {
    commands: KeyCommand[];
    commandHandlers: Record<string, CommandHandler>;
  } => ({
    commands: [...this.pluginKeyBindings.commands, ...this.customCommands],
    commandHandlers: {
      ...this.pluginKeyBindings.commandHandlers,
      ...this.customCommandHandlers,
    },
  });

  focus = () => setTimeout(this.editor.focus);

  blur = () => this.editor.blur();

  getToolbarProps = (type = TOOLBARS.INSERT_PLUGIN) => ({
    buttons: this.toolbars[type],
    context: this.contextualData,
    pubsub: this.commonPubsub,
  });

  getT = () => {
    const { t } = this.props;
    return t;
  };

  getContainer = () => {
    return this.editorWrapper;
  };

  getPlugins = () => {
    return this.plugins;
  };

  getEditorCommands = () => this.EditorCommands;

  setEditor = (ref: Editor) => (this.editor = get(ref, 'editor', ref));

  inPluginEditingMode = false;

  setInPluginEditingMode = (shouldEnable: boolean) => {
    // As explained in https://github.com/facebook/draft-js/blob/585af35c3a8c31fefb64bc884d4001faa96544d3/src/component/handlers/DraftEditorModes.js#L14
    const mode = shouldEnable ? 'render' : 'edit';
    this.editor?.setMode(mode);
    this.inPluginEditingMode = shouldEnable;
    this.handleSideToolbar(shouldEnable);
  };

  handleSideToolbar = (shouldEnable: boolean) => {
    const { toolbarsToIgnore: currentToolbarsToIgnore } = this.state;
    const toolbarsToIgnore: ToolbarsToIgnore = currentToolbarsToIgnore;
    const index = toolbarsToIgnore.indexOf('SideToolbar');
    if (shouldEnable && index === -1) {
      toolbarsToIgnore.push('SideToolbar');
    } else if (!shouldEnable && index !== -1) {
      toolbarsToIgnore.splice(index, 1);
    }
    this.setState({ toolbarsToIgnore });
  };

  getInPluginEditingMode = () => this.inPluginEditingMode;

  removeToolbarFocus = () => {
    this.editor.focus();
    if (this.lastFocusedAtomicPlugin) {
      setSelectionToBlock(this.getEditorState(), this.setEditorState, this.lastFocusedAtomicPlugin);
      this.lastFocusedAtomicPlugin = undefined;
    }
  };

  renderToolbars = () => {
    const { toolbarsToIgnore: toolbarsToIgnoreFromProps = [] } = this.props;
    const { toolbarsToIgnore: toolbarsToIgnoreFromState = [], undoRedoStackChanged } = this.state;
    const toolbarsToIgnore = [
      'MobileToolbar',
      'StaticTextToolbar',
      this.props.textToolbarType === 'static' ? 'InlineTextToolbar' : '',
      ...toolbarsToIgnoreFromProps,
      ...toolbarsToIgnoreFromState,
    ];
    //eslint-disable-next-line array-callback-return
    const toolbars = this.plugins.map((plugin, index) => {
      const Toolbar =
        plugin.Toolbar || plugin.InlinePluginToolbar || plugin.InlineToolbar || plugin.SideToolbar;
      if (Toolbar) {
        if (includes(toolbarsToIgnore, plugin.name)) {
          return null;
        }
        if (plugin.InlinePluginToolbar && includes(toolbarsToIgnore, 'InlinePluginToolbar')) {
          return null;
        }
        return (
          <Toolbar
            removeToolbarFocus={this.removeToolbarFocus}
            key={`k${index}`}
            hide={this.state.innerModal && plugin.name !== 'FooterToolbar'}
            forceDisabled={
              plugin.name === 'FooterToolbar' && !this.props.isInnerRCE && this.inPluginEditingMode
            }
            shouldUpdate={plugin.name === 'FooterToolbar' && undoRedoStackChanged}
          />
        );
      }
    });
    return toolbars;
  };

  renderInlineModals = () => {
    //eslint-disable-next-line array-callback-return
    const modals = this.plugins.map((plugin, index) => {
      if (plugin.InlineModals && plugin.InlineModals.length > 0) {
        return plugin.InlineModals.map((Modal, modalIndex) => {
          return <Modal key={`k${index}m${modalIndex}`} />;
        });
      }
    });
    return modals;
  };

  handleBeforeInput: DraftEditorProps['handleBeforeInput'] = (chars, editorState, timestamp) => {
    let handled = this.props.handleBeforeInput?.(chars, editorState, timestamp);

    const blockType = getBlockType(this.state.editorState);
    if (blockType === 'atomic') {
      // fixes space click on atomic blocks deletion bug.
      // in general, disables any input click on atomic blocks
      handled = 'handled';
    }

    // input is ignored if length > maxTextLength (if maxTextLength is set)
    if (this.props.maxTextLength && this.props.maxTextLength > 0) {
      const contentLength = this.state.editorState.getCurrentContent().getPlainText('').length;
      const selectedTextLength = this.getSelectedText(this.state.editorState).length;
      if (contentLength - selectedTextLength > this.props.maxTextLength - 1) {
        // eslint-disable-next-line no-console
        console.debug(
          `text editing prevented due to maxTextLength limitation (${this.props.maxTextLength})`
        );
        handled = 'handled';
      }
    }

    return handled || 'not-handled';
  };

  onKeyboardShortcutClick = ({
    buttonName,
    pluginId,
  }: {
    buttonName: string;
    pluginId?: string;
  }) => {
    const { helpers = {} } = this.props;
    const alignmentKeys = ['left', 'right', 'center', 'justify'];
    const biButtonName = getBiButtonName(buttonName);
    if (alignmentKeys.includes(buttonName)) {
      helpers.onKeyboardShortcutAction?.({
        buttonName: 'Alignment',
        value: buttonName,
        version: Version.currentVersion,
        contentId: this.getContentId(),
      });
    } else if (biButtonName) {
      helpers.onKeyboardShortcutAction?.({
        buttonName: biButtonName,
        pluginId,
        version: Version.currentVersion,
        contentId: this.getContentId(),
      });
    }
  };

  toDraftTextAlignment(textAlignment: TextAlignment): EditorProps['textAlignment'] {
    return textAlignment === 'justify' ? 'left' : (textAlignment as EditorProps['textAlignment']);
  }

  renderEditor = () => {
    const {
      editorKey,
      tabIndex,
      placeholder,
      spellCheck,
      stripPastedStyles,
      autoCapitalize,
      autoComplete,
      autoCorrect,
      ariaActiveDescendantID,
      ariaAutoComplete,
      ariaControls,
      ariaDescribedBy,
      ariaExpanded,
      ariaLabel,
      ariaMultiline,
      onBlur,
      onFocus,
      textAlignment,
      handleReturn,
      readOnly,
      onBackspace,
      experiments,
    } = this.props;
    const { editorState } = this.state;
    const { theme } = this.contextualData;

    return (
      <Editor
        ref={this.setEditor}
        handleReturn={
          handleReturn
            ? handleReturn(this.updateEditorState)
            : handleReturnCommand(this.updateEditorState, this.commonPubsub)
        }
        editorState={editorState}
        onChange={this.updateEditorState}
        handleBeforeInput={this.handleBeforeInput}
        handlePastedText={this.handlePastedText}
        plugins={this.plugins}
        blockStyleFn={blockStyleFn(
          theme,
          this.styleToClass,
          this.toDraftTextAlignment(textAlignment),
          experiments?.fixedTabSize?.enabled
        )}
        handleKeyCommand={handleKeyCommand(
          this.updateEditorState,
          this.getCustomCommandHandlers().commandHandlers,
          getBlockType(editorState),
          this.onKeyboardShortcutClick,
          onBackspace
        )}
        editorKey={editorKey}
        keyBindingFn={createKeyBindingFn(this.getCustomCommandHandlers().commands || [])}
        customStyleFn={this.customStyleFn}
        tabIndex={tabIndex}
        placeholder={placeholder || ''}
        spellCheck={spellCheck}
        stripPastedStyles={stripPastedStyles}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        ariaActiveDescendantID={ariaActiveDescendantID}
        ariaAutoComplete={ariaAutoComplete}
        ariaControls={ariaControls}
        ariaDescribedBy={ariaDescribedBy}
        ariaExpanded={ariaExpanded}
        ariaLabel={ariaLabel}
        ariaMultiline={ariaMultiline}
        onBlur={onBlur}
        onFocus={onFocus}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onCut={onCut}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onCopy={onCopy}
        textAlignment={this.toDraftTextAlignment(textAlignment)}
        readOnly={readOnly || this.state.readOnly}
        handlePastedFiles={this.handlePastedFiles}
        handleDroppedFiles={this.handleDroppedFiles}
      />
    );
  };

  renderInnerRCE = ({
    editorState,
    setRef,
    onChange,
    renderedIn,
    onBackspaceAtBeginningOfContent,
    direction,
    additionalProps,
    toolbarsToIgnore,
    tablePluginMenu,
    onFocus,
    onBlur,
  }) => {
    return (
      <InnerRCE
        {...this.props}
        ref={setRef}
        onChange={onChange}
        editorState={editorState}
        theme={this.contextualData.theme}
        innerRCERenderedIn={renderedIn}
        setInPluginEditingMode={this.setInPluginEditingMode}
        onBackspaceAtBeginningOfContent={onBackspaceAtBeginningOfContent}
        direction={direction}
        additionalProps={additionalProps}
        setEditorToolbars={this.props.setEditorToolbars}
        toolbarsToIgnore={toolbarsToIgnore}
        handleUndoCommand={this.handleUndoCommand}
        handleRedoCommand={this.handleRedoCommand}
        tablePluginMenu={tablePluginMenu}
        onFocus={onFocus}
        onBlur={onBlur}
        getDocumentStyle={this.props.getDocumentStyle || this.EditorCommands.getDocumentStyle}
        updateDocumentStyle={
          this.props.updateDocumentStyle || this.EditorCommands.updateDocumentStyle
        }
      />
    );
  };

  renderAccessibilityListener = () => (
    <AccessibilityListener isMobile={this.contextualData.isMobile} />
  );

  styleToClass = ([key, val]) => `rich_content_${key}-${val.toString().replace('.', '_')}`;

  styleToCss = ([key, val]) => `${key}: ${val};`;

  objectToCss = obj =>
    Object.entries(obj)
      .map(style => this.styleToCss(style))
      .join(' ');

  renderStyleTag = (editorState = this.getEditorState()) => {
    const blocks = editorState.getCurrentContent().getBlockMap();
    const styles = {};
    const documentStyle = this.EditorCommands.getDocumentStyle();
    if (documentStyle && !this.props.isInnerRCE) {
      Object.entries(documentStyle).forEach(([key, values]) => {
        [' > div > span', ' > div > a > span'].forEach(
          selector => (styles[DOC_STYLE_CLASSES[key] + selector] = this.objectToCss(values))
        );
      });
      const paragrphStyle = documentStyle[DOC_STYLE_TYPES.P];
      paragrphStyle &&
        [DOC_STYLE_CLASSES['ordered-list-item'], DOC_STYLE_CLASSES['unordered-list-item']].forEach(
          className => (styles[className] = this.objectToCss(paragrphStyle))
        );
    }

    blocks.forEach((block: ContentBlock) => {
      const { dynamicStyles = {} } = block.get('data').toJS();
      Object.entries(dynamicStyles).forEach(
        style => (styles[this.styleToClass(style)] = this.styleToCss(style))
      );
    });
    const css = Object.entries(styles).reduce(
      (cssString, [className, css]) => `${cssString}[dir] .${className} {${css}}`,
      ''
    );
    return <style id="dynamicStyles">{css}</style>;
  };

  onResize = debounce(({ bounds }: ContentRect) => this.updateBounds(bounds), 100);

  openInnerModal = data => {
    const { modalStyles, ...modalProps } = data;
    this.setState({
      innerModal: {
        modalProps,
        modalStyles,
      },
    });
  };

  closeInnerModal = () => {
    this.setState({
      innerModal: null,
    });
  };

  renderErrorToast = () => {
    return <RCEErrorToast commonPubsub={this.commonPubsub} />;
  };

  onFocus = (e: FocusEvent) => {
    if (this.inPluginEditingMode) {
      if (e.target && !e.target.closest('[data-id=inner-rce], .rich-content-editor-theme_atomic')) {
        this.setInPluginEditingMode(false);
        this.props.setEditorToolbars?.(this);
      }
    }
  };

  disableFocusInSelection = (editorState: EditorState) => {
    const selection = editorState.getSelection().merge({ hasFocus: false });
    const newEditorState = EditorState.set(editorState, {
      selection,
    });
    this.updateEditorState(newEditorState);
  };

  onBlur = e => {
    const { editorState } = this.state;
    const { isInnerRCE } = this.props;
    if (!isInnerRCE && !this.inPluginEditingMode) {
      if (e.relatedTarget && e.relatedTarget.closest('[data-id=inner-rce]')) {
        this.setInPluginEditingMode(true);
      }
    }
    if (isInnerRCE && editorState.isInCompositionMode()) {
      this.disableFocusInSelection(editorState);
    }
  };

  setEditorWrapper = ref => ref && (this.editorWrapper = ref);

  render() {
    const {
      onError,
      locale,
      direction,
      showToolbars = true,
      isInnerRCE,
      editorStyleClasses = {},
      experiments,
    } = this.props;
    const { innerModal } = this.state;

    try {
      if (this.state.error) {
        onError(this.state.error);
        return null;
      }
      const { theme } = this.contextualData;

      const { containerClassName, editorClassName } = editorStyleClasses;

      return (
        <GlobalContext.Provider value={this.state.context}>
          <Measure bounds onResize={this.onResize}>
            {({ measureRef }) => (
              <div
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                style={this.props.style}
                ref={measureRef}
                className={classNames(draftStyles.wrapper, containerClassName || '')}
                dir={direction || getLangDir(this.props.locale)}
                data-id={'rce'}
                data-hook={!isInnerRCE ? 'root-editor' : 'inner-editor'}
              >
                {this.renderStyleTag()}
                <div
                  ref={this.setEditorWrapper}
                  className={editorClassName}
                  style={isInnerRCE ? { backgroundColor: 'transparent' } : {}}
                >
                  {this.renderAccessibilityListener()}

                  {this.renderEditor()}
                  {showToolbars && this.renderToolbars()}
                  {this.renderInlineModals()}
                  {this.renderErrorToast()}
                  <InnerModal
                    theme={theme}
                    locale={locale}
                    innerModal={innerModal}
                    closeInnerModal={this.closeInnerModal}
                    editorWrapper={this.editorWrapper}
                  />
                </div>
              </div>
            )}
          </Measure>
        </GlobalContext.Provider>
      );
    } catch (err) {
      onError(err);
      return null;
    }
  }
}

export default RichContentEditor;

declare global {
  interface Window {
    __RICOS_INFO__: { getContent; getConfig };
  }
}
