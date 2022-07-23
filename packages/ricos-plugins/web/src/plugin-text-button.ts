import { fromEntries } from 'ricos-content/libs/utils';
import type {
  FormattingToolbarButton,
  FormattingToolbarButtonConfig,
  FormattingToolbarButtons,
  IContentResolver,
  IToolbarItemConfigTiptap,
} from 'ricos-types';
import { resolversById } from 'wix-rich-content-toolbars-v3';

type ResolvedButton = IToolbarItemConfigTiptap & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, IContentResolver<any>>;
};

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

  getButton(): ResolvedButton {
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
    // eslint-disable-next-line no-console
    console.assert(
      this.buttons.every(b =>
        Object.values(b.getButton().attributes).every(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (v: IContentResolver<any>) =>
            typeof v !== 'undefined' &&
            typeof v.id !== 'undefined' &&
            typeof v.resolve !== 'undefined'
        )
      ),
      `All attributes must be resolved (${this.buttons.map(
        b => b.getButton().id
      )} are not resolved)`
    );
    return this.buttons;
  }
}
