import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import { ToolbarButton } from '../ToolbarButton';
import styles from './toggle-button.scss';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: (props?: any) => JSX.Element;
  onClick: (args) => void;
  tooltip: string;
  label?: string;
  dataHook?: string;
  active?: boolean;
  disabled?: boolean;
  setRef?: (ref) => void;
}

const ToggleButton: FC<Props> = ({
  Icon,
  label,
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
        Icon={Icon}
        label={label}
        dataHook={dataHook}
      />
    </div>
  );
};

export default ToggleButton;
