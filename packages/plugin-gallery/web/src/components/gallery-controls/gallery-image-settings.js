/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import imageClientAPI from 'image-client-api/dist/imageClientSDK';
import { mergeStyles } from 'wix-rich-content-common';
import {
  Image,
  InputWithLabel,
  SettingsSection,
  FileInput,
  SettingsPanelFooter,
  SettingsPanelHeader,
  FocusManager,
  SettingsMobileHeader,
  Label,
} from 'wix-rich-content-ui-components';
import { LinkPanelWrapper } from 'wix-rich-content-editor-common';
import { BackIcon, DeleteIcon, ReplaceIcon, NextIcon, PreviousIcon } from '../../icons';
import styles from '../../../statics/styles/gallery-image-settings.scss';
import { sampleItems } from '../../defaults';

class ImageSettings extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    const { t } = props;
    this.updateLabel = t('GalleryImageSettings_Update');
    this.headerLabel = t('GalleryImageSettings_Header');
    this.ReplaceLabel = t('GalleryImageSettings_Replace_Label');
    this.deleteLabel = t('GalleryImageSettings_Delete_Label');
    this.titleLabel = t('ImageSettings_Caption_Label');
    this.titleInputPlaceholder = t('ImageSettings_Caption_Input_Placeholder');
    this.altTextLabel = t('ImageSettings_Alt_Label');
    this.altTextPlaceholder = t('ImageSettings_Alt_Input_Placeholder');
    this.linkLabel = t('GalleryImageSettings_Link_Label');
  }

  deleteItem() {
    this.props.onDeleteItem();
  }

  replaceItem = files => {
    this.props.handleFileChange(files);
  };

  getMediaUrl = item => {
    const itemToScale = item.url && item.metadata ? item : sampleItems[0];
    const {
      metadata: { width, height, type = 'image', poster },
      url,
    } = itemToScale;

    return imageClientAPI.getScaleToFillImageURL(
      (item.url ? 'media/' : '') + (type !== 'video' ? url : poster),
      width,
      height,
      420,
      240
    );
  };

  onTitleChange = title => this.props.onUpdateItem({ title });

  onAltTextChange = altText => this.props.onUpdateItem({ altText });

  onLinkPanelChange = linkPanelValues => {
    this.props.onUpdateItem({ link: linkPanelValues });
  };

  render() {
    const styles = this.styles;
    const {
      image,
      handleFileSelection,
      onCancel,
      onSave,
      theme,
      isMobile,
      t,
      onNextItem,
      onPreviousItem,
      onDeleteItem,
      visibleLeftArrow,
      visibleRightArrow,
      uiSettings,
      accept,
      anchorTarget,
      relValue,
      experiments = {},
    } = this.props;

    const { linkPanel } = uiSettings || {};
    const { showNewTabCheckbox, showNoFollowCheckbox, showSponsoredCheckbox, placeholder } =
      linkPanel || {};
    const { metadata = {} } = image || {};
    const useNewSettingsUi = experiments?.newSettingsModals?.enabled;

    const altText = typeof metadata.altText === 'string' ? metadata.altText : metadata.title;
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
    return (
      <FocusManager className={styles.galleryImageSettings}>
        <div className={styles.galleryImageSettings_content}>
          {isMobile ? (
            <SettingsMobileHeader
              theme={theme}
              onCancel={onCancel}
              onSave={onSave}
              t={t}
              title={useNewSettingsUi && t('GallerySettings_Header')}
              useNewSettingsUi={useNewSettingsUi}
            />
          ) : useNewSettingsUi ? (
            <SettingsPanelHeader showCloseIcon={false}>
              <div onClick={onCancel}>
                <BackIcon className={styles.galleryImageSettings_backIcon} />
                {this.headerLabel}
              </div>
            </SettingsPanelHeader>
          ) : (
            <h3
              className={classNames(
                styles.galleryImageSettings_backButton,
                styles.galleryImageSettings_title
              )}
              data-hook="galleryImageSettingsHeader"
              onClick={onCancel}
            >
              <BackIcon className={styles.galleryImageSettings_backIcon} />
              {this.headerLabel}
            </h3>
          )}
          <div
            className={classNames(styles.galleryImageSettings_scrollContainer, {
              [styles.galleryImageSettings_scrollContainer_mobile]: isMobile,
            })}
          >
            {image && (
              <div>
                <SettingsSection
                  theme={theme}
                  ariaProps={{
                    'aria-label': 'image navigation',
                    role: 'region',
                    'data-hook': 'galleryImageSettingsPreview',
                  }}
                >
                  <Image
                    alt={metadata.title || 'gallery image preview'}
                    resizeMode={'contain'}
                    className={styles.galleryImageSettings_image}
                    src={this.getMediaUrl(image)}
                    theme={theme}
                    error={image.error}
                    t={t}
                  />
                  <div
                    className={classNames(styles.galleryImageSettings_nav, {
                      [styles.galleryImageSettings_nav_mobile]: isMobile,
                    })}
                    data-hook="galleryImagePreview"
                  >
                    <button
                      className={classNames(styles.galleryImageSettings_previous, {
                        [styles.galleryImageSettings_hidden]: !visibleLeftArrow,
                      })}
                      aria-label="previous image"
                      data-hook="galleryImageSettingsPrevious"
                      onClick={onPreviousItem}
                    >
                      <PreviousIcon />
                    </button>
                    <button
                      className={classNames(styles.galleryImageSettings_next, {
                        [styles.galleryImageSettings_hidden]: !visibleRightArrow,
                      })}
                      aria-label="next image"
                      data-hook="galleryImageSettingsNext"
                      onClick={onNextItem}
                    >
                      <NextIcon />
                    </button>
                  </div>
                </SettingsSection>
                <div className={styles.galleryImageSettings_manageImageGrid}>
                  <FileInput
                    className={styles.galleryImageSettings_replace}
                    handleFileSelection={handleFileSelection}
                    dataHook="galleryImageSettingsFileInput"
                    onChange={this.replaceItem}
                    theme={theme}
                    title={this.ReplaceLabel}
                    accept={accept}
                  >
                    <ReplaceIcon className={styles.galleryImageSettings_replace_icon} />
                    <span className={styles.galleryImageSettings_replace_text}>
                      {this.ReplaceLabel}
                    </span>
                  </FileInput>
                  <button
                    className={styles.galleryImageSettings_delete}
                    aria-label="delete image"
                    data-hook="galleryImageSettingsDeleteImage"
                    onClick={onDeleteItem}
                  >
                    <DeleteIcon className={styles.galleryImageSettings_delete_icon} />
                    <span className={styles.galleryImageSettings_delete_text}>
                      {this.deleteLabel}
                    </span>
                  </button>
                </div>
                <SettingsSection
                  ariaProps={{ 'aria-label': 'image properties', role: 'region' }}
                  theme={theme}
                  className={styles.galleryImageSettings_section}
                >
                  <InputWithLabel
                    theme={theme}
                    label={this.titleLabel}
                    placeholder={this.titleInputPlaceholder}
                    value={metadata.title}
                    maxLength={30}
                    dataHook="galleryImageTitleInput"
                    onChange={this.onTitleChange}
                  />
                  <InputWithLabel
                    theme={theme}
                    label={this.altTextLabel}
                    placeholder={this.altTextPlaceholder}
                    value={altText}
                    dataHook="galleryImageAltTextInput"
                    onChange={this.onAltTextChange}
                  />
                </SettingsSection>
                {metadata.type !== 'video' && (
                  <SettingsSection
                    ariaProps={{ 'aria-label': 'image link', role: 'region' }}
                    theme={theme}
                    className={this.styles.galleryImageSettings_section}
                  >
                    <div id="gallery_image_link_lbl" className={this.styles.linkLabel}>
                      <Label label={this.linkLabel} />
                    </div>
                    <LinkPanelWrapper
                      linkValues={metadata.link || {}}
                      onChange={this.onLinkPanelChange}
                      showNewTabCheckbox={showNewTabCheckbox}
                      showNoFollowCheckbox={showNoFollowCheckbox}
                      showSponsoredCheckbox={showSponsoredCheckbox}
                      theme={theme}
                      t={t}
                      ariaProps={{ 'aria-labelledby': 'gallery_image_link_lbl' }}
                      placeholder={placeholder}
                      anchorTarget={anchorTarget}
                      relValue={relValue}
                    />
                  </SettingsSection>
                )}
              </div>
            )}
          </div>
          {isMobile ? null : (
            <SettingsPanelFooter fixed theme={theme} cancel={onCancel} save={onSave} t={t} />
          )}
        </div>
      </FocusManager>
    );
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
  }
}

ImageSettings.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    metadata: PropTypes.object.isRequired,
    error: PropTypes.object,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  onNextItem: PropTypes.func.isRequired,
  onPreviousItem: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  handleFileSelection: PropTypes.func,
  handleFileChange: PropTypes.func,
  isMobile: PropTypes.bool,
  t: PropTypes.func,
  anchorTarget: PropTypes.string,
  relValue: PropTypes.string,
  visibleLeftArrow: PropTypes.bool,
  visibleRightArrow: PropTypes.bool,
  uiSettings: PropTypes.object,
  experiments: PropTypes.object,
  accept: PropTypes.string,
};

export default ImageSettings;
