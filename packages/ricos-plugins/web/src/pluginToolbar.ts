import type { ToolbarButton, RicosServices, PluginToolbarButton, PluginToolbar } from 'ricos-types';
import { RicosPluginToolbarButton } from './pluginToolbarButton';
import type { Selection } from 'prosemirror-state';

export class PluginToolbarButtonCollisionError extends Error {}

export class RicosPluginToolbar implements PluginToolbar {
  buttons: PluginToolbarButton[];

  pluginType: string;

  customIsVisible?: (selection: Selection) => boolean;

  constructor(
    toolbar: { buttons: ToolbarButton[]; isVisible?: (selection: Selection) => boolean },
    pluginType: string,
    services: RicosServices
  ) {
    this.buttons =
      toolbar.buttons?.map(button => RicosPluginToolbarButton.of(button, services)) || [];
    this.pluginType = pluginType;
    this.customIsVisible = toolbar.isVisible;
  }

  static of(
    toolbar: { buttons: ToolbarButton[]; isVisible? },
    pluginType: string,
    services: RicosServices
  ) {
    return new RicosPluginToolbar(toolbar, pluginType, services);
  }

  register() {
    this.buttons.map(b => b.register());
  }

  unregister() {
    this.buttons.map(b => b.unregister());
  }

  getButtons() {
    return this.buttons;
  }

  toToolbarItemsConfig() {
    return this.buttons.map(button => button.toToolbarItemConfig());
  }

  getToolbarButtonsRenderers() {
    return this.buttons.reduce((renderers, button) => {
      return {
        ...renderers,
        ...button.getRenderer(),
      };
    }, {});
  }

  isVisible(selection) {
    return this.customIsVisible
      ? this.customIsVisible(selection)
      : selection.node?.type.name === this.pluginType;
  }
}
