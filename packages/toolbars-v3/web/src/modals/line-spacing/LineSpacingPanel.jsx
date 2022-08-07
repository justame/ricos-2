/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styles from '../panels/styles.scss';
import { MobilePanel } from 'wix-rich-content-toolbars-modals';
import { DesktopPanel } from 'wix-rich-content-toolbars-modals';
import CustomPanel from './CustomPanel';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import { lineSpacingModalData as lineHeights } from '../consts';
class LineSpacingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { spacing: props.currentSelect };
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  generateOptions = () => {
    const current = this.props.currentSelect['line-height'];
    const isCurrentInOptions = lineHeights.some(lineHeight => lineHeight.text === current);
    return isCurrentInOptions
      ? lineHeights
      : [...lineHeights, { text: current, commandKey: current }].sort(
          (a, b) => Number(a.commandKey) - Number(b.commandKey)
        );
  };

  showCustomPanel = () => {
    this.setState({ isCustomPanel: true });
  };

  onChange = spacing => {
    const merged = { ...this.state.spacing, ...spacing };
    this.setState({ spacing: merged });
    this.props?.onToolbarButtonClick?.(merged['line-height']);
    this.props.onChange(merged);
  };

  onSave = (spacing, clickFromKeyboard) => {
    const merged = { ...this.state.spacing, ...spacing };
    this.props?.onToolbarButtonClick?.(merged['line-height']);
    this.props.onSave({ data: merged, clickFromKeyboard });
  };

  onCancel = e => this.props.onCancel({ clickFromKeyboard: !e.detail });

  render() {
    const { t, isMobile, theme } = this.props;
    const { isCustomPanel, spacing } = this.state;
    const { styles, showCustomPanel, onChange, onSave, onCancel, generateOptions } = this;
    const onSaveLineHeight = (height, clickFromKeyboard) =>
      onSave({ 'line-height': height }, clickFromKeyboard);
    const onChangeLineHeight = height => onChange({ 'line-height': `${height}` });
    const mobilePanelHeader = t('FormattingToolbar_LineSpacingPanelHeader');
    const customPanelName = t('LineSpacing_customSpacing');

    const panel = isMobile ? (
      <MobilePanel
        {...{
          currentSelect: this.state.spacing,
          panelHeader: mobilePanelHeader,
          options: generateOptions(),
          onChange: onChangeLineHeight,
          t,
          onCancel: this.props.closeModal,
        }}
      />
    ) : isCustomPanel ? (
      <CustomPanel
        {...{ spacing, onChange, onSave: e => onSave({}, !e.detail), onCancel, t, isMobile, theme }}
      />
    ) : (
      <DesktopPanel
        {...{
          currentSelect: this.state.spacing,
          options: generateOptions(),
          onChange: onSaveLineHeight,
          customPanelName,
          customPanelOptions: { inline: false, onOpen: showCustomPanel },
          t,
        }}
      />
    );
    return (
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

export default LineSpacingPanel;
