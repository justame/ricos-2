/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styles from './customPanelStyles.scss';
import { DesktopPanel, MobilePanel } from '../panels';
import UpdateHeadingPanel from './UpdateHeadingPanel';
import classNames from 'classnames';
import { mergeStyles, GlobalContext, DOC_STYLE_TYPES } from 'wix-rich-content-common';
import { HEADER_TYPE_MAP } from 'wix-rich-content-plugin-commons';
import { getFontSizeNumber, hasStyleChanges } from '../utils';
import { omit, cloneDeep, pick, isEmpty } from 'lodash';
import { ColorsIcon } from './icons';

const DEFAULT_HEADERS_DROPDOWN_OPTIONS = Object.freeze(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P']);

class HeadingsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { openOption: '' };
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  onSaveHeading = (type, clickFromKeyboard) => {
    this.props?.onToolbarButtonClick?.(type);
    this.setState({ openOption: '' });
    return this.props.onSave({ data: type, clickFromKeyboard });
  };

  onUpdateHeading = () => {
    this.setState({ openOption: '' });
    return this.props.onChange();
  };

  onResetType = type => {
    this.props?.onToolbarButtonClick?.('Reset ' + type);
    this.setState({ openOption: '' });
    return this.props.onResetType({ [type]: {} });
  };

  getUpdatePanelModal = heading => {
    const { t, currentSelect, currentInlineStyles, documentStyle } = this.props;
    const documentStyleType = DOC_STYLE_TYPES[heading];
    const headerType = HEADER_TYPE_MAP[heading];
    return (
      <UpdateHeadingPanel
        optionName={this.props.translateHeading(heading, t)}
        onApply={clickFromKeyboard => this.onSaveHeading(headerType, clickFromKeyboard)}
        onReset={() => this.onResetType(documentStyleType)}
        onUpdate={() => this.onUpdateHeading()}
        t={this.props.t}
        resetEnabled={() => !isEmpty(documentStyle?.[documentStyleType])}
        updateEnabled={() =>
          headerType === currentSelect &&
          hasStyleChanges(currentSelect, currentInlineStyles, documentStyle)
        }
        onClose={() => this.setState({ openOption: '' })}
      />
    );
  };

  getHeadingsOptions = () => {
    return (this.props.customHeadings || DEFAULT_HEADERS_DROPDOWN_OPTIONS).map(heading => {
      let customizeOptions = {};
      if (this.props.allowHeadingCustomization) {
        const { documentStyle, wiredFontStyles } = this.props;
        const documentStyleType = DOC_STYLE_TYPES[heading];
        const optionWiredStyles = wiredFontStyles[documentStyleType];
        const subText = optionWiredStyles['font-size'];
        const fontSize = parseInt(getFontSizeNumber(subText)) > 20 ? '20px' : subText;
        const fontFamily = optionWiredStyles['font-family'];
        customizeOptions = {
          subText,
          style: { fontSize, fontFamily },
          modal: !this.props.isMobile && this.getUpdatePanelModal(heading),
          icon: () => (
            <ColorsIcon
              colors={pick(documentStyle?.[documentStyleType], ['color', 'background-color'])}
            />
          ),
        };
      }
      return {
        text: this.props.translateHeading(heading, this.props.t),
        tooltip: this.props.translateHeading(heading, this.props.t, true),
        commandKey: HEADER_TYPE_MAP[heading],
        ...customizeOptions,
      };
    });
  };

  onUpdateModalOpen = type => {
    this.setState({ openOption: type });
  };

  render() {
    const { isMobile, t, currentSelect, onCancel, allowHeadingCustomization } = this.props;
    const { openOption } = this.state;
    const panelHeader = t('FormattingToolbar_HeadingsPanelHeader');

    const panel = isMobile ? (
      <MobilePanel
        {...{
          currentSelect,
          panelHeader,
          options: this.getHeadingsOptions(),
          onChange: this.onSaveHeading,
          onCancel,
          t,
        }}
      />
    ) : (
      <DesktopPanel
        {...{
          currentSelect,
          options: this.getHeadingsOptions(),
          customPanelOptions: allowHeadingCustomization && {
            openOption,
            inline: true,
            onOpen: this.onUpdateModalOpen,
          },
          t,
          onChange: this.onSaveHeading,
          displayIconAndText: allowHeadingCustomization,
        }}
      />
    );
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={classNames(styles.panel_Container, {
          [styles.mobile_Container]: isMobile,
        })}
      >
        {panel}
      </div>
    );
  }
}

export default HeadingsPanel;
