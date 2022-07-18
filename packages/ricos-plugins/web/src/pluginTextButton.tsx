import type { IPluginTextButton, IPluginTextButtons, IToolbarItemConfigTiptap } from 'ricos-types';

export class PluginTextButtonCollisionError extends Error {}

/**
 * Represents plugin text button
 *
 *
 * @export
 * @class PluginTextButton
 */
export class PluginTextButton implements IPluginTextButton {
  button: IToolbarItemConfigTiptap;

  constructor(button: IToolbarItemConfigTiptap) {
    this.button = button;
  }

  static of(button: IToolbarItemConfigTiptap): IPluginTextButton {
    return new PluginTextButton(button);
  }

  getButton(): IToolbarItemConfigTiptap {
    return this.button;
  }
}

export class PluginTextButtons implements IPluginTextButtons {
  buttons: IPluginTextButton[] = [];

  constructor(buttons: IPluginTextButton[] = []) {
    this.buttons = buttons;
  }

  asArray() {
    return this.buttons;
  }
}
