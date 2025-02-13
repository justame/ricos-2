import React from 'react';
import { RichContentViewer } from 'wix-rich-content-viewer';
import { htmlTypeMapper } from 'wix-rich-content-plugin-html/viewer';
import { imageTypeMapper } from 'wix-rich-content-plugin-image/viewer';
import { linkTypeMapper } from 'wix-rich-content-plugin-link/viewer';

const typeMappers = [imageTypeMapper, linkTypeMapper, htmlTypeMapper];

export default () => {
  return <RichContentViewer typeMappers={typeMappers} />;
};
