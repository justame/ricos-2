import React from 'react';
import { RicosEditor } from 'ricos-editor';
import { pluginHtml } from 'wix-rich-content-plugin-html';
import { pluginImage } from 'wix-rich-content-plugin-image';
import { pluginLink } from 'wix-rich-content-plugin-link';
import { pluginCollapsibleList } from 'wix-rich-content-plugin-collapsible-list';

const plugins = [pluginImage(), pluginLink(), pluginHtml(), pluginCollapsibleList()];

export default () => {
  return <RicosEditor plugins={plugins} />;
};
