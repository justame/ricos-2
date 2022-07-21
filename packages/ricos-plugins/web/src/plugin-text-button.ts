import type {
  FormattingToolbarButton,
  FormattingToolbarButtons,
  IToolbarItemConfigTiptap,
} from 'ricos-types';

/**
 * Represents plugin text button
 *
 *
 * @export
 * @class PluginTextButton
 */
export class PluginTextButton implements FormattingToolbarButton {
  button: IToolbarItemConfigTiptap;

  constructor(button: IToolbarItemConfigTiptap) {
    this.button = button;
  }

  getButton(): IToolbarItemConfigTiptap {
    return this.button;
  }
}

export class PluginTextButtons implements FormattingToolbarButtons {
  buttons: FormattingToolbarButton[] = [];

  constructor(buttons: FormattingToolbarButton[] = []) {
    this.buttons = buttons;
  }

  asArray() {
    return this.buttons;
  }
}
