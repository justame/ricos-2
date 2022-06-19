import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import { getImageSrc } from 'wix-rich-content-common/libs/imageUtils';
import {
  SettingsPanelFooter,
  SettingsPanelHeader,
  SettingsSection,
  LabeledToggle,
  InputWithLabel,
  Image,
  Loader,
  SettingsMobileHeader,
  SettingsSeparator,
} from 'wix-rich-content-ui-components';
import styles from '../../statics/styles/image-settings.scss';
import { DIVIDER } from '../consts';

class ImageSettings extends Component {
  constructor(props) {
    super(props);
    this.state = this.propsToState(props);
    this.initialState = { ...this.state };
    const { t, theme, experiments = {} } = props;
    this.styles = mergeStyles({ styles, theme });
    this.updateLabel = t('ImageSettings_Update');
    this.headerText = t('ImageSettings_Header');
    this.captionLabel = t('ImageSettings_Caption_Label');
    this.captionInputPlaceholder = t('ImageSettings_Caption_Input_Placeholder');
    this.altLabel = t('ImageSettings_Alt_Label');
    this.altTooltip = 'ImageSettings_Alt_Label_Tooltip';
    this.altInputPlaceholder = t('ImageSettings_Alt_Input_Placeholder');
    this.modalsWithEditorCommands = experiments?.tiptapEditor?.enabled;
  }

  propsToState(props) {
    const { getComponentData, componentData } = props;
    const {
      src,
      metadata,
      error,
      disableExpand,
      disableDownload,
      config: { spoiler = {} },
    } = getComponentData?.() || componentData;
    const isExpandEnabled = !disableExpand;
    const isDownloadEnabled = !disableDownload;
    const isSpoilerEnabled = spoiler.enabled;

    return {
      src,
      metadata,
      error,
      isExpandEnabled,
      isDownloadEnabled,
      isSpoilerEnabled,
    };
  }

  useNewSettingsUi = !!this.props.experiments?.newSettingsModals?.enabled;

  toggleState = (key, onToggle) => () => {
    const value = !this.state[key];
    this.setState({ [key]: value }, onToggle?.(value));
  };

  renderToggle = ({
    isChecked,
    toggleKey,
    labelKey,
    dataHook,
    tooltipText,
    onChange,
    type,
    onToggle,
  }) => {
    const { theme, t } = this.props;
    return type === DIVIDER ? (
      <SettingsSeparator key={toggleKey} top />
    ) : (
      <div key={toggleKey} className={this.styles.imageSettings_toggleContainer}>
        <LabeledToggle
          theme={theme}
          checked={this.modalsWithEditorCommands ? isChecked() : this.state[toggleKey]}
          label={t(labelKey)}
          onChange={
            this.modalsWithEditorCommands ? onChange : this.toggleState(toggleKey, onToggle)
          }
          dataHook={dataHook}
          tooltipText={tooltipText}
        />
      </div>
    );
  };

  baseToggleData = [
    {
      toggleKey: 'isExpandEnabled',
      labelKey: 'ImagePlugin_Settings_ImageOpensInExpandMode_Label',
      dataHook: 'imageExpandToggle',
      tooltipText: this.props.t('ImageSettings_Expand_Mode_Toggle'),
      isChecked: () => !this.props.componentData.disableExpand,
      onChange: () =>
        this.props.updateData({
          disableExpand: !this.props.componentData.disableExpand,
        }),
    },
    {
      toggleKey: 'isDownloadEnabled',
      labelKey: 'ImagePlugin_Settings_ImageCanBeDownloaded_Label',
      dataHook: 'imageDownloadToggle',
      tooltipText: this.props.t('ImagePlugin_Settings_ImageCanBeDownloaded_Tooltip'),
      isChecked: () => !this.props.componentData.disableDownload,
      onChange: () =>
        this.props.updateData({
          disableDownload: !this.props.componentData.disableDownload,
        }),
    },
  ];

  toggleData = this.props.shouldShowSpoiler
    ? [
        ...this.baseToggleData,
        {
          type: DIVIDER,
        },
        {
          toggleKey: 'isSpoilerEnabled',
          labelKey: 'ImageSettings_Spoiler_Toggle',
          dataHook: 'imageSpoilerToggle',
          tooltipText: this.props.t('Spoiler_Toggle_Tooltip'),
          isChecked: () => this.props.componentData.config?.spoiler?.enabled,
          onChange: value =>
            this.props.updateData({
              ...this.props.componentData,
              ...this.getSpoilerConfig(!this.props.componentData.config?.spoiler?.enabled),
            }),

          onToggle: value =>
            this.props.pubsub.update('componentData', {
              ...this.props.componentData,
              ...this.getSpoilerConfig(value),
            }),
        },
      ]
    : this.baseToggleData;

  componentDidMount() {
    if (!this.modalsWithEditorCommands) {
      this.props.pubsub.subscribe('componentData', this.onComponentUpdate);
    }
  }

  componentWillUnmount() {
    if (!this.modalsWithEditorCommands) {
      this.props.pubsub.unsubscribe('componentData', this.onComponentUpdate);
    }
  }

  onComponentUpdate = () => {
    if (!this.modalsWithEditorCommands) {
      const componentData = this.props.pubsub.get('componentData');
      this.setState({ src: componentData.src, error: componentData?.error });
    }
  };

