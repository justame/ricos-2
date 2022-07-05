import React, { useEffect } from 'react';
import type { TextDirection, TranslationFunction } from 'ricos-types';
import { ToolbarButton } from 'wix-rich-content-editor-common';
import styles from './plugin-menu-button.scss';

interface Props {
  // eslint-disable-next-line @typescript-eslint/ban-types
  Icon: React.ComponentType<{}>;
  dataHook: string;
  label?: string;
  onClick?: () => void;
  t: TranslationFunction;
  tooltipText: string;
  languageDir: TextDirection;
  onButtonVisible?: () => void;
}

const PluginMenuButton: React.FC<Props> = ({
  Icon,
  label,
  dataHook,
  onClick,
  t,
  tooltipText,
  languageDir,
  onButtonVisible,
}) => {
  useEffect(() => {
    onButtonVisible?.();
  }, []);
  const pluginButton = (
    <button
      dir={languageDir}
      data-hook={dataHook}
      className={styles.addPluginButton}
      onClick={onClick}
    >
      <Icon />
      {label && <div>{t(label)}</div>}
    </button>
  );

  return <ToolbarButton tooltipText={tooltipText} button={pluginButton} />;
};

export default PluginMenuButton;
