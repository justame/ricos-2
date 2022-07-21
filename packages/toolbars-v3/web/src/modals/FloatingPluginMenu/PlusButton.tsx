import React from 'react';
import classNames from 'classnames';
import { CirclePlusIcon as PlusIcon } from 'wix-rich-content-ui-components';
import styles from './styles/floating-add-plugin-menu.scss';

type PlusButtonProps = {
  onClick: () => void;
  position?: { top: string };
  rotate?: boolean;
};

const PlusButton = React.forwardRef(
  ({ position, onClick, rotate }: PlusButtonProps, ref: React.RefObject<HTMLButtonElement>) => (
    <button
      data-hook={'addPluginFloatingToolbar'}
      ref={ref}
      onClick={onClick}
      className={classNames(styles.floatingAddPluginMenu_plus_button, {
        [styles.floatingAddPluginMenu_plus_button_rotate]: rotate,
      })}
      style={position}
    >
      <PlusIcon />
    </button>
  )
);

export default PlusButton;
