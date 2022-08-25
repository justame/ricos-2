import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import type { Node } from 'prosemirror-model';
import type { RicosEditorProps } from 'ricos-common';
import { StreamReader, UpdateService, UploadService } from 'ricos-common';
import { commonPluginConfig, commonPlugins } from 'ricos-common-plugins';
import type { GeneralContext } from 'ricos-context';
import { nodeConverter as nodeService } from 'ricos-converters';
import { RicosEvents } from 'ricos-events';
import { RicosModalService } from 'ricos-modals';
import { EditorPlugins, PluginsEvents } from 'ricos-plugins';
import { EditorKeyboardShortcuts } from 'ricos-shortcuts';
import { RicosStyles } from 'ricos-styles';
import type {
  DebugMode,
  EditorPlugin,
  INotifier,
  IUpdateService,
  LegacyEditorPluginConfig,
  Orchestrator,
  RicosServices,
  TranslationFunction,
  IPluginsEvents,
} from 'ricos-types';
import { getLangDir } from 'wix-rich-content-common';
import { Content, RicosToolbars } from 'wix-rich-content-toolbars-v3';
import { getHelpersConfig } from './helpers-config';
import { mapBiCallbacksToSubscriptions } from './map-bi-callbacks-to-events';
import type { RicosEventSource, RicosEventSubscriber } from './orchestrate-events';
import { registerEventSources, registerEventSubscribers } from './orchestrate-events';
import { RicosEditor } from './ricos-editor';

export class RicosOrchestrator implements Orchestrator {
  private readonly editorProps: RicosEditorProps & { debugMode?: DebugMode[] };

  private updateService!: IUpdateService;

  private readonly events: RicosEvents;

  private readonly toolbars: RicosToolbars;

  private readonly pluginsEvents: IPluginsEvents;

  private readonly modals: RicosModalService;

  private readonly styles: RicosStyles;

  private readonly shortcuts: EditorKeyboardShortcuts;

  private readonly plugins: EditorPlugins;

  private readonly uploadService: UploadService;

  private readonly t: TranslationFunction;

  private readonly content: Content;

  private readonly editor: RicosEditor;

  private readonly context: Omit<GeneralContext, 'portal'>;

  constructor(editorProps: RicosEditorProps & { debugMode?: DebugMode[] }, t: TranslationFunction) {
    this.t = t;
    this.editorProps = editorProps;

    this.context = {
      t,
      debugMode: editorProps.debugMode || [],
      isMobile: editorProps.isMobile || false,
      languageDir: getLangDir(editorProps.locale),
      theme: editorProps.theme || {},
      locale: editorProps.locale || 'en',
      localeContent: editorProps.localeContent || 'en',
      experiments: editorProps.experiments || {},
    };

    this.updateService = new UpdateService();
    this.events = new RicosEvents(
      (editorProps.debugMode?.includes('events') || editorProps.debugMode?.includes('all')) ?? false
    );
    this.styles = new RicosStyles();

    this.uploadService = new UploadService(new StreamReader(), this.updateService);

    this.modals = new RicosModalService();

    this.shortcuts = new EditorKeyboardShortcuts(this.modals, {
      isDebugMode:
        (editorProps.debugMode?.includes('shortcuts') || editorProps.debugMode?.includes('all')) ??
        false,
    });

    this.toolbars = new RicosToolbars();
    this.toolbars.getShortcuts().map(shortcut => this.shortcuts.register(shortcut));

    this.pluginsEvents = new PluginsEvents();

    this.content = Content.create<Node[]>([], {
      styles: this.styles,
      nodeService,
      editor: null,
    });

    this.plugins = new EditorPlugins(
      {
        modals: this.modals,
        uploadService: this.uploadService,
        updateService: this.updateService,
        shortcuts: this.shortcuts,
        t: this.t,
        content: this.content,
        styles: this.styles,
        toolbars: this.toolbars,
        pluginsEvents: this.pluginsEvents,
        context: this.context,
      },
      this.editorProps.toolbarSettings || {}
    );

    this.registerAllPlugins(commonPlugins, commonPluginConfig);

    this.editor = new RicosEditor(
      this.editorProps,
      {
        styles: this.styles,
        plugins: this.plugins,
        updateService: this.updateService,
        uploadService: this.uploadService,
        t: this.t,
        content: this.content,
        shortcuts: this.shortcuts,
        modals: this.modals,
        toolbars: this.toolbars,
        pluginsEvents: this.pluginsEvents,
        context: this.context,
      },
      this.editorProps.debugMode?.includes('prosemirror') || editorProps.debugMode?.includes('all')
    );
    this.updateService.setEditorCommands(this.editor.getEditorCommands());

    this.orchestrateEvents();
  }

  finalize() {
    this.plugins.destroy();
    this.modals.destroy();
    this.events.clear();
    this.editor.finalizeUploadObserver();
  }

  private orchestrateEvents() {
    registerEventSources(this.events, [
      this.shortcuts,
      this.modals,
      this.editor as unknown as RicosEventSource,
      this.toolbars,
      this.uploadService,
      this.pluginsEvents,
    ] as RicosEventSource[]);
    registerEventSubscribers(this.events, [
      this.modals as unknown as RicosEventSubscriber,
      this.editor as unknown as RicosEventSubscriber,
    ]);
    mapBiCallbacksToSubscriptions(this.editorProps, this.events);
    this.editor.initializeUploadObserver();
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
      pluginsEvents: this.pluginsEvents,
      context: this.context,
    };
  }

  private registerAllPlugins(
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
