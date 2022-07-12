import React, { useState } from 'react';
import type { VideoPluginEditorConfig } from '../types';
import classNames from 'classnames';
import type {
  AvailableExperiments,
  ComponentData,
  Helpers,
  Pubsub,
  RichContentTheme,
  TranslationFunction,
} from 'wix-rich-content-common';
import { mergeStyles } from 'wix-rich-content-common';
import Styles from '../../statics/styles/video-settings.scss';
import {
  LabeledToggle,
  SettingsSection,
  SettingsPanelFooter,
  SettingsPanelHeader,
  SettingsMobileHeader,
} from 'wix-rich-content-ui-components';

export interface Props {
  componentData: ComponentData;
  helpers?: Helpers;
  pubsub?: Pubsub;
  theme: RichContentTheme;
  t: TranslationFunction;
  isMobile: boolean;
  settings?: VideoPluginEditorConfig;
  onSave?: () => void;
  onCancel?: () => void;
  updateData?: (data) => void;
  experiments?: AvailableExperiments;
  shouldShowSpoiler?: boolean;
}

const VideoSettings: React.FC<Props> = ({
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
  shouldShowSpoiler,
}) => {
  const modalsWithEditorCommands = experiments.tiptapEditor?.enabled;
  const useNewSettingsUi = experiments.newSettingsModals?.enabled;
  const hasDisableDownload =
    componentData.disableDownload !== undefined && componentData.disableDownload !== null;
  const isCustomVideo = hasDisableDownload || !!componentData.isCustomVideo;
  const disableDownload = hasDisableDownload
    ? componentData.disableDownload
    : !!settings?.disableDownload;
  const isSpoilered = componentData.config?.spoiler?.enabled;

  const [isDownloadEnabled, setIsDownloadEnabled] = useState(!disableDownload);
  const [isSpoilerEnabled, setIsSpoilerEnabled] = useState(isSpoilered);
  const styles = mergeStyles({ styles: Styles, theme });
  const closeModal = () => helpers?.closeModal?.();
  const getSpoilerConfig = enabled => ({
    config: { ...componentData.config, spoiler: { enabled } },
  });
  const onDoneClick = () => {
    if (modalsWithEditorCommands) {
      return onSave?.();
    }
    const newComponentData = {
      ...componentData,
      disableDownload: !isDownloadEnabled,
      ...getSpoilerConfig(isSpoilerEnabled),
    };
    pubsub?.update('componentData', newComponentData);
    closeModal();
  };

  const onCancelClick = () => (modalsWithEditorCommands ? onCancel?.() : closeModal());

  const spoilerToggle = {
    toggleKey: 'isSpoilerEnabled',
    labelKey: 'VideoSettings_Spoiler_Toggle',
    dataHook: 'videoSpoilerToggle',
    tooltipText: 'Spoiler_Toggle_Tooltip',
    checked: modalsWithEditorCommands ? isSpoilered : isSpoilerEnabled,
    onToggle: () => {
      if (modalsWithEditorCommands) {
        updateData?.({ config: { ...componentData.config, spoiler: { enabled: !isSpoilered } } });
      } else {
        const value = !isSpoilerEnabled;
        setIsSpoilerEnabled(value);
        pubsub?.update('componentData', { ...componentData, ...getSpoilerConfig(value) });
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
        ? updateData?.({ disableDownload: !disableDownload })
        : setIsDownloadEnabled(!isDownloadEnabled),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleData: Record<string, any>[] = isCustomVideo ? [downloadToggle] : [];
  shouldShowSpoiler && toggleData.push(spoilerToggle);

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
          onCancel={onCancelClick}
          onSave={onDoneClick}
          title={useNewSettingsUi && t('VideoModal_MobileHeader')}
          useNewSettingsUi={useNewSettingsUi}
        />
      ) : experiments?.newSettingsModals?.enabled ? (
        <SettingsPanelHeader title={t('VideoPlugin_Settings_Header')} onClose={onCancelClick} />
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
        <SettingsPanelFooter fixed theme={theme} cancel={onCancelClick} save={onDoneClick} t={t} />
      )}
    </div>
  );
};

export default VideoSettings;
