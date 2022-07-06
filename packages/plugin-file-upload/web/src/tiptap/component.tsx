import React, { useContext } from 'react';
import FileUploadViewer from '../file-upload-viewer';
import type { PluginProps } from 'ricos-tiptap-types';
import { RicosContext } from 'ricos-context';

export const File: React.FC<PluginProps> = ({ settings = {}, componentData, node }) => {
  const { theme, t, isMobile, experiments } = useContext(RicosContext);
  const setComponentUrl = () => null;
  const isLoading = node.attrs.loading;
  const error = node.attrs.error;
  if (error) {
    componentData.error = error;
  }

  const tempDataPlaceHolder = node.attrs.tempData;

  return (
    <FileUploadViewer
      componentData={componentData}
      isMobile={isMobile}
      theme={theme}
      setComponentUrl={setComponentUrl}
      t={t}
      settings={settings}
      isLoading={isLoading}
      tempDataPlaceHolder={tempDataPlaceHolder}
      experiments={experiments}
    />
  );
};
