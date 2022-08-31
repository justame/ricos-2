import React from 'react';
import cx from 'classnames';
import styles from './ToolbarButton.scss';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

type ToolbarButtonProps = {
  isMobile?: boolean;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  onClick: (any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  dataHook?: string;
};

const ToolbarButton = React.forwardRef<HTMLButtonElement | null, ToolbarButtonProps>(
  ({ isMobile = false, active, disabled, tooltip, onClick, icon, dataHook }, ref) => {
    const Icon = icon;

    return (
      <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
        <button
          disabled={disabled}
          ref={ref}
          className={cx(styles.toggleButtonWrapper, {
            [styles.mobileToggleButtonWrapper]: isMobile,
            [styles.active]: active,
          })}
          onClick={onClick}
          onMouseDown={e => e.preventDefault()}
          data-hook={dataHook}
        >
          <div className={cx(styles.toggleButton, { [styles.mobileToggleButton]: isMobile })}>
            <Icon />
          </div>
        </button>
      </Tooltip>
    );
  }
);

export default ToolbarButton;
