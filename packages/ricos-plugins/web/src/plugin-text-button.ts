import { fromEntries } from 'ricos-content/libs/utils';
import type {
  EditorCommands,
  FormattingToolbarButton,
  FormattingToolbarButtonConfig,
  FormattingToolbarButtons,
  IToolbarItemConfigTiptap,
  ToolbarButtonProps,
  IContent,
  PluginServices,
  Platform,
} from 'ricos-types';
import { resolversById } from 'wix-rich-content-toolbars-v3';

export class PluginTextButton implements FormattingToolbarButton {
  private readonly button: FormattingToolbarButtonConfig;

  private services: PluginServices;

  private readonly keyCombinationText: string;

  private constructor(
    button: FormattingToolbarButtonConfig,
    services: PluginServices,
    platform: Platform
  ) {
    this.button = button;
    this.services = services;
    this.keyCombinationText = services.shortcuts.getShortcutDisplayData(
      button.id,
      this.services.t,
      platform
    ).keyCombinationText;
  }

  static of(button: FormattingToolbarButtonConfig, services: PluginServices, platform: Platform) {
    return new PluginTextButton(button, services, platform);
  }

  private getTooltip() {
    return this.button.presentation?.tooltip
      ? `${this.services.t(this.button.presentation.tooltip)} ${
          this.keyCombinationText ? `(${this.keyCombinationText})` : ''
        }`
      : '';
  }

  register() {
    const modal = this.button.modal;
    if (modal) {
      this.services.modalService?.register(modal);
    }
  }

  unregister() {
    if (this.button.modal) {
      this.services.modalService.unregister(this.button.modal?.id);
    }
  }

  private toResolvedAttributes(): IToolbarItemConfigTiptap['attributes'] {
    const resolvedAttributes = Object.entries(this.button.attributes || {}).map(([key, value]) => {
      return [key, resolversById[value]];
    });
    return fromEntries(resolvedAttributes);
  }

  toToolbarItemConfig(editorCommands: EditorCommands): IToolbarItemConfigTiptap {
    return {
      ...this.button,
      presentation: {
        ...(this.button.presentation || {}),
        tooltip: this.getTooltip(),
      },
      attributes: this.toResolvedAttributes(),
      commands: {
        ...this.button.commands,
        click: () => () => {
          this.button.command?.(editorCommands);
        },
      },
    };
  }

  toExternalToolbarButtonConfig(
    editorCommands: EditorCommands,
    content: IContent<unknown>
  ): ToolbarButtonProps {
    const attributes = this.toResolvedAttributes();
    const { modalService, t } = this.services;
    return {
      type: 'button',
      tooltip: this.getTooltip(),
      toolbars: [],
      getIcon: () => this.button.presentation?.icon,
      getLabel: () => this.button.id,
      onClick: () =>
        this.button.modal
          ? modalService?.isModalOpen(this.button.modal.id)
            ? modalService?.closeModal(this.button.modal.id)
            : modalService?.openModal(this.button.modal.id, {
                layout: 'dialog',
              })
          : this.button.command?.(editorCommands),
      isActive: () => !!attributes.active && !!content.resolve(attributes.active),
      isDisabled: () => false,
      dataHook: this.button.presentation?.dataHook,
      name: this.button.id,
    };
  }
}

export class PluginTextButtons implements FormattingToolbarButtons {
  private readonly buttons: PluginTextButton[];

  private constructor(buttons: PluginTextButton[]) {
    this.buttons = buttons;
  }

  static of(buttons: PluginTextButton[]): PluginTextButtons {
    return new PluginTextButtons(buttons);
  }

  asArray() {
    return this.buttons;
  }

  toToolbarItemsConfigs(editorCommands: EditorCommands): IToolbarItemConfigTiptap[] {
    return this.buttons.map(b => b.toToolbarItemConfig(editorCommands));
  }

  toExternalToolbarButtonsConfigs(
    editorCommands: EditorCommands,
    content: IContent<unknown>
  ): Record<string, ToolbarButtonProps> {
    //TODO: support all buttons
    const unsupportedTextButtons = [
      'fontSize',
      'alignment',
      'title',
      'headings',
      'textColor',
      'textHighlight',
      'link',
      'lineSpacing',
    ];

    return this.buttons
      .filter(b => !unsupportedTextButtons.includes(b.toToolbarItemConfig(editorCommands).id))
      .reduce((acc, b) => {
        const buttonConfig = b.toExternalToolbarButtonConfig(editorCommands, content);
        return {
          ...acc,
          [buttonConfig.getLabel?.() || '']: buttonConfig,
        };
      }, {});
  }
}