  revertComponentData = () => {
    const { componentData, helpers, pubsub } = this.props;
    if (this.initialState) {
      const { isExpandEnabled, isDownloadEnabled, ...rest } = this.initialState;
      const initialComponentData = {
        ...componentData,
        ...rest,
        disableExpand: !isExpandEnabled,
        disableDownload: !isDownloadEnabled,
      };
      pubsub.update('componentData', initialComponentData);
      this.setState({ ...this.initialState });
    }
    helpers.closeModal();
  };

  onCancel = () => {
    this.modalsWithEditorCommands ? this.props.onCancel() : this.revertComponentData();
  };

  onSave = () => {
    this.modalsWithEditorCommands ? this.props.onSave() : this.onDoneClick();
  };

  metadataUpdated = (metadata, value) => {
    this.modalsWithEditorCommands
      ? this.props.updateData({ metadata: { ...metadata, ...value } })
      : this.setState({ metadata: { ...metadata, ...value } });
  };

  onDoneClick = () => {
    const { helpers, getComponentData, pubsub, componentData } = this.props;
    const newComponentData = {
      ...(getComponentData?.() || componentData),
      ...this.getSpoilerConfig(this.state.isSpoilerEnabled),
      disableDownload: !this.state.isDownloadEnabled,
      disableExpand: !this.state.isExpandEnabled,
    };
    if (this.state.metadata) {
      newComponentData.metadata = this.state.metadata;
    }
    pubsub.update('componentData', newComponentData);

    helpers.closeModal();
  };

  getSpoilerConfig = enabled => ({
    config: {
      ...this.props.componentData.config,
      spoiler: { enabled },
    },
  });

  render() {
    const { helpers, theme, t, isMobile, languageDir, experiments = {} } = this.props;
    const { src, error } = this.state;
    const metadata =
      (this.modalsWithEditorCommands ? this.props.componentData.metadata : this.state.metadata) ||
      {};
    return (
      <div
        className={classNames(this.styles.imageSettings, {
          [this.styles.imageSettings_newUi]: this.useNewSettingsUi,
        })}
        data-hook="settings"
        dir={languageDir}
      >
        {isMobile ? (
          <SettingsMobileHeader
            theme={theme}
            onCancel={this.onCancel}
            onSave={this.onSave}
            t={t}
            title={this.useNewSettingsUi && t('ImageSettings_Header')}
            useNewSettingsUi={this.useNewSettingsUi}
          />
        ) : this.useNewSettingsUi ? (
          <SettingsPanelHeader title={this.headerText} onClose={this.revertComponentData} />
        ) : (
          <h3 className={this.styles.imageSettingsTitle}>{this.headerText}</h3>
        )}
        <div
          className={classNames(styles.imageSettings_scrollContainer, {
            [styles.imageSettings_mobile]: isMobile,
          })}
        >
          <SettingsSection
            theme={theme}
            className={this.styles.imageSettingsImageSection}
            ariaProps={{
              'aria-label': 'image preview',
              role: 'region',
              'data-hook': 'imagePreview',
            }}
          >
            {src ? (
              <Image
                alt={metadata.alt || 'image preview'}
                resizeMode={'contain'}
                className={this.styles.imageSettingsImage}
                src={getImageSrc(src, helpers?.getImageUrl, {
                  requiredWidth: 1000,
                  requiredHeight: 250,
                  requiredQuality: 80,
                })}
                theme={theme}
                error={error}
                t={t}
              />
            ) : (
              <div className={this.styles.imageSettingsImage}>
                <Loader type={'medium'} />
              </div>
            )}
          </SettingsSection>
          <div className={this.styles.imageSettings_inputsWrapper}>
            <SettingsSection
              theme={theme}
              className={this.styles.imageSettingsSection}
              ariaProps={{ 'aria-label': 'image caption', role: 'region' }}
            >
              <InputWithLabel
                theme={theme}
                id="imageSettingsCaptionInput"
                label={this.captionLabel}
                placeholder={this.captionInputPlaceholder}
                value={metadata.caption || ''}
                onChange={caption => this.metadataUpdated(metadata, { caption })}
                dataHook="imageSettingsCaptionInput"
              />
            </SettingsSection>
            <SettingsSection
              theme={theme}
              className={this.styles.imageSettingsSection}
              ariaProps={{ 'aria-label': 'image alt text', role: 'region' }}
            >
              <InputWithLabel
                theme={theme}
                id="imageSettingsAltInput"
                label={this.altLabel}
                placeholder={this.altInputPlaceholder}
                t={t}
                value={metadata.alt || ''}
                onChange={alt => this.metadataUpdated(metadata, { alt })}
                dataHook="imageSettingsAltInput"
                tooltipTextKey={this.altTooltip}
                isMobile={isMobile}
              />
            </SettingsSection>
            <SettingsSection
              theme={theme}
              ariaProps={{ 'aria-label': 'link redirect explanation', role: 'region' }}
            >
              <div className={this.styles.imageSettingsLabel}>
                {this.toggleData.map(toggle => this.renderToggle(toggle))}
              </div>
            </SettingsSection>
          </div>
        </div>
        {!isMobile && (
          <SettingsPanelFooter
            fixed
            theme={theme}
            cancel={this.onCancel}
            save={this.onSave}
            t={t}
          />
        )}
      </div>
    );
  }
}
ImageSettings.propTypes = {
  componentData: PropTypes.any.isRequired,
  helpers: PropTypes.object,
  experiments: PropTypes.object,
  theme: PropTypes.object.isRequired,
  pubsub: PropTypes.any,
  t: PropTypes.func,
  isMobile: PropTypes.bool,
  languageDir: PropTypes.string,
  shouldShowSpoiler: PropTypes.bool,
  updateData: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  getComponentData: PropTypes.func,
};

export default ImageSettings;
