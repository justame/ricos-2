/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Styles from '../../../../statics/styles/static-toolbar-more-button.scss';
import AddPluginMenu from '../SideToolbar/AddPluginMenu';
import classnames from 'classnames';
import { ShortcutIcon } from '../../Icons';
import ClickOutside from 'react-click-outsider';
import { TOOLBARS } from 'wix-rich-content-editor-common';
import { mergeStyles, Version } from 'wix-rich-content-common';

class MoreButton extends Component {
  constructor(props) {
    super(props);
    this.state = { showPluginMenu: false };
    this.styles = mergeStyles({ styles: Styles, theme: props.theme || {} });
    const { structure, footerToolbarConfig = {} } = props;
    const { showSearch, splitToSections } = footerToolbarConfig.morePluginsMenu || {};
    if (!splitToSections) {
      this.plugins = structure.map(plugin => ({
        ...plugin,
        section: 'BlockToolbar_Section_NoSections_ShortcutToolbar',
      }));
    } else {
      this.plugins = structure;
    }
    this.addPluginMenuConfig = {
      showSearch,
      splitToSections: true,
    };
  }

  calculatePluginMenuPosition = () => {
    if (this.moreButton && !this.state.pluginMenuPosition) {
      const clientRect = this.moreButton.getBoundingClientRect();
      const pluginMenuPosition = {
        // right: clientRect.right >= window.innerWidth && 0,
        // left: clientRect.right < window.innerWidth && clientRect.left - 135,
        top: clientRect.top < 400 && 40,
      };
      this.setState({ pluginMenuPosition });
    }
  };

  togglePopup = showPluginMenu => this.setState({ showPluginMenu });

  handleClick = () => {
    const { showPluginMenu } = this.state;
    const { helpers } = this.props;
    this.calculatePluginMenuPosition();
    if (!showPluginMenu) {
      helpers.onMenuLoad?.({
        version: Version.currentVersion,
        menu: 'SHORTCUT',
      });
    }
    this.togglePopup(!showPluginMenu);
  };

  render() {
    const { addPluginMenuProps, isActive, t, theme, forceDisabled } = this.props;
    const { pluginMenuPosition, showPluginMenu } = this.state;
    return (
      <div className={this.styles.container}>
        <div
          className={classnames(this.styles.moreButton, isActive && this.styles.active)}
          key="shorcutButton"
          onClick={this.handleClick}
          ref={ref => (this.moreButton = ref)}
          data-hook="moreButton"
        >
          <ShortcutIcon className={this.styles.icon} />
          <div className={this.styles.buttonText}>{t('Shortcut_Toolbar_ViewAll_Blocks')}</div>
        </div>
        {showPluginMenu && (
          <ClickOutside onClickOutside={() => this.togglePopup(false)} key="shortcutMenu">
            <div
              className={this.styles.shortcutPluginMenu}
              style={{ ...pluginMenuPosition }}
              onClick={event => event.stopPropagation()}
            >
              <AddPluginMenu
                {...addPluginMenuProps}
                theme={{ ...theme, buttonStyles: null }}
                t={t}
                addPluginMenuConfig={this.addPluginMenuConfig}
                plugins={this.plugins}
                isActive={showPluginMenu}
                isMobile={false}
                hidePopup={() => this.togglePopup(false)}
                pluginMenuButtonRef={this.moreButton}
                toolbarName={TOOLBARS.SHORTCUT}
                isMoreMenu
              />
            </div>
          </ClickOutside>
        )}
      </div>
    );
  }
}

MoreButton.propTypes = {
  addPluginMenuProps: PropTypes.object.isRequired,
  forceDisabled: PropTypes.bool,
  helpers: PropTypes.object,
};

export default MoreButton;
