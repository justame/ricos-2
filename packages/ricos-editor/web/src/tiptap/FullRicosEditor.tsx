import type { ForwardedRef, RefObject } from 'react';
import React, { createRef, forwardRef } from 'react';
import type { RicosEditorProps } from 'ricos-common';
import { ErrorNotifier } from 'ricos-common';
import { ContentQueryProvider } from 'ricos-content-query';
import type { ToolbarContextType } from 'ricos-context';
import {
  EditorContextProvider,
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
import { getLangDir } from 'wix-rich-content-common';
import RicosPortal from '../modals/RicosPortal';
import type { RicosEditorRef } from '../RicosEditorRef';
import { convertToolbarContext } from '../toolbars/convertToolbarContext';
import RicosEditor from './RicosEditor';
import RicosStylesRenderer from './RicosStyles';
import RicosToolbars from './RicosToolbars';
import { RicosOrchestrator } from 'ricos-orchestrator';
import s from '../../statics/styles/editor-styles.scss';
import { FooterToolbarPlaceholder } from '../toolbars/FooterToolbarPlaceholder';

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

  constructor(props: Props) {
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
    this.orchestrator.getServices().editor.publishError(error, errorInfo);
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

  getToolbarContext(): ToolbarContextType {
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
    const { plugins, editor } = this.orchestrator.getServices();

    const toolbarContext = convertToolbarContext({
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
      contentId: '',
      getEditorCommands: editor.getEditorCommands,
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
      editor,
      styles,
      toolbars,
    } = this.orchestrator.getServices();

    const languageDir = getLangDir(locale);
    return (
      <div data-hook="fullRicosEditor" className={s.fullRicosEditor}>
        <StylesContextProvider styles={styles}>
          <>
            <RicosPortal
              languageDir={languageDir}
              ref={this.portalRef}
              className={theme?.parentClass}
            >
              <RicosStylesRenderer
                theme={theme || {}}
                documentStyle={content?.documentStyle || {}}
              />
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
                  <EditorContextProvider editor={editor}>
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
                                  <ToolbarContext.Provider
                                    value={{
                                      ...this.getToolbarContext(),
                                      toolbars,
                                      portal: this.portalRef.current as RicosPortalType,
                                    }}
                                  >
                                    <>
                                      <ContentQueryProvider editor={editor.adapter.tiptapEditor}>
                                        <RicosToolbars
                                          content={toolbarContent}
                                          toolbarSettings={toolbarSettings}
                                          plugins={plugins}
                                        />
                                      </ContentQueryProvider>

                                      <ModalRenderer />
                                    </>
                                  </ToolbarContext.Provider>
                                </UploadContextProvider>
                                <Shortcuts group="formatting">
                                  <RicosEditor {...this.props} ref={this.props.forwardRef} />
                                </Shortcuts>
                                <FooterToolbarPlaceholder />
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
      </div>
    );
  }
}

export default forwardRef<RicosEditorRef, RicosEditorProps & { t: TranslationFunction }>(
  (props, ref) => {
    return <FullRicosEditor {...props} forwardRef={ref} />;
  }
);
