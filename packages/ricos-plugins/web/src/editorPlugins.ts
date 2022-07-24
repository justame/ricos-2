import { compact } from 'lodash';
import type {
  EditorPlugin as EditorPluginType,
  IEditorPlugin,
  IEditorPlugins,
  LegacyEditorPluginConfig,
  ModalService,
  ShortcutRegistrar,
} from 'ricos-types';
import { EditorPlugin } from './editorPlugin';
import { PluginAddButtons } from './pluginAddButton';

export class PluginCollisionError extends Error {}

export class EditorPlugins implements IEditorPlugins {
  private plugins: IEditorPlugin[] = [];

  private modalService: ModalService;

  private readonly shortcuts: ShortcutRegistrar;

  constructor(modalService: ModalService, shortcuts: ShortcutRegistrar) {
    this.modalService = modalService;
    this.shortcuts = shortcuts;
  }

  register(plugin: EditorPluginType) {
    const candidate = EditorPlugin.of(plugin, this.modalService, this.shortcuts);

    const duplicate = this.hasDuplicate(candidate);
    if (duplicate) {
      throw new PluginCollisionError(
        `the plugin ${candidate.getType()} conflicts with ${duplicate.getType()}`
      );
    }

    candidate.register();
    this.plugins.push(candidate);
  }

  unregister(plugin: IEditorPlugin) {
    plugin.unregister();
    return this.filter(p => !p.equals(plugin));
  }

  destroy() {
    this.plugins.map(p => p.unregister());
    this.plugins = [];
  }

  filter(predicate: (plugin: IEditorPlugin) => boolean) {
    this.plugins = this.plugins.filter(predicate);
    return this.plugins;
  }

  asArray() {
    return this.plugins;
  }

  getConfig(type: string) {
    return this.plugins.filter(plugin => plugin.getType() === type)[0]?.getConfig() || {};
  }

  configure(config: Partial<LegacyEditorPluginConfig>) {
    return this.plugins.forEach(plugin => plugin.configure(config));
  }

  getTextButtons() {
    return this.plugins.flatMap(plugin => plugin.getTextButtons() || []);
  }

  getAddButtons() {
    //maybe use filter class func
    const addButtons = this.plugins.flatMap(plugin => plugin.getAddButtons() || []);
    return new PluginAddButtons(addButtons, this.modalService);
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

  private hasDuplicate(plugin: IEditorPlugin) {
    return this.plugins.find(p => p.equals(plugin));
  }
}
