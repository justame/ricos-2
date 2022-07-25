import React from 'react';
import classNames from 'classnames';
import { IMAGE_TYPE } from './types';
import { get, includes, isFunction, uniqueId } from 'lodash';
import type { ComponentData } from 'ricos-content';
import { anchorScroll, addAnchorTagToUrl } from 'wix-rich-content-common';
import { Image, initCustomElement } from '@wix/image';
import { DEFAULTS } from './consts';
import ExpandIcon from './icons/expand';
import InPluginInput from './InPluginInput';

import type { ImageViewerProps } from './types';

initCustomElement();

const IMAGE_FALLBACK_WIDTH = 300;

const getImageSrc = (
  src: ComponentData['src'],
  customGetImageUrl?: ({ file_name }: { file_name: string }) => string
) => {
  if (typeof src === 'object') {
    if (src.source) {
      if (src.source === 'static') {
        if (src.url) {
          return src.url;
        } else {
          console.error('must provide src url when using static image source!', src); //eslint-disable-line no-console
        }
      } else if (src.source === 'custom') {
        if (customGetImageUrl) {
          return customGetImageUrl({ file_name: src.file_name }); //eslint-disable-line camelcase
        } else {
          console.error('must provide getImageUrl helper when using custom image source!', src); //eslint-disable-line no-console
        }
      }
    } else if (src.file_name) {
      return src.file_name;
    }
  }

  return src;
};

class WixImage extends React.Component<ImageViewerProps & { styles: Record<string, string> }> {
  _id: string;

  constructor(props) {
    super(props);
    this._id = uniqueId('new-image');
  }

  getImageDataUrl(): string | null {
    return this.props.dataUrl ? this.props.dataUrl : null;
  }

  renderTitle(data) {
    const config = data.config || {};
    return (
      !!config.showTitle && (
        <div className={classNames(this.props.styles.imageTitle)}>{(data && data.title) || ''}</div>
      )
    );
  }

  renderDescription(data) {
    const config = data.config || {};
    return (
      !!config.showDescription && (
        <div className={classNames(this.props.styles.imageDescription)}>
          {(data && data.description) || ''}
        </div>
      )
    );
  }

  renderCaption(caption) {
    const {
      onCaptionChange,
      setFocusToBlock,
      setInPluginEditingMode,
      styles: { imageCaption, link },
    } = this.props;

    const classes = classNames(imageCaption, this.hasLink() && link);
    return onCaptionChange ? (
      <InPluginInput
        setInPluginEditingMode={setInPluginEditingMode}
        className={classes}
        value={caption}
        onChange={onCaptionChange}
        setFocusToBlock={setFocusToBlock}
      />
    ) : (
      <span dir="auto" className={classes}>
        {caption}
      </span>
    );
  }

  shouldRenderCaption() {
    const { getInPluginEditingMode, settings, componentData, defaultCaption } = this.props;
    const caption = componentData.metadata?.caption;

    if (includes(get(settings, 'toolbar.hidden'), 'settings')) {
      return false;
    }
    if (
      caption === undefined ||
      (caption === '' && !getInPluginEditingMode?.()) ||
      caption === defaultCaption
    ) {
      return false;
    }
    const data = componentData || DEFAULTS;
    if (data.config.size === 'original' && data.src && data.src.width) {
      return data.src.width >= 350;
    }
    return true;
  }

  handleExpand = e => {
    e.preventDefault();
    const {
      settings: { onExpand },
      helpers = {},
    } = this.props;
    helpers.onViewerAction?.(IMAGE_TYPE, 'Click', 'expand_image');
    this.hasExpand() && onExpand?.(this.props.blockKey);
  };

  scrollToAnchor = e => {
    const {
      componentData: {
        config: { link: { anchor } = {} },
      },
      customAnchorScroll,
    } = this.props;
    if (customAnchorScroll) {
      customAnchorScroll(e, anchor as string);
    } else {
      const anchorString = `viewer-${anchor}`;
      const element = document.getElementById(anchorString);
      addAnchorTagToUrl(anchorString);
      anchorScroll(element);
    }
  };

  hasLink = () => this.props.componentData?.config?.link?.url;

  hasAnchor = () => this.props.componentData?.config?.link?.anchor;

