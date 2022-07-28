import type {
  AddButton,
  EditorPlugin as EditorPluginType,
  FormattingToolbarButton,
  IEditorPlugin,
  IPluginAddButton,
  IPluginToolbar,
  LegacyEditorPluginConfig,
  TiptapEditorPlugin,
  PluginServices,
} from 'ricos-types';
import { PluginTextButton } from './plugin-text-button';
import { PluginAddButton } from './pluginAddButton';
import { PluginToolbar } from './pluginToolbar';

export class EditorPlugin implements IEditorPlugin {
  private readonly plugin: EditorPluginType;

  private addButtons?: IPluginAddButton[];

  private textButtons?: PluginTextButton[];

  private toolbar?: IPluginToolbar;

  services: PluginServices;

  static of(plugin: EditorPluginType, services: PluginServices): EditorPlugin {
    return new EditorPlugin(plugin, services);
  }

  private constructor(plugin: EditorPluginType, services: PluginServices) {
    this.plugin = plugin;
    this.services = services;
  }

  private initAddButtons() {
    if (this.plugin.getAddButtons) {
      this.addButtons = this.plugin
        .getAddButtons(this.plugin.config, this.services)
        .map((button: AddButton) => PluginAddButton.of(button, this.services));
      this.addButtons?.map(b => b.register());
    }
  }

  // TODO: pass real platform
  private initTextButtons() {
    if (this.plugin.textButtons) {
      this.textButtons = this.plugin.textButtons.map(b =>
        PluginTextButton.of(b, this.services, 'macOs')
      );
      this.textButtons?.map(b => b.register());
    }
  }

  private getExtensionName(): string {
    return (this.plugin as TiptapEditorPlugin).tiptapExtensions?.[0]?.name || this.plugin.type;
  }

  private initPluginToolbar() {
    if (this.plugin.toolbar) {
      this.toolbar = PluginToolbar.of(
        {
          buttons: this.plugin.toolbar.getButtons(this.plugin.config, this.services),
          isVisible: this.plugin.toolbar.isVisible,
        },
        this.getExtensionName(),
        this.services
      );
      this.toolbar?.register();
    }
  }

  register() {
    this.plugin.shortcuts?.map(shortcut => this.services.shortcuts.register(shortcut));
    this.initAddButtons();
    this.initTextButtons();
    this.initPluginToolbar();
  }

  unregister() {
    this.toolbar?.unregister();
    this.textButtons?.map(b => b.unregister());
    this.addButtons?.map(b => b.unregister());
    this.plugin.shortcuts?.map(shortcut => this.services.shortcuts.unregister(shortcut));
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
