import type { Node } from 'prosemirror-model';
import type { ForwardedRef, RefObject } from 'react';
import React, { createRef, forwardRef } from 'react';
import type { RicosEditorProps } from 'ricos-common';
import { ContentQueryProvider } from 'ricos-content-query';
import type { ToolbarContextType } from 'ricos-context';
import {
  EditorContextConsumer,
  EditorContextProvider,
  EventsContextProvider,
  ModalContextProvider,
  PluginsContextProvider,
  ShortcutsContextProvider,
  StylesContextProvider,
  ToolbarContext,
} from 'ricos-context';
import { fromTiptapNode } from 'ricos-converters';
import { RicosEvents } from 'ricos-events';
import { ModalRenderer, RicosModalService } from 'ricos-modals';
import { EditorPlugins } from 'ricos-plugins';
import { EditorKeyboardShortcuts, Shortcuts } from 'ricos-shortcuts';
import { RicosStyles } from 'ricos-styles';
import type { TiptapAdapter } from 'ricos-tiptap-types';
import type { RicosPortal as RicosPortalType } from 'ricos-types';
import type { EditorCommands } from 'wix-rich-content-common';
import { getLangDir } from 'wix-rich-content-common';
import { Content } from 'wix-rich-content-toolbars-v3';
import type { RichContentAdapter } from 'wix-tiptap-editor';
import { initializeTiptapAdapter } from 'wix-tiptap-editor';
import RicosPortal from '../modals/RicosPortal';
import { LocaleResourceProvider } from '../RicosContext/locale-resource-provider';
import type { RicosEditorRef } from '../RicosEditorRef';
import { convertToolbarContext } from '../toolbars/convertToolbarContext';
import pluginsConfigMerger from '../utils/pluginsConfigMerger/pluginsConfigMerger';
import RicosEditor from './RicosEditor';
import RicosStylesRenderer from './RicosStyles';
import RicosToolbars from './RicosToolbars';
import { UploadProvider } from './UploadProvider';

type State = {
  error: string;
};

type Props = RicosEditorProps & {
  forwardRef: ForwardedRef<RicosEditorRef>;
};

export class FullRicosEditor extends React.Component<Props, State> {
  nodeService = {
    nodeToRicosNode: node => {
      return fromTiptapNode(node.toJSON());
    },
  };

  state = { error: '' };

  portalRef: RefObject<RicosPortalType>;

  private tiptapAdapter!: TiptapAdapter;

  private readonly events: RicosEvents;

  private readonly modalService: RicosModalService;

  private readonly styles: RicosStyles;

  private readonly shortcuts: EditorKeyboardShortcuts;

  private readonly editorPlugins: EditorPlugins;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly content: Content<Node<any>[]>;

  constructor(props) {
    super(props);
    this.portalRef = createRef<RicosPortalType>();

    this.events = new RicosEvents();
    this.modalService = new RicosModalService(this.events);
    this.styles = new RicosStyles();
    this.shortcuts = new EditorKeyboardShortcuts(this.events, this.modalService);
    this.editorPlugins = new EditorPlugins(this.modalService);
    this.content = Content.create<Node[]>([], {
      styles: this.styles,
      nodeService: this.nodeService,
    });
  }

  static getDerivedStateFromError(error: string) {
    return { error };
  }

  initPlugins = () => {
    const { plugins, _rcProps } = this.props;
    const configuredPlugins = pluginsConfigMerger(plugins, _rcProps) || [];
    configuredPlugins.forEach(plugin => this.editorPlugins.register(plugin));
    const { handleFileUpload, handleFileSelection } = _rcProps?.helpers || {};
    this.editorPlugins.configure({ handleFileUpload, handleFileSelection });
  };

  componentDidMount() {
    this.initPlugins();
    this.tiptapAdapter = initializeTiptapAdapter(this.props, {
      events: this.events,
      styles: this.styles,
      plugins: this.editorPlugins,
    });

    this.forceUpdate();
  }

  componentWillUnmount() {
    this.editorPlugins.destroy();
    this.modalService.destroy();
    this.events.clear();
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

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
      plugins: this.editorPlugins,
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
    const {
      isMobile,
      experiments,
      locale,
      localeContent,
      theme,
      _rcProps,
      toolbarSettings,
      content,
    } = this.props;

    const languageDir = getLangDir(locale);
    return (
      <EventsContextProvider events={this.events}>
        <StylesContextProvider styles={this.styles}>
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
              <LocaleResourceProvider
                isMobile={isMobile}
                experiments={experiments}
                locale={locale}
                localeContent={localeContent}
                languageDir={languageDir}
                theme={theme}
                portal={this.portalRef.current}
              >
                <EditorContextProvider adapter={this.tiptapAdapter}>
                  <ModalContextProvider modalService={this.modalService}>
                    <ShortcutsContextProvider shortcuts={this.shortcuts}>
                      <PluginsContextProvider plugins={this.editorPlugins}>
                        <>
                          <Shortcuts group="global" root>
                            <>
                              <UploadProvider helpers={_rcProps?.helpers}>
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
                                            content={this.content}
                                            toolbarSettings={toolbarSettings}
                                          />
                                        </ContentQueryProvider>
                                      </ToolbarContext.Provider>
                                    )}
                                  </EditorContextConsumer>
                                  <ModalRenderer />
                                </>
                              </UploadProvider>
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
              </LocaleResourceProvider>
            )}
          </>
        </StylesContextProvider>
      </EventsContextProvider>
    );
  }
}

export default forwardRef<RicosEditorRef, RicosEditorProps>((props, ref) => {
  return <FullRicosEditor {...props} forwardRef={ref} />;
});
