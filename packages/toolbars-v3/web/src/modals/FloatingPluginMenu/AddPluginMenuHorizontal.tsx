import React, { useContext } from 'react';
import { EditorContext, RicosContext, ModalContext } from 'ricos-context';
import { UploadServiceContext } from 'wix-rich-content-common';
import InsertPluginToolbar from '../../components/InsertPluginToolbar/InsertPluginToolbar';
import type { AddButton, IEditorPlugins } from 'ricos-types';
import { LAYOUTS, PLACEMENTS } from 'ricos-modals';
import { PLUGIN_MENU_HORIZONTAL_MODAL_ID } from './consts';

interface Props {
  referenceElement?: React.RefObject<HTMLElement>;
  plugins: IEditorPlugins;
}

const AddPluginMenuHorizontal: React.FC<Props> = ({ referenceElement, plugins }) => {
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const { languageDir } = useContext(RicosContext) || {};
  const uploadContext = useContext(UploadServiceContext);

  const onButtonClick = ({ modal, command }: AddButton) => {
    modalService.closeModal(PLUGIN_MENU_HORIZONTAL_MODAL_ID);
    return modal
      ? modalService?.openModal(modal.id, {
          positioning: {
            referenceElement: referenceElement?.current,
            placement: languageDir === 'ltr' ? PLACEMENTS.RIGHT_START : PLACEMENTS.LEFT_START,
          },
          layout: LAYOUTS.POPOVER,
        })
      : command(getEditorCommands?.(), uploadContext.uploadService, uploadContext.updateService);
  };

  return <InsertPluginToolbar buttons={plugins.getAddButtons()} onButtonClick={onButtonClick} />;
};

export default AddPluginMenuHorizontal;
