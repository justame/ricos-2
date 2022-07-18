import React, { useContext } from 'react';
import { Component as GiphyComponent } from '../giphy-component';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const Gif: React.FC<PluginProps> = ({ settings, componentData }) => {
  const { theme, isMobile } = useContext(RicosContext);

  const setComponentUrl = () => null;

  return (
    <GiphyComponent
      componentData={componentData}
      isMobile={isMobile}
      theme={theme}
      settings={settings}
      onClick={() => {}}
      setComponentUrl={setComponentUrl}
    />
  );
};
