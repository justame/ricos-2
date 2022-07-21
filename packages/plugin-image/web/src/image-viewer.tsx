import React, { useContext } from 'react';

import WixImage from './wixImage';
import RicosImage from './ricosImage';
import { validate, GlobalContext, mergeStyles } from 'wix-rich-content-common';
import pluginImageSchema from 'wix-rich-content-common/dist/statics/schemas/plugin-image.schema.json';
import styles from '../statics/styles/image-viewer.rtlignore.scss';

import type { FunctionComponent } from 'react';

import type { ImageViewerProps } from './types';

const ImageViewer: FunctionComponent<ImageViewerProps> = props => {
  React.useEffect(() => {
    validate(props.componentData, pluginImageSchema);
  }, [props.componentData]);

  const context = useContext(GlobalContext);
  const experiments = props.experiments || context.experiments;
  const useWixImage = experiments?.useWixImage?.enabled;
  const mergedStyles = mergeStyles({ styles, theme: props.theme });
  const Comp = useWixImage ? WixImage : RicosImage;

  return <Comp {...props} styles={mergedStyles} />;
};

export default ImageViewer;
