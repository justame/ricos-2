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
  TiptapAdapter,
  TranslationFunction,
  Orchestrator,
} from 'ricos-types';
import { Content } from 'wix-rich-content-toolbars-v3';
import { initializeTiptapAdapter } from 'wix-tiptap-editor';
import { getHelpersConfig } from './helpers-config';

export class RicosOrchestrator implements Orchestrator {
  private readonly editorProps: RicosEditorProps;

  private updateService!: IUpdateService;

  private readonly events: RicosEvents;

  private readonly modals: RicosModalService;

  private readonly styles: RicosStyles;

  private readonly shortcuts: EditorKeyboardShortcuts;

  private readonly plugins: EditorPlugins;

  private readonly uploadService: IUploadService;

  private readonly t: TranslationFunction;

  private readonly content: Content;

  private readonly tiptapAdapter: TiptapAdapter;

  constructor(editorProps: RicosEditorProps, t: TranslationFunction) {
    const { onMediaUploadStart, onMediaUploadEnd } = editorProps._rcProps?.helpers || {};
    this.updateService = new UpdateService();
    this.uploadService = new UploadService(new StreamReader(), this.updateService, {
      onMediaUploadStart,
      onMediaUploadEnd,
    });
    this.t = t;
    this.editorProps = editorProps;
    this.events = new RicosEvents();
    this.modals = new RicosModalService(this.events);
    this.styles = new RicosStyles();
    this.shortcuts = new EditorKeyboardShortcuts(this.events, this.modals);

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
      },
      this.editorProps.toolbarSettings || {}
    );

    this.initPlugins(commonPlugins, commonPluginConfig);

    this.tiptapAdapter = initializeTiptapAdapter(this.editorProps, {
      events: this.events,
      styles: this.styles,
      plugins: this.plugins,
      updateService: this.updateService,
      uploadService: this.uploadService,
      t: this.t,
      content: this.content,
      shortcuts: this.shortcuts,
      modals: this.modals,
    });
    this.updateService.setEditorCommands(this.tiptapAdapter.getEditorCommands());
  }

  finalize() {
    this.plugins.destroy();
    this.modals.destroy();
    this.events.clear();
  }

  initialize() {}

  private initUploadService(
    setErrorNotifier: () => INotifier,
    setFileInput: () => HTMLInputElement
  ) {
    this.uploadService.setErrorNotifier(setErrorNotifier);
    this.uploadService.setHiddenInputElement(setFileInput);
  }

  onDomReady(setErrorNotifier: () => INotifier, setFileInput: () => HTMLInputElement) {
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
      tiptapAdapter: this.tiptapAdapter,
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

  private registerEvents() {}

  private subscribeEvents() {}
}
