import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import type { RicosEditorProps } from 'ricos-common';
import { StreamReader, UpdateService, UploadService } from 'ricos-common';
import { commonPluginConfig, commonPlugins } from 'ricos-common-plugins';
import { nodeConverter as nodeService } from 'ricos-converters';
import type { Node } from 'prosemirror-model';
import { RicosEvents } from 'ricos-events';
import { RicosModalService } from 'ricos-modals';
import { EditorPlugins } from 'ricos-plugins';
import { EditorKeyboardShortcuts } from 'ricos-shortcuts';
import { RicosStyles } from 'ricos-styles';
import type {
  EditorPlugin,
  INotifier,
  IUpdateService,
  IUploadService,
  LegacyEditorPluginConfig,
  RicosServices,
  TranslationFunction,
  Orchestrator,
  TopicDescriptor,
  SubscribeTopicDescriptor,
  EventData,
} from 'ricos-types';
import { Content, RicosToolbars } from 'wix-rich-content-toolbars-v3';
import { RicosEditor } from './ricos-editor';
import { getHelpersConfig } from './helpers-config';
import { PublisherInitializer, SubscriptorInitializer } from './event-orchestrators';

export class RicosOrchestrator implements Orchestrator {
  private readonly editorProps: RicosEditorProps;

  private updateService!: IUpdateService;

  private readonly events: RicosEvents;

  private readonly toolbars: RicosToolbars;

  private readonly modals: RicosModalService;

  private readonly styles: RicosStyles;

  private readonly shortcuts: EditorKeyboardShortcuts;

  private readonly plugins: EditorPlugins;

  private readonly uploadService: IUploadService;

  private readonly t: TranslationFunction;

  private readonly content: Content;

  private readonly editor: RicosEditor;

  constructor(editorProps: RicosEditorProps, t: TranslationFunction) {
    this.t = t;
    this.editorProps = editorProps;

    this.updateService = new UpdateService();
    this.events = new RicosEvents();
    this.toolbars = new RicosToolbars();
    this.styles = new RicosStyles();

    const { onMediaUploadStart, onMediaUploadEnd } = editorProps._rcProps?.helpers || {};
    this.uploadService = new UploadService(new StreamReader(), this.updateService, {
      onMediaUploadStart,
      onMediaUploadEnd,
    });

    this.modals = new RicosModalService();

    this.shortcuts = new EditorKeyboardShortcuts(this.modals);

    this.content = Content.create<Node[]>([], {
      styles: this.styles,
      nodeService,
    });
    this.plugins = new EditorPlugins(
      {
        modals: this.modals,
        events: this.events,
        uploadService: this.uploadService,
        updateService: this.updateService,
        shortcuts: this.shortcuts,
        t: this.t,
        content: this.content,
        styles: this.styles,
        toolbars: this.toolbars,
      },
      this.editorProps.toolbarSettings || {}
    );

    this.initPlugins(commonPlugins, commonPluginConfig);

    this.editor = new RicosEditor(this.editorProps, {
      events: this.events,
      styles: this.styles,
      plugins: this.plugins,
      updateService: this.updateService,
      uploadService: this.uploadService,
      t: this.t,
      content: this.content,
      shortcuts: this.shortcuts,
      modals: this.modals,
      toolbars: this.toolbars,
    });
    this.updateService.setEditorCommands(this.editor.getEditorCommands());
    this.initialize();
  }

  finalize() {
    this.plugins.destroy();
    this.modals.destroy();
    this.events.clear();
  }

  initialize() {
    const eventSources = [this.shortcuts, this.modals, this.editor, this.toolbars];

    eventSources.forEach(source => {
      const initializer = new PublisherInitializer(source.topicsToPublish);
      initializer.initializeMap((t: TopicDescriptor) => this.events.register(t));
      source.publishers = initializer;
    });

    const eventSubscribers = [this.modals];

    eventSubscribers.forEach(subscriber => {
      const initializer = new SubscriptorInitializer(subscriber.topicsToSubscribe);
      initializer.initializeMap((t: SubscribeTopicDescriptor) => ({
        subscribe: (handler: (topic: TopicDescriptor, data: EventData) => void) =>
          this.events.subscribe(t, handler, subscriber.id),
      }));
      subscriber.subscriptors = initializer;
    });
  }

  private initUploadService(
    setErrorNotifier: () => INotifier,
    setFileInput: () => HTMLInputElement
  ) {
    this.uploadService.setErrorNotifier(setErrorNotifier);
    this.uploadService.setHiddenInputElement(setFileInput);
  }

  setUpdateServiceDom(setErrorNotifier: () => INotifier, setFileInput: () => HTMLInputElement) {
    this.initUploadService(setErrorNotifier, setFileInput);
  }

  getServices(): RicosServices {
    return {
      events: this.events,
      styles: this.styles,
      plugins: this.plugins,
      uploadService: this.uploadService,
      updateService: this.updateService,
      t: this.t,
      shortcuts: this.shortcuts,
      content: this.content,
      modals: this.modals,
      editor: this.editor,
      toolbars: this.toolbars,
    };
  }

  private initPlugins(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commonPlugins: EditorPlugin<Record<string, any>>[],
    commonPluginConfig: LegacyEditorPluginConfig
  ) {
    const helpersConfig = getHelpersConfig(this.editorProps);

    pipe(
      [...commonPlugins, ...(this.editorProps.plugins || [])],
      EditorPlugins.mergeConfig(this.editorProps._rcProps?.config),
      EditorPlugins.mergeConfig(commonPluginConfig),
      EditorPlugins.mergeConfig(helpersConfig),
      A.map((plugin: EditorPlugin) => this.plugins.register(plugin))
    );
  }
}
