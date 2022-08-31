import React, { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';
import { PluginsContext, RicosContext } from 'ricos-context';
import styles from '../../statics/styles/footer-toolbar.scss';
import type { ToolbarSettings } from 'ricos-common';
import { getDefaultToolbarSettings } from 'wix-rich-content-editor';
import { TOOLBARS, mergeToolbarSettings } from 'wix-rich-content-editor-common';

type Props = {
  toolbarSettings?: ToolbarSettings;
};

export const FooterToolbarPlaceholder: FC<Props> = ({ toolbarSettings }) => {
  const [shouldCreate, setShouldCreate] = useState(false);
  const { isMobile } = useContext(RicosContext);
  const plugins = useContext(PluginsContext);

  const getFooterToolbarSettings = () => {
    const pluginButtons = plugins
      .getAddButtons()
      .asArray()
      .map(b => b.toToolbarButtonSettings());

    const defaultSettings = getDefaultToolbarSettings({ pluginButtons });
    let customSettings;
    if (toolbarSettings?.getToolbarSettings) {
      customSettings = toolbarSettings.getToolbarSettings({ pluginButtons });
    }
    const finalToolbarSettings = customSettings
      ? mergeToolbarSettings({ defaultSettings, customSettings })
      : defaultSettings;

    return finalToolbarSettings.find(toolbar => toolbar.name === TOOLBARS.FOOTER);
  };

  useEffect(() => {
    const shouldCreate = !isMobile && !!getFooterToolbarSettings()?.shouldCreate?.()?.desktop;
    setShouldCreate(shouldCreate);
  }, []);

  return shouldCreate ? (
    <div className={styles.footerToolbarPlaceholder} data-hook="footerToolbarPlaceholder" />
  ) : null;
};
