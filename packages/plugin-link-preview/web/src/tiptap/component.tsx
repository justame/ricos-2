import React, { useContext } from 'react';
import LinkPreviewComponent from '../LinkPreviewComponent';
import type { LinkPreviewPluginEditorConfig } from '../types';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const LinkPreview: React.FC<PluginProps> = ({ settings, componentData }) => {
  const { theme, isMobile } = useContext(RicosContext);
  const blockProps = {
    setFocusToBlock: () => null,
    getData: () => componentData,
  };

  return (
    <LinkPreviewComponent
      isMobile={isMobile}
      theme={theme}
      settings={settings as LinkPreviewPluginEditorConfig}
      blockProps={blockProps}
      iframeSandboxDomain={''}
    />
  );
};
