/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ILocalFileReader,
  IFileUploader,
  INotifier,
  IMediaPluginService,
  IUpdateService,
  IUploadService,
  IUploadObserver,
} from 'ricos-types';

export class UploadService implements IUploadService {
  streamReader: ILocalFileReader;

  getErrorNotifier!: () => INotifier;

  updateService: IUpdateService;

  getHiddenInputElement!: () => HTMLInputElement;

  onInputChange: ((this: HTMLInputElement, event: any) => any) | null;

  BICallbacks?: {
    onMediaUploadStart?: any;
    onMediaUploadEnd?: any;
  };

  uploadObserver?: IUploadObserver;

  constructor(
    streamReader: ILocalFileReader,
    updateService: IUpdateService,
    BICallbacks?: {
      onMediaUploadStart?: any;
      onMediaUploadEnd?: any;
    },
    uploadObserver?: IUploadObserver
  ) {
    this.streamReader = streamReader;
    this.updateService = updateService;
    this.onInputChange = null;
    this.BICallbacks = BICallbacks;
    this.uploadObserver = uploadObserver;
  }

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
    this.uploadObserver?.update({ key: 0 });
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
      const uploadBIData = this.BICallbacks?.onMediaUploadStart?.(type, file.size, file.type);
      let error = null;
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
        this.BICallbacks?.onMediaUploadEnd?.(uploadBIData, error);
      }
    } catch (e) {
      errorNotifier.notify({ msg: 'Failed reading file locally' });
    }
    this.uploadObserver?.update({ key: 1 });
  }
}
