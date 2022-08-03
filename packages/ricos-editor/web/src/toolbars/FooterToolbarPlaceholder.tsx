import React, { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';
import { RicosContext } from 'ricos-context';
import styles from '../../statics/styles/footer-toolbar.scss';
import type { ToolbarSettings } from 'ricos-common';

export const FooterToolbarPlaceholder: FC<{ toolbarSettings?: ToolbarSettings }> = () => {
  const [shouldCreate, setShouldCreate] = useState(false);
  const { isMobile } = useContext(RicosContext);

  useEffect(() => {
    const shouldCreate = !isMobile; //TODO: check by toolbarSettings
    setShouldCreate(shouldCreate);
  }, []);

  return shouldCreate ? (
    <div className={styles.footerToolbarPlaceholder} data-hook="footerToolbarPlaceholder" />
  ) : null;
};
