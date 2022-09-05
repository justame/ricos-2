import type { IMediaPluginService, UploadedData, IMessage } from 'ricos-types';
import { omit } from 'lodash';
import type {
  ComponentData,
  ImageComponentData,
  VideoComponentData,
} from 'wix-rich-content-common';

const GALLERY_FILE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
};

const getGalleryFileType = type => {
  return type.match('image/*')
    ? GALLERY_FILE_TYPES.IMAGE
    : type.match('video/*')
    ? GALLERY_FILE_TYPES.VIDEO
    : '';
};

const galleryImageBuilder = (img: ImageComponentData) => {
  return {
    image: {
      media: {
        src: { url: img.file_name },
        height: img.height,
        width: img.width,
      },
    },
  };
};

const galleryVideoBuilder = (video: VideoComponentData) => {
  const {
    thumbnail: { pathname: url, width, height },
  } = video;
  return {
    video: {
      media: {
        src: { url: video.pathname },
        height: video.height || height,
        width: video.width || width,
      },
      thumbnail: {
        src: { url },
        width,
        height,
      },
    },
  };
};

const setItemInGallery = (item, componentData, itemPos?: number): ComponentData => {
  let { items } = componentData;
  if (typeof itemPos === 'undefined') {
    items = [...items, item];
  } else {
    items = [...items];
    items[itemPos] = item;
  }
  return { ...componentData, items };
};

export class GalleryPluginService implements IMediaPluginService {
  createLoadingData(
    file: File,
    _: unknown,
    componentData: ComponentData,
    fileState?: Record<string, string | number>
  ) {
    // TODO: Remove comment when PG empty URL bug is fixed.
    const fileType = getGalleryFileType(file.type);
    const galleryItem = { [fileType]: { media: { src: { url: '' } } } };
    const itemIndex = fileState?.itemIndex || componentData.items.length;
    const newComponentData = setItemInGallery(galleryItem, componentData, itemIndex);
    return {
      componentData: newComponentData,
      componentState: { loading: true },
      fileState: { ...fileState, itemIndex },
    };
  }

  createPluginData(
    uploadedData: UploadedData,
    componentData: ComponentData,
    fileState?: Record<string, string | number>
  ) {
    const { data } = uploadedData;
    const fileType =
      fileState?.fileType || (data as VideoComponentData).thumbnail
        ? GALLERY_FILE_TYPES.VIDEO
        : GALLERY_FILE_TYPES.IMAGE;

    let galleryItem;
    if (fileType === GALLERY_FILE_TYPES.VIDEO) {
      galleryItem = galleryVideoBuilder(data as VideoComponentData);
    } else {
      galleryItem = galleryImageBuilder(data as ImageComponentData);
    }
    const itemPos: number | undefined = fileState?.itemIndex as number | undefined;
    const newComponentData = setItemInGallery(galleryItem, componentData, itemPos);
    return omit(newComponentData, ['loading']);
  }

  createErrorData(
    error: IMessage,
    componentData: ComponentData,
    fileState?: Record<string, string | number>
  ) {
    const galleryItem = { error, type: fileState?.fileType };
    const itemPos: number | undefined = fileState?.itemIndex as number | undefined;
    const newComponentData = setItemInGallery(galleryItem, componentData, itemPos);
    return omit(newComponentData, ['loading']);
  }
}
