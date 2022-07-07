/* eslint-disable brace-style */
import type { Node } from 'prosemirror-model';
import type { RefObject } from 'react';
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
import type { EditorCommands, EditorContextType, Pubsub } from 'wix-rich-content-common';
import { getLangDir } from 'wix-rich-content-common';
import { getEmptyDraftContent } from 'wix-rich-content-editor-common';
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

const events = new RicosEvents();
const modalService = new RicosModalService(events);
const styles = new RicosStyles();
const shortcuts = new EditorKeyboardShortcuts(events);
const editorPlugins = new EditorPlugins(modalService);

export class FullRicosEditor
  extends React.Component<RicosEditorProps, State>
  implements RicosEditorRef
{
  nodeService = {
    nodeToRicosNode: node => {
      return fromTiptapNode(node.toJSON());
    },
  };

  content = Content.create<Node[]>([], { styles, nodeService: this.nodeService });

  state = { error: '' };

  editor = React.createRef<RicosEditorRef>();

  portalRef: RefObject<RicosPortalType>;

  private tiptapAdapter!: TiptapAdapter;

  constructor(props) {
    super(props);
    this.portalRef = createRef<RicosPortalType>();
  }

  static getDerivedStateFromError(error: string) {
    return { error };
  }

  initPlugins = () => {
    const { plugins, _rcProps } = this.props;
    const configuredPlugins = pluginsConfigMerger(plugins, _rcProps) || [];
    configuredPlugins.forEach(plugin => editorPlugins.register(plugin));
    const { handleFileUpload, handleFileSelection } = _rcProps?.helpers || {};
    editorPlugins.configure({ handleFileUpload, handleFileSelection });
  };

  componentDidMount() {
    this.initPlugins();
    this.tiptapAdapter = initializeTiptapAdapter(this.props, {
      events,
      styles,
      plugins: editorPlugins,
    });

    this.forceUpdate();
  }

  componentWillUnmount() {
    editorPlugins.destroy();
    modalService.destroy();
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  focus: RicosEditorRef['focus'] = () => {
    this.editor.current?.focus();
  };

  blur: RicosEditorRef['blur'] = () => {
    this.editor.current?.blur();
  };

  getContent: RicosEditorRef['getContent'] = (postId, forPublish, shouldRemoveErrorBlocks = true) =>
    this.editor.current?.getContent(postId, forPublish, shouldRemoveErrorBlocks) ||
    Promise.resolve(getEmptyDraftContent());

  getContentPromise: RicosEditorRef['getContentPromise'] = ({ publishId } = {}) =>
    this.getContent(publishId, !!publishId);

  getContentTraits: RicosEditorRef['getContentTraits'] = () => {
    return (
      this.editor.current?.getContentTraits() || {
        isEmpty: false,
        isContentChanged: false,
        isLastChangeEdit: false,
      }
    );
  };

  getToolbarProps: RicosEditorRef['getToolbarProps'] = type => {
    return (
      this.editor.current?.getToolbarProps(type) || {
        buttons: {},
        context: {} as EditorContextType,
        pubsub: {} as Pubsub,
      }
    );
  };

  getEditorCommands: RicosEditorRef['getEditorCommands'] = () => {
    return this.tiptapAdapter?.getEditorCommands() || ({} as EditorCommands);
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
      plugins: editorPlugins,
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
      <EventsContextProvider events={events}>
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
                  <ModalContextProvider modalService={modalService}>
                    <ShortcutsContextProvider shortcuts={shortcuts}>
                      <PluginsContextProvider plugins={editorPlugins}>
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
                                <RicosEditor {...this.props} ref={this.editor} />
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

export default forwardRef<FullRicosEditor, RicosEditorProps>((props, ref) => {
  return <FullRicosEditor {...props} ref={ref} />;
});
