import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SPOILER_TYPE } from '../types';
import { InlineToolbarButton, RichUtils, FORMATTING_BUTTONS } from 'wix-rich-content-editor-common';
import { SpoilerButtonIcon } from 'wix-rich-content-plugin-commons';

export default class TextSpoilerButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  handleClick = event => {
    event.preventDefault();
    const { isActive } = this.state;
    const { getEditorState, setEditorState } = this.props;
    setEditorState(RichUtils.toggleInlineStyle(getEditorState(), SPOILER_TYPE));
    this.setState({ isActive: !isActive });
  };

  componentWillReceiveProps() {
    this.setState({ isActive: this.isActive() });
  }

  isActive = () => {
    const { getEditorState } = this.props;
    if (getEditorState) {
      return getEditorState().getCurrentInlineStyle().has(SPOILER_TYPE);
    } else {
      return false;
    }
  };

  render() {
    const { theme, helpers, isMobile, tabIndex, t, disabled } = this.props;
    const { isActive } = this.state;
    return (
      <InlineToolbarButton
        onClick={this.handleClick}
        helpers={helpers}
        theme={theme}
        isMobile={isMobile}
        tooltipText={t('Spoiler_Insert_Tooltip')}
        dataHook={'textSpoilerButton'}
        formattingButtonName={FORMATTING_BUTTONS.SPOILER}
        tabIndex={tabIndex}
        icon={SpoilerButtonIcon}
        isActive={isActive}
        pluginType={SPOILER_TYPE}
        disabled={disabled}
      />
    );
  }
}

TextSpoilerButton.propTypes = {
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  theme: PropTypes.object,
  helpers: PropTypes.object,
  isMobile: PropTypes.bool,
  t: PropTypes.func,
  tabIndex: PropTypes.number,
  config: PropTypes.object,
  adjustment: PropTypes.number,
  tooltipKey: PropTypes.string,
  dataHook: PropTypes.string,
  icon: PropTypes.object,
  disabled: PropTypes.bool,
};
