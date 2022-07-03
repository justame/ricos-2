import type {
  LegacyEditorPluginConfig,
  EditorPlugin as EditorPluginType,
  ModalService,
  IEditorPlugin,
  IPluginAddButton,
  IPluginToolbar,
} from 'ricos-types';
import type { RicosExtension, TiptapEditorPlugin } from 'ricos-tiptap-types';
import { PluginAddButton } from './pluginAddButton';
import { PluginToolbar } from './pluginToolbar';

export class EditorPlugin implements IEditorPlugin {
  plugin: EditorPluginType;

  addButtons?: IPluginAddButton[];

  toolbar?: IPluginToolbar;

  static of(plugin: EditorPluginType, modalService: ModalService) {
    return new EditorPlugin(plugin, modalService);
  }

  private constructor(plugin: EditorPluginType, modalService?: ModalService) {
    this.plugin = plugin;
    this.initAddButtons(plugin, modalService);
    this.initToolbarButtons(plugin, modalService);
  }

  private initAddButtons(plugin, modalService) {
    if (plugin.addButtons) {
      this.addButtons = plugin.addButtons.map(button => PluginAddButton.of(button, modalService));
    }
  }

  private getExtensionName(): string {
    return (this.plugin as TiptapEditorPlugin).tiptapExtensions?.[0]?.name || this.plugin.type;
  }

  private initToolbarButtons(plugin, modalService) {
    if (plugin.toolbarButtons) {
      this.toolbar = PluginToolbar.of(plugin.toolbarButtons, this.getExtensionName(), modalService);
    }
  }

  register() {
    this.addButtons?.map(b => b.register());
    this.toolbar?.register();
  }

  unregister() {
    this.addButtons?.map(b => b.unregister());
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
