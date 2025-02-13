import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HEADINGS_DROPDOWN_TYPE, mergeStyles } from 'wix-rich-content-common';
import { HEADING_TYPE_TO_ELEMENT } from '../constants';
import {
  ClickOutside,
  InlineToolbarButton,
  EditorState,
  RichUtils,
  hasBlockType,
  FORMATTING_BUTTONS,
} from 'wix-rich-content-editor-common';
import Modal from 'react-modal';
import HeadingsDropDownPanel from './HeadingPanel';
import classNames from 'classnames';
import styles from '../../statics/styles/headingButtonStyles.scss';

export default class HeadingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
      currentHeading: 'P',
    };
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.dataHookText = 'headingsDropdownButton';
  }

  componentWillReceiveProps() {
    this.findCurrentHeading();
  }

  findCurrentHeading = () => {
    const currentEditorState = this.props.getEditorState();
    const selection = currentEditorState.getSelection();
    const headingType = currentEditorState
      .getCurrentContent()
      .blockMap.get(selection.anchorKey)
      .getType();
    const currentHeading = HEADING_TYPE_TO_ELEMENT[headingType] || 'P';
    this.setState({ currentHeading });
  };

  openPanel = () => {
    this.currentEditorState = this.oldEditorState = this.props.getEditorState();
    this.selection = this.oldEditorState.getSelection();
    const { bottom, left } = this.buttonRef.getBoundingClientRect();
    this.props.setKeepOpen(true);
    this.setState({ isPanelOpen: true, panelLeft: left - 15, panelTop: bottom });
  };

  closePanel = () => {
    this.setState({ isPanelOpen: false });
    this.props.setKeepOpen(false);
  };

  updateHeading = (type, element) => {
    const { setEditorState, getEditorState, helpers } = this.props;
    const editorState = getEditorState();
    const isAddEvent = !hasBlockType(type, editorState);
    const newEditorState = RichUtils.toggleBlockType(editorState, type);
    helpers?.onToolbarButtonClick?.({
      pluginId: HEADINGS_DROPDOWN_TYPE,
      buttonName: FORMATTING_BUTTONS.HEADINGS,
      value: type,
    });
    isAddEvent && helpers?.onPluginAdd?.(type, 'FormattingToolbar');
    setEditorState(EditorState.forceSelection(newEditorState, this.selection));
    isAddEvent && helpers?.onPluginAddSuccess?.(type, 'FormattingToolbar');
    this.currentEditorState = newEditorState;
    this.setState({ currentHeading: element });
  };

  translateHeading = (option = '') => {
    const { t } = this.props;
    return option.length === 1
      ? t('FormattingToolbar_TextStyle_Paragraph')
      : t('FormattingToolbar_TextStyle_Heading', { number: option.slice(-1) });
  };

  fixEllipsis = (text = '') => {
    if (text.length > 10) {
      const number = text.slice(-1);
      if (typeof number === 'number') {
        return text.slice(0, 5) + '...' + number;
      } else {
        return text.slice(0, 6) + '...';
      }
    }
    return text;
  };

  save = (type, element) => {
    this.closePanel();
    type
      ? this.updateHeading(type, element)
      : this.props.setEditorState(
          EditorState.forceSelection(this.currentEditorState, this.selection)
        );
  };

  static getModalParent() {
    return document.querySelector('.DraftEditor-root').parentNode;
  }

  render() {
    const { theme, helpers, isMobile, t, tabIndex, toolbarName, customHeadings, inlinePopups } =
      this.props;
    const tooltipText = t('FormattingToolbar_TextStyleButton_Tooltip');
    const { isPanelOpen, panelTop, panelLeft, currentHeading } = this.state;
    const { styles } = this;
    const modalStyle = isMobile
      ? { left: 0, bottom: 0, right: 0 }
      : {
          top: panelTop,
          left: panelLeft,
        };
    const buttonContent = this.fixEllipsis(this.translateHeading(currentHeading));
    if (isMobile || toolbarName !== 'StaticTextToolbar' || !inlinePopups) {
      return (
        <InlineToolbarButton
          onClick={this.openPanel}
          isActive={isPanelOpen}
          helpers={helpers}
          theme={theme}
          isMobile={isMobile}
          tooltipText={tooltipText}
          dataHook={this.dataHookText}
          formattingButtonName={FORMATTING_BUTTONS.HEADINGS}
          tabIndex={tabIndex}
          buttonContent={buttonContent}
          showArrowIcon
          pluginType={HEADINGS_DROPDOWN_TYPE}
          ref={ref => (this.buttonRef = ref)}
        >
          <Modal
            isOpen={isPanelOpen}
            onRequestClose={() => this.save()}
            className={classNames(styles.headingsModal, {
              [styles.headingsModal_mobile]: isMobile,
            })}
            overlayClassName={classNames(styles.headingsModalOverlay, {
              [styles.headingsModalOverlay_mobile]: isMobile,
            })}
            parentSelector={HeadingButton.getModalParent}
            style={{
              content: modalStyle,
            }}
            ariaHideApp={false}
          >
            <HeadingsDropDownPanel
              customHeadingsOptions={customHeadings}
              heading={currentHeading}
              onSave={this.save}
              isMobile={isMobile}
              theme={theme}
              translateHeading={this.translateHeading}
              {...this.props}
            />
          </Modal>
        </InlineToolbarButton>
      );
    } else {
      return (
        <div className={styles.headingPopup_button}>
          <InlineToolbarButton
            onClick={this.openPanel}
            isActive={isPanelOpen}
            helpers={helpers}
            theme={theme}
            isMobile={isMobile}
            tooltipText={tooltipText}
            dataHook={this.dataHookText}
            formattingButtonName={FORMATTING_BUTTONS.HEADINGS}
            tabIndex={tabIndex}
            buttonContent={buttonContent}
            showArrowIcon
            pluginType={HEADINGS_DROPDOWN_TYPE}
            ref={ref => (this.buttonRef = ref)}
          >
            {isPanelOpen && (
              <div className={styles.headingPopup}>
                <ClickOutside onClickOutside={() => this.save()}>
                  <HeadingsDropDownPanel
                    customHeadingsOptions={customHeadings}
                    heading={currentHeading}
                    onSave={this.save}
                    isMobile={isMobile}
                    theme={theme}
                    translateHeading={this.translateHeading}
                    {...this.props}
                  />
                </ClickOutside>
              </div>
            )}
          </InlineToolbarButton>
        </div>
      );
    }
  }
}

HeadingButton.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  helpers: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
  tabIndex: PropTypes.number,
  setKeepOpen: PropTypes.func,
  customHeadings: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  toolbarName: PropTypes.string,
  inlinePopups: PropTypes.bool,
};

HeadingButton.defaultProps = {
  inlinePopups: false,
  setKeepOpen: () => {},
};
