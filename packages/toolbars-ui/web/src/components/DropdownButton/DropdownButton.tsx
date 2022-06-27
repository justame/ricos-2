/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useContext } from 'react';
import type { ReactElement, ComponentType } from 'react';
import cx from 'classnames';
import styles from './DropdownButton.scss';
import { DropdownArrowIcon } from '../../icons';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import { RicosContext, ModalContext } from 'ricos-context';
import { DropdownPanel } from '../DropdownPanel';

type Props = {
  Icon: ComponentType;
  tooltip: string;
  dataHook: string;
  options: ReactElement[];
};

const DropdownButton = ({ Icon, dataHook, tooltip, options }: Props) => {
  const { isMobile, t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  const modalComponent = (
    <div tabIndex={-1} className={styles.modal}>
      <DropdownPanel options={options} />
    </div>
  );

  const onClick = () => {
    modalService?.openModal({
      Component: () => modalComponent,
      id: dataHook,
      layout: isMobile ? 'drawer' : 'toolbar',
      positioning: { referenceElement, placement: 'bottom' },
    });
  };

  return (
    <Tooltip key={t(tooltip)} content={t(tooltip)} tooltipOffset={{ x: 0, y: -8 }}>
      <div
        className={cx(styles.dropdownModalButtonWrapper, {
          [styles.mobileDropdownModalButtonWrapper]: isMobile,
        })}
        ref={setReferenceElement}
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
