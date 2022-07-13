/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useContext, useEffect } from 'react';
import type { ReactElement, ComponentType } from 'react';
import cx from 'classnames';
import styles from './DropdownButton.scss';
import { DropdownArrowIcon } from '../../icons';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import { RicosContext, ModalContext } from 'ricos-context';
import { DropdownPanel } from '../DropdownPanel';
import type { ModalService } from 'ricos-types';

type Props = {
  Icon: ComponentType;
  tooltip: string;
  id: string;
  dataHook: string;
  options: ReactElement[];
};

const DropdownButton = ({ Icon, dataHook, tooltip, options, id }: Props) => {
  const { isMobile, t } = useContext(RicosContext) || {};
  const modalService: ModalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  const ModalComponent = () => (
    <div tabIndex={-1} className={styles.modal}>
      <DropdownPanel options={options} />
    </div>
  );

  useEffect(() => {
    modalService.register({
      Component: ModalComponent,
      id,
    });
  }, []);

  useEffect(() => modalService.unregister(id), []);

  const onClick = () => {
    if (modalService?.isModalOpen(id)) {
      modalService.closeModal(id);
    } else {
      modalService?.openModal(id, {
        layout: isMobile ? 'drawer' : 'toolbar',
        positioning: { referenceElement, placement: 'bottom' },
      });
    }
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
