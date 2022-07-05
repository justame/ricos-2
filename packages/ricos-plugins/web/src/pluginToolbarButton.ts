import { toolbarButtonsConfig } from './toolbarButtonsConfig';
import { toolbarButtonsRenders } from './toolbarButtonsRenders';
import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type {
  ToolbarButton,
  ModalService,
  IPluginToolbarButton,
  TiptapContentResolver,
  IToolbarItemConfigTiptap,
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

  modalService: ModalService;

  private constructor(button: ToolbarButton, modalService: ModalService) {
    this.button = button;
    this.modalService = modalService;
  }

  static of(button: ToolbarButton, modalService: ModalService) {
    return new PluginToolbarButton(button, modalService);
  }

  register() {
    const modal = this.getModal();
    if (modal) {
      this.modalService?.register(modal);
    }
  }

  unregister() {
    const modal = this.getModal();
    if (modal) {
      this.modalService?.unregister(modal.id);
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
    const { id, type, icon, tooltip, command, attributes = {} } = this.button;

    const toolbarItemConfig = toolbarButtonsConfig[id] || {};
    const { presentation = {}, commands } = toolbarItemConfig;

    return {
      id,
      type: type || toolbarItemConfig.type,
      presentation: {
        tooltip: tooltip || presentation.tooltip,
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
                command({ editorCommands, ...args });
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
