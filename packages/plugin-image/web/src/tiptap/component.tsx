import React, { useContext } from 'react';
import { ImageViewer } from '..';
import type { ImageData, ImagePluginViewerConfig } from '../types';
import type { PluginProps } from 'ricos-types';
import { MediaItemErrorMsg, Loader } from 'wix-rich-content-ui-components';
import { RicosContext } from 'ricos-context';

export const Image: React.FC<PluginProps> = ({
  settings,
  componentData,
  updateAttributes,
  node,
}) => {
  const { theme, t, isMobile, experiments } = useContext(RicosContext);
  const helpers = {};
  const setComponentUrl = () => null;
  const { loading, loadingPercentage, error, tempData } = node.attrs;

  const handleCaptionChange = caption => {
    updateAttributes({ caption });
  };
  const blockKey = node.attrs.id;

  return (
    <>
      <ImageViewer
        theme={theme}
        isMobile={isMobile}
        helpers={helpers}
        componentData={componentData as ImageData}
        isLoading={loading}
        dataUrl={tempData}
        settings={settings as ImagePluginViewerConfig}
        defaultCaption={t('ImageViewer_Caption')}
        onCaptionChange={handleCaptionChange}
        setFocusToBlock={() => {}}
        setComponentUrl={setComponentUrl}
        blockKey={blockKey}
        experiments={experiments}
      />
      {loading && <Loader theme={theme} type={'medium'} percent={loadingPercentage} />}
      {error && <MediaItemErrorMsg error={error} t={t} />}
    </>
  );
};
