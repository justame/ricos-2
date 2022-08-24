import React from 'react';
import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type {
  MenuGroups,
  AddButton,
  ToolbarType,
  PluginButton,
  PluginAddButton,
  PluginAddButtons,
  IToolbarItemConfigTiptap,
  AddPluginMenuConfig,
  ToolbarButtonProps,
  EditorCommands,
  PluginMenuItem,
  Layout,
  Placement,
  TextDirection,
} from 'ricos-types';
import { AddPluginMenu, PLUGIN_MENU_MODAL_ID } from 'wix-rich-content-toolbars-ui';
import type { PluginServices } from './editorPlugins';

const SECTIONS = {
  no_section: 'BlockToolbar_Section_NoSections_ShortcutToolbar',
  basic: 'BlockToolbar_Section_Basic',
  advanced: 'BlockToolbar_Section_Advanced',
  embed_wix: 'BlockToolbar_Section_Embed_Wix',
  embed: 'BlockToolbar_Section_Embed_Anywhere',
};

export class PluginAddButtonCollisionError extends Error {}

/**
 * Represents plugin add button
 *
 *
 * @export
 * @class PluginAddButton
 */
export class RicosPluginAddButton implements PluginAddButton {
  button: AddButton;

  services: PluginServices;

  callbacks: { [key: string]: ((id: string) => unknown)[] } = {};

  private constructor(button: AddButton, services: PluginServices) {
    this.button = button;
    this.services = services;
  }

  static of(button: AddButton, services: PluginServices): PluginAddButton {
    return new RicosPluginAddButton(button, services);
  }

  register() {
    const modal = this.getModal();
    if (modal) {
      const { modals } = this.services;
      modals.register(modal);
    }
  }

  unregister() {
    const modal = this.getModal();
    if (modal) {
      const { modals } = this.services;
      modals.unregister(modal.id);
    }
  }

  getModal() {
    return this.button.modal;
  }

  getButton(): AddButton {
    return { ...this.button };
  }

  getTags() {
    return this.button.menuConfig?.tags;
  }

  getGroup() {
    return this.button.menuConfig?.group || ('no_section' as MenuGroups);
  }

  getToolbars(): ToolbarType[] {
    return this.button.toolbars;
  }

  equals(button: PluginAddButton): boolean {
    return this.button.id === button.getButton().id;
  }

  private calcPluginModalLayout(isMobile: boolean): Layout {
    return isMobile ? 'fullscreen' : 'popover';
  }

  private calcPluginModalPlacement(isMobile: boolean, languageDir: TextDirection): Placement {
    return isMobile ? 'bottom' : languageDir === 'ltr' ? 'right-start' : 'left-start';
  }

  toPluginMenuItem(): PluginMenuItem {
    const { t } = this.services;
    return {
      id: this.button.id,
      presentation: {
        dataHook: this.button.dataHook || '',
        label: t(this.button.label) || '',
        tooltip: t(this.button.tooltip) || '',
        icon: this.button.icon,
      },
      getClickHandler:
        (editorCommands: EditorCommands, referenceElement?: HTMLElement | null) => () => {
          const placement = this.calcPluginModalPlacement(
            this.services.context.isMobile,
            this.services.context.languageDir
          );
          const layout = this.calcPluginModalLayout(this.services.context.isMobile);
          this.services.modals.closeModal(PLUGIN_MENU_MODAL_ID);
          this.button.modal
            ? this.services.modals.openModal(this.button.modal.id, {
                positioning: {
                  referenceElement,
                  placement,
                },
                layout,
              })
            : this.button.command(editorCommands);

          this.services.toolbars.pluginMenu.publishButtonClick(this.button.id);
        },
      section: SECTIONS[this.getGroup()],
    };
  }

  toToolbarItemConfig(): IToolbarItemConfigTiptap {
    const { t } = this.services;
    return {
      id: this.button.id,
      type: this.button.modal ? 'modal' : 'toggle',
      presentation: {
        tooltip: t(this.button.tooltip),
        icon: this.button.icon,
        dataHook: this.button.dataHook,
      },
      attributes: {
        visible: alwaysVisibleResolver,
      },
      commands: {
        click:
          ({ editorCommands }) =>
          () => {
            this.services.toolbars.pluginMenu.publishButtonClick(this.button.id);
            this.button.command(editorCommands);
          },
      },
    };
  }

  toExternalToolbarButtonConfig(editorCommands: EditorCommands): ToolbarButtonProps {
    const { modals, context, t } = this.services;
    return {
      type: 'button',
      tooltip: t(this.button.tooltip),
      toolbars: this.button.toolbars,
      getIcon: () => this.button.icon,
      getLabel: () => this.button.label || '',
      onClick: e => {
        this.services.toolbars.external.publishButtonClick(this.button.id);
        return this.button.modal
          ? modals?.isModalOpen(this.button.modal.id)
            ? modals?.closeModal(this.button.modal.id)
            : modals?.openModal(this.button.modal.id, {
                positioning: {
                  placement: 'bottom',
                  referenceElement: e?.target,
                },
                layout: context.isMobile ? 'drawer' : e?.target ? 'popover' : 'dialog',
              })
          : this.button.command(editorCommands);
      },
      isActive: () => false,
      isDisabled: () => false,
      dataHook: this.button.dataHook,
      name: this.button.label,
    };
  }

  toToolbarButtonSettings(): PluginButton {
    return {
      buttonSettings: { name: this.button.id, toolbars: this.getToolbars() },
      component: this.button.icon,
      blockType: 'node',
    };
  }
}

export class RicosPluginAddButtons implements PluginAddButtons {
  buttons: PluginAddButton[] = [];

  services: PluginServices;

  constructor(buttons: PluginAddButton[] = [], services: PluginServices) {
    this.buttons = buttons;
    this.services = services;
  }

  private hasDuplicate(candidate: PluginAddButton) {
    return this.buttons.find(b => b.equals(candidate));
  }

  asArray() {
    return this.buttons;
  }

  byGroup(group: MenuGroups) {
    return new RicosPluginAddButtons(
      this.buttons.filter(button => button.getGroup() === group),
      this.services
    );
  }

  byToolbar(toolbar: ToolbarType) {
    return new RicosPluginAddButtons(
      this.buttons.filter(button => button.getToolbars().includes(toolbar)),
      this.services
    );
  }

  register(button: AddButton) {
    const candidate = RicosPluginAddButton.of(button, this.services);
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
    const candidate = RicosPluginAddButton.of(button, this.services);
    this.buttons = this.buttons.filter(b => !b.equals(candidate));
  }

  toToolbarButtonsConfig() {
    return this.buttons.map(b => b.toToolbarItemConfig());
  }

  registerPluginMenuModal(config?: AddPluginMenuConfig) {
    this.services.modals?.register({
      id: PLUGIN_MENU_MODAL_ID,
      Component: props => (
        <AddPluginMenu addButtons={this} addPluginMenuConfig={config} {...props} />
      ),
    });
  }

  toToolbarItemsConfigs(): IToolbarItemConfigTiptap[] {
    return this.buttons.map(b => b.toToolbarItemConfig());
  }

  toExternalToolbarButtonsConfigs(
    editorCommands: EditorCommands
  ): Record<string, ToolbarButtonProps> {
    return this.buttons.reduce((acc, b) => {
      const buttonConfig = b.toExternalToolbarButtonConfig(editorCommands);
      return {
        ...acc,
        [buttonConfig.getLabel?.() || '']: buttonConfig,
      };
    }, {});
  }
}
