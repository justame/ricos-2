import React, { useContext } from 'react';
import type { ComponentType } from 'react';
import cx from 'classnames';
import styles from './DropdownButton.scss';
import { DropdownArrowIcon } from '../../icons';
import { RicosContext } from 'ricos-context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

type Props = {
  Icon: ComponentType;
  onClick: () => void;
  tooltip: string;
  dataHook?: string;
  setRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
};

const DropdownButton: React.FC<Props> = ({ Icon, dataHook, tooltip, onClick, setRef }) => {
  const { isMobile } = useContext(RicosContext) || {};

  return (
    <div ref={setRef}>
      <ToolbarButton
        isMobile={isMobile}
        tooltip={tooltip}
        onClick={onClick}
        icon={() => (
          <div className={styles.dropdownButtonIconWrapper}>
            <Icon />
            <DropdownArrowIcon />
          </div>
        )}
        dataHook={dataHook}
      />
    </div>
  );
};

export default DropdownButton;
