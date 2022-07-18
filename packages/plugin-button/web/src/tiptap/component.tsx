import React, { useContext } from 'react';
import ButtonComponent from '../button-component';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const Button: React.FC<PluginProps> = ({ componentData, settings }) => {
  const { theme, isMobile } = useContext(RicosContext);
  return (
    <ButtonComponent
      componentData={componentData}
      settings={settings}
      isMobile={isMobile}
      theme={theme}
      helpers={{}}
    />
  );
};
