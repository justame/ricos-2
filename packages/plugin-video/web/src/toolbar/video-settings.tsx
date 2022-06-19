import React, { useState } from 'react';
import type { VideoSettingsProps } from '../types';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import Styles from '../../statics/styles/video-settings.scss';
import {
  LabeledToggle,
  SettingsSection,
  SettingsPanelFooter,
  SettingsPanelHeader,
  SettingsMobileHeader,
} from 'wix-rich-content-ui-components';

const VideoSettings: React.FC<VideoSettingsProps> = ({
  componentData,
  helpers,
  pubsub,
  theme,
  t,
  isMobile,
  settings,
  experiments = {},
  onSave,
  onCancel,
  updateData,
}) => {
  const modalsWithEditorCommands = experiments.tiptapEditor?.enabled;
  const useNewSettingsUi = experiments.newSettingsModals?.enabled;

  const disableDownload =
    componentData.disableDownload !== undefined
      ? componentData.disableDownload
      : !!settings.disableDownload;
  const isSpoilered = componentData.config?.spoiler?.enabled;

  const [isDownloadEnabled, setIsDownloadEnabled] = useState(!disableDownload);
  const [isSpoilerEnabled, setIsSpoilerEnabled] = useState(isSpoilered);
  const styles = mergeStyles({ styles: Styles, theme });
  const closeModal = () => helpers.closeModal?.();
  const getSpoilerConfig = enabled => ({
    config: { ...componentData.config, spoiler: { enabled } },
  });
  const onDoneClick = () => {
    const newComponentData = {
      ...componentData,
      disableDownload: !isDownloadEnabled,
      ...getSpoilerConfig(isSpoilerEnabled),
    };
    pubsub.update('componentData', newComponentData);
    closeModal();
  };
  const isCustomVideo = !!componentData.isCustomVideo;

  const spoilerToggle = {
    toggleKey: 'isSpoilerEnabled',
    labelKey: 'VideoSettings_Spoiler_Toggle',
    dataHook: 'videoSpoilerToggle',
    tooltipText: 'Spoiler_Toggle_Tooltip',
    checked: modalsWithEditorCommands ? isSpoilered : isSpoilerEnabled,
    onToggle: () => {
      if (modalsWithEditorCommands) {
        updateData({ config: { ...componentData.config, spoiler: { enabled: !isSpoilered } } });
      } else {
        const value = !isSpoilerEnabled;
        setIsSpoilerEnabled(value);
        pubsub.update('componentData', { ...componentData, ...getSpoilerConfig(value) });
      }
    },
  };
  const downloadToggle = {
    toggleKey: 'isDownloadEnabled',
    labelKey: 'VideoPlugin_Settings_VideoCanBeDownloaded_Label',
    dataHook: 'videoDownloadToggle',
    tooltipText: 'VideoPlugin_Settings_VideoCanBeDownloaded_Tooltip',
    checked: modalsWithEditorCommands ? !disableDownload : isDownloadEnabled,
    onToggle: () =>
      modalsWithEditorCommands
        ? updateData({ disableDownload: !disableDownload })
        : setIsDownloadEnabled(!isDownloadEnabled),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleData: Record<string, any>[] = isCustomVideo ? [downloadToggle] : [];
  settings.spoiler && toggleData.push(spoilerToggle);

  return (
    <div
      data-hook="settings"
      className={classNames(styles.videoSettings, {
        [styles.videoSettings_mobile]: isMobile,
      })}
    >
      {isMobile ? (
        <SettingsMobileHeader
          t={t}
          theme={theme}
          onCancel={modalsWithEditorCommands ? onCancel : closeModal}
          onSave={modalsWithEditorCommands ? onSave : onDoneClick}
          title={useNewSettingsUi && t('VideoModal_MobileHeader')}
          useNewSettingsUi={useNewSettingsUi}
        />
      ) : experiments?.newSettingsModals?.enabled ? (
        <SettingsPanelHeader title={t('VideoPlugin_Settings_Header')} onClose={closeModal} />
      ) : (
        <>
          <div className={styles.videoSettingsTitle}>{t('VideoPlugin_Settings_Header')}</div>
          <div className={styles.separator} />
        </>
      )}
      <SettingsSection
        theme={theme}
        className={classNames(styles.videoSettings_toggleContainer, {
          [styles.videoSettings_scroll_container]: useNewSettingsUi,
        })}
      >
        {toggleData.map(({ toggleKey, labelKey, tooltipText, dataHook, onToggle, checked }) => (
          <LabeledToggle
            key={toggleKey}
            theme={theme}
            checked={checked}
            label={t(labelKey)}
            onChange={onToggle}
            tooltipText={t(tooltipText)}
            dataHook={dataHook}
          />
        ))}
      </SettingsSection>
      {!isMobile && (
        <SettingsPanelFooter
          fixed
          theme={theme}
          cancel={modalsWithEditorCommands ? onCancel : closeModal}
          save={modalsWithEditorCommands ? onSave : onDoneClick}
          t={t}
        />
      )}
    </div>
  );
};

export default VideoSettings;
