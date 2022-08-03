import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LinkPanelWrapper from './LinkPanelWrapper';
import { FocusManager, SettingsMobileHeader } from 'wix-rich-content-ui-components';
import { mergeStyles } from 'wix-rich-content-common';
import styles from '../link-panel.scss';
import LinkActionsButtons from './LinkActionsButtons';

class BasicLinkPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  render() {
    const { styles } = this;
    const {
      ariaProps,
      showNewTabCheckbox,
      showNoFollowCheckbox,
      showSponsoredCheckbox,
      sharedPanelsProps,
      buttonsProps,
      linkPanelValues,
      onChangeLinkPanel,
      isMobile,
      hasCheckboxes = true,
      t,
    } = this.props;
    const linkPanelContainerClassName = classNames(styles.basic_linkPanel_container, {
      [styles.basic_linkPanel_container_isMobile]: isMobile,
      [styles.basicPanel]: !hasCheckboxes,
    });
    const showSeparator = hasCheckboxes && !isMobile;
    const renderActionButtons = () =>
      isMobile ? (
        <SettingsMobileHeader {...buttonsProps} title={t('MobileLinkModal_Title')} />
      ) : (
        <LinkActionsButtons basicLinkPanel {...buttonsProps} basicDisplay={!hasCheckboxes} />
      );

    return (
      <FocusManager
        className={linkPanelContainerClassName}
        data-hook="linkPanelContainer"
        role="form"
        {...ariaProps}
      >
        <div className={styles.linkPanel_wrapper}>
          <LinkPanelWrapper
            linkValues={linkPanelValues}
            onChange={onChangeLinkPanel}
            showNewTabCheckbox={showNewTabCheckbox}
            showNoFollowCheckbox={showNoFollowCheckbox}
            showSponsoredCheckbox={showSponsoredCheckbox}
            hasCheckboxes={hasCheckboxes}
            {...sharedPanelsProps}
          />
        </div>
        {showSeparator && <div className={styles.linkPanel_actionsDivider} role="separator" />}
        {renderActionButtons()}
      </FocusManager>
    );
  }
}

BasicLinkPanel.propTypes = {
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  ariaProps: PropTypes.object,
  showNewTabCheckbox: PropTypes.bool,
  showNoFollowCheckbox: PropTypes.bool,
  showSponsoredCheckbox: PropTypes.bool,
  sharedPanelsProps: PropTypes.object,
  buttonsProps: PropTypes.object,
  changeRadioGroup: PropTypes.func,
  linkPanelValues: PropTypes.object,
  onChangeLinkPanel: PropTypes.func,
  isMobile: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
};

export default BasicLinkPanel;
