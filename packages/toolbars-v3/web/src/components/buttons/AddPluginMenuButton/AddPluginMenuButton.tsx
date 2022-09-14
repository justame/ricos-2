/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import styles from './AddPluginMenuButton.scss';
import { ModalContext } from 'ricos-context';
import { PLUGIN_MENU_MODAL_ID } from 'ricos-types';
import type { ModalService } from 'ricos-types';

const AddPluginMenuButton = ({ toolbarItem }) => {
  const Icon = toolbarItem.presentation?.icon;
  const modalService: ModalService = useContext(ModalContext) || {};
  return (
    <div className={styles.toggleButtonWrapper}>
      <div
        onMouseDown={e => e.preventDefault()}
        className={styles.toggleButton}
        role="button"
        onClick={() => {
          modalService?.openModal(PLUGIN_MENU_MODAL_ID, {
            positioning: { placement: 'bottom' },
            layout: 'drawer',
          });
        }}
        tabIndex={0}
      >
        <Icon />
      </div>
    </div>
  );
};

export default AddPluginMenuButton;
