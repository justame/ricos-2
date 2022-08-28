import type { FC } from 'react';
import React, { useContext } from 'react';
import { EditorContext, PluginsContext } from 'ricos-context';
import type { PluginAddButton } from 'ricos-types';
import { InsertPluginToolbar } from 'wix-rich-content-toolbars-v3';
import styles from '../../statics/styles/footer-toolbar.scss';

export const FooterToolbar: FC = () => {
  const plugins = useContext(PluginsContext);
  const { getEditorCommands } = useContext(EditorContext);

  const onButtonClick = (addButton: PluginAddButton, event: Event) => {
    const footerToolbarItem = addButton.toFooterToolbarItem();
    return footerToolbarItem.getClickHandler(getEditorCommands?.(), event.target as HTMLElement)();
  };

  return (
    <div className={styles.footerToolbar} data-hook="footerToolbar">
      <InsertPluginToolbar
        buttons={plugins.getAddButtons()}
        onButtonClick={onButtonClick}
        overflowedItemsPosition="top"
      />
    </div>
  );
};
