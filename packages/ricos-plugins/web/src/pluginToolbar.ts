import type {
  ToolbarButton,
  IPluginToolbar,
  IPluginToolbarButton,
  PluginServices,
} from 'ricos-types';
import { PluginToolbarButton } from './pluginToolbarButton';
import type { Selection } from 'prosemirror-state';

export class PluginToolbarButtonCollisionError extends Error {}

export class PluginToolbar implements IPluginToolbar {
  buttons: IPluginToolbarButton[];

  pluginType: string;

  customIsVisible?: (selection: Selection) => boolean;

  constructor(
    toolbar: { buttons: ToolbarButton[]; isVisible?: (selection: Selection) => boolean },
    pluginType: string,
    services: PluginServices
  ) {
    this.buttons = toolbar.buttons?.map(button => PluginToolbarButton.of(button, services)) || [];
    this.pluginType = pluginType;
    this.customIsVisible = toolbar.isVisible;
  }

  static of(
    toolbar: { buttons: ToolbarButton[]; isVisible? },
    pluginType: string,
    services: PluginServices
  ) {
    return new PluginToolbar(toolbar, pluginType, services);
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
