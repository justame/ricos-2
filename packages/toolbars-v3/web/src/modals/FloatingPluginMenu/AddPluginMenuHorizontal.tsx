import type { Node } from 'prosemirror-model';
import React, { useContext } from 'react';
import { EditorContext, RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
import RicosToolbarComponent from '../../components/RicosToolbarComponent';
import { Content } from '../../Content';
import ToggleButton from '../../components/buttons/ToggleButton/ToggleButton';
import styles from './styles/floating-add-plugin-menu.scss';
import { PLUGIN_MENU_MODAL_ID } from './consts';
import type { IPluginMenuButtonClick } from './types';
import { calcPluginModalLayout, calcPluginModalPlacement } from './utils';
import { UploadServiceContext } from 'wix-rich-content-common';

interface Props {
  referenceElement?: React.RefObject<HTMLElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: any;
}

const AddPluginMenuHorizontal: React.FC<Props> = ({ referenceElement, plugins }) => {
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const { languageDir, isMobile } = useContext(RicosContext) || {};
  const uploadContext = useContext(UploadServiceContext);
  const pluginModalLayout = calcPluginModalLayout(isMobile);
  const pluginModalPlacement = calcPluginModalPlacement(isMobile, languageDir);
  const content = Content.create<Node[]>([]);

  const onPluginMenuButtonClick: IPluginMenuButtonClick = (modal, command) => {
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

  const renderers = plugins
    .getAddButtons()
    .asArray()
    .reduce((result, plugin) => {
      const { button } = plugin;
      const onClick = () => onPluginMenuButtonClick(button.modal, button.command);
      return {
        ...result,
        [button.id]: toolbarItem => <ToggleButton toolbarItem={toolbarItem} onClick={onClick} />,
      };
    }, {});

  return (
    <div className={styles.floating_add_plugin_menu_hor}>
      <RicosToolbarComponent
        toolbarItemsConfig={
          plugins
            .getAddButtons()
            .asArray()
            .map(button => button.toToolbarItemConfig()) as IToolbarItemConfigTiptap[]
        }
        toolbarItemsRenders={renderers}
        content={content}
        editorCommands={getEditorCommands?.()}
        isMobile={false}
      />
    </div>
  );
};

export default AddPluginMenuHorizontal;
