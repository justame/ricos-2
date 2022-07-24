import type {
  AddButton,
  EditorPlugin as EditorPluginType,
  IEditorPlugin,
  IPluginAddButton,
  IPluginToolbar,
  IToolbarItemConfigTiptap,
  LegacyEditorPluginConfig,
  ModalService,
  ShortcutRegistrar,
  TiptapEditorPlugin,
} from 'ricos-types';
import { PluginTextButtons } from './plugin-text-button';
import { PluginAddButton } from './pluginAddButton';
import { PluginToolbar } from './pluginToolbar';

export class EditorPlugin implements IEditorPlugin {
  plugin: EditorPluginType;

  addButtons?: IPluginAddButton[];

  textButtons?: PluginTextButtons;

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
  }

  private initAddButtons(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugin: EditorPluginType<Record<string, any>>,
    modalService: ModalService
  ) {
    if (plugin.addButtons) {
      this.addButtons = plugin.addButtons.map((button: AddButton) =>
        PluginAddButton.of(button, modalService)
      );
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
      this.toolbar = PluginToolbar.of(plugin.toolbar, this.getExtensionName(), modalService);
    }
  }

  register() {
    this.initAddButtons(this.plugin, this.modalService);
    this.textButtons = PluginTextButtons.of(this.plugin.textButtons);
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

  configure(config: Partial<LegacyEditorPluginConfig>) {
    this.plugin.reconfigure?.(config);
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

  getTextButtons() {
    const buttons =
      this.textButtons?.asArray().map(b => b.getButton() as IToolbarItemConfigTiptap) || [];
    return buttons;
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
