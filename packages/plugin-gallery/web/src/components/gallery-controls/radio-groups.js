import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroupHorizontal, RadioGroupVertical } from 'wix-rich-content-ui-components';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.object,
  experiments: PropTypes.object,
  t: PropTypes.func,
};

const SelectRadioGroupComponent = (useVertical = false) =>
  useVertical ? RadioGroupVertical : RadioGroupHorizontal;

export const ThumbnailResize = props => {
  const { t, experiments = {} } = props;
  const thumbnailResizeLabel = t('GallerySettings_Radios_Thumbnail_Resize');
  const cropLabel = t('GallerySettings_Radios_Crop');
  const fitLabel = t('GallerySettings_Radios_Fit');
  const RadioGroupComponent = SelectRadioGroupComponent(experiments?.newSettingsModals?.enabled);

  return (
    <RadioGroupComponent
      label={thumbnailResizeLabel}
      dataSource={[
        { value: 'fill', labelText: cropLabel, dataHook: 'radioGroupFill' },
        { value: 'fit', labelText: fitLabel, dataHook: 'radioGroupFit' },
      ]}
      tooltipTextKey={'GallerySettings_Radios_Thumbnail_Resize_Tooltip'}
      t={t}
      {...props}
    />
  );
};
ThumbnailResize.propTypes = propTypes;

export const TitleButtonPlacement = props => {
  const { t, experiments = {} } = props;
  const titleButtonPlacementLabel = t('GallerySettings_Radios_Title_Button_Placement');
  const underneathLabel = t('GallerySettings_Radios_Underneath');
  const onHoverLabel = t('GallerySettings_Radios_On_Hover');
  const RadioGroupComponent = SelectRadioGroupComponent(experiments?.newSettingsModals?.enabled);

  return (
    <RadioGroupComponent
      label={titleButtonPlacementLabel}
      dataSource={[
        { value: 'SHOW_ALWAYS', labelText: underneathLabel, dataHook: 'radioGroupTitleShowAlways' },
        { value: 'SHOW_ON_HOVER', labelText: onHoverLabel, dataHook: 'radioGroupTitleShowOnHover' },
      ]}
      {...props}
    />
  );
};
TitleButtonPlacement.propTypes = propTypes;

export const ImageOrientation = props => {
  const { t, experiments = {} } = props;
  const imageOrientationLabel = t('GallerySettings_Radios_Image_Orientation');
  const verticalLabel = t('GallerySettings_Radios_Vertical');
  const horizontalLabel = t('GallerySettings_Radios_Horizontal');
  const RadioGroupComponent = SelectRadioGroupComponent(experiments?.newSettingsModals?.enabled);

  return (
    <RadioGroupComponent
      label={imageOrientationLabel}
      dataSource={[
        { value: '1', labelText: verticalLabel, dataHook: 'radioGroupImageOrientationVertical' },
        {
          value: '0',
          labelText: horizontalLabel,
          dataHook: 'radioGroupImageOrientationHorizontal',
        },
      ]}
      tooltipTextKey={'GallerySettings_Radios_Image_Orientation_Tooltip'}
      t={t}
      {...props}
    />
  );
};
ImageOrientation.propTypes = propTypes;

export const ScrollDirection = props => {
  const { t, experiments = {} } = props;
  const scrollDirectionLabel = t('GallerySettings_Radios_Scroll_Direction');
  const verticalLabel = t('GallerySettings_Radios_Vertical');
  const horizontalLabel = t('GallerySettings_Radios_Horizontal');
  const RadioGroupComponent = SelectRadioGroupComponent(experiments?.newSettingsModals?.enabled);

  return (
    <RadioGroupComponent
      label={scrollDirectionLabel}
      dataSource={[
        {
          value: 'vertical',
          labelText: verticalLabel,
          dataHook: 'radioGroupScrollDirectionVertical',
        },
        {
          value: 'horizontal',
          labelText: horizontalLabel,
          dataHook: 'radioGroupScrollDirectionHorizontal',
        },
      ]}
      tooltipTextKey={'GallerySettings_Radios_Scroll_Direction_Tooltip'}
      t={t}
      {...props}
    />
  );
};
ScrollDirection.propTypes = propTypes;
