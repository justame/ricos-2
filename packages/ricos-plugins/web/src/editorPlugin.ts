import type {
  AddButton,
  EditorPlugin as EditorPluginType,
  FormattingToolbarButton,
  IEditorPlugin,
  IPluginAddButton,
  IPluginToolbar,
  LegacyEditorPluginConfig,
  ModalService,
  ShortcutDataProvider,
  ShortcutRegistrar,
  TiptapEditorPlugin,
  TranslationFunction,
} from 'ricos-types';
import { PluginTextButton } from './plugin-text-button';
import { PluginAddButton } from './pluginAddButton';
import { PluginToolbar } from './pluginToolbar';

export class EditorPlugin implements IEditorPlugin {
  private readonly plugin: EditorPluginType;

  private addButtons?: IPluginAddButton[];

  private textButtons?: PluginTextButton[];

  private toolbar?: IPluginToolbar;

  private readonly modalService: ModalService;

  private readonly t: TranslationFunction;

  private readonly shortcutRegistrar: ShortcutRegistrar & ShortcutDataProvider;

  static of(
    plugin: EditorPluginType,
    modalService: ModalService,
    shortcuts: ShortcutRegistrar & ShortcutDataProvider,
    t: TranslationFunction
  ): EditorPlugin {
    return new EditorPlugin(plugin, modalService, shortcuts, t);
  }

  private constructor(
    plugin: EditorPluginType,
    modalService: ModalService,
    shortcuts: ShortcutRegistrar & ShortcutDataProvider,
    t: TranslationFunction
  ) {
    this.plugin = plugin;
    this.modalService = modalService;
    this.t = t;
    this.shortcutRegistrar = shortcuts;
  }

  private initAddButtons() {
    if (this.plugin.getAddButtons) {
      this.addButtons = this.plugin
        .getAddButtons(this.plugin.config)
        .map((button: AddButton) => PluginAddButton.of(button, this.modalService));
    }
  }

  private getExtensionName(): string {
    return (this.plugin as TiptapEditorPlugin).tiptapExtensions?.[0]?.name || this.plugin.type;
  }

  private initPluginToolbar() {
    if (this.plugin.toolbar) {
      this.toolbar = PluginToolbar.of(
        {
          buttons: this.plugin.toolbar.getButtons(this.plugin.config),
          isVisible: this.plugin.toolbar.isVisible,
        },
        this.getExtensionName(),
        this.modalService
      );
    }
  }

  // TODO: pass real platform
  private initTextButtons() {
    if (this.plugin.textButtons) {
      this.textButtons = this.plugin.textButtons.map(b =>
        PluginTextButton.of(b, this.modalService, this.shortcutRegistrar, this.t, 'macOs')
      );
    }
  }

  register() {
    this.initAddButtons();
    this.plugin.shortcuts?.map(shortcut => this.shortcutRegistrar.register(shortcut));
    this.initTextButtons();
    this.initPluginToolbar();
    this.addButtons?.map(b => b.register());
    this.textButtons?.map(b => b.register());
    this.toolbar?.register();
  }

  unregister() {
    this.addButtons?.map(b => b.unregister());
    this.textButtons?.map(b => b.unregister());
    this.toolbar?.unregister();
    this.plugin.shortcuts?.map(shortcut => this.shortcutRegistrar.unregister(shortcut));
  }

  getType(): string {
    return this.plugin.type;
  }

  getTiptapExtensions() {
    return (this.plugin as TiptapEditorPlugin).tiptapExtensions?.map(extension => ({
      ...extension,
      settings: this.getConfig(),
    }));
  }

  getConfig(): LegacyEditorPluginConfig {
    return this.plugin.config;
  }

  getTextButtons(): FormattingToolbarButton[] {
    return this.textButtons || [];
  }

  getAddButtons() {
    return this.addButtons || [];
  }

  getToolbar() {
    return this.toolbar;
  }

  equals(plugin: IEditorPlugin) {
    return this.plugin.type === plugin.getType();
  }
}
