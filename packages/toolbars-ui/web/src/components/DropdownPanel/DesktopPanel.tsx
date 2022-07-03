import React, { useRef, useEffect, useContext } from 'react';
import type { ReactElement, FC } from 'react';
import Styles from './desktop-panel.scss';
import { mergeStyles } from 'wix-rich-content-common';
import { FocusManager } from 'wix-rich-content-ui-components';
import { RicosContext } from 'ricos-context';

type Props = {
  options: ReactElement[];
  externalFocus?: boolean;
};

const DesktopPanel: FC<Props> = ({ options, externalFocus }) => {
  const { theme } = useContext(RicosContext) || {};
  const styles = mergeStyles({ styles: Styles, theme });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = panelRef.current as HTMLDivElement;
    !externalFocus && ref.focus();
  }, []);

  const dropDownPanel = (
    <div
      tabIndex={-1}
      ref={panelRef}
      data-hook="toolbars-modal-desktopPanel"
      className={styles.desktopPanel}
    >
      {options}
    </div>
  );
  return externalFocus ? dropDownPanel : <FocusManager>{dropDownPanel}</FocusManager>;
};

export default DesktopPanel;
