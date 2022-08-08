import React, { useContext } from 'react';
import type { FC, ComponentType } from 'react';
import { RicosContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';
import styles from './toggle-button.scss';

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
    <div className={styles.buttonWrapper} ref={setRef}>
      <ToolbarButton
        isMobile={isMobile}
        active={active}
        tooltip={tooltip}
        disabled={disabled}
        onClick={onClick}
        icon={() => <Icon />}
        dataHook={dataHook}
      />
    </div>
  );
};

export default ToggleButton;
