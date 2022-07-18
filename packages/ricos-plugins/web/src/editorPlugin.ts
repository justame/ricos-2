import type {
  LegacyEditorPluginConfig,
  EditorPlugin as EditorPluginType,
  ModalService,
  IEditorPlugin,
  IPluginAddButton,
  IPluginToolbar,
  TiptapEditorPlugin,
  IPluginTextButton,
} from 'ricos-types';
import { PluginAddButton } from './pluginAddButton';
import { PluginTextButton } from './pluginTextButton';
import { PluginToolbar } from './pluginToolbar';

export class EditorPlugin implements IEditorPlugin {
  plugin: EditorPluginType;

  addButtons?: IPluginAddButton[];

  textButtons?: IPluginTextButton[];

  toolbar?: IPluginToolbar;

  static of(plugin: EditorPluginType, modalService: ModalService) {
    return new EditorPlugin(plugin, modalService);
  }

  private constructor(plugin: EditorPluginType, modalService?: ModalService) {
    this.plugin = plugin;
    this.initAddButtons(plugin, modalService);
    this.initTextButtons(plugin);
    this.initPluginToolbar(plugin, modalService);
  }

  private initTextButtons(plugin: EditorPluginType) {
    if (plugin.textButtons) {
      this.textButtons = plugin.textButtons.map(button => PluginTextButton.of(button));
    }
  }

  private initAddButtons(plugin, modalService) {
    if (plugin.addButtons) {
      this.addButtons = plugin.addButtons.map(button => PluginAddButton.of(button, modalService));
    }
  }

  private getExtensionName(): string {
    return (this.plugin as TiptapEditorPlugin).tiptapExtensions?.[0]?.name || this.plugin.type;
  }

  private initPluginToolbar(plugin, modalService) {
    if (plugin.toolbar) {
      this.toolbar = PluginToolbar.of(plugin.toolbar, this.getExtensionName(), modalService);
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

  getTextButtons() {
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
