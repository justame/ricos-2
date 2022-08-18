/* eslint-disable jsx-a11y/click-events-have-key-events */
import cx from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ModalContext, withToolbarContext } from 'ricos-context';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import { DropdownArrowIcon } from '../../../icons';
import styles from './FontSizeButton.scss';

const onInputChange = (e, setInputValue, toolbarItem) => {
  const { value } = e.target;
  const valueAsNumber = Number.parseInt(value);
  if (!valueAsNumber && value !== '') return;
  setInputValue(value);
  toolbarItem.commands?.setFontSizeWithoutFocus(value);
};

const FontSizeButton = ({ toolbarItem, context, dataHook }) => {
  const { t } = context || {};
  const modalService = useContext(ModalContext) || {};
  const inputRef = useRef<HTMLInputElement>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<number | string>('');

  useEffect(() => {
    setInputValue(selectedFontSize);
  }, [toolbarItem.attributes.selectedFontSize]);

  const selectedFontSize = toolbarItem.attributes.selectedFontSize;

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
      <div style={{ boxSizing: 'border-box' }}>
        <div
          className={cx(
            styles.fontSizeModalButtonWrapper,
            modalService.isModalOpen('fontSizeModal') ? styles.active : ''
          )}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            className={styles.fontSizeModalButton}
            role="button"
            onClick={() => toolbarItem.commands?.click({ referenceElement })}
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
