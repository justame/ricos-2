import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { VIDEO_TYPE } from '../types';
import { handleUploadStart, handleUploadFinished, Uploader } from 'wix-rich-content-plugin-commons';
import { MediaUploadModal } from 'wix-rich-content-ui-components';
import { MEDIA_POPOVERS_BUTTONS_NAMES_BI } from 'wix-rich-content-common';
import { VideoPluginService } from './videoPluginService';
export default class VideoUploadModal extends Component {
  constructor(props) {
    super(props);
    const { componentData } = props;
    this.state = {
      url: (!componentData.isCustomVideo && componentData.src) || '',
    };
    this.id = `VideoUploadModal_FileInput_${Math.floor(Math.random() * 9999)}`;
    const { onConfirm, onReplace } = props;
    this.onConfirm = obj => {
      if (onConfirm) {
        const { newBlock } = onConfirm(obj);
        this.blockKey = newBlock.key;
      } else {
        onReplace(obj, this.blockKey);
      }
    };
    this.VideoPluginService = new VideoPluginService();
    this.Uploader = new Uploader(props.handleFileUpload);
    this.uploadContextOnConfirm = (data, isCustomVideo) => {
      if (onConfirm) {
        const componentData = this.VideoPluginService.createPluginData(
          { data },
          this.props.componentData
        );
        const { newBlock } = onConfirm({ ...componentData, isCustomVideo });
        this.blockKey = newBlock.key;
      } else {
        this.props.updateService.updatePluginData(
          { data },
          this.blockKey || this.props.blockKey,
          VIDEO_TYPE,
          this.VideoPluginService
        );
      }
    };
  }

  closeModal = () => {
    this.props.closeModal();
  };

  getOnUploadFinished = isCustomVideo => {
    return ({ data, error }) => {
      this.setComponentData({ ...data, error, isCustomVideo });
    };
  };

  addVideoComponent = ({ data, error }, isCustomVideo = false) => {
    const { uploadService } = this.props;
    if (uploadService) {
      this.uploadContextOnConfirm(data);
    } else {
      handleUploadFinished(VIDEO_TYPE, this.getComponentData, data, error, ({ data, error }) =>
        this.onConfirm({ ...data, error, isCustomVideo })
      );
    }
  };

  setComponentData = data => {
    this.props.pubsub.set('componentData', data, this.blockKey);
  };

  onLocalLoad = ({ src, tempData }) => {
    this.onConfirm({ ...this.props.componentData, src, isCustomVideo: true, tempData });
  };

  getComponentData = () => this.props.componentData;

  handleNativeFileUpload = file => {
    const { uploadService, onConfirm } = this.props;
    if (uploadService) {
      if (onConfirm && !this.blockKey) {
        const { newBlock } = onConfirm({ ...this.props.componentData, isCustomVideo: true });
        this.blockKey = newBlock.key;
      }
      setTimeout(
        () =>
          uploadService.uploadFile(
            file,
            this.blockKey || this.props.blockKey,
            this.Uploader,
            VIDEO_TYPE,
            this.VideoPluginService
          ),
        50
      );
    } else {
      handleUploadStart(
        this.props,
        this.getComponentData,
        file,
        this.onLocalLoad,
        this.getOnUploadFinished(true)
      );
    }
    this.closeModal();
  };

  render() {
    const {
      t,
      handleFileSelection,
      handleFileUpload,
      enableCustomUploadOnMobile,
      isMobile,
      languageDir,
      helpers,
    } = this.props;

    const hasCustomFileUpload = handleFileUpload || handleFileSelection;
    const showUploadSection = (!isMobile || enableCustomUploadOnMobile) && hasCustomFileUpload;

    const handleClick = evt => {
      helpers?.onPluginsPopOverClick?.({
        pluginId: VIDEO_TYPE,
        buttonName: MEDIA_POPOVERS_BUTTONS_NAMES_BI.upload,
      });
      if (handleFileSelection) {
        evt.preventDefault();
        return handleFileSelection(({ data, error }) => {
          this.addVideoComponent({ data, error }, true);
          this.closeModal();
        });
      }
    };

    return (
      <MediaUploadModal
        id={this.id}
        isMobile={isMobile}
        handleClick={handleClick}
        handleChange={this.handleNativeFileUpload}
        languageDir={languageDir}
        title={t('VideoCustomUploadModal_Title')}
        labelText={t('VideoUploadModal_CustomVideoClickText')}
        dataHook="videoUploadModalCustomVideo"
        showUploadSection={showUploadSection}
        accept="video/*"
      />
    );
  }
}

VideoUploadModal.propTypes = {
  onReplace: PropTypes.func,
  onConfirm: PropTypes.func,
  pubsub: PropTypes.object,
  helpers: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  url: PropTypes.string,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  handleFileSelection: PropTypes.func,
  handleFileUpload: PropTypes.func,
  enableCustomUploadOnMobile: PropTypes.bool,
  isMobile: PropTypes.bool,
  languageDir: PropTypes.string,
  blockKey: PropTypes.string,
  uploadService: PropTypes.func,
  updateService: PropTypes.func,
  closeModal: PropTypes.func,
};
