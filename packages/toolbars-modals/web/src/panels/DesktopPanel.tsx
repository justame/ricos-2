/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';
import Styles from './styles.scss';
import { mergeStyles } from 'wix-rich-content-common';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import classNames from 'classnames';
import { findOsName } from '../utils';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import ArrowIcon from './ArrowIcon';
import { FocusManager } from 'wix-rich-content-ui-components';
import type { TranslationFunction } from 'ricos-types';

const DesktopPanel = ({
  currentSelect,
  options,
  onChange,
  customPanelOptions,
  customPanelName,
  theme,
  sizeFitContent,
  t,
  displayIconAndText,
  externalFocus,
}: {
  currentSelect?: any;
  options?: any;
  onChange?: any;
  customPanelOptions?: any;
  customPanelName?: string;
  theme?: any;
  sizeFitContent?: boolean;
  t: TranslationFunction;
  displayIconAndText?: boolean;
  externalFocus?: boolean;
}) => {
  const styles = mergeStyles({ styles: Styles, theme });
  const osName = findOsName();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = panelRef.current as HTMLDivElement;
    !externalFocus && setTimeout(() => ref.focus(), 0); // setTimeout is needed for popper to place the modal first
  }, []);

  const optionElement = (option, isSelected, onClick, onHover) => {
    const content = option.icon && !displayIconAndText ? option.icon() : t(option.text);
    const dataHook = option.dataHook || 'modal-option';
    const onKeyDown = e => {
      if (e.keyCode === KEYS_CHARCODE.ENTER) {
        onClick(option.commandKey, true);
      }
    };
    const onOptionHover = () => {
      const openOption = customPanelOptions?.openOption;
      if (option.modal && openOption && openOption !== option.commandKey) {
        onHover('');
      }
    };
    return (
      <div
        className={styles.panel_row_container}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={e => {
          const eventTarget = e.target;
          onHover &&
            setTimeout(() => {
              eventTarget === document.activeElement && onHover(option.commandKey);
            }, 0);
        }}
        onMouseOver={onOptionHover}
        key={option.commandKey}
      >
        <Tooltip
          content={t?.(
            option?.tooltip,
            option?.tooltipShortcut &&
              osName && {
                shortcut: option.tooltipShortcut[osName],
              }
          )}
        >
          <div
            className={classNames(styles.panel_row_desktop, {
              [styles.panel_selectedRow]: isSelected,
            })}
            onClick={() => onClick(option.commandKey)}
            data-hook={dataHook}
          >
            <div className={styles.panel_row_text_container}>
              {displayIconAndText ? (
                <div className={styles.panel_row_primary}>
                  {option.icon()}
                  <div className={styles.panel_row_text} style={option.style}>
                    {content}
                  </div>
                </div>
              ) : (
                <div className={styles.panel_row_text} style={option.style}>
                  {content}
                </div>
              )}
              {option.subText && <div className={styles.panel_row_subtext}>{option.subText}</div>}
            </div>
            {option.modal && (
              // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
              <div
                className={styles.panel_row_arrow_container}
                onMouseOver={() => setTimeout(() => onHover(option.commandKey), 0)}
              >
                <div className={styles.panel_row_arrow}>
                  <ArrowIcon />
                </div>
              </div>
            )}
          </div>
        </Tooltip>
        {option.modal && customPanelOptions?.openOption === option.commandKey && option.modal}
      </div>
    );
  };

  const dropDownPanel = (
    <div
      tabIndex={-1}
      ref={panelRef}
      data-hook="toolbars-modal-desktopPanel"
      className={classNames(styles.desktopPanel, {
        [styles.desktopPanel_fitContent]: sizeFitContent,
        [styles.desktopPanel_withInlineModal]: customPanelOptions?.inline,
      })}
    >
      {options.map(option =>
        optionElement(
          option,
          (currentSelect?.['line-height'] ?? currentSelect) === option.commandKey,
          onChange,
          customPanelOptions?.inline && customPanelOptions.onOpen
        )
      )}
      {customPanelOptions && !customPanelOptions.inline && (
        <>
          <div className={styles.separator} />
          <button
            className={styles.showCustomPanel_button}
            data-hook="modal-option"
            onClick={customPanelOptions.onOpen}
          >
            {customPanelName}
          </button>
        </>
      )}
    </div>
  );
  return externalFocus ? dropDownPanel : <FocusManager>{dropDownPanel}</FocusManager>;
};

export default DesktopPanel;
