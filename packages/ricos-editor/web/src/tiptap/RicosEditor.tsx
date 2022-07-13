import type { JSONContent } from '@tiptap/core';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { RicosEditorProps } from 'ricos-common';
import { isContentStateEmpty, Version } from 'ricos-content';
import type { GeneralContext } from 'ricos-context';
import { EditorContextConsumer, EventsContextConsumer, RicosContextConsumer } from 'ricos-context';
import { Node_Type } from 'ricos-schema';
import type { HtmlAttributes, TiptapAdapter } from 'ricos-tiptap-types';
import type {
  EditorContextType,
  EditorStyleClasses,
  EventData,
  EventPublisher,
  EventRegistrar,
  EventSubscriptor,
  Pubsub,
} from 'ricos-types';
import { getEmptyDraftContent } from 'wix-rich-content-editor-common';
import {
  EditorEventsContext,
  EditorEvents,
} from 'wix-rich-content-editor-common/libs/EditorEventsContext';
import { draftToTiptap, RicosTiptapEditor, TIPTAP_TYPE_TO_RICOS_TYPE } from 'wix-tiptap-editor';
import editorCss from '../../statics/styles/editor-styles.scss';
import { PUBLISH_DEPRECATION_WARNING_v9 } from '../RicosEditor';
import type { RicosEditorRef } from '../RicosEditorRef';
import { publishBI } from '../utils/bi/publish';
import { createEditorStyleClasses } from '../utils/createEditorStyleClasses';
import errorBlocksRemover from '../utils/errorBlocksRemover';

type RicosEditorState = {
  initialContent: JSONContent;
  htmlAttributes: HtmlAttributes;
};

type Props = RicosEditorProps & {
  ricosContext: GeneralContext;
  editor: TiptapAdapter;
  events: EventRegistrar;
};

class RicosEditor extends React.Component<Props, RicosEditorState> implements RicosEditorRef {
  state: Readonly<RicosEditorState> = {
    initialContent: null as unknown as JSONContent,
    htmlAttributes: {} as HtmlAttributes,
  };

  private readonly editorStyleClasses: EditorStyleClasses;

  private isLastChangeEdit = false;

  private readonly editorLoadedPublisher: EventPublisher<EventData>;

  private readonly firstContentEditPublisher: EventPublisher<EventData>;

  private firstEdit = false;

  constructor(props) {
    super(props);
    const { isMobile, experiments } = props;
    this.editorStyleClasses = createEditorStyleClasses({
      isMobile,
      experiments,
      editorCss,
    });
    this.editorLoadedPublisher = props.events.register('ricos.editor.instance.loaded');
    this.firstContentEditPublisher = props.events.register('ricos.editor.content.firstEdit');
  }

  focus: RicosEditorRef['focus'] = () => {
    this.props.editor.focus();
  };

  blur: RicosEditorRef['blur'] = () => {
    this.props.editor.blur();
  };

  getContent: RicosEditorRef['getContent'] = (
    postId,
    forPublish,
    shouldRemoveErrorBlocks = true
  ) => {
    const draftContent = this.props.editor.getDraftContent();
    const content = shouldRemoveErrorBlocks ? errorBlocksRemover(draftContent) : draftContent;
    if (postId && forPublish) {
      console.warn(PUBLISH_DEPRECATION_WARNING_v9); // eslint-disable-line
      const onPublish = this.props._rcProps?.helpers?.onPublish;
      publishBI(content, onPublish, postId);
    }
    return Promise.resolve(content);
  };

  getContentPromise: RicosEditorRef['getContentPromise'] = ({ publishId } = {}) =>
    this.getContent(publishId, !!publishId);

  getContentTraits: RicosEditorRef['getContentTraits'] = () => {
    return {
      isEmpty: isContentStateEmpty(this.props.editor.getDraftContent()),
      isContentChanged: this.props.editor.isContentChanged(),
      isLastChangeEdit: this.isLastChangeEdit,
    };
  };

  getToolbarProps: RicosEditorRef['getToolbarProps'] = this.props.editor.getToolbarProps;

