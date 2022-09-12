import type { FC } from 'react';
import React, { useContext } from 'react';
import { RicosContext } from 'ricos-context';
import { getLangDir } from 'wix-rich-content-common';
import { ColorPicker } from 'wix-rich-content-plugin-commons';
import { colorPicker } from './colorPicker';

type Props = {
  closeModal: () => void;
  onChange: (color) => void;
  resetColor: () => void;
  palette: string[];
  onColorAdded?: (color) => void;
  currentColor?: string;
};

export const TableColorPicker: FC<Props> = ({
  closeModal,
  onChange,
  resetColor,
  currentColor,
  onColorAdded,
  palette,
}) => {
  const { isMobile, theme, locale } = useContext(RicosContext);
  const paletteColors = isMobile ? palette.slice(0, 5) : palette.slice(0, 6);

  const onColorChange = ({ color }) => {
    onChange(color);
    closeModal();
  };

  const onResetColor = () => {
    resetColor();
    closeModal();
  };

  const { t } = useContext(RicosContext);
  return (
    <div dir={getLangDir(locale)}>
      <ColorPicker
        color={currentColor}
        palette={paletteColors}
        userColors={[]}
        onColorAdded={color => onColorAdded?.(color)}
        theme={theme}
        isMobile={isMobile}
        onChange={onColorChange}
        t={t}
        onResetColor={onResetColor}
      >
        {colorPicker({ isMobile, header: t('Color_Picker_TextColorButton_Header') })}
      </ColorPicker>
    </div>
  );
};
