import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, ActionButtons, BUTTON_SIZE } from 'wix-rich-content-ui-components';
import styles from '../link-action-buttons.scss';
import { mergeStyles } from 'wix-rich-content-common';

class LinkActionsButtons extends PureComponent {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  render() {
    const { styles } = this;
    const {
      isActive,
      t,
      tabIndex,
      isDoneButtonEnable,
      onCancel,
      onDelete,
      onSave,
      basicLinkPanel,
      hideUrlInput,
      isMobile,
      basicDisplay,
    } = this.props;
    const removeButtonText = t('LinkPanelContainer_RemoveButton');
    const showRemoveButton = isActive && !hideUrlInput && !isMobile;
    const saveLabel = t('SettingsPanelFooter_Save');

    return basicDisplay && !isMobile ? (
      <Button
        dataHook="actionButtonSave"
        disabled={!isDoneButtonEnable}
        onClick={onSave}
        size={BUTTON_SIZE.medium}
        theme={this.theme}
      >
        {saveLabel}
      </Button>
    ) : (
      <div
        className={classNames(styles.LinkButtons_wrapper, {
          [styles.LinkButtons_wrapper_mobile]: isMobile,
          [styles.LinkButtons_wrapper_row_reverse]: !showRemoveButton,
          [styles.multiSelectLinkPanel_wrapper]: !basicLinkPanel,
        })}
      >
        {showRemoveButton && (
          <div>
            <Button
              tabIndex={tabIndex}
              data-hook="linkPanelContainerRemove"
              onClick={onDelete}
              theme={this.theme}
              secondary
              borderless
            >
              {removeButtonText}
            </Button>
          </div>
        )}

        <div
          className={classNames(styles.actionButtons_wrapper, {
            [styles.actionButtons_wrapper_mobile]: isMobile,
          })}
        >
          <ActionButtons
            size={BUTTON_SIZE.tiny}
            isMobile={isMobile}
            onCancel={onCancel}
            onSave={onSave}
            theme={this.theme}
            disableSave={!isDoneButtonEnable}
            t={t}
          />
        </div>
      </div>
    );
  }
}

LinkActionsButtons.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  tabIndex: PropTypes.number,
  isDoneButtonEnable: PropTypes.bool,
  basicLinkPanel: PropTypes.bool,
  hideUrlInput: PropTypes.bool,
  isMobile: PropTypes.bool,
  cancelLabel: PropTypes.string,
  saveLabel: PropTypes.string,
  basicDisplay: PropTypes.bool,
};

export default LinkActionsButtons;
