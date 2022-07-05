import { TiptapContentResolver } from 'wix-rich-content-toolbars-v3';
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

  isPluginSelectedResolver: TiptapContentResolver;

  constructor(toolbarButtons: ToolbarButton[], pluginType: string, modalService: ModalService) {
    this.buttons =
      toolbarButtons?.map(button => PluginToolbarButton.of(button, modalService)) || [];
    this.isPluginSelectedResolver = this.createIsPluginSelectedResolver(pluginType);
  }

  static of(toolbarButtons: ToolbarButton[], pluginType: string, modalService: ModalService) {
    return new PluginToolbar(toolbarButtons, pluginType, modalService);
  }

  private createIsPluginSelectedResolver(pluginType: string) {
    return TiptapContentResolver.create(
      `IS_${pluginType.toUpperCase()}_SELECTED`,
      content => content.length === 1 && content[0].type.name === pluginType
    );
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
    return !!content && this.isPluginSelectedResolver.resolve(content);
  }
}
