import React, { useContext } from 'react';
import type { UploadContextType } from 'wix-rich-content-common';
import { UploadServiceContext } from 'wix-rich-content-common';
import AudioInsertModal from './AudioInsertModal';

const AudioModal = props => {
  const {
    helpers: { closeModal },
    pubsub,
    experiments,
  } = props;

  const { uploadService, updateService }: UploadContextType = experiments?.useUploadContext?.enabled
    ? useContext(UploadServiceContext)
    : {};

  const onReplace = audio => {
    pubsub.set('componentData', audio);
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
