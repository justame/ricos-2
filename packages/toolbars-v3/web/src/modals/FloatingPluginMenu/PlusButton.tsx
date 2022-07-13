import React from 'react';
import { CirclePlusIcon as PlusIcon } from 'wix-rich-content-ui-components';
import styles from './styles/floating-add-plugin-menu.scss';

type PlusButtonProps = {
  onClick: () => void;
  position?: { top: string };
  isRotate?: boolean;
};

const PlusButton = React.forwardRef(
  ({ position, onClick, isRotate }: PlusButtonProps, ref: React.RefObject<HTMLButtonElement>) => {
    const transform = isRotate && { transform: `rotate(45deg)` };

    return (
      <button
        data-hook={'addPluginFloatingToolbar'}
        ref={ref}
        onClick={onClick}
        className={styles.floatingAddPluginMenu_plus_button}
        style={{ ...position, ...transform }}
      >
        <PlusIcon />
      </button>
    );
  }
);

export default PlusButton;
