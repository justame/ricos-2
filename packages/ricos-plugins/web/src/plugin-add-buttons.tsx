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
} from 'ricos-types';
import { AddPluginMenu } from 'wix-rich-content-toolbars-ui';
import type { PluginServices } from './editorPlugins';
import { RicosPluginAddButton, PluginAddButtonCollisionError } from './pluginAddButton';

// TODO: copied from toolbars-ui, should be moved to ricos-types?
const PLUGIN_MENU_MODAL_ID = 'pluginMenu';

export class RicosPluginAddButtons implements PluginAddButtons {
  buttons: PluginAddButton[] = [];

  services: PluginServices;

  constructor(buttons: PluginAddButton[] = [], services: PluginServices) {
    this.buttons = buttons;
    this.services = services;
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
      this.services
    );
  }

  byToolbar(toolbar: ToolbarType) {
    return new RicosPluginAddButtons(
      this.buttons.filter(button => button.getToolbars().includes(toolbar)),
      this.services
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
  }

  toToolbarButtonsConfig(): IToolbarItemConfigTiptap[] {
    return this.buttons.map(b => b.toToolbarItemConfig());
  }

  toExternalToolbarButtonsConfigs(
    editorCommands: EditorCommands
  ): Record<string, ToolbarButtonProps> {
    return this.buttons.reduce((acc, b) => {
      const buttonConfig = b.toExternalToolbarButtonConfig(editorCommands);
      return {
        ...acc,
        [buttonConfig.getLabel?.() || '']: buttonConfig,
      };
    }, {});
  }
}
