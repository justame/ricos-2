import { fromEntries } from 'ricos-content/libs/utils';
import type {
  EditorCommands,
  FormattingToolbarButton,
  FormattingToolbarButtonConfig,
  FormattingToolbarButtons,
  IToolbarItemConfigTiptap,
  IUpdateService,
  IUploadService,
  ToolbarButtonProps,
  TranslationFunction,
  IContent,
  ShortcutDataProvider,
  Platform,
  ModalService,
} from 'ricos-types';
import { resolversById } from 'wix-rich-content-toolbars-v3';

export class PluginTextButton implements FormattingToolbarButton {
  private readonly button: FormattingToolbarButtonConfig;

  private readonly keyCombinationText: string;

  private readonly t: TranslationFunction;

  private readonly modalService: ModalService;

  constructor(
    button: FormattingToolbarButtonConfig,
    modalService: ModalService,
    shortcuts: ShortcutDataProvider,
    t: TranslationFunction,
    platform: Platform
  ) {
    this.button = button;
    this.t = t;
    this.modalService = modalService;

    this.keyCombinationText = shortcuts.getShortcutDisplayData(
      button.id,
      t,
      platform
    ).keyCombinationText;
  }

  private getTooltip() {
    return this.button.presentation?.tooltip
      ? `${this.t(this.button.presentation.tooltip)} ${
          this.keyCombinationText ? `(${this.keyCombinationText})` : ''
        }`
      : '';
  }

  static of(
    button: FormattingToolbarButtonConfig,
    modalService: ModalService,
    shortcuts: ShortcutDataProvider,
    t: TranslationFunction,
    platform: Platform
  ) {
    return new PluginTextButton(button, modalService, shortcuts, t, platform);
  }

  register() {
    const modal = this.button.modal;
    if (modal) {
      this.modalService?.register(modal);
    }
  }

  unregister() {
    if (this.button.modal) {
      this.modalService.unregister(this.button.modal?.id);
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
    _t: TranslationFunction,
    _uploadService: IUploadService,
    _updateService: IUpdateService,
    content: IContent<unknown>
  ): ToolbarButtonProps {
    const attributes = this.toResolvedAttributes();
    return {
      type: 'button',
      tooltip: this.getTooltip(),
      toolbars: [],
      getIcon: () => this.button.presentation?.icon,
      getLabel: () => this.button.id,
      onClick: () =>
        this.button.modal
          ? this.modalService?.isModalOpen(this.button.modal.id)
            ? this.modalService?.closeModal(this.button.modal.id)
            : this.modalService?.openModal(this.button.modal.id, {
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
    t: TranslationFunction,
    uploadService: IUploadService,
    updateService: IUpdateService,
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
        const buttonConfig = b.toExternalToolbarButtonConfig(
          editorCommands,
          t,
          uploadService,
          updateService,
          content
        );
        return {
          ...acc,
          [buttonConfig.getLabel?.() || '']: buttonConfig,
        };
      }, {});
  }
}
