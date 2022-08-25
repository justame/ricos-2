/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ILocalFileReader,
  IFileUploader,
  INotifier,
  IMediaPluginService,
  IUpdateService,
  IUploadService,
  EventSource,
  PublisherProvider,
} from 'ricos-types';
import type { MediaUploadError } from 'wix-rich-content-common';
import { createUploadEndBIData, createUploadStartBIData } from '../biCallbacks/mediaUploadBI';

export type UploadTopics = [
  'ricos.upload.functionality.uploadStarted',
  'ricos.upload.functionality.uploadFinished'
];

export class UploadService implements IUploadService, EventSource<UploadTopics> {
  streamReader: ILocalFileReader;

  getErrorNotifier!: () => INotifier;

  updateService: IUpdateService;

  getHiddenInputElement!: () => HTMLInputElement;

  onInputChange: ((this: HTMLInputElement, event: any) => any) | null;

  constructor(streamReader: ILocalFileReader, updateService: IUpdateService) {
    this.streamReader = streamReader;
    this.updateService = updateService;
    this.onInputChange = null;
  }

  topicsToPublish: UploadTopics = [
    'ricos.upload.functionality.uploadStarted',
    'ricos.upload.functionality.uploadFinished',
  ];

  publishers!: PublisherProvider<UploadTopics>;

  setErrorNotifier(getErrorNotifer: () => INotifier) {
    this.getErrorNotifier = getErrorNotifer;
  }

  setHiddenInputElement(getHiddenInputElement: () => HTMLInputElement) {
    this.getHiddenInputElement = getHiddenInputElement;
  }

  selectFiles(accept = 'image/*', multiple: boolean, callback: (files: File[]) => void) {
    const hiddenInputElement = this.getHiddenInputElement();
    this.onInputChange && hiddenInputElement.removeEventListener('change', this.onInputChange);
    this.onInputChange = event => {
      const files: File[] = Array.from(event.target.files || []);
      event.target.value = null;
      callback(files);
    };
    hiddenInputElement.addEventListener('change', this.onInputChange, { once: true });
    hiddenInputElement.accept = accept;
    hiddenInputElement.multiple = !!multiple;
    hiddenInputElement.click();
  }

  async uploadFile(
    file: File,
    nodeId: string,
    uploader: IFileUploader,
    type: string,
    MediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) {
    const errorNotifier = this.getErrorNotifier();
    try {
      const url = await this.streamReader.read(file);
      const newFileState = this.updateService.updateLoadingState(
        url,
        file,
        nodeId,
        type,
        MediaPluginService,
        fileState
      );
      const uploadStartBiData = createUploadStartBIData(type, file.size, file.type);
      this.publishers
        .byTopic('ricos.upload.functionality.uploadStarted')
        .publish(uploadStartBiData);
      let error: MediaUploadError | undefined;
      try {
        const uploadedFile = await uploader.upload(file);
        this.updateService.updatePluginData(
          uploadedFile,
          nodeId,
          type,
          MediaPluginService,
          newFileState
        );
        this.streamReader.free(url as string);
      } catch (e) {
        error = e;
        errorNotifier.notify(e);
        this.updateService.updateErrorState(e, nodeId, type, MediaPluginService, newFileState);
      } finally {
        const uploadFinishedBiData = createUploadEndBIData(uploadStartBiData, error);
        this.publishers
          .byTopic('ricos.upload.functionality.uploadFinished')
          .publish(uploadFinishedBiData);
      }
    } catch (e) {
      errorNotifier.notify({ msg: 'Failed reading file locally' });
    }
  }
}
