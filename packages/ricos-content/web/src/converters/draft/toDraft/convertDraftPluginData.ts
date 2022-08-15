import { updatePrivacyField } from './utils';
/* eslint-disable fp/no-delete */
// TODO: purify this module
import type {
  Node,
  ImageData,
  Decoration,
  PluginContainerData,
  VideoData,
  DividerData,
  MentionData,
  FileData,
  ButtonData,
  LinkData,
  GalleryData,
  GIFData,
  CollapsibleListData_InitialExpandedItems,
  Struct,
  AudioData,
} from 'ricos-schema';
import { Node_Type, Decoration_Type, ButtonData_Type } from 'ricos-schema';
import { cloneDeep, has, merge } from 'lodash';
import toCamelCase from 'to-camel-case';
import type { DraftGalleryStyles } from '../consts';
import {
  TO_RICOS_DECORATION_DATA_FIELD,
  FROM_RICOS_DECORATION_TYPE,
  FROM_RICOS_ENTITY_TYPE,
  TO_RICOS_DATA_FIELD,
} from '../consts';
import { WRAP, NO_WRAP } from '../../../consts';
import type { ComponentData, FileComponentData } from '../../../types';
import { parseLink } from '../../nodeUtils';
import { toDraft } from './toDraft';
import { convertStructToJson } from './convertStructToJson';

export const convertNodeToDraftData = (node: Node) => {
  const { type } = node;
  const draftPluginType = FROM_RICOS_ENTITY_TYPE[type];
  const dataFieldName = TO_RICOS_DATA_FIELD[draftPluginType];
  if (!dataFieldName) {
    console.error(`No data field name | Plugin Name: ${draftPluginType}`);
  }
  return convertNodeDataToDraft(type, node[dataFieldName] || {}, node.nodes);
};

export const convertDecorationToDraftData = (decoration: Decoration) => {
  const { type } = decoration;
  const dataFieldName = TO_RICOS_DECORATION_DATA_FIELD[FROM_RICOS_DECORATION_TYPE[type]];
  return convertDecorationDataToDraft(type, decoration[dataFieldName]);
};

export const convertNodeDataToDraft = (nodeType: Node_Type, data, nodes?: Node[]) => {
  if (!data) {
    if (
      ![
        Node_Type.COLLAPSIBLE_ITEM,
        Node_Type.COLLAPSIBLE_ITEM_BODY,
        Node_Type.COLLAPSIBLE_ITEM_TITLE,
      ].includes(nodeType)
    ) {
      console.error(`No data for ${nodeType}`);
    }
    return {};
  }
  const newData = cloneDeep(data);
  const converters = {
    [Node_Type.VIDEO]: convertVideoData,
    [Node_Type.AUDIO]: convertAudioData,
    [Node_Type.DIVIDER]: convertDividerData,
    [Node_Type.FILE]: convertFileData,
    [Node_Type.GIF]: convertGIFData,
    [Node_Type.IMAGE]: convertImageData,
    [Node_Type.POLL]: convertPollData,
    [Node_Type.APP_EMBED]: convertAppEmbedData,
    [Node_Type.LINK_PREVIEW]: convertLinkPreviewData,
    [Node_Type.BUTTON]: convertButtonData,
    [Node_Type.COLLAPSIBLE_LIST]: convertCollapsibleListData,
    [Node_Type.HTML]: convertHTMLData,
    [Node_Type.MAP]: convertMapData,
    [Node_Type.EMBED]: convertEmbedData,
    [Node_Type.GALLERY]: convertGalleryData,
    [Node_Type.TABLE]: convertTableData,
    [Node_Type.EXTERNAL]: convertExternalData,
  };
  if (newData.containerData) {
    convertContainerData(newData, nodeType);
  }
  if (nodeType in converters) {
    const convert = converters[nodeType];
    convert(newData, nodes);
  }
  return JSON.parse(JSON.stringify(newData)); // remove undefined values
};

export const convertDecorationDataToDraft = (decorationType: Decoration_Type, data) => {
  const converters = {
    [Decoration_Type.MENTION]: convertMentionData,
    [Decoration_Type.LINK]: convertLinkData,
  };
  if (decorationType in converters) {
    const convert = converters[decorationType];
    const newData = cloneDeep(data);
    convert(newData);
    return newData;
  }
  return data;
};

