import type {
  LegacyEditorPluginConfig,
  EditorPlugin as EditorPluginType,
  AddButton,
  MenuGroups,
  ToolbarButton,
} from './pluginTypes';
import type { ComponentType } from 'react';
import type { IToolbarItemConfigTiptap } from './toolbarTypes';
import type { ToolbarType } from './toolbarEnums';
import type { PluginButton, AddPluginMenuConfig } from './toolbarSettingsTypes';
import type { ToolbarButtonProps } from './buttonTypes';
import type { EditorCommands } from './editorCommandsType';
import type { IUpdateService, IUploadService } from './uploadServicesTypes';
import type { TranslationFunction } from './commonTypes';

/**
 * Represents a plugin in Ricos Editor.
 * Admits config, modals, tiptap extensions, add buttons and toolbar buttons.
 *
 * @export
 * @interface IEditorPlugin
 */
export interface IEditorPlugin {
  /**
   * Plugin's type
   *
   * @returns  {string}
   * @memberof IEditorPlugin
   */
  getType(): string;
  /**
   * Plugin's Tiptap extensions
   *
   * @memberof IEditorPlugin
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTiptapExtensions(): any[];
  /**
   * Plugin config
   *
   * @returns  {LegacyEditorPluginConfig}
   * @memberof IEditorPlugin
   */
  getConfig(): LegacyEditorPluginConfig;
  /**
   * Add Buttons
   *
   * @returns  {IPluginAddButton[]}
   * @memberof IEditorPlugin
   */
  getAddButtons(): IPluginAddButton[];
  /**
   * Toolbar Buttons
   *
   * @returns  {PluginToolbar}
   * @memberof IEditorPlugin
   */
  getToolbar(): IPluginToolbar | undefined;
  /**
   * Determines whether plugin equals to another plugin, based on type
   *
   * @param {IEditorPlugin} plugin
   * @returns  {boolean}
   * @memberof IEditorPlugin
   */
  equals(plugin: IEditorPlugin): boolean;
  /**
   * Register plugin to services
   *
   * @memberof IEditorPlugin
   */
  register(): void;
  /**
   * Unregister plugin from services
   *
   * @memberof IEditorPlugin
   */
  unregister(): void;
  /**
   * Reconfigure Plugin
   *
   * @param {Partial<LegacyEditorPluginConfig>} config
   * @memberof IEditorPlugin
   */
  configure(config: Partial<LegacyEditorPluginConfig>); // runtime configuration
}

/**
 * Aggregate over Plugin entity.
 * Responsible for plugin validation.
 *
 * @export
 * @interface IEditorPlugins
 */
export interface IEditorPlugins {
  /**
   * Registers plugin, validates it has no conflicts.
   *
   * @memberof IEditorPlugins
   */
  register: (plugin: EditorPluginType) => void;
  /**
   * Removes plugin
   *
   * @memberof IEditorPlugins
   */
  unregister: (plugin: IEditorPlugin) => void;
  /**
   * Removes all plugins
   *
   * @memberof IEditorPlugins
   */
  destroy: () => void;
  /**
   * Filters plugins according to predicate
   *
   * @memberof IEditorPlugins
   */
  filter: (predicate: (plugin: IEditorPlugin) => boolean) => IEditorPlugin[];
  /**
   * Gets plugin array
   *
   * @memberof IEditorPlugins
   */
  asArray: () => IEditorPlugin[];
  /**
   * Plugins add Buttons
   *
   * @returns  {IPluginAddButtons}
   * @memberof IEditorPlugins
   */
  getAddButtons(): IPluginAddButtons;
  /**
   * Plugins toolbar Buttons
   *
   * @returns  {PluginsToolbar}
   * @memberof IEditorPlugins
   */
  getVisibleToolbar(selection): IPluginToolbar | undefined;
  /**
   * Get RicosExtensions for Tiptap based editor
   *
   * @returns  {RicosExtension[]}
   * @memberof IEditorPlugins
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTiptapExtensions(): any[]; // TODO: fix RicosExtension type
  /**
   * Reconfigure Plugin
   *
   * @param {string} type
   * @param {Partial<LegacyEditorPluginConfig>} config
   * @memberof IEditorPlugins
   */
  configure(config: Partial<LegacyEditorPluginConfig>); // runtime configuration
}

export interface IPluginAddButton {
  getButton: () => AddButton;

  getTags: () => string | undefined;

  getGroup: () => MenuGroups | undefined;

  equals: (button: IPluginAddButton) => boolean;

  toToolbarItemConfig: () => IToolbarItemConfigTiptap;

  toExternalToolbarButtonConfig: (
    editorCommands: EditorCommands,
    t: TranslationFunction,
    uploadService: IUploadService,
    updateService: IUpdateService
  ) => ToolbarButtonProps;

  getToolbars: () => ToolbarType[];

  toToolbarButtonSettings: () => PluginButton;

  register: () => void;

  unregister: () => void;
}

export interface IPluginAddButtons {
  asArray: () => IPluginAddButton[];

  byGroup: (group: MenuGroups) => IPluginAddButtons;

  register: (button: AddButton) => void;

  unregister: (button: AddButton) => void;

  toToolbarButtonsConfig: () => IToolbarItemConfigTiptap[];

  registerPluginMenuModal: (config?: AddPluginMenuConfig) => void;
}

export interface IPluginToolbar {
  getButtons: () => IPluginToolbarButton[];

  toToolbarItemsConfig: () => IToolbarItemConfigTiptap[];

  // eslint-disable-next-line @typescript-eslint/ban-types
  getToolbarButtonsRenderers: () => Record<string, Function>;

  isVisible: (selection) => boolean;

  register: () => void;

  unregister: () => void;
}

export interface IPluginToolbarButton {
  getButton: () => ToolbarButton;

  equals: (button: IPluginToolbarButton) => boolean;

  toToolbarItemConfig: () => IToolbarItemConfigTiptap;

  getRenderer: () => Record<string, ComponentType>;

  register: () => void;

  unregister: () => void;
}
