/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Styles from './customPanelStyles.scss';
import { mergeStyles } from 'wix-rich-content-common';
import { InfoIconComponent } from 'wix-rich-content-ui-components';
import classNames from 'classnames';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';

const onKeyDown = (e, onClick, onClose, clickFromKeyBoard?: boolean) => {
  if (e.keyCode === KEYS_CHARCODE.ENTER) {
    e.preventDefault();
    clickFromKeyBoard ? onClick(true) : onClick();
  } else if (e.keyCode === KEYS_CHARCODE.ESCAPE) {
    onClose();
  }
};

const UpdateHeadingPanel = ({
  optionName,
  theme,
  onApply,
  onUpdate,
  onReset,
  t,
  resetEnabled,
  updateEnabled,
  onClose,
}) => {
  const styles = mergeStyles({ styles: Styles, theme });
  const updateButtonDisabled = !updateEnabled();
  const resetButtonDisabled = !resetEnabled();
  return (
    <div className={styles.panel}>
      <div
        className={styles.panel_row}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <div
          className={classNames(styles.panel_row, styles.buttonComponent)}
          onClick={() => onApply(false)}
          onKeyDown={e => onKeyDown(e, onApply, onClose, true)}
        >
          {t('FormattingToolbar_TextStyle_Heading_Apply', { optionName })}
        </div>
      </div>
      <div className={styles.separator} />
      <div
        className={styles.panel_row}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={updateButtonDisabled ? -1 : 0}
      >
        <div
          className={classNames(styles.buttonComponent, updateButtonDisabled && styles.disabled)}
          onClick={() => !updateButtonDisabled && onUpdate()}
          onKeyDown={e => !updateButtonDisabled && onKeyDown(e, onUpdate, onClose)}
        >
          {t('FormattingToolbar_TextStyle_Heading_Update', { optionName })}
        </div>
        <InfoIconComponent
          tooltipText={t('FormattingToolbar_TextStyle_Update_Heading_Tooltip')}
          size={{ height: 16, width: 16 }}
          iconStyles={classNames(updateButtonDisabled && styles.disabled_icon)}
        />
      </div>
      <div
        className={styles.panel_row}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={resetButtonDisabled ? -1 : 0}
      >
        <div
          className={classNames(
            styles.panel_row,
            styles.buttonComponent,
            resetButtonDisabled && styles.disabled
          )}
          onClick={() => !resetButtonDisabled && onReset()}
          onKeyDown={e => !resetButtonDisabled && onKeyDown(e, onReset, onClose)}
        >
          {t('FormattingToolbar_TextStyle_Heading_Reset')}
        </div>
      </div>
    </div>
  );
};

export default UpdateHeadingPanel;
