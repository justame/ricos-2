import React from 'react';
import { CirclePlusIcon as PlusIcon } from 'wix-rich-content-ui-components';
import styles from './styles/floating-add-plugin-menu.scss';

type PlusButtonProps = {
  onClick: () => void;
  position?: { top: string };
};

const PlusButton = React.forwardRef(
  ({ position, onClick }: PlusButtonProps, ref: React.RefObject<HTMLButtonElement>) => (
    <button
      ref={ref}
      onClick={onClick}
      className={styles.floatingAddPluginMenu_plus_button}
      style={position}
      data-hook="addPluginFloatingToolbar"
    >
      <PlusIcon />
    </button>
  )
);

export default PlusButton;
