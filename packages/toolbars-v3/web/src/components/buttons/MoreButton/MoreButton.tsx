/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import cx from 'classnames';
import styles from './MoreButton.scss';
import { ContextMenuIcon } from '../../../icons';

const MoreButton = ({ onClick, showMore }) => {
  return (
    <div className={cx(styles.moreButtonWrapper, showMore ? styles.active : '')}>
      <div className={styles.moreButton} role="button" onClick={onClick} tabIndex={0}>
        <ContextMenuIcon />
      </div>
    </div>
  );
};

export default MoreButton;
