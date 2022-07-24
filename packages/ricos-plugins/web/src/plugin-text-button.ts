import { fromEntries } from 'ricos-content/libs/utils';
import type {
  FormattingToolbarButton,
  FormattingToolbarButtonConfig,
  FormattingToolbarButtons,
  IContentResolver,
  IToolbarItemConfigTiptap,
} from 'ricos-types';
import { resolversById } from 'wix-rich-content-toolbars-v3';

export class PluginTextButton implements FormattingToolbarButton {
  private readonly button: IToolbarItemConfigTiptap;

  constructor(button: FormattingToolbarButtonConfig) {
    this.button = this.toResolvedButton(button);
  }

  private toResolvedButton(button: FormattingToolbarButtonConfig): IToolbarItemConfigTiptap {
    if (button.attributes) {
      const resolvedAttributes = Object.entries(button.attributes).map(([key, value]) => {
        return [key, resolversById[value]];
      });
      return {
        ...button,
        attributes: fromEntries(resolvedAttributes),
      };
    }
    return button as unknown as IToolbarItemConfigTiptap;
  }

  getButton(): IToolbarItemConfigTiptap {
    return this.button;
  }
}

export class PluginTextButtons implements FormattingToolbarButtons {
  private readonly buttons: PluginTextButton[];

  private constructor(buttons: PluginTextButton[]) {
    this.buttons = buttons;
  }

  static of(buttons: FormattingToolbarButtonConfig[] = []): PluginTextButtons {
    return new PluginTextButtons(buttons.map(button => new PluginTextButton(button)));
  }

  asArray() {
    return this.buttons;
  }
}
