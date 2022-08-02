/* eslint-disable brace-style */
import type { RicosEditorProps } from 'ricos-common';
import type { RicosEvents } from 'ricos-events';
import type { RicosStyles } from 'ricos-styles';
import type {
  IContent,
  RicosEditorPlugins,
  IUpdateService,
  IUploadService,
  TranslationFunction,
  TiptapAdapter,
  IRicosEditor,
  EventSource,
  PublisherProvider,
} from 'ricos-types';
import { initializeTiptapAdapter } from 'wix-tiptap-editor';
import type { RicosModalService } from 'ricos-modals';
import type { IShortcuts } from 'ricos-shortcuts';

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

type RicosProps = {
  events: RicosEvents;
  styles: RicosStyles;
  plugins: RicosEditorPlugins;
  updateService: IUpdateService;
  uploadService: IUploadService;
  t: TranslationFunction;
  content: IContent<unknown>;
  shortcuts: IShortcuts;
  modals: RicosModalService;
};

export class RicosEditor implements IRicosEditor, EventSource<Topics> {
  private tiptapAdapter: TiptapAdapter;

  constructor(editorProps: RicosEditorProps, ricosProps: RicosProps) {
    this.tiptapAdapter = initializeTiptapAdapter(editorProps, ricosProps);
  }

  topicsToPublish = topics;

  publishers!: PublisherProvider<Topics>;

  publishLoaded() {
    return this.publishers.byTopic('ricos.editor.instance.loaded').publish('🖖 editor mounted');
  }

  publishFirstEdit() {
    return this.publishers
      .byTopic('ricos.editor.functionality.firstEdit')
      .publish('📝 first content edit');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishError(error: any, errorInfo: any): boolean {
    return this.publishers.byTopic('ricos.editor.instance.error').publish({ error, errorInfo });
  }

  publishContentSaved(): boolean {
    return this.publishers.byTopic('ricos.editor.content.saved').publish('💾 content saved');
  }

  get adapter() {
    return this.tiptapAdapter;
  }

  getEditorCommands = () => this.tiptapAdapter.getEditorCommands();
}
