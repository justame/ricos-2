import React from 'react';
import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type {
  MenuGroups,
  AddButton,
  ToolbarType,
  PluginButton,
  PluginAddButton,
  PluginAddButtons,
  IToolbarItemConfigTiptap,
  AddPluginMenuConfig,
  ToolbarButtonProps,
  EditorCommands,
} from 'ricos-types';
import { AddPluginMenu, PLUGIN_MENU_MODAL_ID } from 'wix-rich-content-toolbars-ui';
import type { PluginServices } from './editorPlugins';

export class PluginAddButtonCollisionError extends Error {}

/**
 * Represents plugin add button
 *
 *
 * @export
 * @class PluginAddButton
 */
export class RicosPluginAddButton implements PluginAddButton {
  button: AddButton;

  services: PluginServices;

  callbacks: { [key: string]: ((id: string) => unknown)[] } = {};

  private constructor(button: AddButton, services: PluginServices) {
    this.button = button;
    this.services = services;
  }

  static of(button: AddButton, services: PluginServices): PluginAddButton {
    return new RicosPluginAddButton(button, services);
  }

  register() {
    const modal = this.getModal();
    if (modal) {
      const { modals } = this.services;
      modals.register(modal);
    }
  }

  unregister() {
    const modal = this.getModal();
    if (modal) {
      const { modals } = this.services;
      modals.unregister(modal.id);
    }
  }

  getModal() {
    return this.button.modal;
  }

  getButton(): AddButton {
    return { ...this.button };
  }

  getTags() {
    return this.button.menuConfig?.tags;
  }

  getGroup() {
    return this.button.menuConfig?.group;
  }

  getToolbars(): ToolbarType[] {
    return this.button.toolbars;
  }

  equals(button: PluginAddButton): boolean {
    return this.button.id === button.getButton().id;
  }

  toToolbarItemConfig(): IToolbarItemConfigTiptap {
    return {
      id: this.button.id,
      type: this.button.modal ? 'modal' : 'toggle',
      presentation: {
        tooltip: this.button.tooltip,
        icon: this.button.icon,
        dataHook: this.button.dataHook,
      },
      attributes: {
        visible: alwaysVisibleResolver,
      },
      commands: {
        click:
          ({ editorCommands }) =>
          () => {
            this.getButton().command(editorCommands);
          },
      },
    };
  }

  toExternalToolbarButtonConfig(editorCommands: EditorCommands): ToolbarButtonProps {
    const { modals, t } = this.services;
    return {
      type: 'button',
      tooltip: t(this.button.tooltip),
      toolbars: this.button.toolbars,
      getIcon: () => this.button.icon,
      getLabel: () => this.button.label || '',
      onClick: () => {
        this.button.modal
          ? modals?.isModalOpen(this.button.modal.id)
            ? modals?.closeModal(this.button.modal.id)
            : modals?.openModal(this.button.modal.id, {
                layout: 'dialog',
              })
          : this.button.command(editorCommands);
      },
      isActive: () => false,
      isDisabled: () => false,
      dataHook: this.button.dataHook,
      name: this.button.label,
    };
  }

  toToolbarButtonSettings(): PluginButton {
    return {
      buttonSettings: { name: this.button.id, toolbars: this.getToolbars() },
      component: this.button.icon,
      blockType: 'node',
    };
  }
}

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

  toToolbarButtonsConfig() {
    return this.buttons.map(b => b.toToolbarItemConfig());
  }

  registerPluginMenuModal(config?: AddPluginMenuConfig) {
    this.services.modals?.register({
      id: PLUGIN_MENU_MODAL_ID,
      Component: props => (
        <AddPluginMenu addButtons={this} addPluginMenuConfig={config} {...props} />
      ),
    });
  }

  toToolbarItemsConfigs(): IToolbarItemConfigTiptap[] {
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
