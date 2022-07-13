/* eslint-disable */
import React, { PureComponent } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { compact, flatMap, debounce } from 'lodash';
import { set, get } from 'local-storage';
import { ErrorBoundary, Fab, SectionHeader, SectionContent, ExternalToolbar } from './Components';
import {
  generateKey,
  loadStateFromStorage,
  saveStateToStorage,
  disableBrowserBackButton,
} from './utils';
import { SectionSettings, OnVisibilityChanged } from './types';
import { DraftContent, ToolbarType } from 'wix-rich-content-common';
import ContentStateEditorType from './Components/ContentStateEditor';
import { ensureDraftContent } from 'ricos-content/libs/ensureDraftContent';
import { themeStrategy } from 'ricos-common';
import { FONTS, EXPERIMENTS, ricosPalettes } from '../../storybook/src/shared/resources';
import { mockFetchUrlPreviewData } from '../../storybook/src/shared/utils/linkPreviewUtil';
import { config as initialPluginConfig, addPluginMenuConfig } from '../shared/editor/EditorPlugins';

const ContentStateEditor = React.lazy(() => import('./Components/ContentStateEditor'));
const EditorSettings = React.lazy(() => import('./Components/EditorSettings'));
const Editor = React.lazy(() => import('../shared/editor/Editor'));
const Viewer = React.lazy(() => import('../shared/viewer/Viewer'));
const Preview = React.lazy(() => import('../shared/preview/Preview'));

interface ExampleAppProps {
  isMobile?: boolean;
  onContentStateChange?: (contentState: DraftContent) => void;
  contentState?: DraftContent;
  injectedContent?: DraftContent;
  setLocale?: (locale: string) => void;
  locale?: string;
  allLocales?: string[];
  onRicosEditorChange?: (contentState: DraftContent) => void;
  localeResource?: Record<string, string>;
}

interface ExampleAppState {
  containerKey?: string;
  isEditorShown?: boolean;
  isViewerShown?: boolean;
  isPreviewShown?: boolean;
  isContentStateShown?: boolean;
  isEditorSettingsShown?: boolean;
  viewerResetKey?: number;
  previewResetKey?: number;
  editorResetKey?: number;
  shouldNativeUpload?: boolean;
  shouldUseNewContent?: boolean;
  [key: string]: any;
}

