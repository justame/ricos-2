/* eslint-disable brace-style */
import type { RicosEditorProps } from 'ricos-common';
import type {
  TiptapAdapter,
  IRicosEditor,
  EventSource,
  PublisherProvider,
  RicosServices,
  PolicySubscriber,
  SubscriptorProvider,
  Subscription,
  EditorEventSource,
  UploadObserver,
} from 'ricos-types';
import { initializeTiptapAdapter } from 'wix-tiptap-editor';

type Topics = [
  'ricos.editor.instance.loaded',
  'ricos.editor.instance.error',
  'ricos.editor.functionality.firstEdit',
  'ricos.editor.content.saved'
];

const topics: Topics = [
  'ricos.editor.instance.loaded',
  'ricos.editor.instance.error',
  'ricos.editor.functionality.firstEdit',
  'ricos.editor.content.saved',
];

type UploadTopics = [
  'ricos.upload.functionality.uploadStarted',
  'ricos.upload.functionality.uploadFinished'
];

const UPLOAD_TOPICS: UploadTopics = [
  'ricos.upload.functionality.uploadStarted',
  'ricos.upload.functionality.uploadFinished',
];

export class RicosEditor
  implements
    IRicosEditor,
    EventSource<Topics>,
    PolicySubscriber<UploadTopics>,
    UploadObserver,
    EditorEventSource
{
  private tiptapAdapter: TiptapAdapter;

  id = 'ricos-editor';

  private activeUploads = [] as string[];

  private uploadStartedSubscription!: Subscription;

  private uploadFinishedSubscription!: Subscription;

  constructor(
    editorProps: RicosEditorProps,
    services: Omit<RicosServices, 'editor' | 'zIndexService' | 'editorQuery'>,
    isDebugMode = false
  ) {
    this.tiptapAdapter = initializeTiptapAdapter(editorProps, services, isDebugMode);
  }

  topicsToPublish = topics;

  topicsToSubscribe = UPLOAD_TOPICS;

  publishers!: PublisherProvider<Topics>;

  subscriptors!: SubscriptorProvider<UploadTopics>;

  publishLoaded() {
    return this.publishers
      .byTopic('ricos.editor.instance.loaded')
      .publish({ msg: '🖖 editor mounted' });
  }

  publishFirstEdit() {
    return this.publishers
      .byTopic('ricos.editor.functionality.firstEdit')
      .publishOnce({ msg: '📝 first content edit' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishError(error: any, errorInfo: any): boolean {
    return this.publishers.byTopic('ricos.editor.instance.error').publish({ error, errorInfo });
  }

  publishContentSaved(): boolean {
    return this.publishers
      .byTopic('ricos.editor.content.saved')
      .publish({ msg: '💾 content saved' });
  }

  get adapter() {
    return this.tiptapAdapter;
  }

  getEditorCommands = () => this.tiptapAdapter.getEditorCommands();

  initializeUploadObserver() {
    this.uploadStartedSubscription = this.subscriptors
      .byTopic('ricos.upload.functionality.uploadStarted')
      .subscribe((_, { correlationId }) => {
        this.activeUploads.push(correlationId);
      });
    this.uploadFinishedSubscription = this.subscriptors
      .byTopic('ricos.upload.functionality.uploadFinished')
      .subscribe((_, { correlationId }) => {
        this.activeUploads = this.activeUploads.filter(id => id !== correlationId);
      });
  }

  hasActiveUploads() {
    return this.activeUploads.length > 0;
  }

  finalizeUploadObserver() {
    this.uploadStartedSubscription.cancel();
    this.uploadFinishedSubscription.cancel();
  }
}
