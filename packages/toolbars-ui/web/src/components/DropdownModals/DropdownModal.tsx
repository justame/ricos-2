import React from 'react';
import type { ReactElement } from 'react';
import { DropdownPanel } from '../DropdownPanel';
import styles from './DropdownModal.scss';

type Props = {
  options: ReactElement[];
};

const DropdownModal: React.FC<Props> = ({ options }) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div tabIndex={-1} className={styles.modal}>
      <DropdownPanel options={options} />
    </div>
  );
};

export default DropdownModal;
