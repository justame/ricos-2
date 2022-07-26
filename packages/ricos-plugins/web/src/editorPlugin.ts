import type {
  AddButton,
  EditorPlugin as EditorPluginType,
  FormattingToolbarButton,
  IEditorPlugin,
  IPluginAddButton,
  IPluginToolbar,
  LegacyEditorPluginConfig,
  ModalService,
  ShortcutRegistrar,
  TiptapEditorPlugin,
} from 'ricos-types';
import type { PluginTextButton } from './plugin-text-button';
import { PluginTextButtons } from './plugin-text-button';
import { PluginAddButton } from './pluginAddButton';
import { PluginToolbar } from './pluginToolbar';

export class EditorPlugin implements IEditorPlugin {
  plugin: EditorPluginType;

  addButtons?: IPluginAddButton[];

  textButtons!: PluginTextButton[];

  toolbar?: IPluginToolbar;

  modalService: ModalService;

  shortcutRegistrar: ShortcutRegistrar;

  static of(
    plugin: EditorPluginType,
    modalService: ModalService,
    shortcuts: ShortcutRegistrar
  ): EditorPlugin {
    return new EditorPlugin(plugin, modalService, shortcuts);
  }

  private constructor(
    plugin: EditorPluginType,
    modalService: ModalService,
    shortcuts: ShortcutRegistrar
  ) {
    this.plugin = plugin;
    this.modalService = modalService;
    this.shortcutRegistrar = shortcuts;
    this.initAddButtons(plugin, modalService);
    this.initPluginToolbar(plugin, modalService);
  }

  private initAddButtons(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugin: EditorPluginType<Record<string, any>>,
    modalService: ModalService
  ) {
    if (plugin.getAddButtons) {
      this.addButtons = plugin
        .getAddButtons(plugin.config)
        .map((button: AddButton) => PluginAddButton.of(button, modalService));
    }
  }

  private getExtensionName(): string {
    return (this.plugin as TiptapEditorPlugin).tiptapExtensions?.[0]?.name || this.plugin.type;
  }

  private initPluginToolbar(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugin: EditorPluginType<Record<string, any>>,
    modalService: ModalService
  ) {
    if (plugin.toolbar) {
      this.toolbar = PluginToolbar.of(
        { buttons: plugin.toolbar.getButtons(plugin.config), isVisible: plugin.toolbar.isVisible },
        this.getExtensionName(),
        modalService
      );
    }
  }

  register() {
    this.initAddButtons(this.plugin, this.modalService);
    this.textButtons = PluginTextButtons.of(this.plugin.textButtons).asArray();
    this.initPluginToolbar(this.plugin, this.modalService);
    this.plugin.shortcuts?.map(shortcut => this.shortcutRegistrar.register(shortcut));
    this.addButtons?.map(b => b.register());
    this.toolbar?.register();
  }

  unregister() {
    this.addButtons?.map(b => b.unregister());
    this.toolbar?.unregister();
    this.plugin.shortcuts?.map(shortcut => this.shortcutRegistrar.unregister(shortcut));
    this.toolbar?.unregister();
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
    return this.textButtons;
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
