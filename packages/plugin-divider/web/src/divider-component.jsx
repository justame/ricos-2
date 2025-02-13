import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mergeStyles, validate } from 'wix-rich-content-common';
// eslint-disable-next-line max-len
import pluginDividerSchema from 'wix-rich-content-common/dist/statics/schemas/plugin-divider.schema.json';
import { isEqual } from 'lodash';
import { Divider } from './domain/divider';
import DividerLine from './components/divider-line';
import { sizeClassName } from './classNameStrategies';
import styles from '../statics/styles/divider-viewer.rtlignore.scss';

class DividerComponent extends PureComponent {
  static sizeClassName = (componentData, theme) => sizeClassName(componentData, theme);

  constructor(props) {
    super(props);
    validate(props.componentData, pluginDividerSchema);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.componentData, this.props.componentData)) {
      validate(nextProps.componentData, pluginDividerSchema);
    }
  }

  render() {
    this.styles = this.styles || mergeStyles({ styles, theme: this.props.theme });
    // NOTE: editor-only logic in viewer component
    const divider = new Divider(this.props.componentData);
    const { type, size, alignment } = divider;
    const className = classNames(
      this.styles['divider-container'],
      this.styles[`divider-container--${type}`],
      this.props.isMobile && this.styles['divider-container--mobile'],
      this.props.className
    );
    return (
      <div className={className} data-hook={`divider-${type}`}>
        <DividerLine
          type={type}
          width={'100%'}
          size={size}
          alignment={alignment}
          styles={this.styles}
          isMobile={this.props.isMobile}
        />
      </div>
    );
  }
}

DividerComponent.propTypes = {
  componentData: PropTypes.object.isRequired,
  className: PropTypes.string,
  theme: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default DividerComponent;
