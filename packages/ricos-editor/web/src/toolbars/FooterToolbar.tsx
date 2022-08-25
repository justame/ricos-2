import React, { useContext } from 'react';
import type { FC } from 'react';
import { InsertPluginToolbar } from 'wix-rich-content-toolbars-v3';
import type { AddButton } from 'ricos-types';
import { ModalContext, EditorContext, PluginsContext } from 'ricos-context';
import styles from '../../statics/styles/footer-toolbar.scss';

export const FooterToolbar: FC = () => {
  const plugins = useContext(PluginsContext);
  const modalService = useContext(ModalContext);
  const { getEditorCommands } = useContext(EditorContext);

  const onButtonClick = ({ modal, command }: AddButton, event: Event) => {
    if (modal && modalService) {
      return modalService.isModalOpen(modal.id)
        ? modalService.closeModal(modal.id)
        : modalService.openModal(modal.id, {
            positioning: {
              placement: 'bottom',
              referenceElement: event.target,
            },
            layout: 'popover',
          });
    }
    return command(getEditorCommands?.());
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
