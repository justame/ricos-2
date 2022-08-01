/* eslint-disable fp/no-delete */
import { has, cloneDeep } from 'lodash';
import {
  ACTION_BUTTON_TYPE,
  DIVIDER_TYPE,
  FILE_UPLOAD_TYPE,
  HTML_TYPE,
  IMAGE_TYPE,
  IMAGE_TYPE_LEGACY,
  LINK_BUTTON_TYPE,
  LINK_PREVIEW_TYPE,
  MENTION_TYPE,
  POLL_TYPE,
  APP_EMBED_TYPE,
  VIDEO_TYPE,
  MAP_TYPE,
  COLLAPSIBLE_LIST_TYPE,
  EMBED_TYPE,
  LINK_TYPE,
  TABLE_TYPE,
  GALLERY_TYPE,
  GIPHY_TYPE,
  WRAP,
  NO_WRAP,
  EXTERNAL,
  AUDIO_TYPE,
} from '../../../consts';
import type {
  PluginContainerData_Spoiler,
  FileSource,
  Link,
  ButtonData,
  GIFData,
  GalleryData,
  FileData,
} from 'ricos-schema';
import { PluginContainerData_Width_Type, ButtonData_Type } from 'ricos-schema';
import { TO_RICOS_DATA } from './consts';
import type {
  AudioComponentData,
  ComponentData,
  FileComponentData,
  ImageComponentData,
  VideoComponentData,
} from '../../../types';
import { createLink } from '../../nodeUtils';
import toConstantCase from 'to-constant-case';
import type { DraftGalleryStyles } from '../consts';
import { convertJsonToStruct } from './convertJsonToStruct';

export const convertBlockDataToRicos = (type: string, data) => {
  const newData = cloneDeep(data);
  const converters = {
    [VIDEO_TYPE]: convertVideoData,
    [AUDIO_TYPE]: convertAudioData,
    [DIVIDER_TYPE]: convertDividerData,
    [FILE_UPLOAD_TYPE]: convertFileData,
    [GIPHY_TYPE]: convertGIFData,
    [IMAGE_TYPE]: convertImageData,
    [IMAGE_TYPE_LEGACY]: convertImageData,
    [POLL_TYPE]: convertPollData,
    [APP_EMBED_TYPE]: convertAppEmbedData,
    [LINK_PREVIEW_TYPE]: convertLinkPreviewData,
    [MENTION_TYPE]: convertMentionData,
    [LINK_BUTTON_TYPE]: convertButtonData,
    [ACTION_BUTTON_TYPE]: convertButtonData,
    [COLLAPSIBLE_LIST_TYPE]: convertCollapsibleListData,
    [HTML_TYPE]: convertHTMLData,
    [MAP_TYPE]: convertMapData,
    [EMBED_TYPE]: convertEmbedData,
    [LINK_TYPE]: convertLinkData,
    [TABLE_TYPE]: convertTableData,
    [GALLERY_TYPE]: convertGalleryData,
    [EXTERNAL]: convertExternalData,
  };
  let blockType = type;
  if (type === LINK_PREVIEW_TYPE && data.html) {
    blockType = EMBED_TYPE;
  }
  if (newData.config && blockType !== EXTERNAL) {
    convertContainerData(newData, blockType);
  }
  if (blockType in converters) {
    const convert = converters[blockType];
    convert(newData, blockType);
  }
  const fromJSON = data => {
    const pluginDataMethods = TO_RICOS_DATA[blockType];
    return pluginDataMethods?.fromJSON(data) || data;
  };
  return fromJSON(newData);
};

const convertContainerData = (
  data: { config?: ComponentData['config']; containerData },
  blockType: string
) => {
  const { size, alignment, width, spoiler, height, textWrap = WRAP } = data.config || {};
  const { enabled, description, buttonContent } = spoiler || {};
  const newSpoiler: PluginContainerData_Spoiler | undefined = spoiler && {
    enabled: enabled || false,
    description,
    buttonText: buttonContent,
  };
  data.containerData = {
    alignment: alignment?.toUpperCase(),
    spoiler: newSpoiler,
    textWrap: textWrap !== NO_WRAP,
  };
  typeof height === 'number' && (data.containerData.height = { custom: height });
  typeof width === 'number'
    ? (data.containerData.width = { custom: width })
    : size && (data.containerData.width = { size: toConstantCase(size) });
  if (
    (blockType === ACTION_BUTTON_TYPE || blockType === LINK_BUTTON_TYPE) &&
    data.containerData.width.size
  ) {
    data.containerData.width.size = 'ORIGINAL';
  }
};

