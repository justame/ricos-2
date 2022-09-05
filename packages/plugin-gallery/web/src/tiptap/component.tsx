import React, { useContext } from 'react';
import { Component as GalleryComponent } from '../gallery-component';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const Gallery: React.FC<PluginProps> = ({ settings, componentData, node }) => {
  const { theme, t, isMobile } = useContext(RicosContext);
  const helpers = {};
  const block = {
    getKey: () => node.attrs.id,
  };
  const { error } = node.attrs;
  const anchorTarget = '';
  const relValue = '';

  return (
    <GalleryComponent
      componentData={componentData}
      isMobile={isMobile}
      theme={theme}
      helpers={helpers}
      t={t}
      settings={settings}
      block={block}
      anchorTarget={anchorTarget}
      relValue={relValue}
      error={error}
    />
  );
};
