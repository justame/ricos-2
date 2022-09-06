import { fromEntries } from 'ricos-content/libs/utils';
import { TOOLBARS, FORMATTING_BUTTONS } from 'wix-rich-content-editor-common';
import type {
  EditorCommands,
  FormattingToolbarButton,
  FormattingToolbarButtonConfig,
  FormattingToolbarButtons,
  IToolbarItemConfigTiptap,
  ToolbarButtonProps,
  ToolbarSettings,
  Platform,
  ToolbarType,
  ToolbarSettingsFunctions,
} from 'ricos-types';
import { resolversById, tiptapStaticToolbarConfig } from 'wix-rich-content-toolbars-v3';
import { cleanSeparators } from './toolbar-utils/cleanSeparators';
import {
  toTiptapToolbarItemsConfig,
  toExternalToolbarItemsConfig,
} from './toolbar-utils/toToolbarItemsConfig';
import { getToolbarConfig } from './toolbar-utils/getToolbarConfig';
import { initToolbarSettings } from './toolbar-utils/initToolbarSettings';
import { Decoration_Type, Node_Type } from 'ricos-schema';
import type { PluginServices } from './editorPlugins';

const toExternalType = {
  [Decoration_Type.BOLD]: FORMATTING_BUTTONS.BOLD,
  [Decoration_Type.ITALIC]: FORMATTING_BUTTONS.ITALIC,
  [Decoration_Type.UNDERLINE]: FORMATTING_BUTTONS.UNDERLINE,
  [`${Node_Type.HEADING}.title`]: FORMATTING_BUTTONS.TITLE,
  [Node_Type.BLOCKQUOTE]: FORMATTING_BUTTONS.BLOCKQUOTE,
  'TextAlignment.ALIGNMENT': FORMATTING_BUTTONS.ALIGNMENT,
  'TextAlignment.LEFT': FORMATTING_BUTTONS.ALIGN_LEFT,
  'TextAlignment.CENTER': FORMATTING_BUTTONS.ALIGN_CENTER,
  'TextAlignment.RIGHT': FORMATTING_BUTTONS.ALIGN_RIGHT,
  'TextAlignment.JUSTIFY': FORMATTING_BUTTONS.ALIGN_JUSTIFY,
  [Node_Type.ORDERED_LIST]: FORMATTING_BUTTONS.ORDERED_LIST,
  [Node_Type.BULLETED_LIST]: FORMATTING_BUTTONS.UNORDERED_LIST,
  [Decoration_Type.FONT_SIZE]: FORMATTING_BUTTONS.FONT_SIZE,
  [Decoration_Type.SPOILER]: FORMATTING_BUTTONS.SPOILER,
  [Decoration_Type.LINK]: FORMATTING_BUTTONS.LINK,
  [`${Node_Type.HEADING}.dropdown`]: FORMATTING_BUTTONS.HEADINGS,
  [`${Decoration_Type.COLOR}.foreground`]: FORMATTING_BUTTONS.TEXT_COLOR,
  [`${Decoration_Type.COLOR}.background`]: FORMATTING_BUTTONS.TEXT_HIGHLIGHT,
  [Node_Type.CODE_BLOCK]: FORMATTING_BUTTONS.CODE_BLOCK,
  LINE_SPACING: FORMATTING_BUTTONS.LINE_SPACING,
  [`INDENT.increase`]: FORMATTING_BUTTONS.INCREASE_INDENT,
  [`INDENT.decrease`]: FORMATTING_BUTTONS.DECREASE_INDENT,
};

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

  getButtonId() {
    return this.button.id;
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
    const { modals, context } = this.services;
    return {
      ...this.button,
      presentation: {
        ...(this.button.presentation || {}),
        tooltip: this.getTooltip(),
      },
      attributes: this.toResolvedAttributes(),
      commands: {
        ...this.button.commands,
        click:
          () =>
          ({ referenceElement, ...rest } = {}) => {
            this.services.toolbars.byType(toolbarType).publishButtonClick(this.button.id);
            return this.button.modal
              ? modals.isModalOpen(this.button.modal.id)
                ? modals.closeModal(this.button.modal.id)
                : modals.openModal(this.button.modal.id, {
                    componentProps: {
                      closeModal: () =>
                        this.button.modal && modals.closeModal(this.button.modal.id),
                    },
                    positioning: {
                      placement: 'bottom',
                      referenceElement,
                    },
                    layout: context.isMobile ? 'drawer' : referenceElement ? 'toolbar' : 'dialog',
                  })
              : this.button.command?.(editorCommands)?.(rest);
          },
      },
    };
  }

  toExternalToolbarButtonConfig(editorCommands: EditorCommands): ToolbarButtonProps {
    const attributes = this.toResolvedAttributes();
    const { modals, content, context, t } = this.services;
    const name = toExternalType[this.button.id] ?? this.button.id;

    return {
      type: 'button',
      tooltip: this.getTooltip(),
      toolbars: [],
      getIcon: () =>
        this.button.presentation?.icon ||
        this.button.presentation?.getIcon(editorCommands, this.services.t),
      getLabel: () => t(name),
      onClick: e => {
        this.services.toolbars.external.publishButtonClick(this.button.id);
        return this.button.modal
          ? modals.isModalOpen(this.button.modal.id)
            ? modals.closeModal(this.button.modal.id)
            : modals.openModal(this.button.modal.id, {
                componentProps: {
                  closeModal: () => this.button.modal && modals.closeModal(this.button.modal.id),
                },
                positioning: {
                  placement: 'bottom',
                  referenceElement: e?.target,
                },
                layout: context.isMobile ? 'drawer' : e?.target ? 'toolbar' : 'dialog',
              })
          : this.button.command?.(editorCommands)({});
      },
      isActive: () => !!attributes.active && !!content.resolve(attributes.active),
      isDisabled: () => !!attributes.disabled && !!content.resolve(attributes.disabled),
      dataHook: this.button.presentation?.dataHook,
      name,
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
    isMobile: boolean
  ): Record<string, ToolbarButtonProps> {
    const toolbarType = TOOLBARS.FORMATTING;
    const toolbarConfig = getToolbarConfig(this.finalToolbarSettings, toolbarType);

    const buttonsType = isMobile ? 'mobile' : 'desktop';

    const externalToolbarItemsConfig = toExternalToolbarItemsConfig(
      toolbarConfig,
      this.buttons,
      toolbarType,
      buttonsType
    );

    return externalToolbarItemsConfig.reduce((acc, b) => {
      const buttonConfig = b.toExternalToolbarButtonConfig(editorCommands);
      return {
        ...acc,
        [buttonConfig.name || '']: buttonConfig,
      };
    }, {});
  }
}
