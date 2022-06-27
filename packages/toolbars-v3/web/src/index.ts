export { tiptapStaticToolbarConfig } from './toolbarItemConfig/tiptapToolbarItemConfig';
export { linkToolbarItemConfig } from './toolbarItemConfig/linkToolbarItemConfig';

export const toolbarsV3 = () => {
  // eslint-disable-next-line no-console
  console.log('toolbarsV3');
  return 'toolbarsV3';
};

export { default as RicosDraftToolbar } from './components/RicosDraftToolbar';
export { default as RicosTiptapToolbar } from './components/RicosTiptapToolbar';
export { Content } from './Content';
export { IToolbarItemConfigTiptap } from './types';
export { FloatingToolbar } from './components/FloatingToolbar/FloatingToolbar';
export { TiptapContentResolver } from './ContentResolver';
export * from './resolvers/tiptapResolvers';
export { ToggleButton } from './components/buttons';
export { default as RicosToolbarComponent } from './components/RicosToolbarComponent';
export { default as FloatingAddPluginMenu } from './modals/FloatingPluginMenu/FloatingAddPluginMenu';
export { LinkButton } from './components/buttons';
