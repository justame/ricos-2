import React, { useContext } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import HtmlEditPanel from './HtmlEditPanel';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentData: Record<string, any>;
  updateData: (data) => void;
  close: () => void;
};

const HtmlEditPanelTiptap: FC<Props> = ({ componentData, updateData, close }) => {
  const { t, theme } = useContext(RicosContext) || {};

  return (
    <HtmlEditPanel
      componentData={componentData}
      t={t}
      theme={theme}
      close={close}
      updateData={updateData}
    />
  );
};

export default HtmlEditPanelTiptap;
