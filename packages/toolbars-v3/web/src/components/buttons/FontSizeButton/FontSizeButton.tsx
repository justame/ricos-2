/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useContext, useRef } from 'react';
import cx from 'classnames';
import styles from './FontSizeButton.scss';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext, ModalContext } from 'ricos-context';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const onInputChange = (e, setInputValue, toolbarItem) => {
  const { value } = e.target;
  const valueAsNumber = Number.parseInt(value);
  if (!valueAsNumber && value !== '') return;
  setInputValue(value);
  toolbarItem.commands?.setFontSizeWithoutFocus(value);
};

const FontSizeButton = ({ toolbarItem, context, dataHook }) => {
  const id = 'fontSizeModal';
  const { t } = context || {};
  const modalService = useContext(ModalContext) || {};
  const inputRef = useRef<HTMLInputElement>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<number | string>('');
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(selectedFontSize);
  }, [toolbarItem.attributes.selectedFontSize]);

  useEffect(() => {
    modalService.onModalOpened(() => {
      modalService.isModalOpen(id) && setIsButtonActive(true);
    });
    modalService.onModalClosed(() => {
      !modalService.isModalOpen(id) && setIsButtonActive(false);
    });
  }, []);

  const selectedFontSize = toolbarItem.attributes.selectedFontSize;

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
      <div style={{ boxSizing: 'border-box' }}>
        <div
          className={cx(styles.fontSizeModalButtonWrapper, isButtonActive ? styles.active : '')}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            className={styles.fontSizeModalButton}
            role="button"
            onClick={() => toolbarItem.commands?.click(referenceElement)}
            tabIndex={-1}
          >
            <input
              className={styles.fontSizeModalInputButton}
              required
              value={inputValue}
              onChange={e => onInputChange(e, setInputValue, toolbarItem)}
              ref={inputRef}
            />
            <DropdownArrowIcon />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default withToolbarContext(FontSizeButton);
