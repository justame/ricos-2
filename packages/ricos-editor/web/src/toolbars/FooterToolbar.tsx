import React, { useContext } from 'react';
import type { FC } from 'react';
import { InsertPluginToolbar } from 'wix-rich-content-toolbars-v3';
import type { AddButton } from 'ricos-types';
import { ModalContext, EditorContext, PluginsContext } from 'ricos-context';
import { UploadServiceContext } from 'wix-rich-content-common';
import styles from '../../statics/styles/footer-toolbar.scss';

export const FooterToolbar: FC = () => {
  const plugins = useContext(PluginsContext);
  const modalService = useContext(ModalContext);
  const uploadContext = useContext(UploadServiceContext);
  const { getEditorCommands } = useContext(EditorContext);

  const onButtonClick = ({ modal, command }: AddButton, event: Event) => {
    return modal
      ? modalService?.openModal(modal.id, {
          positioning: {
            placement: 'bottom',
            referenceElement: event.target,
          },
          layout: 'popover',
        })
      : command(getEditorCommands?.(), uploadContext);
  };

  return (
    <div className={styles.footerToolbar} data-hook="footerToolbar">
      <InsertPluginToolbar buttons={plugins.getAddButtons()} onButtonClick={onButtonClick} />
    </div>
  );
};
