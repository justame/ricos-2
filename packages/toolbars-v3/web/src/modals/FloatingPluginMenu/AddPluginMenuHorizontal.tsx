import React, { useContext } from 'react';
import { EditorContext, RicosContext, ModalContext } from 'ricos-context';
import { PLUGIN_MENU_MODAL_ID } from './consts';
import { calcPluginModalLayout, calcPluginModalPlacement } from './utils';
import { UploadServiceContext } from 'wix-rich-content-common';
import InsertPluginToolbar from '../../components/InsertPluginToolbar/InsertPluginToolbar';
import type { AddButton, IEditorPlugins } from 'ricos-types';

interface Props {
  referenceElement?: React.RefObject<HTMLElement>;
  plugins: IEditorPlugins;
}

const AddPluginMenuHorizontal: React.FC<Props> = ({ referenceElement, plugins }) => {
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const { languageDir, isMobile } = useContext(RicosContext) || {};
  const uploadContext = useContext(UploadServiceContext);
  const pluginModalLayout = calcPluginModalLayout(isMobile);
  const pluginModalPlacement = calcPluginModalPlacement(isMobile, languageDir);

  const onButtonClick = ({ modal, command }: AddButton) => {
    modalService.closeModal(PLUGIN_MENU_MODAL_ID);
    return modal
      ? modalService?.openModal(modal.id, {
          positioning: {
            referenceElement: referenceElement?.current,
            placement: pluginModalPlacement,
          },
          layout: pluginModalLayout,
        })
      : command(getEditorCommands?.(), uploadContext);
  };

  return <InsertPluginToolbar buttons={plugins.getAddButtons()} onButtonClick={onButtonClick} />;
};

export default AddPluginMenuHorizontal;
