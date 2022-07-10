/* eslint-disable @typescript-eslint/ban-types */
import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import { SliderPanel } from 'wix-rich-content-ui-components';

interface Props {
  onChange: (value: number) => void;
  getValue: () => number;
  min: number;
  max: number;
  inputMin?: number;
  inputMax?: number;
}

const SliderModal: FC<Props> = props => {
  const { theme, languageDir } = useContext(RicosContext);
  return (
    <SliderPanel
      theme={theme}
      languageDir={languageDir}
      {...props}
      onChange={() => props.onChange}
    />
  );
};

export default SliderModal;
