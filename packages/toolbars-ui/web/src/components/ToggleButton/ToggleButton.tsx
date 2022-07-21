/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import type { FC, ComponentType } from 'react';
import cx from 'classnames';
import styles from './toggle-button.scss';
import { RicosContext } from 'ricos-context';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

interface Props {
  Icon: ComponentType;
  onClick: (args) => void;
  tooltip: string;
  dataHook?: string;
  active?: boolean;
  disabled?: boolean;
  setRef?: (ref) => void;
}

const ToggleButton: FC<Props> = ({
  Icon,
  onClick,
  dataHook,
  tooltip,
  active,
  disabled,
  setRef,
}) => {
  const { isMobile } = useContext(RicosContext) || {};
  return (
    <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
      <div
        className={cx(styles.buttonWrapper, {
          [styles.mobileButtonWrapper]: isMobile,
          [styles.active]: active,
          [styles.disabled]: disabled,
        })}
        ref={setRef}
      >
        <div
          data-hook={dataHook}
          onMouseDown={e => e.preventDefault()}
          className={cx(styles.button, { [styles.mobileButton]: isMobile })}
          role="button"
          onClick={onClick}
          tabIndex={0}
        >
          <Icon />
        </div>
      </div>
    </Tooltip>
  );
};

export default ToggleButton;
