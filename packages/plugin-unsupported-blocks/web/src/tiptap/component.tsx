import React, { useContext } from 'react';
import { Component } from '../unsupported-blocks-component';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const UnsupportedBlock: React.FC<PluginProps> = () => {
  const { theme, t } = useContext(RicosContext);
  return (
    <div contentEditable={false}>
      <Component theme={theme} t={t} />
    </div>
  );
};
