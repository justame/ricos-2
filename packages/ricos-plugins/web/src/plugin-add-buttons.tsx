import React from 'react';
import type {
  AddButton,
  AddPluginMenuConfig,
  EditorCommands,
  IToolbarItemConfigTiptap,
  MenuGroups,
  PluginAddButton,
  PluginAddButtons,
  PluginMenuItem,
  ToolbarButtonProps,
  ToolbarType,
  ToolbarSettings,
} from 'ricos-types';
import { PLUGIN_MENU_MODAL_ID, PLUGIN_MENU_HORIZONTAL_MODAL_ID } from 'ricos-types';
import { AddPluginMenu } from 'wix-rich-content-toolbars-ui';
import { AddPluginMenuHorizontal } from 'wix-rich-content-toolbars-v3';
import type { PluginServices } from './editorPlugins';
import { RicosPluginAddButton, PluginAddButtonCollisionError } from './pluginAddButton';
import { initToolbarSettings } from './toolbar-utils/initToolbarSettings';
import { getToolbarConfig } from './toolbar-utils/getToolbarConfig';
import { TOOLBARS } from 'wix-rich-content-editor-common';
import { toExternalInsertPluginToolbarItemsConfig } from './toolbar-utils/toToolbarItemsConfig';

export class RicosPluginAddButtons implements PluginAddButtons {
  buttons: PluginAddButton[] = [];

  services: PluginServices;

  toolbarSettings: ToolbarSettings;

  constructor(
    buttons: PluginAddButton[] = [],
    services: PluginServices,
    toolbarSettings: ToolbarSettings
  ) {
    this.buttons = buttons;
    this.services = services;
    this.toolbarSettings = toolbarSettings;
  }

  private hasDuplicate(candidate: PluginAddButton) {
    return this.buttons.find(b => b.equals(candidate));
  }

  asArray() {
    return this.buttons;
  }

  byGroup(group: MenuGroups) {
    return new RicosPluginAddButtons(
      this.buttons.filter(button => button.getGroup() === group),
      this.services,
      this.toolbarSettings
    );
  }

  byToolbar(toolbar: ToolbarType) {
    return new RicosPluginAddButtons(
      this.buttons.filter(button => button.getToolbars().includes(toolbar)),
      this.services,
      this.toolbarSettings
    );
  }

  byTag(tag) {
    const { t } = this.services;
    return this.buttons.filter(button =>
      t(button.getTags() || '')
        .toLowerCase()
        .includes(tag.toLowerCase())
    );
  }

  register(button: AddButton) {
    const candidate = RicosPluginAddButton.of(button, this.services);
    const duplicate = this.hasDuplicate(candidate);
    if (duplicate) {
      throw new PluginAddButtonCollisionError(
        `the plugin add button ${candidate.getButton().id} conflicts with ${
          duplicate.getButton().id
        }`
      );
    }
    this.buttons.push(candidate);
  }

  unregister(button: AddButton) {
    const candidate = RicosPluginAddButton.of(button, this.services);
    this.buttons = this.buttons.filter(b => !b.equals(candidate));
  }

  toPluginMenuItems(): PluginMenuItem[] {
    return this.buttons.map(button => button.toPluginMenuItem());
  }

  toHorizontalMenuItems() {
    return this.buttons.map(b => b.toHorizontalMenuItem());
  }

  toFooterToolbarItems() {
    return this.buttons.map(b => b.toFooterToolbarItem());
  }

  registerPluginMenuModal(config?: AddPluginMenuConfig) {
    this.services.modals?.register({
      id: PLUGIN_MENU_MODAL_ID,
      Component: props => (
        <AddPluginMenu addButtons={this} addPluginMenuConfig={config} {...props} />
      ),
    });
    this.services.modals?.register({
      id: PLUGIN_MENU_HORIZONTAL_MODAL_ID,
      Component: props => <AddPluginMenuHorizontal buttons={this} {...props} />,
    });
  }

  toToolbarButtonsConfig(): IToolbarItemConfigTiptap[] {
    return this.buttons.map(b => b.toToolbarItemConfig());
  }

  toExternalToolbarButtonsConfigs(
    editorCommands: EditorCommands,
    isMobile: boolean
  ): Record<string, ToolbarButtonProps> {
    const toolbarType = TOOLBARS.INSERT_PLUGIN;
    const finalToolbarSettings = initToolbarSettings(this.toolbarSettings);
    const toolbarConfig = getToolbarConfig(finalToolbarSettings, toolbarType);
    const buttonsType = isMobile ? 'mobile' : 'desktop';

    const externalToolbarItemsConfig = toExternalInsertPluginToolbarItemsConfig(
      toolbarConfig,
      this.buttons,
      toolbarType,
      buttonsType
    );

    return externalToolbarItemsConfig.reduce((acc, b) => {
      const buttonConfig = b.toExternalToolbarButtonConfig(editorCommands);
      return {
        ...acc,
        [buttonConfig.name || '']: buttonConfig,
      };
    }, {});
  }
}
