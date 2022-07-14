import type {
  ModalService,
  ToolbarButton,
  IPluginToolbar,
  IPluginToolbarButton,
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
    modalService: ModalService
  ) {
    this.buttons =
      toolbar.buttons?.map(button => PluginToolbarButton.of(button, modalService)) || [];
    this.pluginType = pluginType;
    this.customIsVisible = toolbar.isVisible;
  }

  static of(
    toolbar: { buttons: ToolbarButton[]; isVisible? },
    pluginType: string,
    modalService: ModalService
  ) {
    return new PluginToolbar(toolbar, pluginType, modalService);
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