const convertVideoData = (data: {
  src?: string | VideoComponentData;
  metadata?: {
    oembed?: {
      thumbnail_url?: string;
      thumbnail_width?: string;
      thumbnail_height?: string;
      video_url?: string;
    };
    thumbnail_url?: string;
    width?: number;
    height?: number;
    title?: string;
  };
  video;
  thumbnail;
  title?;
  duration?: number;
}) => {
  if (typeof data.src === 'string') {
    data.video = { src: { url: data.src } };
    const {
      oembed,
      thumbnail_url,
      width: thumbnail_width,
      height: thumbnail_height,
      title,
    } = data.metadata || {};
    let src, width, height;
    if (oembed) {
      const { thumbnail_url, thumbnail_width, thumbnail_height } = oembed;
      src = { url: thumbnail_url };
      width = thumbnail_width;
      height = thumbnail_height;
    } else {
      src = { url: thumbnail_url };
      width = thumbnail_width;
      height = thumbnail_height;
    }
    title && (data.title = title);
    data.thumbnail = {
      src,
      width,
      height,
    };
  } else if (typeof data.src === 'object') {
    data.video = { src: { id: data.src.pathname } };
    data.thumbnail = {
      src: { id: data.src.thumbnail.pathname },
      width: data.src.thumbnail.width,
      height: data.src.thumbnail.height,
    };
  }
  data.video && (data.video.duration = data.duration);
};

const convertAudioData = (data: AudioComponentData & { coverImage: { file_name: string } }) => {
  const { coverImage } = data;
  if (coverImage) {
    const { file_name, width, height } = coverImage;
    data.coverImage = { file_name, src: { id: file_name }, width, height };
  }
};

const convertGalleryStyles = styles => {
  styles.layout = {};
  styles.item = {};
  styles.thumbnails = {};
  has(styles, 'galleryLayout') && (styles.layout.type = styles.galleryLayout);
  has(styles, 'oneRow') && (styles.layout.horizontalScroll = styles.oneRow);
  has(styles, 'isVertical') && (styles.layout.orientation = styles.isVertical ? 'COLUMNS' : 'ROWS');
  has(styles, 'numberOfImagesPerRow') &&
    (styles.layout.numberOfColumns = styles.numberOfImagesPerRow);
  has(styles, 'm_numberOfImagesPerRow') &&
    (styles.layout.mobileNumberOfColumns = styles.m_numberOfImagesPerRow);
  has(styles, 'gallerySizePx') && (styles.item.targetSize = styles.gallerySizePx);
  has(styles, 'cubeRatio') && (styles.item.ratio = styles.cubeRatio);
  const cubeType = styles?.cubeType?.toUpperCase();
  ['FIT', 'FILL'].includes(cubeType) && (styles.item.crop = cubeType);
  has(styles, 'imageMargin') && (styles.item.spacing = styles.imageMargin);
  const thumbnailPlacement = styles?.galleryThumbnailsAlignment?.toUpperCase();
  styles.thumbnails.placement = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'].includes(thumbnailPlacement)
    ? thumbnailPlacement
    : 'NONE';
  has(styles, 'thumbnailSpacings') && (styles.thumbnails.spacing = styles.thumbnailSpacings * 2);
  return styles;
};

const convertGalleryItem = item => {
  const {
    url,
    metadata: { type = 'image', poster, height, width, link, title, altText },
  } = item;
  item[type] = { media: { src: { url }, height, width } };
  title && (item.title = title);
  altText && (item.altText = altText);
  if (type === 'video' && poster) {
    const src = { url: poster.url || poster };
    item.video.thumbnail = { src, height: poster.height || height, width: poster.width || width };
  }
  type === 'image' && link && (item.image.link = createLink(link));

  return item;
};

const convertGalleryData = (data: GalleryData & { styles: DraftGalleryStyles }) => {
  has(data, 'items') && (data.items = data.items.map(item => convertGalleryItem(item)));
  has(data, 'styles') && (data.options = convertGalleryStyles(data.styles));
};

const convertDividerData = (data: {
  type?: string;
  config?: ComponentData['config'];
  lineStyle?: string;
  width;
  alignment;
  containerData;
}) => {
  has(data, 'type') && (data.lineStyle = data.type?.toUpperCase());
  has(data, 'config.size') && (data.width = data.config?.size?.toUpperCase());
  has(data, 'config.alignment') && (data.alignment = data.config?.alignment?.toUpperCase());
  data.containerData.width = { size: PluginContainerData_Width_Type.CONTENT };
};

const convertExternalData = data => {
  data.fields = convertJsonToStruct(data).fields;
};

