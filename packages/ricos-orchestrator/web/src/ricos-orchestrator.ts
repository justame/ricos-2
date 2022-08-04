import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import type { Node } from 'prosemirror-model';
import type { RicosEditorProps } from 'ricos-common';
import { StreamReader, UpdateService, UploadService } from 'ricos-common';
import { commonPluginConfig, commonPlugins } from 'ricos-common-plugins';
import { Version } from 'ricos-content';
import { nodeConverter as nodeService } from 'ricos-converters';
import { RicosEvents } from 'ricos-events';
import { RicosModalService } from 'ricos-modals';
import { EditorPlugins } from 'ricos-plugins';
import { EditorKeyboardShortcuts } from 'ricos-shortcuts';
import { RicosStyles } from 'ricos-styles';
import type {
  BICallbacks,
  EditorPlugin,
  EventData,
  INotifier,
  IUpdateService,
  IUploadService,
  LegacyEditorPluginConfig,
  Orchestrator,
  RicosServices,
  SubscribeTopicDescriptor,
  ToolbarType,
  TopicDescriptor,
  TranslationFunction,
} from 'ricos-types';
import { TOOLBARS } from 'wix-rich-content-editor-common';
import { Content, RicosToolbars } from 'wix-rich-content-toolbars-v3';
import { PublisherInitializer, SubscriptorInitializer } from './event-orchestrators';
import { getHelpersConfig } from './helpers-config';
import { RicosEditor } from './ricos-editor';

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
    this.orchestrateEvents();
  }

  finalize() {
    this.plugins.destroy();
    this.modals.destroy();
    this.events.clear();
  }

  private registerEventSources() {
    const eventSources = [this.shortcuts, this.modals, this.editor, this.toolbars];
    eventSources.forEach(source => {
      const initializer = new PublisherInitializer(source.topicsToPublish);
      initializer.initializeMap((t: TopicDescriptor) => this.events.register(t));
      source.publishers = initializer;
    });
  }

  private registerEventSubscribers() {
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

  /**
   * Subscribes BI callback by name to proper topic
   *
   * @private
   * @param {TopicDescriptor} topic
   * @param {keyof BICallbacks} name
   * @param {(data: EventData) =>  Parameters<NonNullable<BICallbacks[K]>>} eventDataToBICallbackParams
   * @returns
   * @memberof RicosOrchestrator
   */
  private subscribeBiCallback<K extends keyof BICallbacks>(
    topic: TopicDescriptor,
    name: K,
    eventDataToBICallbackParams: (data: EventData) => Parameters<NonNullable<BICallbacks[K]>>
  ) {
    const callback = this.editorProps._rcProps?.helpers?.[name];
    if (!callback) {
      return { topic, cancel: () => {} };
    }
    return this.events.subscribe(
      topic,
      (_topic, data: EventData) => {
        const params = eventDataToBICallbackParams(data);
        callback.call(callback, ...params);
      },
      `${name} BI callback`
    );
  }

  /**
   *  Maps BI callbacks to events.
   *  Callbacks:
        ☐  onChangePluginSettings
        ✓  onContentEdited --> first edit
        ☐  onInlineToolbarOpen --> floating toolbar rendered
        ✓  onKeyboardShortcutAction
        ☐  onMediaUploadEnd
        ☐  onMediaUploadStart
        ☐  onMenuLoad --> add plugin menu rendered
        ✓  onOpenEditorSuccess --> editor mounted
        ☐  onPluginAction
        ☐  onPluginAdd
        ☐  onPluginAddStep
        ☐  onPluginAddSuccess
        ☐  onPluginChange
        ☐  onPluginDelete
        ☐  onPluginModalOpened
        ☐  onPluginsPopOverClick
        ☐  onPluginsPopOverTabSwitch
        ✓  onPublish --> this one is handled separately in RicosEditor
        ✓  onToolbarButtonClick --> formatting(inline,static,external) toolbar button click (includes value)
        ☐  onToolbarButtonClick --> plugin toolbar button click (includes value)
        ☐  onVideoSelected --> ?
   *
   * @private
   * @memberof RicosOrchestrator
   */
  private mapBiCallbacksToSubscriptions() {
    const version = Version.currentVersion;
    const contentId = this.editorProps.content?.ID;

    this.subscribeBiCallback('ricos.editor.instance.loaded', 'onOpenEditorSuccess', () => [
      version,
      TOOLBARS.INLINE, // TODO: check meaning
      contentId,
    ]);

    this.subscribeBiCallback('ricos.editor.functionality.firstEdit', 'onContentEdited', () => [
      { version, contentId },
    ]);

    this.subscribeBiCallback(
      'ricos.shortcuts.functionality.applied',
      'onKeyboardShortcutAction',
      ({ shortcutName }) => [{ buttonName: shortcutName, pluginId: '', version, contentId }]
    );

    this.subscribeBiCallback(
      'ricos.toolbars.functionality.buttonClick',
      'onToolbarButtonClick',
      ({ toolbarType, buttonId }: { toolbarType: ToolbarType; buttonId: string }) => [
        { version, contentId, buttonName: buttonId, type: toolbarType },
      ]
    );
    // TODO: complete map
  }

  private orchestrateEvents() {
    this.registerEventSources();
    this.registerEventSubscribers();
    this.mapBiCallbacksToSubscriptions();
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
