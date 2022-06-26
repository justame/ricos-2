import { TiptapContentResolver } from 'wix-rich-content-toolbars-v3';
import type { IToolbarItemConfigTiptap } from 'wix-rich-content-toolbars-v3';
import type { ToolbarButton, Resolver } from 'ricos-types';
import { PluginToolbarButton } from './pluginToolbarButton';

export class PluginToolbarButtonCollisionError extends Error {}

export class PluginToolbar {
  buttons: PluginToolbarButton[];

  resolvers: Record<string, TiptapContentResolver>;

  isPluginSelectedResolver: TiptapContentResolver;

  constructor(buttons: ToolbarButton[], resolvers: Resolver, pluginType: string) {
    this.buttons = buttons.map(button => PluginToolbarButton.of(button));
    this.isPluginSelectedResolver = this.createIsPluginSelectedResolver(pluginType);
    this.resolvers = this.initResolvers(resolvers);
  }

  static of(buttons: ToolbarButton[] = [], resolvers: Resolver, pluginType: string) {
    return new PluginToolbar(buttons, resolvers, pluginType);
  }

  private createIsPluginSelectedResolver(pluginType: string) {
    return TiptapContentResolver.create(
      `IS_${pluginType.toUpperCase()}_SELECTED`,
      content => content.length === 1 && content[0].type.name === pluginType
    );
  }

  private initResolvers(resolvers: Resolver) {
    return Object.entries(resolvers || {}).reduce((prevResolvers, [resolverId, resolver]) => {
      return {
        ...prevResolvers,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [resolverId]: TiptapContentResolver.create(resolverId, resolver as any),
      };
    }, {});
  }

  getButtons() {
    return this.buttons;
  }

  toToolbarItemsConfig(): IToolbarItemConfigTiptap[] {
    return this.buttons.map(button => button.toToolbarItemConfig(this.resolvers));
  }

  getToolberButtonsRenderers() {
    return this.buttons.reduce((renderers, button) => {
      return {
        ...renderers,
        ...button.getRenderer(),
      };
    }, {});
  }

  isVisible(content): boolean {
    return !!content && this.isPluginSelectedResolver.resolve(content);
  }
}