  getEditorCommands: RicosEditorRef['getEditorCommands'] = () => {
    return this.props.editor.getEditorCommands();
  };

  onSelectionUpdate = ({ selectedNodes, content }) => {
    const { onAtomicBlockFocus, onChange } = this.props;
    this.isLastChangeEdit = false;
    const textContainers = [Node_Type.PARAGRAPH, Node_Type.CODE_BLOCK, Node_Type.HEADING];
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

    if (onChange) {
      onChange(content);
    }
  };

  private getHtmlAttributes(): HtmlAttributes {
    return {
      autoCapitalize: this.props.draftEditorSettings?.autoCapitalize || 'off',
      spellCheck: this.props.draftEditorSettings?.spellCheck ? 'true' : 'false',
      autoComplete: this.props.draftEditorSettings?.autoComplete || 'off',
      autoCorrect: this.props.draftEditorSettings?.autoCorrect || 'off',
      tabIndex: this.props.draftEditorSettings?.tabIndex || 0,
    };
  }

  onUpdate = ({ content }) => {
    if (!this.firstEdit) {
      this.firstEdit = true;
      this.firstContentEditPublisher.publishOnce('📝 first content edit');
    }
    this.isLastChangeEdit = true;
    this.props.onChange?.(content);
  };

  componentDidMount() {
    const { content, injectedContent } = this.props;
    const initialContent = draftToTiptap(content ?? injectedContent ?? getEmptyDraftContent());
    const htmlAttributes = this.getHtmlAttributes();

    this.setState({
      initialContent,
      htmlAttributes,
    });

    this.props.editorEvents?.subscribe(EditorEvents.RICOS_PUBLISH, this.onPublish);
    this.editorLoadedPublisher.publish('🖖 editor mounted');
    this.reportDebuggingInfo();
  }

  componentWillUnmount() {
    this.props.editorEvents?.unsubscribe(EditorEvents.RICOS_PUBLISH, this.onPublish);
  }

  onPublish = async () => {
    const draftContent = this.props.editor.getDraftContent();
    const onPublish = this.props._rcProps?.helpers?.onPublish;
    publishBI(draftContent, onPublish);
    console.log('editor publish callback'); // eslint-disable-line
    return {
      type: 'EDITOR_PUBLISH',
      data: await Promise.resolve(draftContent),
    };
  };

  private reportDebuggingInfo() {
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
          reporter: 'Ricos Editor (Tiptap)',
          plugins: this.props.plugins?.map(p => p.type) || [],
          getContent: () => this.props.editor.getDraftContent(),
          getConfig: () => this.props.plugins?.map(p => p.config) || [],
        });
      });
    }
  }

  render() {
    const { ricosContext, editor, onLoad } = this.props;
    const { initialContent, htmlAttributes } = this.state;
    if (!initialContent) {
      return null;
    }
    return (
      <RicosTiptapEditor
        onLoad={onLoad}
        editor={editor.tiptapEditor}
        content={initialContent}
        t={ricosContext.t}
        onUpdate={this.onUpdate}
        onSelectionUpdate={this.onSelectionUpdate}
        theme={{
          modalTheme: undefined,
        }}
        htmlAttributes={htmlAttributes}
        editorStyleClasses={this.editorStyleClasses}
      />
    );
  }
}

const RicosEditorWithForwardRef = forwardRef<RicosEditorRef, RicosEditorProps>((props, ref) => (
  <EventsContextConsumer>
    {(events: EventRegistrar & EventSubscriptor) => (
      <RicosContextConsumer>
        {(ricosContext: GeneralContext) => (
          <EditorContextConsumer>
            {(editor: TiptapAdapter) => (
              <EditorEventsContext.Consumer>
                {editorEvents => (
                  <RicosEditor
                    {...props}
                    ref={ref as ForwardedRef<RicosEditor>}
                    ricosContext={ricosContext}
                    editor={editor}
                    events={events}
                    editorEvents={editorEvents}
                  />
                )}
              </EditorEventsContext.Consumer>
            )}
          </EditorContextConsumer>
        )}
      </RicosContextConsumer>
    )}
  </EventsContextConsumer>
));

export default RicosEditorWithForwardRef;
