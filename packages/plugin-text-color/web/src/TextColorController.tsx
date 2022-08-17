import React, { useContext } from 'react';
import { RicosContext, ToolbarContext } from 'ricos-context';
import { getLangDir } from 'wix-rich-content-common';
import { ColorPicker } from 'wix-rich-content-plugin-commons';
import { colorPicker, extractPalette } from './TextColorPicker';

export const TextColorController = () => {
  const {
    isMobile,
    theme,
    locale,
    getEditorCommands,
    colorPickerData: {
      TEXT_COLOR: { colorScheme, userColors = [], onColorAdded = () => {} },
    },
  } = useContext(ToolbarContext);
  const palette = extractPalette(colorScheme);
  const paletteColors = isMobile ? palette.slice(0, 5) : palette.slice(0, 6);
  const currentColor = getEditorCommands()?.getColor('ricos-text-color');
  const onChange = ({ color }) => {
    getEditorCommands()?.insertDecoration('ricos-text-color', { color });
  };
  const onCustomColorAdded = ({ color }) => onColorAdded(color);

  const onResetColor = () => {
    getEditorCommands()?.deleteDecoration('ricos-text-color');
  };

  const { t } = useContext(RicosContext);
  return (
    <div dir={getLangDir(locale)}>
      <ColorPicker
        color={currentColor}
        palette={paletteColors}
        userColors={userColors.slice(-12)}
        onColorAdded={onCustomColorAdded}
        theme={theme}
        isMobile={isMobile}
        onChange={onChange}
        t={t}
        onResetColor={onResetColor}
      >
        {colorPicker({ isMobile, header: t('Color_Picker_TextColorButton_Header') })}
      </ColorPicker>
    </div>
  );
};
