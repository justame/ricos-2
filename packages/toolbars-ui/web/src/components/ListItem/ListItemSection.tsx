import React from 'react';
import type { FC } from 'react';
import styles from './list-item-section.scss';

type Props = {
  type?: 'divider' | 'whitespace';
};

const ListItemSection: FC<Props> = ({ type }) => {
  return (
    <div className={styles.whitespace}>
      {type === 'divider' && <div className={styles.divider} />}
    </div>
  );
};

export default ListItemSection;
