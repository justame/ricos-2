import React, { useContext } from 'react';
import type { UploadContextType } from 'wix-rich-content-common';
import AudioInsertModal from './AudioInsertModal';
import { UploadContext } from 'ricos-context';

const AudioModal = props => {
  const {
    helpers: { closeModal },
    pubsub,
    experiments,
  } = props;

  const { uploadService, updateService }: UploadContextType = experiments?.tiptapEditor?.enabled
    ? useContext(UploadContext)
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
