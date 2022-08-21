import React, { useContext } from 'react';
import { EditorContext, RicosContext, ModalContext } from 'ricos-context';
import InsertPluginToolbar from '../../components/InsertPluginToolbar/InsertPluginToolbar';
import type { AddButton, RicosEditorPlugins } from 'ricos-types';
import { PLUGIN_MENU_HORIZONTAL_MODAL_ID } from './consts';
import styles from './styles/floating-add-plugin-menu.scss';
interface Props {
  referenceElement?: React.RefObject<HTMLElement>;
  plugins: RicosEditorPlugins;
}

const AddPluginMenuHorizontal: React.FC<Props> = ({ referenceElement, plugins }) => {
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const { languageDir } = useContext(RicosContext) || {};

  const onButtonClick = ({ modal, command }: AddButton) => {
    modalService.closeModal(PLUGIN_MENU_HORIZONTAL_MODAL_ID);
    return modal
      ? modalService?.openModal(modal.id, {
          positioning: {
            referenceElement: referenceElement?.current,
            placement: languageDir === 'ltr' ? 'right-start' : 'left-start',
          },
          layout: 'popover',
        })
      : command(getEditorCommands?.());
  };

  return (
    <div className={styles.addPluginMenu_horizontal_wrapper} data-hook="addPluginMenuHorizontal">
      <InsertPluginToolbar buttons={plugins.getAddButtons()} onButtonClick={onButtonClick} />
    </div>
  );
};

export default AddPluginMenuHorizontal;
