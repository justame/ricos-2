/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import type { ComponentType } from 'react';
import cx from 'classnames';
import styles from './DropdownButton.scss';
import { DropdownArrowIcon } from '../../icons';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import { RicosContext } from 'ricos-context';

type Props = {
  Icon: ComponentType;
  onClick: () => void;
  tooltip: string;
  dataHook?: string;
  setRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
};

const DropdownButton: React.FC<Props> = ({ Icon, dataHook, tooltip, onClick, setRef }) => {
  const { isMobile, t } = useContext(RicosContext) || {};
  return (
    <Tooltip key={t(tooltip)} content={t(tooltip)} tooltipOffset={{ x: 0, y: -8 }}>
      <div
        className={cx(styles.dropdownModalButtonWrapper, {
          [styles.mobileDropdownModalButtonWrapper]: isMobile,
        })}
        ref={setRef}
      >
        <div
          data-hook={dataHook}
          className={cx(styles.dropdownModalButton, {
            [styles.mobileDropdownModalButton]: isMobile,
          })}
          role="button"
          onClick={onClick}
          tabIndex={0}
        >
          <Icon />
          <DropdownArrowIcon />
        </div>
      </div>
    </Tooltip>
  );
};

export default DropdownButton;
