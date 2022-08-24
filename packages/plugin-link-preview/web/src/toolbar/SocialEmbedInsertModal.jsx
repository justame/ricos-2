import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UrlInputModal, NewUrlInputModal, BUTTON_SIZE } from 'wix-rich-content-ui-components';
import { DEFAULTS } from '../defaults';
import { LINK_PREVIEW_TYPE } from '../types';
import { MEDIA_POPOVERS_BUTTONS_NAMES_BI } from 'wix-rich-content-common';

export default class SocialEmbedInsertModal extends Component {
  constructor(props) {
    super(props);
    const { componentData } = this.props;
    this.state = {
      url: componentData?.config?.link?.url || '',
      submittedInvalidUrl: false,
    };
  }

  onConfirm = () => {
    const { url } = this.state;
    const { componentData, onConfirm, helpers, fetchData, closeModal } = this.props;
    helpers?.onPluginsPopOverClick?.({
      pluginId: LINK_PREVIEW_TYPE,
      buttonName: MEDIA_POPOVERS_BUTTONS_NAMES_BI.embed,
    });
    if (url) {
      fetchData(url).then(({ html }) => {
        if (!html) {
          this.setState({ submittedInvalidUrl: true });
        } else {
          const { config } = DEFAULTS;
          onConfirm({
            ...componentData,
            html,
            config: {
              ...config,
              width: 350,
              link: { ...config.link, url },
            },
          });

          closeModal?.();
        }
      });
    }
  };

  onCloseRequested = () => {
    const { helpers, closeModal } = this.props;
    helpers?.onPluginsPopOverClick?.({
      pluginId: LINK_PREVIEW_TYPE,
      buttonName: MEDIA_POPOVERS_BUTTONS_NAMES_BI.cancel,
    });
    closeModal?.();
  };

  render() {
    const { url, submittedInvalidUrl } = this.state;
    const { t, languageDir, socialType, helpers, isMobile, experiments } = this.props;
    const useNewModal =
      experiments?.tiptapEditor?.enabled || experiments?.newVideoVerticalAndSocialModals?.enabled;
    const UrlInputModalComponent = useNewModal ? NewUrlInputModal : UrlInputModal;

    return (
      <UrlInputModalComponent
        onConfirm={this.onConfirm}
        helpers={helpers}
        input={url}
        t={t}
        languageDir={languageDir}
        title={t(`EmbedURL_Social_${socialType}_Title`)}
        saveLabel={t('Embed_Add_Button_Label')}
        submittedInvalidUrl={submittedInvalidUrl}
        dataHook={'socialEmbedUploadModal'}
        onInputChange={url => this.setState({ url })}
        errorMessage={t('SoundCloudUploadModal_Input_InvalidUrl')}
        placeholder={t(`EmbedURL_Social_${socialType}_Placeholder`)}
        onCloseRequested={this.onCloseRequested}
        buttonSize={BUTTON_SIZE.medium}
        isMobile={isMobile}
        withMobileSaveButton
      />
    );
  }
}

SocialEmbedInsertModal.propTypes = {
  helpers: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  t: PropTypes.func,
  languageDir: PropTypes.string,
  fetchData: PropTypes.func,
  socialType: PropTypes.string,
  isMobile: PropTypes.bool,
  experiments: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  closeModal: PropTypes.func,
};
