import {
  pluginToolbarButtonsConfig,
  pluginToolbarItemsRenders,
  alwaysVisibleResolver,
} from 'wix-rich-content-toolbars-v3';
import type { TiptapContentResolver, IToolbarItemConfigTiptap } from 'wix-rich-content-toolbars-v3';
import type { ToolbarButton } from 'ricos-types';
import type { ComponentType } from 'react';
import { getToolbarButtonRenderer } from './utils';

export class PluginToolbarButtonCollisionError extends Error {}

/**
 * Represents plugin toolbar button
 *
 *
 * @export
 * @class PluginToolbarButton
 */
export class PluginToolbarButton {
  button: ToolbarButton;

  private constructor(button: ToolbarButton) {
    this.button = button;
  }

  static of(button: ToolbarButton) {
    return new PluginToolbarButton(button);
  }

  getButton(): ToolbarButton {
    return { ...this.button };
  }

  equals(button: PluginToolbarButton): boolean {
    return this.button.id === button.getButton().id;
  }

  toToolbarItemConfig(resolvers: Record<string, TiptapContentResolver>): IToolbarItemConfigTiptap {
    const { id, type, config: { icon, tooltip, command, attributes } = {} } = this.button;

    const buttonResolvers: Record<string, TiptapContentResolver> = Object.entries(
      attributes || {}
    ).reduce((attributes, [attributeName, resolverId]) => {
      return {
        ...attributes,
        [attributeName]: resolvers[resolverId as string],
      };
    }, {});

    if (!attributes?.visible) {
      buttonResolvers.visible = alwaysVisibleResolver;
    }

    const toolbarItemConfig = pluginToolbarButtonsConfig[id] || {};
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

  getRenderer(): Record<string, ComponentType> | undefined {
    const { id, renderer } = this.button;
    return {
      [id]: renderer ? getToolbarButtonRenderer(renderer) : pluginToolbarItemsRenders[id],
    };
  }
}
