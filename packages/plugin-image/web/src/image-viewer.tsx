import React from 'react';

import WixImage from './wixImage';
import { validate, mergeStyles } from 'wix-rich-content-common';
import pluginImageSchema from 'wix-rich-content-common/dist/statics/schemas/plugin-image.schema.json';
import styles from '../statics/styles/image-viewer.rtlignore.scss';

import type { FunctionComponent } from 'react';

import type { ImageViewerProps } from './types';

const ImageViewer: FunctionComponent<ImageViewerProps> = props => {
  React.useEffect(() => {
    validate(props.componentData, pluginImageSchema);
  }, [props.componentData]);

  const mergedStyles = mergeStyles({ styles, theme: props.theme });

  const hasLink = () => props.componentData?.config?.link?.url;
  const hasExpandMode = () => !props.componentData?.disableExpand;

  const accessibilityProps = hasLink() || hasExpandMode() ? { role: 'button', tabIndex: 0 } : {};

  return <WixImage {...props} styles={mergedStyles} accessibilityProps={accessibilityProps} />;
};

export default ImageViewer;
