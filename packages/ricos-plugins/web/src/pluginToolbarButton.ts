import { toolbarButtonsConfig } from './toolbarButtonsConfig';
import { toolbarButtonsRenders } from './toolbarButtonsRenders';
import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type {
  ToolbarButton,
  IPluginToolbarButton,
  IToolbarItemConfigTiptap,
  PluginServices,
} from 'ricos-types';

export class PluginToolbarButtonCollisionError extends Error {}

/**
 * Represents plugin toolbar button
 *
 *
 * @export
 * @class PluginToolbarButton
 */
export class PluginToolbarButton implements IPluginToolbarButton {
  button: ToolbarButton;

  services: PluginServices;

  private constructor(button: ToolbarButton, services: PluginServices) {
    this.button = button;
    this.services = services;
  }

  static of(button: ToolbarButton, services: PluginServices) {
    return new PluginToolbarButton(button, services);
  }

  register() {
    const modal = this.getModal();
    if (modal) {
      this.services.modalService?.register(modal);
    }
  }

  unregister() {
    const modal = this.getModal();
    if (modal) {
      this.services.modalService?.unregister(modal.id);
    }
  }

  getButton(): ToolbarButton {
    return { ...this.button };
  }

  getModal() {
    return this.button.modal;
  }

  equals(button: IPluginToolbarButton): boolean {
    return this.button.id === button.getButton().id;
  }

  toToolbarItemConfig(): IToolbarItemConfigTiptap {
    const { id, type, icon, tooltip, dataHook, command, attributes = {} } = this.button;

    const toolbarItemConfig = toolbarButtonsConfig[id] || {};
    const { presentation = {}, commands } = toolbarItemConfig;

    return {
      id,
      type: type || toolbarItemConfig.type,
      presentation: {
        tooltip: tooltip || presentation.tooltip,
        dataHook: dataHook || presentation.dataHook,
        icon: icon || presentation.icon,
      },
      attributes: {
        visible: alwaysVisibleResolver,
        ...attributes,
        ...toolbarItemConfig.attributes,
      },
      commands: command
        ? {
            click:
              ({ editorCommands }) =>
              args => {
                command({ ...this.services, editorCommands, ...args });
              },
          }
        : { ...commands },
    };
  }

  getRenderer() {
    const { id, renderer } = this.button;
    return {
      [id]: renderer || toolbarButtonsRenders[id],
    };
  }
}
