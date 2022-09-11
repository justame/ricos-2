import type { RefObject } from 'react';
import React from 'react';
import classNames from 'classnames';
import { IMAGE_TYPE } from './types';
import { get, includes, isFunction } from 'lodash';

import { isSSR, anchorScroll, addAnchorTagToUrl, GlobalContext } from 'wix-rich-content-common';
import { getImageSrc, isPNG, WIX_MEDIA_DEFAULT } from 'wix-rich-content-common/libs/imageUtils';
import { DEFAULTS, SEO_IMAGE_WIDTH } from './consts';

import ExpandIcon from './icons/expand';
import InPluginInput from './InPluginInput';

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

import type { ImageViewerProps } from './types';

interface ImageSrc {
  preload: string;
  highres: string;
}

interface ImageViewerState {
  container?: HTMLDivElement;
  ssrDone?: boolean;
  fallbackImageSrc?: ImageSrc;
}

class RicosImage extends React.Component<
  ImageViewerProps & {
    styles: Record<string, string>;
    accessibilityProps: { role?: string; tabIndex?: number };
  },
  ImageViewerState
> {
  preloadRef: RefObject<HTMLImageElement>;

  imageRef: RefObject<HTMLImageElement>;

  constructor(props) {
    super(props);
    this.state = {};
    this.preloadRef = React.createRef();
    this.imageRef = React.createRef();
  }

  static contextType = GlobalContext;

  componentDidMount() {
    this.setState({ ssrDone: true });
    if (isSafari()) {
      //In Safari, onload event doesn't always called when reloading the page
      this.forceOnImageLoad();
    }
  }

  forceOnImageLoad = () => {
    let executionTimes = 0;
    const interval = setInterval(() => {
      if (this.imageRef?.current?.complete) {
        this.onImageLoad(this.imageRef.current);
        clearInterval(interval);
      }
      if (++executionTimes === 10) {
        clearInterval(interval);
      }
    }, 200);
  };

  calculateHeight(width = 1, src) {
    return src && src.height && src.width
      ? Math.ceil((src.height / src.width) * width)
      : WIX_MEDIA_DEFAULT.SIZE;
  }

  getImageDataUrl(): ImageSrc | null {
    return this.props.dataUrl
      ? {
          preload: this.props.dataUrl,
          highres: this.props.dataUrl,
        }
      : null;
  }

  getExperiments = () => this.props.experiments || this.context.experiments;

  // eslint-disable-next-line complexity
  getImageUrl(src): ImageSrc | null {
    const { helpers, seoMode, isMobile } = this.props || {};

    if (!src && helpers?.handleFileSelection) {
      return null;
    }

    const experiments = this.getExperiments();
    const removeUsm = experiments?.removeUsmFromImageUrls?.enabled;
    const encAutoImageUrls = experiments?.encAutoImageUrls?.enabled;
    const qualityPreloadPngs = experiments?.qualityPreloadPngs?.enabled;

    const imageUrl: ImageSrc = {
      preload: '',
      highres: '',
    };

    const getImageDimensions = (width, isMobile) => {
      let requiredHeight;
      let requiredWidth = width || 1;
      if (isMobile && !isSSR()) {
        //adjust the image width to viewport scaling
        requiredWidth *= window.screen.width / document.body.clientWidth;
      }
      //keep the image's original ratio
      requiredHeight = this.calculateHeight(requiredWidth, src);
      requiredWidth = Math.ceil(requiredWidth);
      requiredHeight = Math.ceil(requiredHeight);
      return [requiredWidth, requiredHeight];
    };

    let requiredWidth, requiredHeight;
    let webAndNonPngPreloadOpts = {};
    /**
        PNG files can't reduce quality via Wix services and we want to avoid downloading a big png image that will affect performance.
      **/
    const validQualtyPreloadFileType = (encAutoImageUrls && qualityPreloadPngs) || !isPNG(src);
    if (!isMobile && validQualtyPreloadFileType) {
      const {
        componentData: { config: { alignment, width, size } = {} },
      } = this.props;
      const usePredefinedWidth = (alignment === 'left' || alignment === 'right') && !width;
      webAndNonPngPreloadOpts = {
        imageType: 'quailtyPreload',
        size: this.getExperiments().imagePreloadWidthByConfig?.enabled && size,
        ...(usePredefinedWidth && { requiredWidth: 300 }),
      };
    }

    const commonPreloadOpts = {
      encAutoImageUrls,
    };

    imageUrl.preload = getImageSrc(src, helpers?.getImageUrl, {
      ...commonPreloadOpts,
      ...webAndNonPngPreloadOpts,
    });
    if (seoMode) {
      requiredWidth = src?.width && Math.min(src.width, SEO_IMAGE_WIDTH);
      requiredHeight = this.calculateHeight(SEO_IMAGE_WIDTH, src);
    } else if (this.state.container) {
      const desiredWidth = this.state.container.getBoundingClientRect().width || src?.width;
      [requiredWidth, requiredHeight] = getImageDimensions(desiredWidth, this.props.isMobile);
    }

    imageUrl.highres = getImageSrc(src, helpers?.getImageUrl, {
      removeUsm,
      requiredWidth,
      requiredHeight,
      requiredQuality: 90,
      imageType: 'highRes',
    });

    if (this.state.ssrDone && !imageUrl.preload && !this.props.isLoading) {
      console.error(`image plugin mounted with invalid image source!`, src); //eslint-disable-line no-console
    }

    return imageUrl;
  }

  onImageLoadError = () => {
    const {
      componentData: { src },
    } = this.props;

    if (src && src.fallback) {
      this.setState({
        fallbackImageSrc: {
          preload: src.fallback,
          highres: src.fallback,
        },
      });
    }
  };

  renderImage = (imageClassName, imageSrc, alt, props, isGif, onlyHighRes) => {
    return this.getImage(
      classNames(imageClassName, this.props.styles.imageHighres, {
        [this.props.styles.onlyHighRes]: onlyHighRes,
      }),
      imageSrc.highres,
      alt,
      props,
      { fadeIn: !isGif, width: imageSrc.highresWidth, height: imageSrc.highresHeight }
    );
  };

  renderPreloadImage = (imageClassName, imageSrc, alt, props) => {
    return this.getImage(
      classNames(imageClassName, this.props.styles.imagePreload),
      imageSrc.preload,
      alt,
      { 'aria-hidden': true, ...props }
    );
  };

  getImageSize = opts => {
    let width, height;
    if (opts?.width && opts?.height) {
      width = opts.width;
      height = opts.height;
    } else {
      width = this.props.componentData?.src?.width;
      height = this.props.componentData?.src?.height;
    }
    return { width, height };
  };

  getImage(
    imageClassNames,
    src,
    alt,
    props,
    opts: {
      fadeIn?: boolean;
      width?: number | string;
      height?: number | string;
    } = {}
  ) {
    const { fadeIn = false } = opts;
    const loading = this.getExperiments().lazyImagesAndIframes?.enabled ? 'lazy' : undefined;
    const { width, height } = this.getImageSize(opts);
    return (
      <img
        {...props}
        className={imageClassNames}
        src={src}
        alt={alt}
        onError={this.onImageLoadError}
        onLoad={fadeIn ? e => this.onImageLoad(e.target) : undefined}
        ref={fadeIn ? this.imageRef : this.preloadRef}
        width={width}
        height={height}
        loading={loading}
      />
    );
  }

  onImageLoad = element => {
    element.style.opacity = 1;
    if (this.preloadRef.current) {
      this.preloadRef.current.style.opacity = '0';
    }
  };

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
    const { onCaptionChange, setFocusToBlock, setInPluginEditingMode } = this.props;
    const { imageCaption, link } = this.props.styles;
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

  handleRef = e => {
    if (!this.state.container) {
      this.setState({ container: e }); //saving the container on the state to trigger a new render
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
      seoMode,
      styles,
      accessibilityProps,
    } = this.props;
    const { fallbackImageSrc, ssrDone } = this.state;
    const data = componentData || DEFAULTS;
    let { metadata } = componentData;
    if (!metadata) {
      metadata = {};
    }

    const itemClassName = classNames(styles.imageWrapper, className, {
      [styles.pointer]: this.hasExpand() as boolean,
    });
    const imageClassName = styles.image;
    const imageSrc = fallbackImageSrc || this.getImageDataUrl() || this.getImageUrl(data.src);
    let imageProps = {};
    if (data.src && settings && settings.imageProps) {
      imageProps = isFunction(settings.imageProps)
        ? settings.imageProps(data.src)
        : settings.imageProps;
    }
    const isGif = imageSrc?.highres?.endsWith?.('.gif');
    setComponentUrl?.(imageSrc?.highres);

    const shouldRenderPreloadImage = !seoMode && imageSrc && !isGif;
    const shouldRenderImage = (imageSrc && (seoMode || ssrDone)) || isGif;
    const onlyHiRes = seoMode || isGif;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        data-hook="imageViewer"
        className={styles.imageContainer}
        ref={this.handleRef}
        onContextMenu={this.handleContextMenu}
        onKeyDown={this.onKeyDown}
        {...accessibilityProps}
      >
        <div
          className={itemClassName}
          aria-label={metadata.alt}
          onClick={this.handleClick}
          onKeyDown={this.onKeyDown}
        >
          {shouldRenderPreloadImage &&
            this.renderPreloadImage(imageClassName, imageSrc, metadata.alt, imageProps)}
          {shouldRenderImage &&
            this.renderImage(imageClassName, imageSrc, metadata.alt, imageProps, isGif, onlyHiRes)}
          {this.hasExpand() && this.renderExpandIcon()}
        </div>
        {this.renderTitle(data)}
        {this.renderDescription(data)}
        {this.shouldRenderCaption() && this.renderCaption(metadata.caption)}
      </div>
    );
  }
}

export default RicosImage;