const convertImageData = (data: {
  src?: ImageComponentData;
  config?: ComponentData['config'];
  metadata?: { alt?: string; caption?: string };
  image;
  link;
  altText;
  caption;
  width;
  height;
}) => {
  if (typeof data.src === 'string') {
    data.image = {
      src: { source: 'static', url: data.src },
      width: data.width,
      height: data.height,
    };
  } else if (typeof data.src === 'object') {
    const { file_name, width, height } = data.src || {};
    data.image = { src: { id: file_name }, width, height };
  }
  const { link, anchor } = data.config || {};
  data.link = (link || anchor) && createLink({ ...link, anchor });
  data.altText = data.metadata?.alt;
  data.caption = data.metadata?.caption;
};

const convertGIFData = (
  data: GIFData & {
    gif?: {
      originalUrl;
      originalMp4;
      stillUrl;
      downsizedUrl;
      downsizedSmallMp4;
      downsizedStillUrl;
      height;
      width;
    };
  }
) => {
  const { gif } = data;
  const {
    originalUrl,
    originalMp4,
    stillUrl,
    downsizedUrl,
    downsizedSmallMp4,
    downsizedStillUrl,
    height,
    width,
  } = gif || {};
  data.original = { gif: originalUrl, mp4: originalMp4, still: stillUrl };
  data.downsized = { gif: downsizedUrl, mp4: downsizedSmallMp4, still: downsizedStillUrl };
  data.height = height;
  data.width = width;
  delete data.gif;
};

const convertPollData = (data: { containerData; layout; design; poll }) => {
  has(data, 'layout.poll.type') && (data.layout.poll.type = data.layout.poll.type.toUpperCase());
  has(data, 'layout.poll.direction') &&
    (data.layout.poll.direction = data.layout.poll.direction.toUpperCase());
  if (has(data, 'layout.option')) {
    data.layout.options = data.layout.option;
    delete data.layout.option;
  }
  if (has(data, 'design')) {
    const { poll = {}, option = {} } = data.design;
    const { backgroundType, background } = poll;
    const regex = /(\d*)px/;
    const getBackground = background =>
      background?.angle
        ? {
            gradient: {
              angle: background.angle,
              startColor: background?.start?.toUpperCase(),
              lastColor: background.end?.toUpperCase(),
            },
          }
        : background?.charAt?.(0) === '#'
        ? { color: background?.toUpperCase() }
        : { image: { src: { url: background } } };
    data.design = {
      poll: {
        background: {
          type: backgroundType?.toUpperCase(),
          ...getBackground(background),
        },
        borderRadius: parseInt(regex.exec(poll.borderRadius)?.[1] || '0'),
      },
      options: { borderRadius: parseInt(regex.exec(option.borderRadius)?.[1] || '0') },
    };
  }
  has(data, 'poll.id') && (data.poll.pollId = data.poll.id);
  has(data, 'poll.createdBy') && (data.poll.creatorId = data.poll.createdBy);
  has(data, 'poll.mediaId') && (data.poll.image = { src: { url: data.poll.mediaId } });
  has(data, 'poll.options') &&
    (data.poll.options = data.poll.options.map(({ mediaId, ...rest }) => ({
      image: { src: { url: mediaId } },
      ...rest,
    })));
  if (has(data, 'poll.settings')) {
    const { multipleVotes, voteRole, resultsVisibility, votersDisplay, votesDisplay } =
      data.poll.settings;

    const getViewRole = resultsVisibility =>
      resultsVisibility === 'ALWAYS'
        ? 'EVERYONE'
        : resultsVisibility === 'VOTERS_ONLY'
        ? 'VOTERS'
        : 'CREATOR';

    data.poll.settings = {
      permissions: {
        view: getViewRole(resultsVisibility),
        vote: voteRole,
        allowMultipleVotes: multipleVotes,
      },
      showVoters: votersDisplay,
      showVotesCount: votesDisplay,
    };
  }
  has(data, 'containerData.width.size') && (data.containerData.width.size = 'CONTENT');
};

