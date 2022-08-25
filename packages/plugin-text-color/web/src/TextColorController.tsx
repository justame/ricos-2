import type { FC } from 'react';
import React, { useContext } from 'react';
import { RicosContext, ToolbarContext } from 'ricos-context';
import { getLangDir } from 'wix-rich-content-common';
import { ColorPicker } from 'wix-rich-content-plugin-commons';
import { colorPicker, extractPalette } from './TextColorPicker';

type Props = { type: 'ricos-text-color' | 'ricos-text-highlight' };

const getConfigKey = (
  type: 'ricos-text-color' | 'ricos-text-highlight'
): 'TEXT_COLOR' | 'TEXT_HIGHLIGHT' =>
  ({
    'ricos-text-color': 'TEXT_COLOR' as const,
    'ricos-text-highlight': 'TEXT_HIGHLIGHT' as const,
  }[type]);

export const TextColorController: FC<Props> = ({ type }) => {
  const {
    isMobile,
    theme,
    locale,
    getEditorCommands,
    colorPickerData: {
      [getConfigKey(type)]: { colorScheme, getUserColors = () => [], onColorAdded = () => {} },
    },
  } = useContext(ToolbarContext);
  const palette = extractPalette(colorScheme);
  const paletteColors = isMobile ? palette.slice(0, 5) : palette.slice(0, 6);
  const currentColor = getEditorCommands()?.getColor(type);
  const onChange = ({ color }) => {
    getEditorCommands()?.insertDecoration(type, { color });
  };
  const onCustomColorAdded = ({ color }) => onColorAdded(color);

  const onResetColor = () => {
    getEditorCommands()?.deleteDecoration(type);
  };

  const { t } = useContext(RicosContext);
  return (
    <div dir={getLangDir(locale)}>
      <ColorPicker
        color={currentColor}
        palette={paletteColors}
        userColors={getUserColors().slice(-12)}
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
