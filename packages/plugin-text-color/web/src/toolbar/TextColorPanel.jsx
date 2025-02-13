import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from 'wix-rich-content-plugin-commons';
import { Modifier, EditorState, getSelectionStyles } from 'wix-rich-content-editor-common';
import { DEFAULT_STYLE_SELECTION_PREDICATE } from '../constants';
import { getColor } from '../text-decorations-utils';

import {
  extractColor,
  extractPalette,
  extractSchemeAttributes,
  validateColorScheme,
} from '../color-scheme-utils';

export default class TextColorPanel extends Component {
  constructor(props) {
    super(props);
    this.styleSelectionPredicate = props.predicate(
      props.settings.styleSelectionPredicate || DEFAULT_STYLE_SELECTION_PREDICATE
    );
    if (props.settings.colorScheme && !validateColorScheme(props.settings.colorScheme)) {
      console.error('Error: colorScheme is not valid'); // eslint-disable-line no-console
    }
    this.currentColors = getSelectionStyles(props.editorState, this.styleSelectionPredicate);
    this.state = {
      currentColor:
        this.currentColors.length > 0
          ? extractColor(props.settings.colorScheme, getColor(this.currentColors[0]))
          : this.props.defaultColor,
      currentSchemeColor: this.currentColors[0] && getColor(this.currentColors[0]),
      userColors: props.settings.getUserColors() || [],
    };
    this.setColor = this.setColor.bind(this);
    this.onColorAdded = this.onColorAdded.bind(this);
  }

  componentWillUnmount() {
    this.props.setKeepToolbarOpen(false);
  }

  setColor({ color: colorName } = {}) {
    let { editorState, settings, defaultColor, onSelect, styleMapper, predicate } = this.props;
    const newColorHex = colorName && extractColor(settings.colorScheme, colorName);
    editorState = getInlineColorState(colorName, editorState, settings, styleMapper, predicate);
    this.setState({
      currentColor: newColorHex || defaultColor,
      currentSchemeColor: colorName || (this.currentColors[0] && getColor(this.currentColors[0])),
    });
    this.props.closeModal(editorState);
    onSelect && onSelect(colorName);
  }

  onColorAdded({ color }) {
    this.props.settings.onColorAdded(color);
    this.setState({
      userColors: this.props.settings.getUserColors() || [],
    });
  }

  render() {
    const { theme, settings, t, setKeepToolbarOpen, isMobile, defaultColor, colorPickerHeaderKey } =
      this.props;
    const { colorScheme } = settings;
    const palette = extractPalette(colorScheme);
    const schemeAttributes = extractSchemeAttributes(colorScheme);
    const { onCustomPickerToggle, onCustomColorPicked } = settings;
    const paletteColors = isMobile ? palette.slice(0, 5) : palette.slice(0, 6);
    return (
      <ColorPicker
        schemeAttributes={schemeAttributes}
        schemeColor={this.state.currentSchemeColor}
        color={this.state.currentColor}
        defaultColor={defaultColor}
        palette={paletteColors}
        userColors={this.state.userColors.slice(0, 17)}
        onColorAdded={this.onColorAdded}
        onChange={this.setColor}
        onResetColor={this.setColor}
        onCustomPickerToggle={onCustomPickerToggle}
        onCustomColorPicked={onCustomColorPicked}
        theme={theme}
        t={t}
        setKeepToolbarOpen={setKeepToolbarOpen}
        isMobile={isMobile}
      >
        {({
          renderPalette,
          renderUserColors,
          renderAddColorButton,
          renderResetColorButton,
          mergedStyles,
        }) => (
          <>
            {isMobile && (
              <>
                <div className={mergedStyles.colorPicker_header}>{t(colorPickerHeaderKey)}</div>
                <div className={mergedStyles.colorPicker_separator} />
              </>
            )}
            <div className={mergedStyles.colorPicker_palette}>
              <div className={mergedStyles.colorPicker_buttons_container}>
                {renderPalette()}
                {renderUserColors()}
                {isMobile && renderAddColorButton()}
              </div>
              {!isMobile && (
                <>
                  <hr className={mergedStyles.colorPicker_separator} />
                  <div className={mergedStyles.colorPicker_bottom_container}>
                    {renderResetColorButton()}
                    {renderAddColorButton()}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </ColorPicker>
    );
  }
}

TextColorPanel.propTypes = {
  editorState: PropTypes.object.isRequired,
  setEditorState: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  uiSettings: PropTypes.object,
  settings: PropTypes.shape({
    onColorAdded: PropTypes.func.isRequired,
    colorScheme: PropTypes.object,
    getUserColors: PropTypes.func,
    onCustomPickerToggle: PropTypes.func,
    onCustomColorPicked: PropTypes.func,
    styleSelectionPredicate: PropTypes.func,
  }).isRequired,
  setKeepToolbarOpen: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  styleMapper: PropTypes.func.isRequired,
  predicate: PropTypes.func,
  defaultColor: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  colorPickerHeaderKey: PropTypes.string,
};

export const getInlineColorState = (color, editorState, settings, styleMapper, predicate) => {
  const styleSelectionPredicate = predicate(
    (settings && settings.styleSelectionPredicate) || DEFAULT_STYLE_SELECTION_PREDICATE
  );
  const selection = editorState.getSelection();
  const currentColors = getSelectionStyles(editorState, styleSelectionPredicate);
  const newEditorState = currentColors.reduce((nextEditorState, prevColor) => {
    const contentState = nextEditorState.getCurrentContent();
    const nextContentState = Modifier.removeInlineStyle(contentState, selection, prevColor);
    return EditorState.push(nextEditorState, nextContentState, 'change-inline-style');
  }, editorState);
  let contentState = newEditorState.getCurrentContent();
  if (color) {
    contentState = Modifier.applyInlineStyle(contentState, selection, styleMapper(color));
  }
  return EditorState.push(newEditorState, contentState, 'change-inline-style');
};
