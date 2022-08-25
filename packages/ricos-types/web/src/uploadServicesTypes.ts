/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EditorCommands } from '.';
import type {
  ComponentData,
  ImageComponentData,
  VideoComponentData,
  FileComponentData,
  MediaUploadError,
} from 'ricos-content';

export interface ILocalFileReader {
  read: (file: File) => Promise<unknown>;
  free: (url: string) => void;
}

export enum MediaUploadProgressKey {
  STARTED,
  FINISHED,
}

export type IMessage = MediaUploadError;

export type IUploadProgessMessage = { key: MediaUploadProgressKey };

export interface INotifier {
  notify: (message: IMessage) => void;
}

export type UploadedData = {
  data?: ImageComponentData | VideoComponentData | FileComponentData;
  error?: IMessage;
};

export interface IFileUploader {
  upload: (file: File) => Promise<UploadedData>;
}

export interface MediaPluginLocalLoadedData {
  componentData: ComponentData;
  fileState?: Record<string, string | number>;
  componentState?: {
    loading?: boolean;
    tempData?: any;
  };
}

export interface IMediaPluginService {
  createLoadingData: (
    file: File,
    url: unknown,
    componentData: ComponentData,
    fileState?: Record<string, string | number>
  ) => MediaPluginLocalLoadedData;
  createPluginData: (
    uploadedData: UploadedData,
    componentData: ComponentData,
    fileState?: Record<string, string | number>
  ) => ComponentData;
  createErrorData: (
    error: IMessage,
    componentData: ComponentData,
    fileState?: Record<string, string | number>
  ) => ComponentData;
}

export interface IUpdateService {
  EditorCommands?: EditorCommands;

  setEditorCommands: (editorCommands: EditorCommands) => void;

  updatePluginData: (
    uploadedData: UploadedData,
    nodeId: string,
    type: string,
    mediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) => void;

  updateLoadingState: (
    url: unknown,
    file: File,
    nodeId: string,
    type: string,
    mediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) => Record<string, string | number> | undefined;

  updateErrorState: (
    error: IMessage,
    nodeId: string,
    type: string,
    mediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) => void;
}

export interface IUploadService {
  streamReader: ILocalFileReader;

  getErrorNotifier: () => INotifier;

  updateService: IUpdateService;

  getHiddenInputElement: () => HTMLInputElement;

  onInputChange: ((this: HTMLInputElement, event: any) => any) | null;

  setErrorNotifier: (getErrorNotifier: () => INotifier) => void;

  setHiddenInputElement: (getHiddenInputElement: () => HTMLInputElement) => void;

  selectFiles: (accept: string, multiple: boolean, callback: (files: File[]) => void) => void;

  uploadFile: (
    file: File,
    nodeId: string,
    uploader: IFileUploader,
    type: string,
    MediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) => void;
}

export type UploadContextType = {
  updateService?: IUpdateService;
  uploadService?: IUploadService;
};
