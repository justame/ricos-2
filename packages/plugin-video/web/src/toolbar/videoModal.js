import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import VideoSelectionInputModal from './videoSelectionInputModal';
import MediaURLInputModal from './mediaURLInputModal';
import NewVideoModal from './NewVideoModal';
import { mediaTypes } from '../types';
import { UploadContext } from 'ricos-context';

const VideoModal = props => {
  const {
    componentData: { type },
    experiments,
  } = props;

  const { uploadService, updateService } = experiments?.tiptapEditor?.enabled
    ? useContext(UploadContext)
    : {};

  const useNewModal = experiments?.newVideoVerticalAndSocialModals?.enabled;
  const oldVideoModal = mediaTypes.includes(type) ? MediaURLInputModal : VideoSelectionInputModal;
  const Component = useNewModal ? NewVideoModal : oldVideoModal;

  return <Component {...props} uploadService={uploadService} updateService={updateService} />;
};

export default VideoModal;

VideoModal.propTypes = {
  componentData: PropTypes.object,
  experiments: PropTypes.object,
};
