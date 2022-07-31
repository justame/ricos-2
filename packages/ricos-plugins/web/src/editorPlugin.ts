import type {
  AddButton,
  EditorPlugin as EditorPluginType,
  FormattingToolbarButton,
  RicosEditorPlugin,
  PluginAddButton,
  PluginToolbar,
  LegacyEditorPluginConfig,
  TiptapEditorPlugin,
  RicosServices,
} from 'ricos-types';
import type { PluginServices } from './editorPlugins';
import { PluginTextButton } from './plugin-text-button';
import { RicosPluginAddButton } from './pluginAddButton';
import { RicosPluginToolbar } from './pluginToolbar';

export class EditorPlugin implements RicosEditorPlugin {
  private readonly plugin: EditorPluginType;

  private addButtons?: PluginAddButton[];

  private textButtons?: PluginTextButton[];

  private toolbar?: PluginToolbar;

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
        .getAddButtons(this.plugin.config, this.services as RicosServices)
        .map((button: AddButton) => RicosPluginAddButton.of(button, this.services));
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
      this.toolbar = RicosPluginToolbar.of(
        {
          buttons: this.plugin.toolbar.getButtons(
            this.plugin.config,
            this.services as RicosServices
          ),
          isVisible: this.plugin.toolbar.isVisible,
        },
        this.getExtensionName(),
        this.services as RicosServices
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

  equals(plugin: RicosEditorPlugin) {
    return this.plugin.type === plugin.getType();
  }
}
