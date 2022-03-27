import React from 'react';
import { Component as GalleryComponent } from '../gallery-component';
import { GALLERY_TYPE } from '../types';
import type { PluginProps } from 'ricos-tiptap-types';

export const Gallery: React.FC<PluginProps> = ({ context, componentData, node }) => {
  const { isMobile, theme, t, config = {} } = context;
  const helpers = {};
  const settings = config[GALLERY_TYPE] || {};
  const block = {
    getKey: () => node.attrs.id,
  };
  const { loading, loadingPercentage, error } = node.attrs;
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
      isLoading={loading}
      loadingPercentage={loadingPercentage}
      error={error}
    />
  );
};
