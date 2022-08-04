import React from 'react';
import styles from '../../statics/styles/customize-toolbar-button.scss';

const CustomizeButton = ({ onClick, text }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div className={styles.customize_button} role="button" tabIndex={0} onClick={onClick}>
    {text}
  </div>
);

export default CustomizeButton;