const convertAppEmbedData = (data: {
  type: string;
  selectedProduct: Record<string, string>;
  url;
  imageSrc;
  imageWidth;
  imageHeight;
  itemId;
  name;
  bookingData;
  eventData;
  image;
}) => {
  const {
    id,
    name,
    imageSrc,
    imageHeight,
    imageWidth,
    description,
    pageUrl,
    scheduling,
    location,
    html,
    durations,
  } = data.selectedProduct;
  data.url = pageUrl || (html && (data.url = html.match(/href="[^"]*/g)?.[0]?.slice(6)));
  data.itemId = id;
  data.name = name;
  data.imageSrc = imageSrc;
  data.image = { src: { url: imageSrc }, width: imageWidth, height: imageHeight };
  if (data.type === 'booking') {
    data.bookingData = { durations: durations || description };
  } else if (data.type === 'event') {
    data.eventData = {
      location: location || (description && description.match(/[^|]*$/)?.[0]),
      scheduling: scheduling || (description && description.match(/[^|]+/)?.[0]),
    };
  }
  data.type = data.type?.toUpperCase();
};

const convertLinkPreviewData = (data: {
  thumbnail_url?: string;
  config?: { link };
  thumbnailUrl;
  link;
}) => {
  has(data, 'thumbnail_url') && (data.thumbnailUrl = data.thumbnail_url);
  data.config?.link && (data.link = createLink(data.config?.link));
};

const convertMentionData = (data: {
  mention?: { name?: string; slug?: string };
  name?: string;
  slug?: string;
}) => {
  data.name = data.mention?.name;
  data.slug = data.mention?.slug;
  delete data.mention;
};

const convertFileData = (data: FileComponentData & FileData) => {
  const { url, id, privacy } = data;
  const isPrivate = typeof privacy !== 'undefined' ? privacy === 'private' : undefined;
  const src: FileSource = { url, id, private: isPrivate };
  data.src = src;
};

const convertCollapsibleListData = (data: {
  config?: { expandState: string; expandOnlyOne: boolean; direction: string };
  initialExpandedItems?: string;
  expandOnlyOne?: boolean;
  direction?: string;
}) => {
  const { config } = data || {};
  const { expandState, expandOnlyOne, direction } = config || {};

  const getInitialExpandedItems = (expandState?: string) => {
    if (expandState === 'expanded') {
      return 'ALL';
    }
    if (expandState === 'collapsed') {
      return 'NONE';
    }
    return 'FIRST';
  };

  data.initialExpandedItems = getInitialExpandedItems(expandState);
  data.expandOnlyOne = expandOnlyOne;
  data.direction = direction?.toUpperCase();
};

const convertButtonData = (
  data: { button?: { settings; design } } & ButtonData,
  blockType: string
) => {
  const { settings, design } = data.button || {};
  const { borderRadius, borderWidth, background, color, borderColor } = design || {};
  const { buttonText, url, rel, target } = settings || {};
  data.styles = {
    colors: { text: color, border: borderColor, background },
    border: { radius: borderRadius, width: borderWidth },
  };
  data.type = blockType === ACTION_BUTTON_TYPE ? ButtonData_Type.ACTION : ButtonData_Type.LINK;
  data.text = buttonText;
  if (data.type === ButtonData_Type.LINK && url) {
    data.link = createLink({
      url,
      rel,
      target,
    });
  }
};

const convertHTMLData = data => {
  const { src, srcType } = data;
  data[srcType] = src;
};

const convertMapData = data => {
  const {
    isDraggingAllowed,
    isMarkerShown,
    isStreetViewControlShown,
    isZoomControlShown,
    locationDisplayName,
    isViewControlShown,
    zoom,
    mode,
  } = data.mapSettings;
  data.mapSettings.draggable = isDraggingAllowed;
  data.mapSettings.marker = isMarkerShown;
  data.mapSettings.streetViewControl = isStreetViewControlShown;
  data.mapSettings.zoomControl = isZoomControlShown;
  data.mapSettings.locationName = locationDisplayName;
  data.mapSettings.initialZoom = zoom;
  data.mapSettings.mapType = mode?.toUpperCase();

  if (has(data.mapSettings, 'isViewControlShown')) {
    data.mapSettings.viewModeControl = isViewControlShown;
  }
};

const convertEmbedData = (data: {
  html;
  description?;
  title?;
  thumbnail_url?;
  src;
  config;
  oembed;
}) => {
  const url = data.config?.link?.url;
  url && (data.src = url);
  data.oembed = {
    type: 'rich',
    thumbnailUrl: data.thumbnail_url,
    title: data.title,
    description: data.description,
    html: data.html,
  };
};

const convertLinkData = (data: { url: string; target?: string; rel?: string } & { link: Link }) => {
  data.link = createLink(data);
};

const convertTableData = data => {
  const {
    config: { colsWidth, rowsHeight, colsMinWidth, rowHeader },
  } = data;
  const colsWidthRatio = colsWidth.map(width => parseInt(width, 10));
  data.dimensions = { colsWidthRatio, rowsHeight, colsMinWidth };
  data.header = rowHeader;
};
