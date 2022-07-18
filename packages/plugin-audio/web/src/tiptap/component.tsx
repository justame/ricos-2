import React, { useContext } from 'react';
import { Component as AudioComponent } from '../audio-component';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const Audio: React.FC<PluginProps> = ({ settings, componentData, node }) => {
  const { theme, isMobile } = useContext(RicosContext);
  const helpers = {};
  const { loading } = node.attrs;

  return (
    <AudioComponent
      componentData={componentData}
      theme={theme}
      settings={settings}
      isLoading={loading}
      helpers={helpers}
      isMobile={isMobile}
    />
  );
};
