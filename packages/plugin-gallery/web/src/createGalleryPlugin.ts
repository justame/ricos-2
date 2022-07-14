import createToolbar from './toolbar/createToolbar';
import { createBasePlugin, createBaseMediaPlugin } from 'wix-rich-content-plugin-commons';
import { Component, DEFAULTS } from './gallery-component';
import type { GalleryPluginEditorConfig } from './types';
import { GALLERY_TYPE } from './types';
import type { CreatePluginFunction } from 'wix-rich-content-common';
import { fileInputAccept } from './consts';

const createGalleryPlugin: CreatePluginFunction<GalleryPluginEditorConfig> = config => {
  const type = GALLERY_TYPE;
  const {
    helpers,
    theme,
    t,
    anchorTarget,
    relValue,
    [type]: settings = {},
    spoilerWrapper,
    uiSettings,
    experiments,
    ...rest
  } = config;
  settings.accept = settings.accept || fileInputAccept;

  const defaults = {
    ...DEFAULTS,
    config: {
      ...DEFAULTS.config,
      ...settings?.defaultData?.config,
    },
  };

  const pluginData =
    uiSettings?.disableDownload !== undefined
      ? {
          ...defaults,
          disableDownload: uiSettings?.disableDownload,
        }
      : defaults;

  const defaultPluginData =
    settings?.disableExpand !== undefined
      ? {
          ...pluginData,
          disableExpand: settings.disableExpand,
        }
      : pluginData;
  return createBasePlugin({
    component: experiments?.useUploadContext?.enabled
      ? Component
      : createBaseMediaPlugin(Component),
    settings,
    theme,
    t,
    type,
    toolbar: createToolbar({
      settings,
      helpers,
      t,
      anchorTarget,
      relValue,
      experiments,
      isMobile: config.isMobile,
      uiSettings,
    }),
    helpers,
    anchorTarget,
    relValue,
    disableRightClick: config?.uiSettings?.disableRightClick,
    spoilerWrapper: settings.spoiler && spoilerWrapper,
    defaultPluginData,
    ...rest,
  });
};

createGalleryPlugin.functionName = GALLERY_TYPE;

export { createGalleryPlugin };
