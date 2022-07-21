import React, { useContext } from 'react';
import { Component as VideoComponent } from '../video-component';
import { VIDEO_TYPE } from '../types';
import type { PluginProps } from 'ricos-types';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import { RicosContext } from 'ricos-context';

export const Video: React.FC<PluginProps> = ({
  settings,
  componentData,
  updateAttributes,
  node,
}) => {
  const { theme, t } = useContext(RicosContext);
  const blockProps = {
    setFocusToBlock: () => null,
  };
  const block = { getKey: () => null };
  const setComponentUrl = () => null;
  const store = {
    update: (type, data) => updateAttributes(convertBlockDataToRicos(VIDEO_TYPE, data)),
  };

  const { loading, loadingPercentage } = node.attrs;

  return (
    <VideoComponent
      componentData={componentData}
      theme={theme}
      t={t}
      settings={settings}
      blockProps={blockProps}
      setComponentUrl={setComponentUrl}
      onClick={() => {}}
      store={store}
      isDraggable={false}
      isLoading={loading}
      loadingPercentage={loadingPercentage}
      block={block}
    />
  );
};
