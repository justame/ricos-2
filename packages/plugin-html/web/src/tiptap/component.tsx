import React, { useContext } from 'react';
import { Component as HtmlComponent } from '../HtmlComponent';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const Html: React.FC<PluginProps> = ({ settings, componentData }) => {
  const { theme, isMobile, experiments } = useContext(RicosContext);

  return (
    <HtmlComponent
      componentData={componentData}
      iframeSandboxDomain={''}
      settings={settings}
      isMobile={isMobile}
      theme={theme}
      experiments={experiments}
    />
  );
};
