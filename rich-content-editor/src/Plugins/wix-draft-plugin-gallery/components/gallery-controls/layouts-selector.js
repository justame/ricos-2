import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SelectionList from '~/Components/SelectionList';
import { getGalleryLayouts } from '../../helpers';
import { mergeStyles } from '~/Utils/mergeStyles';
import styles from './layout-selector.scss';

class LayoutSelector extends Component {

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  getLayouts = t => {
    return getGalleryLayouts(t).map(layout => {
      return { layoutId: layout.value, name: layout.label, icon: layout.icon };
    });
  }

  dataMapper = ({ layoutId }) => ({ value: layoutId });

  renderOption = ({ item, selected }) => (
    <div className={this.styles.layoutsSelector_tile}>
      <item.icon className={classnames(this.styles.layoutsSelector_icon, { [this.styles.layoutsSelector_icon_selected]: selected })}/>
      <label className={this.styles.layoutsSelector_tile_label}>{item.name}</label>
    </div>
  );

  render() {
    const styles = this.styles;
    const { value, theme, onChange, t } = this.props;
    const layoutsLabel = t('GalleryPlugin_Layouts_Title');
    return (
      <div>
        <label className={styles.layoutsSelector_label}>{layoutsLabel}</label>
        <SelectionList
          theme={theme}
          className={styles.layoutsSelector_grid}
          dataSource={this.getLayouts(t)}
          dataMapper={this.dataMapper}
          renderItem={this.renderOption}
          value={value}
          onChange={value => onChange(value)}
          optionClassName={styles.layoutsSelector_option}
        />
      </div>
    );
  }
}

LayoutSelector.propTypes = {
  value: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default LayoutSelector;
