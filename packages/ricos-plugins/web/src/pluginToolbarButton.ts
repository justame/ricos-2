import { toolbarButtonsConfig } from './toolbarButtonsConfig';
import { toolbarButtonsRenders } from './toolbarButtonsRenders';
import { alwaysVisibleResolver, getNodeInSelectionResolver } from 'wix-rich-content-toolbars-v3';
import type {
  PluginToolbarButton,
  ToolbarButton,
  IToolbarItemConfigTiptap,
  RicosServices,
} from 'ricos-types';

export class PluginToolbarButtonCollisionError extends Error {}

/**
 * Represents plugin toolbar button
 *
 *
 * @export
 * @class PluginToolbarButton
 */
export class RicosPluginToolbarButton implements PluginToolbarButton {
  button: ToolbarButton;

  services: RicosServices;

  private constructor(button: ToolbarButton, services: RicosServices) {
    this.button = button;
    this.services = services;
  }

  static of(button: ToolbarButton, services: RicosServices) {
    return new RicosPluginToolbarButton(button, services);
  }

  register() {
    const modal = this.getModal();
    if (modal) {
      this.services.modals.register(modal);
    }
  }

  unregister() {
    const modal = this.getModal();
    if (modal) {
      this.services.modals.unregister(modal.id);
    }
  }

  getButton(): ToolbarButton {
    return { ...this.button };
  }

  getModal() {
    return this.button.modal;
  }

  equals(button: PluginToolbarButton): boolean {
    return this.button.id === button.getButton().id;
  }

  toToolbarItemConfig(): IToolbarItemConfigTiptap {
    const { id, type, icon, tooltip, dataHook, command, attributes = {} } = this.button;

    const toolbarItemConfig = toolbarButtonsConfig[id] || {};
    const { presentation = {}, commands } = toolbarItemConfig;

    const publishPluginToolbarClick = (args, node) => {
      const { value } = args || {};
      this.services.pluginsEvents.publishPluginToolbarClick({
        pluginId: node.type.name,
        nodeId: node.attrs.id,
        buttonName: this.button.id,
        value,
      });
    };

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
        selectedNode: getNodeInSelectionResolver,
        ...toolbarItemConfig.attributes,
        ...attributes,
      },
      commands: command
        ? {
            click:
              ({ editorCommands, attributes }) =>
              args => {
                const node = attributes.selectedNode;
                command({ ...this.services, editorCommands, attributes, ...args });
                publishPluginToolbarClick(args, node);
              },
          }
        : Object.keys(commands).reduce((acc, key) => {
            const command = commands[key];
            return {
              ...acc,
              [key]:
                ({ editorCommands, attributes }) =>
                args => {
                  const node = attributes.selectedNode;
                  command({ ...this.services, editorCommands, attributes, ...args });
                  publishPluginToolbarClick(args, node);
                },
            };
          }, {}),
    };
  }

  getRenderer() {
    const { id, renderer } = this.button;
    return {
      [id]: renderer || toolbarButtonsRenders[id],
    };
  }
}
