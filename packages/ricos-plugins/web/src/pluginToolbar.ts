import type {
  ModalService,
  ToolbarButton,
  IPluginToolbar,
  IPluginToolbarButton,
} from 'ricos-types';
import { PluginToolbarButton } from './pluginToolbarButton';

export class PluginToolbarButtonCollisionError extends Error {}

export class PluginToolbar implements IPluginToolbar {
  buttons: IPluginToolbarButton[];

  pluginType: string;

  constructor(toolbarButtons: ToolbarButton[], pluginType: string, modalService: ModalService) {
    this.buttons =
      toolbarButtons?.map(button => PluginToolbarButton.of(button, modalService)) || [];
    this.pluginType = pluginType;
  }

  static of(toolbarButtons: ToolbarButton[], pluginType: string, modalService: ModalService) {
    return new PluginToolbar(toolbarButtons, pluginType, modalService);
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

  isVisible(content) {
    return content?.length === 1 && content?.[0].type.name === this.pluginType;
  }
}
