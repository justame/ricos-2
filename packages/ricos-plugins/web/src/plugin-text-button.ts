import { fromEntries } from 'ricos-content/libs/utils';
import { TOOLBARS } from 'wix-rich-content-editor-common';
import type {
  EditorCommands,
  FormattingToolbarButton,
  FormattingToolbarButtonConfig,
  FormattingToolbarButtons,
  IToolbarItemConfigTiptap,
  ToolbarButtonProps,
  ToolbarSettings,
  IContent,
  Platform,
  ToolbarType,
  ToolbarSettingsFunctions,
} from 'ricos-types';
import { resolversById, tiptapStaticToolbarConfig } from 'wix-rich-content-toolbars-v3';
import { cleanSeparators } from './toolbar-utils/cleanSeparators';
import { toTiptapToolbarItemsConfig } from './toolbar-utils/toTiptapToolbarItemsConfig';
import { getToolbarConfig } from './toolbar-utils/getToolbarConfig';
import { initToolbarSettings } from './toolbar-utils/initToolbarSettings';
import type { PluginServices } from './editorPlugins';

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
      this.services.modals.register(modal);
    }
  }

  unregister() {
    if (this.button.modal) {
      this.services.modals.unregister(this.button.modal?.id);
    }
  }

  private toResolvedAttributes(): IToolbarItemConfigTiptap['attributes'] {
    const resolvedAttributes = Object.entries(this.button.attributes || {}).map(([key, value]) => {
      return [key, resolversById[value]];
    });
    return fromEntries(resolvedAttributes);
  }

  toToolbarItemConfig(
    editorCommands: EditorCommands,
    toolbarType: ToolbarType
  ): IToolbarItemConfigTiptap {
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
          this.services.toolbars.byType(toolbarType).publishButtonClick(this.button.id);
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
    const { modals } = this.services;
    return {
      type: 'button',
      tooltip: this.getTooltip(),
      toolbars: [],
      getIcon: () => this.button.presentation?.icon,
      getLabel: () => this.button.id,
      onClick: () => {
        this.services.toolbars.external.publishButtonClick(this.button.id);
        return this.button.modal
          ? modals.isModalOpen(this.button.modal.id)
            ? modals.closeModal(this.button.modal.id)
            : modals.openModal(this.button.modal.id, {
                componentProps: {
                  closeModal: () => this.button.modal && modals.closeModal(this.button.modal.id),
                },
                layout: 'dialog',
              })
          : this.button.command?.(editorCommands);
      },
      isActive: () => !!attributes.active && !!content.resolve(attributes.active),
      isDisabled: () => false,
      dataHook: this.button.presentation?.dataHook,
      name: this.button.id,
    };
  }
}

export class PluginTextButtons implements FormattingToolbarButtons {
  private readonly buttons: PluginTextButton[];

  private readonly finalToolbarSettings: ToolbarSettingsFunctions[];

  private constructor(buttons: PluginTextButton[], toolbarSettings: ToolbarSettings) {
    this.buttons = buttons;
    this.finalToolbarSettings = initToolbarSettings(toolbarSettings);
  }

  static of(buttons: PluginTextButton[] = [], toolbarSettings: ToolbarSettings): PluginTextButtons {
    return new PluginTextButtons(buttons, toolbarSettings);
  }

  toToolbarItemsConfig(
    toolbarType: ToolbarType,
    isMobile: boolean,
    editorCommands: EditorCommands
  ) {
    const toolbarConfig = getToolbarConfig(this.finalToolbarSettings, toolbarType);
    const toolbarItemConfigs = [
      ...this.buttons.map(b => b.toToolbarItemConfig(editorCommands, toolbarType)),
      ...tiptapStaticToolbarConfig,
    ];
    const toolbarItemsConfig = toTiptapToolbarItemsConfig(
      toolbarConfig,
      toolbarItemConfigs,
      toolbarType,
      isMobile ? 'mobile' : 'desktop'
    );

    return cleanSeparators(toolbarItemsConfig);
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
      'lineSpacing',
    ];

    return this.buttons
      .filter(
        b =>
          !unsupportedTextButtons.includes(
            b.toToolbarItemConfig(editorCommands, TOOLBARS.EXTERNAL).id
          )
      )
      .reduce((acc, b) => {
        const buttonConfig = b.toExternalToolbarButtonConfig(editorCommands, content);
        return {
          ...acc,
          [buttonConfig.getLabel?.() || '']: buttonConfig,
        };
      }, {});
  }
}