const convertContainerData = (
  data: { containerData?: PluginContainerData; config },
  nodeType: string
) => {
  const { width, alignment, spoiler, height, textWrap = true } = data.containerData || {};
  const { enabled = false, description, buttonText } = spoiler || {};
  data.config = Object.assign(
    {},
    data.config,
    width?.size && { size: toCamelCase(width.size) },
    width?.custom && { width: parseInt(width.custom) },
    height?.custom && { height: parseInt(height.custom) },
    alignment && { alignment: alignment?.toLowerCase() },
    spoiler && {
      spoiler: {
        enabled,
        description,
        buttonContent: buttonText,
      },
    },
    { textWrap: textWrap ? WRAP : NO_WRAP }
  );
  if ((nodeType === Node_Type.IMAGE || nodeType === Node_Type.BUTTON) && width?.custom) {
    data.config.size = 'inline';
  } else if (nodeType === Node_Type.BUTTON) {
    data.config.size = 'small';
    data.config.width = 'fit-content';
  } else if (nodeType === Node_Type.MAP && width?.custom) {
    data.config.size = 'content';
  }
  delete data.containerData;
};

const convertVideoData = (data: VideoData & { src; metadata; title?; duration?: number }) => {
  const videoSrc = data.video?.src;
  const { src, width, height } = data.thumbnail || {};
  if (videoSrc?.url) {
    data.src = videoSrc.url;
    data.metadata = { thumbnail_url: src?.url, width, height, title: data.title };
  } else if (videoSrc?.id || videoSrc?.custom) {
    data.src = {
      pathname: videoSrc?.id || videoSrc?.custom,
      thumbnail: { pathname: src?.id || src?.custom, width, height },
    };
  }
  data.duration = data.video?.duration;
  delete data.video;
  delete data.title;
  delete data.thumbnail;
};

const convertAudioData = (
  data: AudioData & { coverImage?: { file_name?: string; id?: string } }
) => {
  const { coverImage } = data;
  if (coverImage) {
    const { width, height } = coverImage;
    const id = coverImage?.id ?? coverImage?.src?.id;
    const file_name = coverImage?.file_name ?? coverImage?.src?.id;
    data.coverImage = {
      id,
      file_name,
      width,
      height,
    };
  }
};

