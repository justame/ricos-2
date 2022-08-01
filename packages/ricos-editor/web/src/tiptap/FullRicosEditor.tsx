import type { ForwardedRef, RefObject } from 'react';
import React, { createRef, forwardRef } from 'react';
import type { RicosEditorProps } from 'ricos-common';
import { ErrorNotifier } from 'ricos-common';
import { ContentQueryProvider } from 'ricos-content-query';
import type { ToolbarContextType } from 'ricos-context';
import {
  EditorContextConsumer,
  EditorContextProvider,
  EventsContextProvider,
  ModalContextProvider,
  PluginsContextProvider,
  RicosContextProvider,
  ShortcutsContextProvider,
  StylesContextProvider,
  ToolbarContext,
  UploadContextProvider,
} from 'ricos-context';
import { ModalRenderer } from 'ricos-modals';
import { Shortcuts } from 'ricos-shortcuts';
import type {
  Orchestrator,
  RicosPortal as RicosPortalType,
  TranslationFunction,
} from 'ricos-types';
import type { EditorCommands } from 'wix-rich-content-common';
import { getLangDir } from 'wix-rich-content-common';
import type { RichContentAdapter } from 'wix-tiptap-editor';
import RicosPortal from '../modals/RicosPortal';
import type { RicosEditorRef } from '../RicosEditorRef';
import { convertToolbarContext } from '../toolbars/convertToolbarContext';
import RicosEditor from './RicosEditor';
import RicosStylesRenderer from './RicosStyles';
import RicosToolbars from './RicosToolbars';
import { RicosOrchestrator } from 'ricos-orchestrator';

type State = {
  error: string;
};

type Props = RicosEditorProps & {
  forwardRef: ForwardedRef<RicosEditorRef>;
  t: TranslationFunction;
};

export class FullRicosEditor extends React.Component<Props, State> {
  state = { error: '' };

  portalRef: RefObject<RicosPortalType>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorNotifier: React.RefObject<any>;

  inputRef: React.RefObject<HTMLInputElement>;

  orchestrator: Orchestrator;

  constructor(props) {
    super(props);
    this.portalRef = createRef<RicosPortalType>();
    this.errorNotifier = React.createRef();
    this.inputRef = React.createRef();
    this.orchestrator = new RicosOrchestrator(props, props.t);
  }

  static getDerivedStateFromError(error: string) {
    return { error };
  }

  componentDidMount() {
    this.orchestrator.setUpdateServiceDom(
      () => this.errorNotifier.current,
      () => this.inputRef.current as HTMLInputElement
    );

    this.forceUpdate();
  }

  componentWillUnmount() {
    this.orchestrator.finalize();
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  renderUploadServiceElements = (languageDir: string) => {
    return (
      <>
        <ErrorNotifier
          ref={this.errorNotifier}
          isMobile={this.props.isMobile}
          languageDir={languageDir}
        />
        <input
          ref={this.inputRef}
          id={'ricos-file-upload-input'}
          key="ricosUploadInput"
          type="file"
          style={{ display: 'none' }}
          tabIndex={-1}
          multiple
        />
      </>
    );
  };

  getToolbarContext(getEditorCommands: () => EditorCommands): ToolbarContextType {
    const {
      theme,
      locale,
      linkPanelSettings,
      linkSettings,
      experiments,
      cssOverride,
      isMobile,
      toolbarSettings,
    } = this.props;
    const helpers = this.props._rcProps?.helpers;

    const toolbarContext = convertToolbarContext({
      isMobile,
      theme,
      locale,
      helpers,
      plugins: this.orchestrator.getServices().plugins,
      linkPanelSettings,
      linkSettings,
      experiments,
      toolbarSettings,
      cssOverride,
      contentId: '',
      getEditorCommands,
    });
    return toolbarContext as unknown as ToolbarContextType;
  }

  render() {
    try {
      if (this.state.error) {
        this.props.onError?.(this.state.error);
        return null;
      }

      return this.renderEditor();
    } catch (e) {
      this.props.onError?.(e);
      return null;
    }
  }

  private renderEditor() {
    const { t, isMobile, experiments, locale, localeContent, theme, toolbarSettings, content } =
      this.props;

    const {
      plugins,
      shortcuts,
      content: toolbarContent,
      modals,
      uploadService,
      updateService,
      tiptapAdapter,
      styles,
    } = this.orchestrator.getServices();

    const languageDir = getLangDir(locale);
    return (
      <StylesContextProvider styles={styles}>
        <>
          <RicosPortal
            languageDir={languageDir}
            ref={this.portalRef}
            className={theme?.parentClass}
          >
            <RicosStylesRenderer theme={theme || {}} documentStyle={content?.documentStyle || {}} />
          </RicosPortal>
          {this.portalRef.current && (
            <RicosContextProvider
              t={t}
              isMobile={isMobile}
              experiments={experiments}
              locale={locale}
              localeContent={localeContent}
              languageDir={languageDir}
              theme={theme}
              portal={this.portalRef.current}
            >
              <>
                <EditorContextProvider adapter={tiptapAdapter}>
                  <ModalContextProvider modalService={modals}>
                    <ShortcutsContextProvider shortcuts={shortcuts}>
                      <PluginsContextProvider plugins={plugins}>
                        <>
                          <Shortcuts group="global" root>
                            <>
                              <UploadContextProvider
                                uploadService={uploadService}
                                updateService={updateService}
                              >
                                <>
                                  <EditorContextConsumer>
                                    {(editor: RichContentAdapter) => (
                                      <ToolbarContext.Provider
                                        value={{
                                          ...this.getToolbarContext(editor.getEditorCommands),
                                          portal: this.portalRef.current as RicosPortalType,
                                        }}
                                      >
                                        <ContentQueryProvider editor={editor.tiptapEditor}>
                                          <RicosToolbars
                                            content={toolbarContent}
                                            toolbarSettings={toolbarSettings}
                                            plugins={plugins}
                                          />
                                        </ContentQueryProvider>
                                      </ToolbarContext.Provider>
                                    )}
                                  </EditorContextConsumer>
                                  <ModalRenderer />
                                </>
                              </UploadContextProvider>
                              <Shortcuts group="formatting">
                                <RicosEditor {...this.props} ref={this.props.forwardRef} />
                              </Shortcuts>
                            </>
                          </Shortcuts>
                        </>
                      </PluginsContextProvider>
                    </ShortcutsContextProvider>
                  </ModalContextProvider>
                </EditorContextProvider>
                {this.renderUploadServiceElements(languageDir)}
              </>
            </RicosContextProvider>
          )}
        </>
      </StylesContextProvider>
    );
  }
}

export default forwardRef<RicosEditorRef, RicosEditorProps & { t: TranslationFunction }>(
  (props, ref) => {
    return <FullRicosEditor {...props} forwardRef={ref} />;
  }
);