class ExampleApp extends PureComponent<ExampleAppProps, ExampleAppState> {
  editorSettings: SectionSettings[];
  viewerSettings: SectionSettings[];
  editorScrollingElementFn: () => Element;
  viewerScrollingElementFn: () => Element;
  contentStateEditor: ContentStateEditorType;

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.initSectionsSettings();
    disableBrowserBackButton();
  }

  getInitialState() {
    const { isMobile } = this.props;
    const containerKey = generateKey('container');
    const localState = loadStateFromStorage();
    return {
      containerKey,
      isEditorShown: true,
      isViewerShown: !isMobile,
      isPreviewShown: false,
      isContentStateShown: false,
      isEditorSettingsShown: false,
      viewerResetKey: 0,
      previewResetKey: 0,
      editorResetKey: 0,
      shouldNativeUpload: false,
      shouldUseNewContent: false,
      activeFont: 0,
      activePalette: 0,
      experiments: get('experiments') || {},
      externalToolbarToShow: ToolbarType.FORMATTING,
      textWrap: true,
      showSideBlockComponent: false,
      editorKey: 1,
      editorSettings: {
        pluginsConfig: initialPluginConfig,
        toolbarConfig: { addPluginMenuConfig },
      },
      ...localState,
    };
  }

  componentDidMount() {
    this.editorScrollingElementFn = () =>
      typeof window !== 'undefined' && document.getElementsByClassName('editor-example')[0];
    this.viewerScrollingElementFn = () =>
      typeof window !== 'undefined' && document.getElementsByClassName('viewer-example')[0];
    window && window.addEventListener('resize', this.onContentStateEditorResize);
    const contentState = this.loadContentStateFromLocalStorage();
    if (contentState) {
      this.props.onContentStateChange(contentState);
    }
    if (this.getExperiments()?.newFormattingToolbar?.value === undefined) {
      this.onSetExperiment('newFormattingToolbar', 'true');
    }
  }

  componentWillUnmount() {
    window && window.removeEventListener('resize', this.onContentStateEditorResize);
  }

  componentDidUpdate(prevProps) {
    this.saveContentStateToLocalStorage(this.props.contentState);
  }

  saveContentStateToLocalStorage = debounce(contentState => set('contentState', contentState), 500);

  loadContentStateFromLocalStorage = (): DraftContent => get('contentState');

  setContentStateEditor = (ref: ContentStateEditorType) => (this.contentStateEditor = ref);

  onContentStateEditorResize = () =>
    this.contentStateEditor && this.contentStateEditor.refreshLayout();

  onSectionVisibilityChange: OnVisibilityChanged = (sectionName, isVisible) => {
    this.setState(
      { [`is${sectionName}Shown`]: isVisible, containerKey: generateKey('prefix') },
      () => {
        saveStateToStorage(this.state);
      }
    );
    this.onContentStateEditorResize();
  };

  onSetLocale = (locale: string) => {
    this.props.setLocale && this.props.setLocale(locale);
  };

  setEditorSettings = editorSettings =>
    this.setState({ editorSettings, editorKey: this.state.editorKey + 1 });

  initSectionsSettings = () => {
    const {
      editorIsMobile,
      staticToolbar,
      externalToolbarToShow,
      shouldNativeUpload,
      shouldUseNewContent,
      externalPopups,
      textWrap,
      showSideBlockComponent,
    } = this.state;
    this.editorSettings = [
      {
        name: 'Mobile',
        active: editorIsMobile,
        action: () =>
          this.setState(state => ({
            editorIsMobile: !state.editorIsMobile,
            editorResetKey: state.editorResetKey + 1,
          })),
      },
      {
        name: 'Use New Content',
        active: shouldUseNewContent,
        action: () => {
          this.setState(state => ({
            shouldUseNewContent: !state.shouldUseNewContent,
          }));
        },
      },
      {
        name: 'New Formatting Toolbar',
        active: this.getExperiments()?.newFormattingToolbar?.value === 'true',
        action: () =>
          this.onSetExperiment(
            'newFormattingToolbar',
            this.getExperiments()?.newFormattingToolbar?.value === 'true' ? 'false' : 'true'
          ),
      },
      {
        name: 'Static Toolbar',
        active: staticToolbar,
        action: () =>
          this.setState(state => ({
            staticToolbar: !state.staticToolbar,
            editorResetKey: state.editorResetKey + 1,
          })),
      },
      {
        name: 'External Toolbar',
        active: externalToolbarToShow,
        action: selectedExternalToolbar =>
          this.setState({ externalToolbarToShow: selectedExternalToolbar }),
        items: [ToolbarType.FORMATTING, ToolbarType.INSERT_PLUGIN],
      },
      {
        name: 'Native Upload Mock',
        active: shouldNativeUpload,
        action: () =>
          this.setState(state => ({
            shouldNativeUpload: !state.shouldNativeUpload,
            editorResetKey: state.editorResetKey + 1,
          })),
      },
      {
        name: 'External Link Popups',
        active: externalPopups,
        action: () =>
          this.setState(state => ({
            externalPopups: !state.externalPopups,
            editorResetKey: state.editorResetKey + 1,
          })),
      },
      {
        name: 'TextWrap',
        active: textWrap,
        action: () =>
          this.setState(state => ({
            textWrap: !state.textWrap,
            editorResetKey: state.editorResetKey + 1,
          })),
      },
      {
        name: 'Locale',
        active: this.props.locale,
        action: selectedLocale => this.onSetLocale(selectedLocale),
        items: this.props.allLocales,
      },
      {
        name: 'Experiments',
        getActive: this.getExperiments,
        action: this.onSetExperiment,
        items: EXPERIMENTS,
        itemsType: 'experiments',
      },
      {
        name: 'Palettes',
        getActive: this.getActivePalette,
        action: this.onPaletteChange,
        items: ricosPalettes,
        itemsType: 'palettes',
      },
      {
        name: 'Fonts',
        getActive: this.getActiveFont,
        action: this.onFontChange,
        items: FONTS,
        itemsType: 'fonts',
      },
      {
        name: 'Side Node Component (Notes)',
        active: showSideBlockComponent,
        action: () =>
          this.setState(state => ({
            showSideBlockComponent: !state.showSideBlockComponent,
            editorResetKey: state.editorResetKey + 1,
          })),
      },
    ];

    this.viewerSettings = [
      {
        name: 'Mobile',
        action: () =>
          this.setState(state => ({
            viewerIsMobile: !state.viewerIsMobile,
            viewerResetKey: state.viewerResetKey + 1,
          })),
      },
    ];
  };

  getActivePalette = () => this.state.activePalette;

  getExperiments = () => this.state.experiments;

  getActiveFont = () => this.state.activeFont;

  getThemeObj = (activeFont, activePalette) => {
    const themeObj: any = {};
    activeFont !== undefined && (themeObj.customStyles = FONTS[activeFont]);
    activePalette !== undefined && (themeObj.palette = ricosPalettes[activePalette]);
    return themeObj;
  };

  onPaletteChange = i => {
    this.setState({
      activePalette: i,
    });
    set('activePalette', i);
  };

  onFontChange = i => {
    this.setState({ activeFont: i });
    set('activeFont', i);
  };

  onSetExperiment = (name: string, value: any) => {
    const experiments = {
      ...this.state.experiments,
      [name]: { enabled: value && value !== 'false', namespace: 'ricos', value },
    };
    this.setState({ experiments });
    set('experiments', experiments);
    window.location.reload();
  };

  renderEditor = () => {
    const { locale, isMobile, contentState, injectedContent, onRicosEditorChange } = this.props;
    const {
      isEditorShown,
      staticToolbar,
      externalToolbarToShow,
      editorIsMobile,
      shouldNativeUpload,
      experiments,
      externalPopups,
      textWrap,
      showSideBlockComponent,
    } = this.state;

    return (
      isEditorShown && (
        <ReflexElement
          key={`editor-section-${this.state.editorResetKey}`}
          className="section editor-example"
        >
          <SectionHeader
            title={experiments?.tiptapEditor?.enabled ? 'Tiptap 👍' : 'Draft 👎'}
            onClick={() =>
              this.onSetExperiment(
                'tiptapEditor',
                experiments?.tiptapEditor?.enabled ? 'false' : 'true'
              )
            }
            settings={this.editorSettings}
            onHide={this.onSectionVisibilityChange}
          />
          <SectionContent>
            <ErrorBoundary>
              <Editor
                isMobile={editorIsMobile || isMobile}
                shouldNativeUpload={shouldNativeUpload}
                staticToolbar={staticToolbar}
                externalPopups={externalPopups}
                externalToolbarToShow={externalToolbarToShow}
                locale={locale}
                scrollingElementFn={this.editorScrollingElementFn}
                externalToolbar={ExternalToolbar}
                contentState={contentState}
                injectedContent={injectedContent}
                onRicosEditorChange={onRicosEditorChange}
                experiments={experiments}
                textWrap={textWrap}
                showSideBlockComponent={showSideBlockComponent}
                // testAppConfig={this.state.editorSettings}
                key={this.state.editorKey}
                ricosTheme={this.getThemeObj(this.state.activeFont, this.state.activePalette)}
              />
            </ErrorBoundary>
          </SectionContent>
        </ReflexElement>
      )
    );
  };

  renderPreview = () => {
    const { contentState, isMobile, locale, localeResource } = this.props;
    const { isPreviewShown } = this.state;
    const settings = [
      {
        name: 'Mobile',
        action: () =>
          this.setState(state => ({
            previewIsMobile: !state.previewIsMobile,
            previewResetKey: state.previewResetKey + 1,
          })),
      },
    ];
    return (
      isPreviewShown && (
        <ReflexElement
          key={`preview-section-${this.state.previewResetKey}`}
          className="section preview-example"
        >
          <SectionHeader
            title="Preview"
            settings={settings}
            onHide={this.onSectionVisibilityChange}
          />
          <SectionContent>
            <ErrorBoundary>
              <Preview
                initialState={ensureDraftContent(contentState)}
                isMobile={this.state.previewIsMobile || isMobile}
                locale={locale}
                localeResource={localeResource}
              />
            </ErrorBoundary>
          </SectionContent>
        </ReflexElement>
      )
    );
  };

  renderViewer = () => {
    const { contentState, isMobile, locale } = this.props;
    const { isViewerShown, experiments } = this.state;

    return (
      isViewerShown && (
        <ReflexElement
          key={`viewer-section-${this.state.viewerResetKey}`}
          className="section viewer-example"
        >
          <SectionHeader
            title="Viewer"
            settings={this.viewerSettings}
            onHide={this.onSectionVisibilityChange}
          />
          <SectionContent>
            <ErrorBoundary>
              <Viewer
                initialState={contentState}
                isMobile={this.state.viewerIsMobile || isMobile}
                locale={locale}
                scrollingElementFn={this.viewerScrollingElementFn}
                experiments={experiments}
                linkPreviewPopoverFetchData={mockFetchUrlPreviewData()}
              />
            </ErrorBoundary>
          </SectionContent>
        </ReflexElement>
      )
    );
  };

  renderContentState = () => {
    const { contentState, onContentStateChange } = this.props;
    const { isContentStateShown, shouldUseNewContent } = this.state;
    return (
      isContentStateShown && (
        <ReflexElement
          key="contentstate-section"
          className="section"
          onStopResize={this.onContentStateEditorResize}
        >
          <SectionHeader title="Content State" onHide={this.onSectionVisibilityChange} />
          <SectionContent>
            <ContentStateEditor
              ref={this.setContentStateEditor}
              onChange={onContentStateChange}
              contentState={contentState}
              shouldUseNewContent={shouldUseNewContent}
            />
          </SectionContent>
        </ReflexElement>
      )
    );
  };

  renderEditorSettings = () => {
    const { isEditorSettingsShown } = this.state;
    return (
      isEditorSettingsShown && (
        <ReflexElement key="editorsettings-section" className="section">
          <SectionHeader title="Editor Settings" onHide={this.onSectionVisibilityChange} />
          <SectionContent>
            <EditorSettings
              setEditorSettings={this.setEditorSettings}
              editorSettings={this.state.editorSettings}
            />
          </SectionContent>
        </ReflexElement>
      )
    );
  };

  setSectionVisibility: OnVisibilityChanged = (sectionName, isVisible) =>
    this.setState({ [`show${sectionName}`]: isVisible });

  renderSections = () => {
    const sections = compact([
      this.renderEditor(),
      this.renderViewer(),
      this.renderPreview(),
      this.renderContentState(),
      this.renderEditorSettings(),
    ]);

    return flatMap(sections, (val, i, arr) =>
      arr.length - 1 !== i
        ? [val, <ReflexSplitter className="splitter" propagate={true} key={`splitter-${i}`} />]
        : val
    );
  };

  render() {
    const { isMobile } = this.props;
    const {
      isEditorShown,
      isViewerShown,
      isContentStateShown,
      isPreviewShown,
      isEditorSettingsShown,
    } = this.state;
    const showEmptyState =
      !isEditorShown && !isViewerShown && !isContentStateShown && !isPreviewShown;
    this.initSectionsSettings();

    return (
      <div className="wrapper">
        <ReflexContainer orientation="vertical" windowResizeAware={true} className="container">
          {showEmptyState ? (
            <div className="empty-state">Wix Rich Content</div>
          ) : (
            this.renderSections()
          )}
        </ReflexContainer>
        <Fab
          isMobile={isMobile}
          isEditorShown={isEditorShown}
          isViewerShown={isViewerShown}
          isPreviewShown={isPreviewShown}
          isContentStateShown={isContentStateShown}
          isEditorSettingsShown={isEditorSettingsShown}
          toggleSectionVisibility={this.onSectionVisibilityChange}
        />
      </div>
    );
  }
}

export default ExampleApp;
