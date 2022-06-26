import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type { MenuGroups, AddButton, ModalService } from 'ricos-types';

export class PluginAddButtonCollisionError extends Error {}

/**
 * Represents plugin add button
 *
 *
 * @export
 * @class PluginAddButton
 */
export class PluginAddButton {
  button: AddButton;

  callbacks: { [key: string]: ((id: string) => unknown)[] } = {};

  private constructor(button: AddButton, modalService?: ModalService) {
    this.button = button;
    this.registerModal(modalService);
  }

  static of(button: AddButton, modalService?: ModalService) {
    return new PluginAddButton(button, modalService);
  }

  private registerModal(modalService) {
    const modal = this.button.modal;
    if (modal) {
      modalService?.register(modal);
    }
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

  equals(button: PluginAddButton): boolean {
    return this.button.id === button.getButton().id;
  }

  toToolbarItemConfig() {
    return {
      id: this.button.id,
      type: this.button.modal ? 'modal' : 'toggle',
      presentation: {
        tooltip: this.button.tooltip,
        icon: this.button.icon,
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
}

export class PluginAddButtons {
  buttons: PluginAddButton[];

  constructor(buttons: PluginAddButton[] = []) {
    this.buttons = buttons;
  }

  private hasDuplicate(candidate: PluginAddButton) {
    return this.buttons.find(b => b.equals(candidate));
  }

  asArray() {
    return this.buttons;
  }

  byGroup(group: MenuGroups) {
    return new PluginAddButtons(this.buttons.filter(button => button.getGroup() === group));
  }

  register(button: AddButton) {
    const candidate = PluginAddButton.of(button);
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
    const candidate = PluginAddButton.of(button);
    this.buttons = this.buttons.filter(b => !b.equals(candidate));
  }
}