  onKeyDown = e => {
    // Allow key events only in viewer
    if ((e.key === 'Enter' || e.key === ' ') && !this.props.getInPluginEditingMode) {
      this.handleClick(e);
    }
  };

  handleClick = e => {
    if (this.hasLink()) {
      return null;
    } else if (this.hasAnchor()) {
      e.preventDefault();
      e.stopPropagation(); // fix problem with wix platform, where it wouldn't scroll and sometimes jump to different page
      this.scrollToAnchor(e);
    } else {
      this.handleExpand(e);
    }
  };

  handleContextMenu = e => {
    const {
      componentData: { disableDownload = false },
    } = this.props;
    return disableDownload && e.preventDefault();
  };

  hasExpand = () => {
    const { componentData, settings } = this.props;
    let disableExpand = false;
    if (componentData.disableExpand !== undefined) {
      disableExpand = componentData.disableExpand;
    } else if (settings.disableExpand !== undefined) {
      disableExpand = settings.disableExpand;
    }
    return !disableExpand && settings.onExpand;
  };

  renderExpandIcon = () => {
    const {
      styles: { expandContainer, expandIcon },
    } = this.props;
    return (
      <div className={expandContainer}>
        <ExpandIcon className={expandIcon} onClick={this.handleExpand} />
      </div>
    );
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      componentData,
      className,
      settings,
      setComponentUrl,
      helpers,
      getInPluginEditingMode,
      styles,
      isMobile,
    } = this.props;

    const data = componentData || DEFAULTS;
    let { metadata, config: { alignment, width, size } = {} } = componentData;
    if (!metadata) {
      metadata = {};
    }

    const itemClassName = classNames(styles.imageWrapper, className, {
      [styles.pointer]: this.hasExpand() as boolean,
    });

    const imageSrc = this.getImageDataUrl() || getImageSrc(data.src, helpers?.getImageUrl);
    let imageProps = {};
    if (data.src && settings && settings.imageProps) {
      imageProps = isFunction(settings.imageProps)
        ? settings.imageProps(data.src)
        : settings.imageProps;
    }

    console.log('image props stiil need to be handled', imageProps); //eslint-disable-line

    const socialAttrs = {};

    ['data-pin-nopin', 'data-pin-url', 'data-pin-media'].forEach(
      attr => imageProps[attr] && (socialAttrs[attr] = imageProps[attr])
    );

    setComponentUrl?.(imageSrc);

    const accesibilityProps = !this.hasLink() && { role: 'button', tabIndex: 0 };

    /* eslint-disable jsx-a11y/no-static-element-interactions */

    const isEditor = getInPluginEditingMode;

    const usePredefinedWidth =
      (alignment === 'left' || alignment === 'right') &&
      !width &&
      size !== 'small' &&
      size !== 'original' &&
      !isMobile;

    const dim = {
      width: (data.src?.width || data.width) as number,
      height: (data.src?.height || data.height) as number,
    };
    return (
      <div
        data-hook="imageViewer"
        className={styles.imageContainer}
        onContextMenu={this.handleContextMenu}
        onKeyDown={this.onKeyDown}
        {...accesibilityProps}
      >
        <div
          className={itemClassName}
          id={this._id}
          aria-label={metadata.alt}
          onClick={this.handleClick}
          onKeyDown={this.onKeyDown}
          style={{
            width: '100%',
            aspectRatio: `${dim.width} /  ${dim.height}`,
            ...(usePredefinedWidth && { width: IMAGE_FALLBACK_WIDTH + 'px' }),
          }}
        >
          <Image
            id={imageSrc}
            containerId={this._id}
            displayMode="fill"
            width={dim.width}
            height={dim.height}
            uri={imageSrc}
            alt={metadata.alt || ''}
            socialAttrs={socialAttrs}
            {...(!isEditor && { placeholderTransition: 'blur', shouldUseLQIP: true })}
          />

          {this.hasExpand() && this.renderExpandIcon()}
        </div>
        {this.renderTitle(data)}
        {this.renderDescription(data)}
        {this.shouldRenderCaption() && this.renderCaption(metadata.caption)}
      </div>
    );
  }
}

export default WixImage;
