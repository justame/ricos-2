import type {
  AddButton,
  EditorCommands,
  IToolbarItemConfigTiptap,
  Layout,
  MenuGroups,
  Placement,
  PluginAddButton,
  PluginButton,
  PluginMenuItem,
  TextDirection,
  ToolbarButtonProps,
  ToolbarType,
} from 'ricos-types';
import { TOOLBARS } from 'wix-rich-content-editor-common';
import { PLUGIN_MENU_MODAL_ID } from 'wix-rich-content-toolbars-ui';
import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type { PluginServices } from './editorPlugins';

// TODO: copied from RCE, should be moved to ricos-types
const SECTIONS = {
  no_section: 'BlockToolbar_Section_NoSections_ShortcutToolbar',
  basic: 'BlockToolbar_Section_Basic',
  advanced: 'BlockToolbar_Section_Advanced',
  embed_wix: 'BlockToolbar_Section_Embed_Wix',
  embed: 'BlockToolbar_Section_Embed_Anywhere',
};

// TODO: copied from toolbars-v3, should be moved to ricos-types
const PLUGIN_MENU_HORIZONTAL_MODAL_ID = 'pluginMenuHorizontal';

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

  getButtonId() {
    return this.button.id;
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

  private calculateLayout(isMobile: boolean): Layout {
    return isMobile ? 'fullscreen' : 'popover';
  }

  private calculatePlacement(isMobile: boolean, languageDir: TextDirection): Placement {
    return isMobile ? 'bottom' : languageDir === 'ltr' ? 'right-start' : 'left-start';
  }

  private getPluginMenuItem(
    layout: Layout,
    placement: Placement,
    sideEffect: () => void
  ): PluginMenuItem {
    const { t } = this.services;
    return {
      id: this.button.id,
      presentation: {
        dataHook: this.button.dataHook || '',
        label: t(this.button.label) || '',
        tooltip: t(this.button.tooltip) || '',
        icon: this.button.icon,
      },
      attributes: {
        visible: alwaysVisibleResolver,
      },
      getClickHandler:
        (editorCommands: EditorCommands, referenceElement?: HTMLElement | null) => () => {
          this.button.modal
            ? this.services.modals.openModal(this.button.modal.id, {
                positioning: {
                  referenceElement,
                  placement,
                },
                layout,
              })
            : this.button.command(editorCommands);

          sideEffect();
        },
      section: SECTIONS[this.getGroup()],
    };
  }

  toPluginMenuItem(): PluginMenuItem {
    return this.getPluginMenuItem(
      this.calculateLayout(this.services.context.isMobile),
      this.calculatePlacement(this.services.context.isMobile, this.services.context.languageDir),
      () => {
        this.services.toolbars.pluginMenu.publishButtonClick(this.button.id);
        this.services.pluginsEvents.publishPluginAdd({
          pluginId: this.button.id,
          entryPoint: TOOLBARS.PLUGIN_MENU,
        });
        this.services.modals.closeModal(PLUGIN_MENU_MODAL_ID);
      }
    );
  }

  toFooterToolbarItem(): PluginMenuItem {
    return this.getPluginMenuItem('popover', 'bottom', () => {
      this.services.toolbars.footer.publishButtonClick(this.button.id);
      this.services.pluginsEvents.publishPluginAdd({
        pluginId: this.button.id,
        entryPoint: TOOLBARS.FOOTER,
      });
    });
  }

  toHorizontalMenuItem(): PluginMenuItem {
    return this.getPluginMenuItem(
      'popover',
      this.calculatePlacement(false, this.services.context.languageDir),
      () => {
        this.services.toolbars.pluginMenu.publishButtonClick(this.button.id);
        this.services.pluginsEvents.publishPluginAdd({
          pluginId: this.button.id,
          entryPoint: TOOLBARS.PLUGIN_MENU,
        });
        this.services.modals.closeModal(PLUGIN_MENU_HORIZONTAL_MODAL_ID);
      }
    );
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
            this.services.pluginsEvents.publishPluginAdd({
              pluginId: this.button.id,
              entryPoint: TOOLBARS.PLUGIN_MENU,
            });
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
      getLabel: () => t(this.button.label),
      onClick: e => {
        this.services.toolbars.external.publishButtonClick(this.button.id);
        this.services.pluginsEvents.publishPluginAdd({
          pluginId: this.button.id,
          entryPoint: TOOLBARS.EXTERNAL,
        });
        return this.button.modal
          ? modals?.isModalOpen(this.button.modal.id)
            ? modals?.closeModal(this.button.modal.id)
            : modals?.openModal(this.button.modal.id, {
                positioning: {
                  placement: 'bottom',
                  referenceElement: e?.target,
                },
                layout: context.isMobile ? 'fullscreen' : e?.target ? 'popover' : 'dialog',
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
