/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import classNames from 'classnames';
import { CloseIcon } from 'wix-rich-content-ui-components';
import styles from './styles.scss';

const Separator = () => <div className={styles.separator} />;

const MobilePanel = ({ currentSelect, panelHeader, onChange, onCancel, options, t }) => {
  const lineHeightElement = (option, isSelected, showSeparator) => {
    const fontSize = option.style?.fontSize;
    const fontFamily = option.style?.fontFamily;
    const dataHook = option.dataHook || 'modal-option';
    return (
      <div>
        <div
          className={classNames(styles.panel_row, {
            [styles.panel_selectedRow]: isSelected,
          })}
          key={option.commandKey}
          onClick={e => {
            e.stopPropagation();
            onChange(option.commandKey);
          }}
          data-hook={dataHook}
        >
          <div className={styles.panel_row_text_container}>
            {option.icon && <div className={styles.panel_row_icon}>{option.icon()}</div>}
            <div className={styles.panel_row_text} style={{ fontSize, fontFamily }}>
              {t(option.text)}
            </div>
            {option.subText && <div className={styles.panel_row_subtext}>{option.subText}</div>}
          </div>
        </div>
        {showSeparator && <Separator />}
      </div>
    );
  };

  return (
    <div className={styles.mobilePanel}>
      <div className={styles.mobilePanel_header}>
        {panelHeader}
        <CloseIcon
          className={styles.closeIcon}
          data-hook="toolbar-modal-close-icon"
          onClick={onCancel}
        />
      </div>
      <Separator />
      <div className={styles.mobilePanel_rows}>
        {options.map((option, i) => {
          const isSelected =
            (currentSelect?.['line-height'] ?? currentSelect) === option.commandKey;
          const showSeparator = i !== options.length - 1;
          return lineHeightElement(option, isSelected, showSeparator);
        })}
      </div>
    </div>
  );
};

export default MobilePanel;
