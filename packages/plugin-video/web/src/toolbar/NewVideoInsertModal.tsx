import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import classNames from 'classnames';
import { Tab, Tabs, SettingsMobileHeader } from 'wix-rich-content-ui-components';
import {
  MEDIA_POPOVERS_BUTTONS_NAMES_BI,
  MEDIA_POPOVERS_TABS_NAMES_BI,
} from 'wix-rich-content-common';
import VideoUploadModal from './videoUploadModal';
import NewMediaURLInputModal from './NewMediaUrlInputModal';
import { videoButtonsTypes, VIDEO_TYPE } from '../types';
import styles from '../../statics/styles/video-modal.scss';

const VideoInsertModal = props => {
  const {
    componentData: { isCustomVideo, src, type },
    helpers,
    t,
    theme,
    isMobile,
    closeModal,
  } = props;

  const videoTabs = { embed: t('VideoModal_Tabs_Embed'), upload: t('VideoModal_Tabs_Upload') };
  const initialUrl = isCustomVideo ? '' : src || '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState(isCustomVideo ? videoTabs.upload : videoTabs.embed);
  const [url, setUrl] = useState(initialUrl);
  const [submittedInvalidUrl, setSubmittedInvalidUrl] = useState(false);
  const isSoundCloud = type === videoButtonsTypes.soundCloud;
  const getTabsBiButtonName = tab =>
    tab === videoTabs.embed
      ? MEDIA_POPOVERS_TABS_NAMES_BI.embed
      : MEDIA_POPOVERS_TABS_NAMES_BI.upload;

  const { onPluginsPopOverTabSwitch, onPluginsPopOverClick } = helpers || {};

  const onTabSelected = tab => {
    activeTab !== tab &&
      onPluginsPopOverTabSwitch?.({
        pluginId: VIDEO_TYPE,
        buttonName: getTabsBiButtonName(tab),
      });
    setActiveTab(tab);
  };
  const onUrlInputDoubleClick = () => setUrl('https://www.youtube.com/watch?v=ZVmHVzwOWro');

  const onConfirm = () => {
    onPluginsPopOverClick?.({
      pluginId: VIDEO_TYPE,
      buttonName: MEDIA_POPOVERS_BUTTONS_NAMES_BI.embed,
    });
    if (url && ReactPlayer.canPlay(url)) {
      const { componentData, helpers, onConfirm, onReplace } = props;
      if (onConfirm) {
        onConfirm({ ...componentData, src: url, isCustomVideo: false });
      } else {
        onReplace({ src: url, isCustomVideo: false });
      }

      if (helpers && helpers.onVideoSelected) {
        helpers.onVideoSelected(url, data => onReplace({ metadata: { ...data } }));
      }

      closeModal?.();
    } else {
      setSubmittedInvalidUrl(true);
    }
  };

  const dataHook = isSoundCloud ? 'soundCloudUploadModal' : 'videoMediaUrlModal';

  const title = isSoundCloud
    ? isMobile
      ? t('SoundCloudUploadModal_Header_Mobile')
      : t('SoundCloudUploadModal_Header')
    : null;

  const renderMediaUrlInputModal = () => {
    return (
      <NewMediaURLInputModal
        {...props}
        onConfirm={onConfirm}
        url={url}
        setUrl={setUrl}
        submittedInvalidUrl={submittedInvalidUrl}
        withMobileHeader={isSoundCloud}
        dataHook={dataHook}
        title={isSoundCloud && title}
        saveLabel={isSoundCloud ? t('Embed_Add_Button_Label') : t('VideoModal_Embed_ButtonText')}
        subTitle={!isSoundCloud && t('VideoModal_Embed_Title')}
        onDoubleClick={onUrlInputDoubleClick}
      />
    );
  };

  return isSoundCloud ? (
    renderMediaUrlInputModal()
  ) : (
    <div
      className={classNames(styles.video_modal_container, {
        [styles.video_modal_mobile]: isMobile,
      })}
    >
      <div className={styles.video_modal_content}>
        {isMobile && (
          <SettingsMobileHeader
            theme={theme}
            onSave={onConfirm}
            onCancel={closeModal}
            t={t}
            title={t('VideoModal_MobileHeader')}
            useNewSettingsUi
            showSaveBtn={false}
          />
        )}
        <Tabs
          value={activeTab}
          onTabSelected={onTabSelected}
          className={styles.video_modal_tabs_header}
          theme={theme}
          headersStyle={isMobile && styles.video_tabs_headers}
        >
          <Tab label={videoTabs.embed} value={videoTabs.embed} theme={theme}>
            <div className={styles.video_modal_tab}>{renderMediaUrlInputModal()}</div>
          </Tab>
          <Tab label={videoTabs.upload} value={videoTabs.upload} theme={theme}>
            <div className={classNames(styles.video_modal_tab, styles.video_upload_tab)}>
              <VideoUploadModal {...props} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoInsertModal;
