import type { IMediaPluginService, UploadedData, IMessage } from 'ricos-types';
import { omit } from 'lodash';
import type { ComponentData, AudioComponentData } from 'wix-rich-content-common';

export class AudioPluginService implements IMediaPluginService {
  createLoadingData(file: File, url: unknown, componentData: ComponentData) {
    const isCoverImageData = file.type.includes('image');
    if (isCoverImageData) return { componentData };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { html, ...rest } = componentData;
    return {
      componentData: {
        ...rest,
        audio: { src: { id: url } },
        name: file.name.split('.')[0],
      },
      componentState: {
        tempData: true,
        loading: true,
      },
    };
  }

  createPluginData(uploadedData: UploadedData, componentData: ComponentData) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { html, tempData, loading, ...rest } = componentData;
    const data = uploadedData.data as AudioComponentData & {
      file_name: string;
    };

    const isCoverImageData = data?.file_name;
    const name = data?.name ?? componentData?.name;
    const authorName = data?.authorName ?? componentData?.authorName;
    const audio = data?.audio ?? componentData?.audio;
    const coverImage = isCoverImageData ? data : undefined;

    return {
      ...rest,
      audio,
      name,
      authorName,
      coverImage,
    };
  }

  createErrorData(error: IMessage, componentData: ComponentData) {
    return {
      ...omit(componentData, ['tempData']),
      error,
    };
  }
}
