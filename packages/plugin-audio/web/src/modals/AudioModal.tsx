import React, { useContext } from 'react';
import type { UploadContextType } from 'wix-rich-content-common';
import { UploadServiceContext } from 'wix-rich-content-common';
import AudioInsertModal from './AudioInsertModal';

const AudioModal = props => {
  const {
    helpers: { closeModal },
    pubsub,
    experiments,
    componentData,
  } = props;

  const { uploadService, updateService }: UploadContextType = experiments?.useUploadContext?.enabled
    ? useContext(UploadServiceContext)
    : {};

  const onReplace = audio => {
    const newComponentData = { ...componentData, ...audio };
    pubsub.set('componentData', newComponentData);
  };

  return (
    <AudioInsertModal
      {...props}
      onReplace={onReplace}
      closeModal={closeModal}
      uploadService={uploadService}
      updateService={updateService}
    />
  );
};

export default AudioModal;
