import type { VideoComponentData, ImageComponentData } from 'wix-rich-content-common';
import {
  IMAGE_TYPE,
  GALLERY_TYPE,
  VIDEO_TYPE,
  FILE_UPLOAD_TYPE,
  AUDIO_TYPE,
} from 'wix-rich-content-common';

export const GALLERY_FILE_TYPES = { IMAGE: 'image', VIDEO: 'video' };

const galleryItemBuilder = {
  [GALLERY_FILE_TYPES.IMAGE]: (
    img: ImageComponentData & HTMLImageElement,
    preloadImage?: boolean | undefined
  ) => {
    return {
      metadata: { type: GALLERY_FILE_TYPES.IMAGE, height: img.height, width: img.width },
      url: preloadImage ? img.src : img.file_name,
      tempData: preloadImage,
    };
  },
  [GALLERY_FILE_TYPES.VIDEO]: (video: VideoComponentData, preloadImage?: boolean | undefined) => {
    const {
      thumbnail: { pathname, width, height },
    } = video;
    return {
      metadata: {
        type: GALLERY_FILE_TYPES.VIDEO,
        height: video.height || height,
        width: video.width || width,
        poster: { url: pathname, width, height },
      },
      url: video.pathname,
      tempData: preloadImage,
    };
  },
};

const setItemInGallery = (item, componentData, itemPos?: number) => {
  let { items, styles } = componentData;
  if (typeof itemPos === 'undefined') {
    items = [...items, item];
  } else {
    items = [...items];
    items[itemPos] = item;
  }
  return { items, styles, config: {} };
};

export const dataBuilder = {
  [IMAGE_TYPE]: ({ data, error }, componentData) => {
    const imageData = data?.length ? data[0] : data;
    const config = { ...componentData.config };
    if (!config.alignment) {
      config.alignment = imageData.width >= 740 ? 'center' : 'left';
    }
    return { ...componentData, config, src: imageData, error };
  },
  [VIDEO_TYPE]: ({ data, error }, componentData) => {
    let { src } = componentData;
    if (data) {
      const { pathname, thumbnail, url } = data;
      src = pathname ? { pathname, thumbnail } : url;
    }
    return { ...componentData, src, error, tempData: undefined };
  },
  [AUDIO_TYPE]: ({ data, error }, componentData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { html, tempData, ...rest } = componentData;
    const name = data?.name ?? componentData?.name;
    const authorName = data?.authorName ?? componentData?.authorName;
    const isCoverImageData = data?.file_name;

    return isCoverImageData
      ? { ...componentData, coverImage: data }
      : {
          ...rest,
          audio: data?.audio,
          error,
          name,
          authorName,
        };
  },
  [FILE_UPLOAD_TYPE]: ({ data, error }, componentData) => {
    return { ...componentData, ...data, error, tempData: undefined };
  },
  [GALLERY_TYPE]: ({ data, error }, componentData, fileType, itemIndex) => {
    const type =
      fileType ||
      data.type ||
      (data.thumbnail ? GALLERY_FILE_TYPES.VIDEO : GALLERY_FILE_TYPES.IMAGE);
    return setItemInGallery(
      { ...galleryItemBuilder[type]?.(data), error },
      componentData,
      itemIndex
    );
  },
};

export const tempDataBuilder = {
  [IMAGE_TYPE]: ({ url }) => {
    return { dataUrl: url };
  },
  [VIDEO_TYPE]: ({ url }) => {
    return { src: url, tempData: true };
  },
  [AUDIO_TYPE]: ({ url, file }) => {
    if (!file.type.includes('image')) {
      const audio = { src: { id: url } };
      const name = file.name.split('.')[0];
      return { audio, name, tempData: true };
    }
  },
  [FILE_UPLOAD_TYPE]: ({ file }) => {
    const { name, size } = file;
    const type = name.split('.').pop();
    return { name, size, type, tempData: true };
  },
};

export const uploadFunctionGetter = {
  [IMAGE_TYPE]: props => props.helpers?.handleFileUpload,
  [VIDEO_TYPE]: props => props.handleFileUpload,
  [AUDIO_TYPE]: props => props.handleFileUpload,
  [FILE_UPLOAD_TYPE]: props => props.settings?.onFileSelected,
  [GALLERY_TYPE]: props => props.helpers?.handleFileUpload,
};
