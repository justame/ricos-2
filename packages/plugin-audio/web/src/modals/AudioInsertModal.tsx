import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import classNames from 'classnames';
import { Tab, Tabs, SettingsMobileHeader } from 'wix-rich-content-ui-components';
import AudioUploadModal from './AudioUploadModal';
import MediaURLInputModal from './MediaURLInputModal';
import type {
  AvailableExperiments,
  ComponentData,
  Helpers,
  IUpdateService,
  IUploadService,
  Pubsub,
  RicosTheme,
  TextDirection,
  TranslationFunction,
} from 'wix-rich-content-common';
import {
  MEDIA_POPOVERS_BUTTONS_NAMES_BI,
  MEDIA_POPOVERS_TABS_NAMES_BI,
} from 'wix-rich-content-common';
import { AUDIO_TYPE } from '../types';
import styles from '../../statics/styles/audio-modal.scss';

interface Props {
  componentData: ComponentData;
  closeModal: () => void;
  t: TranslationFunction;
  theme: RicosTheme;
  isMobile: boolean;
  embedType: boolean;
  onConfirm?: (data?: ComponentData) => void;
  onReplace?: (data?: ComponentData) => void;
  languageDir?: TextDirection;
  setData?: (data) => void;
  pubsub?: Pubsub;
  experiments?: AvailableExperiments;
  helpers?: Helpers;
  handleFileSelection: (updateEntity) => void;
  handleFileUpload: (files, updateEntity) => void;
  fetchData: (url: string) => Promise<unknown>;
  uploadService?: IUploadService;
  updateService?: IUpdateService;
}

const AudioInsertModal: React.FC<Props> = props => {
  const {
    componentData = {},
    closeModal,
    t,
    theme,
    isMobile,
    embedType = false,
    onConfirm,
    setData,
    pubsub,
    languageDir,
    experiments,
    onReplace,
    helpers = {},
  } = props;
  const src = componentData?.audio?.src;
  const audioTabs = { embed: t('MediaModal_Tabs_Embed'), upload: t('MediaModal_Tabs_Upload') };
  const initialUrl = src?.url || '';
  const isEmbedType = embedType || src?.url;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState(isEmbedType ? audioTabs.embed : audioTabs.upload);
  const [url, setUrl] = useState(initialUrl);
  const [submittedInvalidUrl, setSubmittedInvalidUrl] = useState(false);
  const modalsWithEditorCommands = experiments?.tiptapEditor?.enabled;
  const { onPluginsPopOverTabSwitch, onPluginsPopOverClick, onAudioSelected } = helpers || {};
  const onTabSelected = tab => {
    onPluginsPopOverTabSwitch?.({
      pluginId: AUDIO_TYPE,
      buttonName: MEDIA_POPOVERS_TABS_NAMES_BI[tab.toLowerCase()],
    });
    setActiveTab(tab);
  };

  const onUrlInputDoubleClick = () =>
    setUrl(
      'https://soundcloud.com/kotathefriend/smile?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'
    );

  const onEmbedClick = () => {
    onPluginsPopOverClick?.({
      pluginId: AUDIO_TYPE,
      buttonName: MEDIA_POPOVERS_BUTTONS_NAMES_BI.embed,
    });
    if (url && ReactPlayer.canPlay(url)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { audio, name, coverImage, authorName, disableDownload, html, ...rest } = componentData;
      const { onConfirm } = props;
      if (onConfirm) {
        onConfirm({ ...rest, audio: { src: { url } } });
      }
      if (onReplace) {
        onReplace({ ...rest, audio: { src: { url } } });
      } else {
        modalsWithEditorCommands
          ? setData?.({ ...rest, audio: { src: { url } } })
          : pubsub?.set('componentData', { ...rest, audio: { src: { url } } });
      }
      closeModal?.();
    } else {
      onSpotifyEmbed(url);
    }
  };

  const onSpotifyEmbed = url => {
    const { fetchData } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { audio, name, coverImage, authorName, disableDownload, ...rest } = componentData;
    if (url) {
      fetchData(url).then(({ html }) => {
        if (!html) {
          setSubmittedInvalidUrl(true);
        } else {
          if (onConfirm) {
            onConfirm({ ...rest, audio: { src: { url } }, html });
          }
          if (onReplace) {
            onReplace({ ...rest, audio: { src: { url } }, html });
          } else {
            modalsWithEditorCommands
              ? setData?.({ ...rest, audio: { src: { url } }, html })
              : pubsub?.set('componentData', { ...rest, audio: { src: { url } }, html });
          }
          closeModal?.();
        }
      });
    }
  };

  return (
    <div
      className={classNames(styles.audio_modal_container, {
        [styles.audio_modal_mobile]: isMobile,
      })}
    >
      <div className={styles.audio_modal_content}>
        {isMobile && (
          <SettingsMobileHeader
            theme={theme}
            onSave={onConfirm ? onConfirm : closeModal}
            onCancel={() => closeModal()}
            t={t}
            title={t('AudioPlugin_Settings_Header')}
            useNewSettingsUi
            showSaveBtn={false}
          />
        )}
        <Tabs
          value={activeTab}
          onTabSelected={onTabSelected}
          headersStyle={isMobile ? styles.audio_tabs_headers : undefined}
          theme={theme}
        >
          <Tab label={audioTabs.upload} value={audioTabs.upload} theme={theme}>
            <div className={classNames(styles.audio_modal_tab, styles.audio_upload_tab)}>
              <AudioUploadModal {...props} />
            </div>
          </Tab>
          <Tab label={audioTabs.embed} value={audioTabs.embed} theme={theme}>
            <div className={styles.audio_modal_tab}>
              <MediaURLInputModal
                {...props}
                onConfirm={onEmbedClick}
                url={url}
                setUrl={setUrl}
                languageDir={languageDir}
                submittedInvalidUrl={submittedInvalidUrl}
                withMobileHeader={false}
                dataHook="audioModalEmbedInput"
                saveLabel={t('AudioModal_Embed_ButtonText')}
                subTitle={t('AudioModal_Embed_Title')}
                onDoubleClick={onUrlInputDoubleClick}
                helpers={helpers}
                t={t}
                isMobile={isMobile}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AudioInsertModal;
