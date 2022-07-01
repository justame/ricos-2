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

  toToolbarItemConfig(resolvers: Record<string, TiptapContentResolver>): IToolbarItemConfigTiptap {
    const { id, type, config: { icon, tooltip, command, attributes } = {} } = this.button;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buttonResolvers: Record<string, any> = Object.entries(attributes || {}).reduce(
      (attributes, [attributeName, resolverId]) => {
        return {
          ...attributes,
          [attributeName]: resolvers[resolverId as string],
        };
      },
      {}
    );

    if (!attributes?.visible) {
      buttonResolvers.visible = alwaysVisibleResolver;
    }

    const toolbarItemConfig = toolbarButtonsConfig[id] || {};
    const { presentation = {}, commands } = toolbarItemConfig;

    return {
      id,
      type: type || toolbarItemConfig.type,
      presentation: {
        tooltip: tooltip || presentation.tooltip,
        icon: icon || presentation.icon,
      },
      attributes: { ...buttonResolvers, ...toolbarItemConfig.attributes },
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
