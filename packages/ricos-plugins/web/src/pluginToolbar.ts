import { TiptapContentResolver } from 'wix-rich-content-toolbars-v3';
import type {
  ModalService,
  Resolver,
  PluginToolbarButtons,
  IPluginToolbar,
  IPluginToolbarButton,
  TiptapContentResolver as TiptapContentResolverType,
} from 'ricos-types';
import { PluginToolbarButton } from './pluginToolbarButton';

export class PluginToolbarButtonCollisionError extends Error {}

export class PluginToolbar implements IPluginToolbar {
  buttons: IPluginToolbarButton[];

  resolvers: Record<string, TiptapContentResolverType>;

  isPluginSelectedResolver: TiptapContentResolver;

  constructor(
    toolbarButtons: PluginToolbarButtons,
    pluginType: string,
    modalService: ModalService
  ) {
    this.buttons =
      toolbarButtons.buttons?.map(button => PluginToolbarButton.of(button, modalService)) || [];
    this.isPluginSelectedResolver = this.createIsPluginSelectedResolver(pluginType);
    this.resolvers = toolbarButtons.resolvers ? this.initResolvers(toolbarButtons.resolvers) : {};
  }

  static of(toolbarButtons: PluginToolbarButtons, pluginType: string, modalService: ModalService) {
    return new PluginToolbar(toolbarButtons, pluginType, modalService);
  }

  private createIsPluginSelectedResolver(pluginType: string) {
    return TiptapContentResolver.create(
      `IS_${pluginType.toUpperCase()}_SELECTED`,
      content => content.length === 1 && content[0].type.name === pluginType
    );
  }

  private initResolvers(resolvers: Resolver): Record<string, TiptapContentResolverType> {
    return Object.entries(resolvers || {}).reduce((prevResolvers, [resolverId, resolver]) => {
      return {
        ...prevResolvers,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [resolverId]: TiptapContentResolver.create(resolverId, resolver as any),
      };
    }, {});
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
    return this.buttons.map(button => button.toToolbarItemConfig(this.resolvers));
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
