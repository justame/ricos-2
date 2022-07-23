import type {
  EditorPlugin as EditorPluginType,
  IEditorPlugin,
  IPluginAddButton,
  IPluginToolbar,
  IToolbarItemConfigTiptap,
  LegacyEditorPluginConfig,
  ModalService,
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

  static of(plugin: EditorPluginType, modalService: ModalService) {
    return new EditorPlugin(plugin, modalService);
  }

  private constructor(plugin: EditorPluginType, modalService?: ModalService) {
    this.plugin = plugin;
    this.initAddButtons(plugin, modalService);
    this.textButtons = PluginTextButtons.of(plugin.textButtons);
    this.initPluginToolbar(plugin, modalService);
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
