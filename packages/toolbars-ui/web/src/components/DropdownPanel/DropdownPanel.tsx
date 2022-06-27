import React from 'react';
import type { FC, ReactElement } from 'react';
import styles from './dropdown-panel.scss';
import DesktopPanel from './DesktopPanel';

type Props = {
  options: ReactElement[];
};

const DropdownPanel: FC<Props> = ({ options }) => {
  const panel = <DesktopPanel options={options} />;

  return <div className={styles.panel_Container}>{panel}</div>;
};

export default DropdownPanel;
