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
} from 'ricos-types';
import { resolversById } from 'wix-rich-content-toolbars-v3';

export class PluginTextButton implements FormattingToolbarButton {
  private readonly button: FormattingToolbarButtonConfig;

  constructor(button: FormattingToolbarButtonConfig) {
    this.button = button;
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
    t: TranslationFunction,
    _uploadService: IUploadService,
    _updateService: IUpdateService,
    content: IContent<unknown>
  ): ToolbarButtonProps {
    const attributes = this.toResolvedAttributes();
    return {
      type: 'button',
      tooltip: t(this.button.presentation?.tooltip),
      toolbars: [],
      getIcon: () => this.button.presentation?.icon,
      getLabel: () => this.button.id,
      onClick: () => this.button.command?.(editorCommands),
      isActive: () => !!attributes.active && !!content.resolve(attributes.active),
      isDisabled: () => false,
      dataHook: this.button.presentation?.dataHook,
      name: this.button.id,
    };
  }
}

export class PluginTextButtons implements FormattingToolbarButtons {
  private readonly buttons: PluginTextButton[];

  constructor(buttons: PluginTextButton[]) {
    this.buttons = buttons;
  }

  static of(buttons: FormattingToolbarButtonConfig[] = []): PluginTextButtons {
    return new PluginTextButtons(buttons.map(button => new PluginTextButton(button)));
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
