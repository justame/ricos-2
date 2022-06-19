import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mergeStyles } from 'wix-rich-content-common';
import { SettingsSection, SettingsSeparator } from 'wix-rich-content-ui-components';
import { decorateComponentWithProps } from 'wix-rich-content-editor-common';
import styles from '../../statics/styles/gallery-settings-modal.scss';
import { Spacing, ItemsPerRow, ThumbnailSize } from './gallery-controls/sliders';
import {
  ThumbnailResize,
  TitleButtonPlacement,
  ImageOrientation,
  ScrollDirection,
} from './gallery-controls/radio-groups';
import ImageRatioSelector from './gallery-controls/image-ratio-selector';
import ThumbnailPlacementSelector from './gallery-controls/thumbnail-placement-selector';
import classNames from 'classnames';

const scrollDirectionOptions = {
  horizontal: { oneRow: true },
  vertical: { oneRow: false },
};

class Separator extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    experiments: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.modalsWithEditorCommands = props.experiments.tiptapEditor?.enabled;
  }

  render = () => {
    const { type, experiments = {} } = this.props;
    switch (type) {
      case 'space':
        return (
          <div
            className={classNames(this.styles.gallerySettings_spacer, {
              [this.styles.gallerySettings_newUi_spacer]: experiments?.newSettingsModals?.enabled,
            })}
          />
        );
      case 'hr':
      default:
        return <SettingsSeparator top bottom />;
    }
  };
}

class LayoutControlsSection extends Component {
  modalsWithEditorCommands = this.props.experiments.tiptapEditor?.enabled;

  controlsByLayout = [
    ['|', 'scrollDirection', '|', 'imageOrientation', '|', 'thumbnailSize', '|', 'spacing'], // collage
    ['|', 'imageOrientation', '|', 'thumbnailSize', '|', 'spacing'], // masonry
    ['|', 'itemsPerRow', '_', 'spacing', '|', 'thumbnailResize', '|', 'imageRatio'], // grid
    ['|', 'thumbnailPlacement', '|', 'thumbnailSpacing'], // thumbnails
    ['|', 'spacing', '|', 'thumbnailResize', '|', 'imageRatio'], // slides
    [], // slideshow
    ['|', 'spacing'], // panorama
    ['|', 'spacing'], // columns
    [], // magic
    [], // fullsize
  ];

  getValueFromComponentStyles = name => this.props.data.styles[name];

  applyGallerySetting = setting => {
    const { data, store, updateData } = this.props;
    const componentData = { ...data, styles: { ...data.styles, ...setting } };
    this.modalsWithEditorCommands
      ? updateData(componentData)
      : store.set('componentData', componentData);
  };

  getControlData = t => ({
    '|': { component: Separator, props: { type: 'hr' } }, //separator
    _: { component: Separator, props: { type: 'space', experiments: this.props.experiments } }, //separator
    itemsPerRow: {
      component: ItemsPerRow,
      props: {
        onChange: value => this.applyGallerySetting({ numberOfImagesPerRow: value }),
        defaultValue: this.getValueFromComponentStyles('numberOfImagesPerRow'),
        t,
        languageDir: this.props.languageDir,
      },
    },
    thumbnailSize: {
      component: ThumbnailSize,
      props: {
        onChange: value => this.applyGallerySetting({ gallerySizePx: value }),
        defaultValue: this.getValueFromComponentStyles('gallerySizePx'),
        options: {
          label: this.getValueFromComponentStyles('isVertical')
            ? t('GallerySettings_LayoutControlSection_Column')
            : t('GallerySettings_LayoutControlSection_Row'),
        },
        languageDir: this.props.languageDir,
      },
    },
    spacing: {
      component: Spacing,
      props: {
        onChange: value => this.applyGallerySetting({ imageMargin: value }),
        defaultValue: this.getValueFromComponentStyles('imageMargin'),
        t,
        languageDir: this.props.languageDir,
      },
    },
    thumbnailSpacing: {
      component: Spacing,
      props: {
        onChange: value => this.applyGallerySetting({ thumbnailSpacings: value }),
        defaultValue: this.getValueFromComponentStyles('thumbnailSpacings'),
        t,
      },
    },
    thumbnailResize: {
      component: ThumbnailResize,
      props: {
        onChange: value => this.applyGallerySetting({ cubeType: value }),
        value: this.getValueFromComponentStyles('cubeType'),
        t,
        experiments: this.props.experiments,
      },
    },
    titleButtonPlacement: {
      component: TitleButtonPlacement,
      props: {
        onChange: value => this.applyGallerySetting({ titlePlacement: value }),
        value: this.getValueFromComponentStyles('titlePlacement'),
        t,
        experiments: this.props.experiments,
      },
    },
    imageRatio: {
      component: ImageRatioSelector,
      props: {
        onChange: value => this.applyGallerySetting({ cubeRatio: value }),
        value: this.getValueFromComponentStyles('cubeRatio'),
        t,
        experiments: this.props.experiments,
      },
    },
    imageOrientation: {
      component: ImageOrientation,
      props: {
        onChange: value => {
          this.applyGallerySetting({ isVertical: value === '1' });
        },
        value: this.getValueFromComponentStyles('isVertical') ? '1' : '0',
        t,
        experiments: this.props.experiments,
      },
    },
    scrollDirection: {
      component: ScrollDirection,
      props: {
        onChange: value => {
          return this.applyGallerySetting(scrollDirectionOptions[value]);
        },
        value: this.getValueFromComponentStyles('oneRow') ? 'horizontal' : 'vertical',
        t,
        experiments: this.props.experiments,
      },
    },
    thumbnailPlacement: {
      component: ThumbnailPlacementSelector,
      props: {
        onChange: value => this.applyGallerySetting({ galleryThumbnailsAlignment: value }),
        value: this.getValueFromComponentStyles('galleryThumbnailsAlignment'),
        t,
        experiments: this.props.experiments,
      },
    },
  });

  render() {
    const { t } = this.props;
    const controls = this.getControlData(t);
    const layoutControls = this.controlsByLayout[this.props.layout];
    return (
      <div>
        {layoutControls.map((name, i) => (
          <SettingsSection theme={this.props.theme} key={i}>
            {React.createElement(
              decorateComponentWithProps(controls[name].component, {
                ...controls[name].props,
                theme: this.props.theme,
                experiments: this.props.experiments,
              })
            )}
          </SettingsSection>
        ))}
      </div>
    );
  }
}

LayoutControlsSection.propTypes = {
  layout: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  experiments: PropTypes.object,
  languageDir: PropTypes.string.isRequired,
  t: PropTypes.func,
  updateData: PropTypes.func.isRequired,
};

// export default translate(null)(LayoutControlsSection);
export default LayoutControlsSection;
