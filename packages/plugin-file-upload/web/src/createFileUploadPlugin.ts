import createToolbar from './toolbar/createToolbar';
import { DEFAULTS } from './defaults';
import { Component } from './file-upload-component';
import type { FilePluginEditorConfig } from './types';
import { FILE_UPLOAD_TYPE } from './types';
import { createBasePlugin, createBaseMediaPlugin } from 'wix-rich-content-plugin-commons';
import type { CreatePluginFunction } from 'wix-rich-content-common';

const createFileUploadPlugin: CreatePluginFunction<FilePluginEditorConfig> = config => {
  const type = FILE_UPLOAD_TYPE;
  const { helpers, t, [type]: settings = {}, isMobile, experiments, ...rest } = config;
  return createBasePlugin({
    component: createBaseMediaPlugin(Component),
    type: FILE_UPLOAD_TYPE,
    toolbar: createToolbar({
      helpers,
      t,
      settings,

      isMobile,
      experiments,
    }),
    helpers,
    settings,
    t,
    defaultPluginData: DEFAULTS,
    isMobile,
    experiments,
    ...rest,
  });
};

createFileUploadPlugin.functionName = FILE_UPLOAD_TYPE;

export { createFileUploadPlugin };
