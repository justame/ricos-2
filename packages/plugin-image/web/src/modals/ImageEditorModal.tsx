/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext } from 'react';
import type { FC } from 'react';
import { ModalContext, UploadContext } from 'ricos-context';
import { IMAGE_TYPE } from '../types';
import type { ImageEditorWixSettings } from '../types';
import { imageModals } from '../consts';
import type { ImagePluginService } from '../toolbar/imagePluginService';
import { Uploader } from 'wix-rich-content-plugin-commons';
import { setupImageEditor } from '../imageStudio/image-editor-logic';

interface Props {
  nodeId: string;
  src: string;
  imagePluginService: ImagePluginService;
  handleFileUpload;
  imageEditorWixSettings: ImageEditorWixSettings;
  onImageEditorOpen?: () => void;
}

const ImageEditorModal: FC<Props> = ({
  nodeId,
  imagePluginService,
  handleFileUpload,
  imageEditorWixSettings,
  onImageEditorOpen,
  src,
}) => {
  const uploader = new Uploader(handleFileUpload);
  const modalService = useContext(ModalContext) || {};
  const uploadContext = useContext(UploadContext) || {};

  const onClose = () => {
    modalService.closeModal(imageModals.imageEditor);
  };

  const onSave = (file: File) => {
    uploadContext.uploadService?.uploadFile(file, nodeId, uploader, IMAGE_TYPE, imagePluginService);
    onClose();
  };

  onImageEditorOpen && onImageEditorOpen();

  const id = 'imageEditor';
  setupImageEditor(imageEditorWixSettings, id, src, onSave, onClose);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <div id={id} nofocus="true" />;
};

export default ImageEditorModal;
