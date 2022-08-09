import type {
  FormattingToolbarButton,
  FormattingToolbarButtons,
} from './formatting-toolbar-buttons';
import type { PluginAddButton, PluginAddButtons } from './plugin-add-buttons';
import type { PluginToolbar } from './plugin-toolbar';
import type { EditorPlugin, LegacyEditorPluginConfig } from './pluginTypes';
import type { RicosExtension } from './tiptap';

/**
 * Represents a plugin in Ricos Editor.
 * Admits config, modals, tiptap extensions, add buttons and toolbar buttons.
 *
 * @export
 * @interface RicosEditorPlugin
 */
export interface RicosEditorPlugin {
  /**
   * Plugin's type
   *
   * @returns  {string}
   * @memberof RicosEditorPlugin
   */
  getType(): string;
  /**
   * Plugin's Tiptap extensions
   *
   * @memberof RicosEditorPlugin
   */
  getTiptapExtensions(): RicosExtension[];
  /**
   * Plugin config
   *
   * @returns  {LegacyEditorPluginConfig}
   * @memberof RicosEditorPlugin
   */
  getConfig(): LegacyEditorPluginConfig;
  /**
   * Text Buttons
   *
   * @returns  {FormattingToolbarButton[]}
   * @memberof RicosEditorPlugin
   */
  getTextButtons(): FormattingToolbarButton[];
  /**
   * Add Buttons
   *
   * @returns  {PluginAddButton[]}
   * @memberof RicosEditorPlugin
   */
  getAddButtons(): PluginAddButton[];
  /**
   * Toolbar Buttons
   *
   * @returns  {PluginToolbar}
   * @memberof RicosEditorPlugin
   */
  getToolbars(): PluginToolbar[] | [];
  /**
   * Determines whether plugin equals to another plugin, based on type
   *
   * @param {RicosEditorPlugin} plugin
   * @returns  {boolean}
   * @memberof RicosEditorPlugin
   */
  equals(plugin: RicosEditorPlugin): boolean;
  /**
   * Register plugin to services
   *
   * @memberof RicosEditorPlugin
   */
  register(): void;
  /**
   * Unregister plugin from services
   *
   * @memberof RicosEditorPlugin
   */
  unregister(): void;
}

/**
 * Aggregate over Plugin entity.
 * Responsible for plugin validation.
 *
 * @export
 * @interface RicosEditorPlugins
 */
export interface RicosEditorPlugins {
  /**
   * Registers plugin, validates it has no conflicts.
   *
   * @memberof RicosEditorPlugins
   */
  register: (plugin: EditorPlugin) => void;
  /**
   * Removes plugin
   *
   * @memberof RicosEditorPlugins
   */
  unregister: (plugin: RicosEditorPlugin) => void;
  /**
   * Removes all plugins
   *
   * @memberof RicosEditorPlugins
   */
  destroy: () => void;
  /**
   * Filters plugins according to predicate
   *
   * @memberof RicosEditorPlugins
   */
  filter: (predicate: (plugin: RicosEditorPlugin) => boolean) => RicosEditorPlugin[];
  /**
   * Gets plugin array
   *
   * @memberof RicosEditorPlugins
   */
  asArray: () => RicosEditorPlugin[];
  /**
   * Plugins text Buttons
   *
   * @returns  {FormattingToolbarButtons}
   * @memberof RicosEditorPlugins
   */
  getTextButtons(): FormattingToolbarButtons;
  /**
   * Plugins add Buttons
   *
   * @returns  {PluginAddButtons}
   * @memberof RicosEditorPlugins
   */
  getAddButtons(): PluginAddButtons;
  /**
   * Plugins toolbar Buttons
   *
   * @returns  {PluginsToolbar}
   * @memberof RicosEditorPlugins
   */
  getVisibleToolbar(selection): PluginToolbar | undefined;
  /**
   * Get RicosExtensions for Tiptap based editor
   *
   * @returns  {RicosExtension[]}
   * @memberof RicosEditorPlugins
   */
  getTiptapExtensions(): RicosExtension[];
}
