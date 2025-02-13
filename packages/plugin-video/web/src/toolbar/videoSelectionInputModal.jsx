import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TextInput, Button, CloseIcon, BUTTON_SIZE } from 'wix-rich-content-ui-components';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import {
  mergeStyles,
  isValidExactUrl,
  MEDIA_POPOVERS_BUTTONS_NAMES_BI,
} from 'wix-rich-content-common';
import styles from '../../statics/styles/video-selection-input-modal.scss';
import ReactPlayer from 'react-player';
import { VIDEO_TYPE } from '../types';
import { handleUploadStart, handleUploadFinished, Uploader } from 'wix-rich-content-plugin-commons';
import { VideoPluginService } from './videoPluginService';

export default class VideoSelectionInputModal extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    const { componentData } = this.props;
    this.state = {
      url: (!componentData.isCustomVideo && componentData.src) || '',
    };
    this.id = `VideoUploadModal_FileInput_${Math.floor(Math.random() * 9999)}`;
    const { onConfirm, onReplace } = props;
    this.blockKey = this.getFocusedBlockKey();
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

  getFocusedBlockKey() {
    return this.props.pubsub.get('focusedBlock');
  }

  onUrlChange = url => this.setState({ url, showError: false });

  onUrlVideoSelection = () => {
    const { componentData, helpers } = this.props;
    const { url = '' } = this.state;
    const src = url.trim();
    if (!(isValidExactUrl(src) && ReactPlayer.canPlay(src))) {
      this.setState({ showError: true });
      return;
    }
    // eslint-disable-next-line fp/no-delete
    delete componentData.isCustomVideo;
    const data = { ...componentData, tempData: false, src };
    this.onConfirm(data);
    helpers?.onPluginsPopOverClick?.({
      pluginId: VIDEO_TYPE,
      buttonName: MEDIA_POPOVERS_BUTTONS_NAMES_BI.embed,
    });
    helpers?.onVideoSelected?.(
      src,
      metadata => setTimeout(() => this.updateComponentData({ ...data, metadata })),
      0
    );
    this.closeModal();
  };

  onUrlInputDoubleClick = () => {
    this.setState({ url: 'https://www.youtube.com/watch?v=vzKryaN44ss' });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
    this.props.helpers.closeModal();
  };

  handleKeyPress = e => {
    if (e.charCode === KEYS_CHARCODE.ENTER) {
      this.onUrlVideoSelection();
    }
  };

  //These two function needed to handle onFocus select for iphone devices
  componentDidMount() {
    this.input.focus();
    this.input.setSelectionRange(0, this.input.value.length);
  }

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

  updateComponentData = data => {
    this.props.pubsub.update('componentData', data, this.blockKey);
  };

  onLocalLoad = ({ src, tempData }) => {
    this.onConfirm({ ...this.props.componentData, src, isCustomVideo: true, tempData });
  };

  getComponentData = () => this.props.componentData;

  handleNativeFileUpload = () => {
    const { uploadService, onConfirm } = this.props;
    if (uploadService) {
      if (onConfirm && !this.blockKey) {
        const { newBlock } = onConfirm({ ...this.props.componentData, isCustomVideo: true });
        this.blockKey = newBlock.key;
      }
      const file = this.inputFile.files[0];
      setTimeout(() =>
        uploadService.uploadFile(
          file,
          this.blockKey || this.props.blockKey,
          this.Uploader,
          VIDEO_TYPE,
          this.VideoPluginService
        )
      );
    } else {
      handleUploadStart(
        this.props,
        this.getComponentData,
        this.inputFile.files[0],
        this.onLocalLoad,
        this.getOnUploadFinished(true)
      );
    }
    this.closeModal();
  };

  render() {
    const { url, showError } = this.state;
    const {
      t,
      handleFileSelection,
      handleFileUpload,
      enableCustomUploadOnMobile,
      isMobile,
      languageDir,
      componentData,
      theme,
    } = this.props;
    const { styles } = this;
    const hasCustomFileUpload = handleFileUpload || handleFileSelection;

    const handleClick = evt => {
      const { helpers } = this.props;
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

    const uploadVideoSection = (
      <div>
        <div className={styles.video_modal_or_upload_video_from}>
          {t('VideoUploadModal_CustomVideoHeader')}
        </div>
        <div className={styles.video_modal_upload_video}>
          <input
            id={this.id}
            type="file"
            accept="video/*"
            className={styles.fileInput}
            ref={node => (this.inputFile = node)}
            onClick={handleClick}
            onChange={this.handleNativeFileUpload}
          />
          <label
            htmlFor={this.id}
            className={styles.fileInputLabel}
            role="button" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
            data-hook="videoUploadModalCustomVideo"
            tabIndex={0}
          >
            + {t('VideoUploadModal_CustomVideoClickText')}
          </label>
        </div>
      </div>
    );
    return (
      <div dir={languageDir}>
        <div
          className={styles[`video_modal_container_${hasCustomFileUpload ? 'big' : 'small'}`]}
          data-hook="videoUploadModal"
        >
          {<CloseIcon className={styles.video_modal_closeIcon} onClick={() => this.closeModal()} />}
          <h2 className={styles.video_modal_add_a_Video}>{t('VideoUploadModal_Title')}</h2>
          <div
            role="heading"
            aria-level={3}
            aria-labelledby="video_modal_hdr"
            className={styles.video_modal_header}
          >
            <h3 id="video_modal_hdr" className={styles.video_modal_header_text}>
              {t('VideoUploadModal_Header')}
            </h3>
          </div>
          <div className={styles.video_modal_input_button_wrapper}>
            <div
              className={
                styles[`video_modal_textInput_${hasCustomFileUpload ? 'customWidth' : 'fullWidth'}`]
              }
            >
              <TextInput
                inputRef={ref => {
                  this.input = ref;
                }}
                type="url"
                onKeyPress={this.handleKeyPress}
                onChange={this.onUrlChange}
                onDoubleClick={this.onUrlInputDoubleClick}
                value={url}
                error={showError ? t('VideoUploadModal_Input_InvalidUrl') : null}
                placeholder={t('VideoUploadModal_Input_Placeholder')}
                theme={styles}
                data-hook="videoUploadModalInput"
              />
            </div>
            <div className={styles.video_modal_add_button_wrapper}>
              <Button
                disabled={!this.state.url}
                theme={{ ...styles, ...theme }}
                dataHook="videoUploadModalAddButton"
                onClick={this.onUrlVideoSelection}
                size={isMobile ? BUTTON_SIZE.medium : BUTTON_SIZE.small}
              >
                {t('VideoUploadModal_AddButtonText')}
              </Button>
            </div>
          </div>
          {(!isMobile || enableCustomUploadOnMobile) && hasCustomFileUpload && uploadVideoSection}
        </div>
      </div>
    );
  }
}

VideoSelectionInputModal.propTypes = {
  onReplace: PropTypes.func,
  onConfirm: PropTypes.func,
  pubsub: PropTypes.object,
  commonPubsub: PropTypes.object,
  helpers: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  url: PropTypes.string,
  theme: PropTypes.object.isRequired,
  doneLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  t: PropTypes.func,
  handleFileSelection: PropTypes.func,
  handleFileUpload: PropTypes.func,
  enableCustomUploadOnMobile: PropTypes.bool,
  isMobile: PropTypes.bool,
  languageDir: PropTypes.string,
  blockKey: PropTypes.string,
  uploadService: PropTypes.func,
  updateService: PropTypes.func,
};
