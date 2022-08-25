import React, { useContext } from 'react';
import { DropdownArrowIcon } from '../../icons';
import { RicosContext } from 'ricos-context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: (props?: any) => JSX.Element;
  onClick: () => void;
  tooltip: string;
  active: boolean;
  disabled?: boolean;
  dataHook?: string;
  label?: string;
  setRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
};

const DropdownButton: React.FC<Props> = ({
  Icon,
  dataHook,
  tooltip,
  onClick,
  label,
  active,
  setRef,
  disabled,
}) => {
  const { isMobile } = useContext(RicosContext) || {};

  return (
    <div ref={setRef}>
      <ToolbarButton
        isMobile={isMobile}
        tooltip={tooltip}
        onClick={onClick}
        label={label}
        active={active}
        disabled={disabled}
        Icon={Icon}
        dataHook={dataHook}
      >
        <DropdownArrowIcon />
      </ToolbarButton>
    </div>
  );
};

export default DropdownButton;
