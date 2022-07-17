import React, { useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import { getImageSrc } from 'wix-rich-content-common/libs/imageUtils';
import { SETTINGS_IMG_SIZE, AUDIO_BI_VALUES, AUDIO_ACTION_NAMES, AUDIO_TYPES } from '../consts';
import { AUDIO_TYPE } from '../types';
import {
  LabeledToggle,
  SettingsSection,
  SettingsPanelHeader,
  SettingsMobileHeader,
  SettingsSeparator,
  SettingsAddItem,
  InputWithLabel,
  Label,
  SettingsPanelFooter,
} from 'wix-rich-content-ui-components';
import Styles from '../../statics/styles/audio-settings.scss';
import { Uploader } from 'wix-rich-content-plugin-commons';
import type { UploadContextType } from 'wix-rich-content-common';
import { AudioPluginService as audioPluginService } from '../toolbar/audioPluginService';
import { UploadContext } from 'ricos-context';

const AudioSettings = ({
  onCancel,
  updateData,
  componentData,
  helpers,
  pubsub,
  theme,
  t,
  isMobile,
  experiments,
  blockKey,
  getComponentData,
}) => {
  const useUploadService = !!experiments?.tiptapEditor?.enabled;
  const { uploadService }: UploadContextType = useUploadService ? useContext(UploadContext) : {};
  const styles = mergeStyles({ styles: Styles, theme });
  const initialState = {
    name: componentData?.name,
    authorName: componentData?.authorName,
    disableDownload: componentData?.disableDownload,
    coverImage: componentData?.coverImage,
  };
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(!initialState.disableDownload);
  const [coverImage, setCoverImage] = useState(initialState?.coverImage || null);
  const [name, setName] = useState(initialState.name || '');
  const [authorName, setAuthorName] = useState(initialState.authorName || '');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const modalsWithEditorCommands = experiments?.tiptapEditor?.enabled;

  const onDownlandToggle = () => {
    setIsDownloadEnabled(!isDownloadEnabled);
    const toggleBIValue = isDownloadEnabled ? AUDIO_BI_VALUES.NO : AUDIO_BI_VALUES.YES;
    helpers?.onChangePluginSettings({
      pluginId: AUDIO_TYPE,
      actionName: AUDIO_ACTION_NAMES.downloadAudio,
      value: toggleBIValue,
    });
  };

  const onInputBlur = (actionName, value) => {
    helpers?.onChangePluginSettings({
      pluginId: AUDIO_TYPE,
      actionName,
      value,
    });
  };

  const AudioPluginService = new audioPluginService();

  const handleFilesAdded = args => {
    const img = args.data[0] || args.data;
    setCoverImage(img);
    setIsLoadingImage(false);
    helpers?.onChangePluginSettings({
      pluginId: AUDIO_TYPE,
      actionName: AUDIO_ACTION_NAMES.changeCover,
      value: AUDIO_BI_VALUES.YES,
    });
  };

  const handleFileSelection = () => {
    const deleteBlock = pubsub.get('deleteBlock');
    helpers.handleFileSelection(undefined, false, handleFilesAdded, deleteBlock, componentData);
  };

  const handleFileChange = async ([file]) => {
    if (uploadService) {
      const uploader = new Uploader(helpers?.handleFileUpload);
      setIsLoadingImage(true);
      await uploadService.uploadFile(file, blockKey, uploader, AUDIO_TYPE, AudioPluginService);
      setCoverImage(getComponentData().coverImage);
      setIsLoadingImage(false);
    } else {
      setIsLoadingImage(true);
      helpers.handleFileUpload(file, handleFilesAdded);
    }
  };

  const handleClose = () => {
    const onClose = () => {
      pubsub.update('componentData', {
        ...componentData,
        name: initialState.name,
        authorName: initialState.authorName,
        disableDownload: initialState.disableDownload,
        coverImage: initialState.coverImage,
      });
      helpers.closeModal();
    };
    return modalsWithEditorCommands ? onCancel() : onClose();
  };

  const handleCoverImageDelete = () => {
    setCoverImage(null);
    helpers?.onChangePluginSettings({
      pluginId: AUDIO_TYPE,
      actionName: AUDIO_ACTION_NAMES.changeCover,
      value: AUDIO_BI_VALUES.NO,
    });
  };

  const inputsData = [
    {
      label: t('AudioPlugin_Settings_AudioName_Label'),
      value: name,
      onChange: value => setName(value),
      dataHook: 'audioSettingsAudioNameInput',
      placeholder: t('AudioPlugin_Settings_AudioName_Label_Placeholder'),
      onBlur: e => onInputBlur(AUDIO_ACTION_NAMES.changeTitle, e.target.value),
    },
    {
      label: t('AudioPlugin_Settings_AuthorName_Label'),
      value: authorName,
      onChange: value => setAuthorName(value),
      dataHook: 'audioSettingsAuthorNameInput',
      placeholder: t('AudioPlugin_Settings_AuthorName_Label_Placeholder'),
      onBlur: e => onInputBlur(AUDIO_ACTION_NAMES.changeCreator, e.target.value),
    },
  ];

  const renderInputs = () =>
    inputsData.map(props => <InputWithLabel key={props.dataHook} theme={theme} {...props} />);

  const renderHeader = () =>
    isMobile ? (
      <SettingsMobileHeader
        t={t}
        theme={theme}
        title={t('AudioPlugin_Settings_Header')}
        onCancel={handleClose}
        onSave={helpers.closeModal}
        useNewSettingsUi
      />
    ) : (
      <SettingsPanelHeader title={t('AudioPlugin_Settings_Header')} onClose={handleClose} />
    );

  const imgSrc =
    coverImage &&
    getImageSrc(coverImage, helpers?.getImageUrl, {
      requiredWidth: 120,
      requiredHeight: 120,
      requiredQuality: 70,
    });

  useEffect(() => {
    modalsWithEditorCommands
      ? updateData({
          ...componentData,
          name,
          authorName,
          disableDownload: !isDownloadEnabled,
          coverImage,
        })
      : pubsub.update('componentData', {
          ...componentData,
          name,
          authorName,
          disableDownload: !isDownloadEnabled,
          coverImage,
        });
    return () => {
      const { duration, src } = componentData.audio;
      helpers?.mediaPluginsDetails?.({
        pluginId: AUDIO_TYPE,
        creator: authorName,
        title: name,
        track_duration: duration?.toString(),
        type: AUDIO_TYPES.custom,
        url: src.id,
      });
    };
  }, [name, authorName, isDownloadEnabled, coverImage]);

  return (
    <div>
      <div
        data-hook="audioSettings"
        className={classNames(styles.audio_settings, {
          [styles.audio_settings_mobile]: isMobile,
        })}
      >
        <div className={styles.audio_settings_wrapper}>
          <SettingsSection
            theme={theme}
            className={classNames(styles.audio_settings_inputs_wrapper)}
          >
            {renderInputs()}
          </SettingsSection>

          <SettingsSection theme={theme}>
            <Label label={t('AudioPlugin_Settings_CoverImage_Label')} />
            <div className={styles.audio_settings_coverImage_wrapper}>
              <SettingsAddItem
                handleFileChange={handleFileChange}
                handleFileSelection={helpers.handleFileSelection && handleFileSelection}
                isMobile={isMobile}
                uploadMediaLabel={t('AudioPlugin_Settings_CoverImage_Label')}
                theme={theme}
                dataHook="audioCoverImage"
                inlineStyle={{ width: SETTINGS_IMG_SIZE, height: SETTINGS_IMG_SIZE, marginLeft: 0 }}
                src={imgSrc}
                handleDelete={handleCoverImageDelete}
                t={t}
                alt={name}
                hasReplace={useUploadService}
                isLoading={isLoadingImage}
              />
            </div>
          </SettingsSection>

          <SettingsSeparator top />

          <SettingsSection
            theme={theme}
            className={classNames(styles.audio_settings_toggle_wrapper)}
          >
            <LabeledToggle
              theme={theme}
              checked={isDownloadEnabled}
              label={t('AudioPlugin_Settings_AudioCanBeDownloaded_Label')}
              onChange={onDownlandToggle}
              tooltipText={t('AudioPlugin_Settings_AudioCanBeDownloaded_Tooltip')}
              dataHook="AudioDownloadToggle"
              isMobile={isMobile}
            />
          </SettingsSection>
          {isMobile && (
            <div className={classNames(styles.audio_settings_download_label)}>
              {t('AudioPlugin_Settings_AudioCanBeDownloaded_Tooltip')}
            </div>
          )}
        </div>
        {renderHeader()}
      </div>
      {!isMobile && (
        <SettingsPanelFooter
          fixed
          theme={theme}
          cancel={handleClose}
          save={helpers.closeModal}
          t={t}
        />
      )}
    </div>
  );
};

export default AudioSettings;