const convertExternalData = (data: Struct) => {
  const draftData = convertStructToJson(data);
  Object.entries(draftData).forEach(([k, v]) => {
    data[k] = v;
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete data.fields;
};

const convertDividerData = (
  data: Partial<DividerData> & {
    type;
    lineStyle?: string;
    config?: ComponentData['config'];
    containerData?: PluginContainerData;
  }
) => {
  data.type = data.lineStyle?.toLowerCase();
  delete data.lineStyle;
  data.config = data.config || {};
  if (has(data, 'width')) {
    data.config.size = data.width?.toLowerCase();
    delete data.width;
  }
  if (has(data, 'alignment')) {
    data.config.alignment = data.alignment?.toLowerCase();
    delete data.alignment;
  }
  delete data.containerData;
};

enum GalleryLayout {
  COLLAGE = 0,
  MASONRY,
  GRID,
  THUMBNAIL,
  SLIDER,
  SLIDESHOW,
  PANORAMA,
  COLUMN,
  MAGIC,
  FULLSIZE,
}

const convertGalleryStyles = options => {
  const styles: DraftGalleryStyles = {};
  has(options, 'layout.type') &&
    (styles.galleryLayout = parseInt(GalleryLayout[options.layout.type]));
  has(options, 'layout.horizontalScroll') && (styles.oneRow = options.layout.horizontalScroll);
  has(options, 'layout.orientation') &&
    (styles.isVertical = options.layout.orientation === 'COLUMNS');
  has(options, 'layout.numberOfColumns') &&
    (styles.numberOfImagesPerRow = options.layout.numberOfColumns);
  has(options, 'layout.mobileNumberOfColumns') &&
    (styles.m_numberOfImagesPerRow = options.layout.mobileNumberOfColumns);
  has(options, 'item.targetSize') && (styles.gallerySizePx = options.item.targetSize);
  has(options, 'item.ratio') && (styles.cubeRatio = options.item.ratio);
  has(options, 'item.crop') && (styles.cubeType = options.item.crop.toLowerCase());
  has(options, 'item.spacing') && (styles.imageMargin = options.item.spacing);
  has(options, 'thumbnails.placement') &&
    (styles.galleryThumbnailsAlignment = options.thumbnails.placement.toLowerCase());
  has(options, 'thumbnails.spacing') && (styles.thumbnailSpacings = options.thumbnails.spacing / 2);
  return styles;
};

const convertGalleryItem = item => {
  const type = has(item, 'image') ? 'image' : 'video';
  const {
    src: { url },
    height,
    width,
  } = item[type].media;
  item.url = url;
  item.metadata = { height, width, type };
  has(item, 'title') && (item.metadata.title = item.title);
  has(item, 'altText') && (item.metadata.altText = item.altText);
  if (has(item, 'video.thumbnail')) {
    const {
      src: { url },
      height,
      width,
    } = item.video.thumbnail;
    item.metadata.poster = { url, height, width };
  }
  item.image?.link && (item.metadata.link = parseLink(item.image.link));
  delete item.video;
  delete item.image;
  delete item.title;
  delete item.altText;
  return item;
};

const convertGalleryData = (
  data: GalleryData & {
    styles: DraftGalleryStyles;
  }
) => {
  has(data, 'items') && (data.items = data.items.map(item => convertGalleryItem(item)));
  has(data, 'options') && (data.styles = convertGalleryStyles(data.options));
  delete data.options;
};

const convertImageData = (data: ImageData & { src; config; metadata }) => {
  const { link, config, image, altText, caption } = data;
  const { src, width, height } = image || {};
  const id = src?.id || src?.custom;
  data.src = id ? { id, file_name: id, width, height } : { url: src?.url, source: 'static' };
  const links = link?.anchor ? { anchor: link?.anchor } : { link: link && parseLink(link) };
  if (links.link?.customData) {
    const parsedCustomData = parseLinkCustomData(links.link?.customData);
    merge(links.link, parsedCustomData);
    if (!parsedCustomData.customData) {
      delete links.link.customData;
    }
  }
  data.config = { ...(config || {}), ...links };
  data.metadata = (altText || caption) && { caption, alt: altText };
  delete data.image;
  delete data.link;
  delete data.caption;
  delete data.altText;
};

const convertGIFData = (
  data: GIFData & {
    gif: {
      originalUrl;
      originalMp4;
      stillUrl;
      downsizedUrl;
      downsizedSmallMp4;
      downsizedStillUrl;
      height;
      width;
    };
    width;
    height;
  }
) => {
  const { original = {}, downsized = {}, height, width } = data;
  data.gif = {
    originalUrl: original.gif,
    originalMp4: original.mp4,
    stillUrl: original.still,
    downsizedUrl: downsized.gif,
    downsizedSmallMp4: downsized.mp4,
    downsizedStillUrl: downsized.still,
    height,
    width,
  };
  delete data.original;
  delete data.downsized;
  delete data.height;
  delete data.width;
};

const convertPollData = data => {
  has(data, 'layout.poll.type') && (data.layout.poll.type = data.layout.poll.type.toLowerCase());
  has(data, 'layout.poll.direction') &&
    (data.layout.poll.direction = data.layout.poll.direction.toLowerCase());
  if (has(data, 'layout.options')) {
    data.layout.option = data.layout.options;
    delete data.layout.options;
  }
  if (has(data, 'design')) {
    const { poll = {}, options = {} } = data.design;
    const { background, borderRadius } = poll;
    const getBackground = background =>
      background?.gradient
        ? {
            angle: background?.gradient?.angle,
            start: background?.gradient?.startColor,
            end: background?.gradient?.lastColor,
          }
        : background?.color?.charAt?.(0) === '#'
        ? background?.color
        : background?.image?.src?.url;
    data.design = {
      poll: {
        backgroundType: background?.type?.toLowerCase(),
        background: getBackground(background),
        borderRadius: `${borderRadius}px`,
      },
      option: { borderRadius: `${options.borderRadius}px` },
    };
  }
  has(data, 'poll.pollId') && (data.poll.id = data.poll.pollId);
  delete data.poll.pollId;
  has(data, 'poll.creatorId') && (data.poll.createdBy = data.poll.creatorId);
  delete data.poll.creatorId;
  has(data, 'poll.image.src.url') && (data.poll.mediaId = data.poll.image.src.url);
  delete data.poll.image;
  has(data, 'poll.options') &&
    (data.poll.options = data.poll.options.map(({ image, ...rest }) => ({
      mediaId: image?.src?.url,
      ...rest,
    })));
  if (has(data, 'poll.settings')) {
    const { showVotesCount, showVoters, permissions } = data.poll.settings;
    const { view, vote, allowMultipleVotes } = permissions || {};

    const getResultsVisibility = view =>
      view === 'EVERYONE' ? 'ALWAYS' : view === 'VOTERS' ? 'VOTERS_ONLY' : 'ONLY_ME';

    data.poll.settings = {
      resultsVisibility: getResultsVisibility(view),
      multipleVotes: allowMultipleVotes,
      voteRole: vote,
      votersDisplay: showVoters,
      votesDisplay: showVotesCount,
    };
  }
  data.config.size = 'large';
  data.config.width = 'full-width';
};

const convertAppEmbedData = data => {
  const { type, itemId, name, image, url, bookingData, eventData, imageSrc } = data;
  const { src, width, height } = image || {};
  data.type = type.toLowerCase();
  const selectedProduct: Record<string, unknown> = {
    id: itemId,
    name,
    imageSrc: src?.url || imageSrc,
    pageUrl: url,
    ...(bookingData || {}),
    ...(eventData || {}),
  };
  width && (selectedProduct.imageWidth = width);
  height && (selectedProduct.imageHeight = height);
  data.selectedProduct = selectedProduct;
  delete data.id;
  delete data.itemId;
  delete data.name;
  delete data.imageSrc;
  delete data.image;
  delete data.url;
  bookingData && delete data.bookingData;
  eventData && delete data.eventData;
};

const convertLinkPreviewData = data => {
  if (data.thumbnailUrl) {
    data.thumbnail_url = data.thumbnailUrl;
    delete data.thumbnailUrl;
  }
  if (data.link) {
    data.config.link = parseLink(data.link);
    delete data.link;
  }
};

const convertMentionData = (data: Partial<MentionData> & { mention }) => {
  data.mention = { slug: data.slug, name: data.name, id: data.id };
  delete data.name;
  delete data.slug;
  delete data.id;
};

const convertFileData = (data: FileData & FileComponentData) => {
  const { url, id, custom, private: isPrivate } = data.src || {};
  data.url = url;
  data.id = id || custom;
  updatePrivacyField(data, isPrivate);
  delete data.src;
};

const convertCollapsibleListData = (
  data: {
    config: {
      expandState?: string;
      expandOnlyOne?: boolean;
      direction?: string;
      alignment?: string;
    };
    initialExpandedItems?: CollapsibleListData_InitialExpandedItems;
    expandOnlyOne?: boolean;
    direction?: string;
    pairs;
  },
  nodes: Node[]
) => {
  const { initialExpandedItems, expandOnlyOne, direction } = data || {};

  const getExpandState = (initialExpandedItems?: CollapsibleListData_InitialExpandedItems) => {
    if (initialExpandedItems === 'ALL') {
      return 'expanded';
    }
    if (initialExpandedItems === 'NONE') {
      return 'collapsed';
    }
    return 'first_expanded';
  };

  const config = {
    expandState: getExpandState(initialExpandedItems),
    expandOnlyOne,
    direction: direction?.toLowerCase(),
  };
  data.config = { ...data.config, ...config };
  data.pairs = nodes.map(node => {
    const { VERSION: _, ID: __, ...title } = toDraft(node.nodes[0]);
    const { VERSION: ___, ID: ____, ...content } = toDraft(node.nodes[1]);
    return {
      key: node.id,
      title,
      content,
    };
  });
  delete data.initialExpandedItems;
  delete data.expandOnlyOne;
  delete data.direction;
  delete data.config.alignment;
};

const convertButtonData = (data: Partial<ButtonData> & { button }) => {
  const { link, text, type, styles } = data;
  const { colors, border } = styles || {};
  const { width, radius } = border || {};
  const convertedLink = type === ButtonData_Type.LINK && link ? parseLink(link) : {};
  data.button = {
    settings: {
      buttonText: text,
      ...convertedLink,
    },
    design: {
      borderRadius: radius,
      borderWidth: width,
      background: colors?.background,
      color: colors?.text,
      borderColor: colors?.border,
    },
  };
  delete data.link;
  delete data.text;
  delete data.type;
  delete data.styles;
};

const convertHTMLData = data => {
  const { html, url, config = {} } = data;
  const srcType = html ? 'html' : 'url';
  data.srcType = srcType;
  data.src = html || url;
  delete data[srcType];
  config.size && delete data.config.size;
};

const convertMapData = data => {
  const {
    draggable,
    marker,
    streetViewControl,
    zoomControl,
    locationName,
    viewModeControl,
    initialZoom,
    mapType,
  } = data.mapSettings;
  data.mapSettings.isDraggingAllowed = draggable;
  data.mapSettings.isMarkerShown = marker;
  data.mapSettings.isStreetViewControlShown = streetViewControl;
  data.mapSettings.isZoomControlShown = zoomControl;
  data.mapSettings.locationDisplayName = locationName;
  data.mapSettings.zoom = initialZoom;
  data.mapSettings.mode = mapType?.toLowerCase();
  delete data.mapSettings.draggable;
  delete data.mapSettings.marker;
  delete data.mapSettings.streetViewControl;
  delete data.mapSettings.zoomControl;
  delete data.mapSettings.locationName;
  delete data.mapSettings.initialZoom;
  delete data.mapSettings.mapType;

  if (viewModeControl) {
    data.mapSettings.isViewControlShown = viewModeControl;
    delete data.mapSettings.viewModeControl;
  }
};

const convertEmbedData = data => {
  data.config = {
    ...(data?.config || {}),
    alignment: 'center',
    size: 'content',
    link: { url: data.src, target: '_blank', rel: 'noopener' },
  };
  const { html, thumbnailUrl, title, description } = data.oembed;
  data.html = html;
  thumbnailUrl && (data.thumbnail_url = thumbnailUrl);
  title && (data.title = title);
  description && (data.description = description);
  delete data.oembed;
  delete data.src;
};

const convertLinkData = (
  data: LinkData & { url?: string; target?: string; rel?: string; customData?: string }
) => {
  if (data.link) {
    const { url, target, rel, customData } = parseLink(data.link);
    data.url = url;
    if (target) {
      data.target = target;
    }
    if (rel) {
      data.rel = rel;
    }
    if (customData) {
      const customDataObj = parseLinkCustomData(customData);
      merge(data, customDataObj);
    }
    delete data.link;
  }
};

const parseLinkCustomData = (customData: string) => {
  try {
    return { customData: JSON.parse(customData) };
  } catch (e) {
    console.error('failed to parse customData', customData); // eslint-disable-line
    return { customData };
  }
};

const convertTableData = (
  data: {
    dimensions;
    header;
    rowHeader;
    columnHeader;
    config: {
      colsWidth;
      rowsHeight;
      colsMinWidth;
      alignment?;
      rows;
      rowHeader;
      colHeader;
    };
  },
  nodes
) => {
  const {
    dimensions: { colsWidthRatio, rowsHeight, colsMinWidth },
    header,
    rowHeader,
    columnHeader,
  } = data || {};
  const { alignment: _, ...rest } = data.config || {};

  data.config = {
    ...rest,
    colsWidth: colsWidthRatio,
    rowsHeight,
    colsMinWidth,
    rowHeader: rowHeader || header,
    colHeader: columnHeader,
  };
  const rows = {};
  nodes.forEach((row, i) => {
    rows[i] = { columns: {} };
    row.nodes.forEach((cell, j) => {
      const { VERSION: _, ID: __, ...content } = toDraft(cell);
      const { cellStyle = {}, borderColors = {} } = cell.tableCellData || {};
      rows[i].columns[j] = {
        content,
        style: {
          verticalAlign: cellStyle.verticalAlignment?.toLowerCase(),
          backgroundColor: cellStyle.backgroundColor?.toLowerCase(),
        },
        border: {
          top: borderColors.top?.toLowerCase(),
          left: borderColors.left?.toLowerCase(),
          right: borderColors.right?.toLowerCase(),
          bottom: borderColors.bottom?.toLowerCase(),
        },
      };
    });
  });
  data.config.rows = rows;
  delete data.dimensions;
  delete data.header;
  delete data.rowHeader;
  delete data.columnHeader;
};
