import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { normalizeUrl } from 'wix-rich-content-common';
import { alignmentClassName, sizeClassName } from './classNameStrategies';
import ButtonViewer from './components/button-viewer';

class ButtonComponent extends Component {
  static alignmentClassName = (componentData, theme, styles, isMobile) =>
    alignmentClassName(componentData, theme, styles, isMobile);

  static sizeClassName = (componentData, theme, styles, isMobile) =>
    sizeClassName(componentData, theme, styles, isMobile);

  render() {
    const {
      componentData: { button },
      settings: { onClick, themeData },
      config,
      helpers,
      anchorTarget,
      theme,
    } = this.props;
    const { colors: { actionColor, bgColor } = {} } = themeData || config?.themeData || {};
    const buttonText = button.settings.buttonText;
    const url = button.settings?.url;
    let linkButtonSettings = {};
    if (url) {
      linkButtonSettings = {
        url: normalizeUrl(url),
        target: button.settings.target,
        rel: button.settings.rel,
      };
    }
    const style = {
      border: '0px solid blue',
      color: this.props.settings.colors?.color1 || bgColor,
      background: this.props.settings.colors?.color8 || actionColor,
      borderColor: this.props.settings.colors?.color8 || actionColor,
      ...this.props.style,
      ...button.design,
    };
    return (
      <ButtonViewer
        style={style}
        buttonText={buttonText}
        theme={theme}
        onClick={onClick}
        helpers={helpers}
        anchorTarget={anchorTarget}
        {...linkButtonSettings}
      />
    );
  }
}

ButtonComponent.propTypes = {
  componentData: PropTypes.object,
  style: PropTypes.object,
  anchorTarget: PropTypes.string,
  settings: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  helpers: PropTypes.object,
  config: PropTypes.object,
};

export default ButtonComponent;
