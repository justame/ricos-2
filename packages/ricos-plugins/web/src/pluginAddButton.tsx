import React from 'react';
import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type {
  MenuGroups,
  AddButton,
  ModalService,
  ToolbarType,
  PluginButton,
  IPluginAddButton,
  IPluginAddButtons,
  IToolbarItemConfigTiptap,
  AddPluginMenuConfig,
} from 'ricos-types';
import { AddPluginMenu, PLUGIN_MENU_MODAL_ID } from 'wix-rich-content-toolbars-ui';

export class PluginAddButtonCollisionError extends Error {}

/**
 * Represents plugin add button
 *
 *
 * @export
 * @class PluginAddButton
 */
export class PluginAddButton implements IPluginAddButton {
  button: AddButton;

  modalService: ModalService;

  callbacks: { [key: string]: ((id: string) => unknown)[] } = {};

  private constructor(button: AddButton, modalService: ModalService) {
    this.button = button;
    this.modalService = modalService;
  }

  static of(button: AddButton, modalService: ModalService): IPluginAddButton {
    return new PluginAddButton(button, modalService);
  }

  register() {
    const modal = this.getModal();
    if (modal) {
      this.modalService?.register(modal);
    }
  }

  unregister() {
    const modal = this.getModal();
    if (modal) {
      this.modalService?.unregister(modal.id);
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

  equals(button: IPluginAddButton): boolean {
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

  toToolbarButtonSettings(): PluginButton {
    return {
      buttonSettings: { name: this.button.id, toolbars: this.getToolbars() },
      component: this.button.icon,
      blockType: 'node',
    };
  }
}

export class PluginAddButtons implements IPluginAddButtons {
  buttons: IPluginAddButton[] = [];

  modalService: ModalService;

  constructor(buttons: IPluginAddButton[] = [], modalService: ModalService) {
    this.buttons = buttons;
    this.modalService = modalService;
  }

  private hasDuplicate(candidate: IPluginAddButton) {
    return this.buttons.find(b => b.equals(candidate));
  }

  asArray() {
    return this.buttons;
  }

  byGroup(group: MenuGroups) {
    return new PluginAddButtons(
      this.buttons.filter(button => button.getGroup() === group),
      this.modalService
    );
  }

  byToolbar(toolbar: ToolbarType) {
    return new PluginAddButtons(
      this.buttons.filter(button => button.getToolbars().includes(toolbar)),
      this.modalService
    );
  }

  register(button: AddButton) {
    const candidate = PluginAddButton.of(button, this.modalService);
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
    const candidate = PluginAddButton.of(button, this.modalService);
    this.buttons = this.buttons.filter(b => !b.equals(candidate));
  }

  toToolbarButtonsConfig() {
    return this.buttons.map(b => b.toToolbarItemConfig());
  }

  registerPluginMenuModal(config?: AddPluginMenuConfig) {
    this.modalService?.register({
      id: PLUGIN_MENU_MODAL_ID,
      Component: props => (
        <AddPluginMenu addButtons={this} addPluginMenuConfig={config} {...props} />
      ),
    });
  }
}
