import { compact } from 'lodash';
import type {
  EditorPlugin as EditorPluginType,
  FormattingToolbarButtons,
  RicosEditorPlugin,
  RicosEditorPlugins,
  RicosServices,
  ToolbarSettings,
} from 'ricos-types';
import type { PluginTextButton } from './plugin-text-button';
import { PluginTextButtons } from './plugin-text-button';
import { RicosPluginAddButtons } from './pluginAddButton';
import { mergeConfig } from './mergeConfig';
import { EditorPlugin } from './editorPlugin';

export type PluginServices = Omit<RicosServices, 'plugins' | 'tiptapAdapter'>;

export class PluginCollisionError extends Error {}

export class EditorPlugins implements RicosEditorPlugins {
  private plugins: RicosEditorPlugin[] = [];

  private services: PluginServices;

  private toolbarSettings: ToolbarSettings;

  static mergeConfig = mergeConfig;

  constructor(services: PluginServices, toolbarSettings: ToolbarSettings) {
    this.services = services;
    this.toolbarSettings = toolbarSettings;
  }

  register(plugin: EditorPluginType) {
    const candidate = EditorPlugin.of(plugin, this.services);
    const duplicate = this.hasDuplicate(candidate);
    if (duplicate) {
      throw new PluginCollisionError(
        `the plugin ${candidate.getType()} conflicts with ${duplicate.getType()}`
      );
    }

    candidate.register();
    this.plugins.push(candidate);
  }

  unregister(plugin: RicosEditorPlugin) {
    plugin.unregister();
    return this.filter(p => !p.equals(plugin));
  }

  destroy() {
    this.plugins.map(p => p.unregister());
    this.plugins = [];
  }

  filter(predicate: (plugin: RicosEditorPlugin) => boolean) {
    this.plugins = this.plugins.filter(predicate);
    return this.plugins;
  }

  asArray() {
    return this.plugins;
  }

  getConfig(type: string) {
    return this.plugins.filter(plugin => plugin.getType() === type)[0]?.getConfig() || {};
  }

  getTextButtons(): FormattingToolbarButtons {
    const textButtons = this.plugins.flatMap(
      plugin => (plugin.getTextButtons() as PluginTextButton[]) || []
    );
    return PluginTextButtons.of(textButtons, this.toolbarSettings);
  }

  getAddButtons() {
    //maybe use filter class func
    const addButtons = this.plugins.flatMap(plugin => plugin.getAddButtons() || []);
    return new RicosPluginAddButtons(addButtons, this.services);
  }

  getVisibleToolbar(selection) {
    const toolbar = this.plugins
      .map(plugin => plugin.getToolbar())
      .filter(toolbar => !!toolbar?.isVisible(selection))?.[0];
    return toolbar;
  }

  getTiptapExtensions() {
    return compact(this.plugins.flatMap(plugin => plugin.getTiptapExtensions?.() || []));
  }

  private hasDuplicate(plugin: RicosEditorPlugin) {
    return this.plugins.find(p => p.equals(plugin));
  }
}
