import React, { useContext } from 'react';
import type { Helpers } from 'wix-rich-content-common';
import { UploadServiceContext } from 'wix-rich-content-common';
import type { AddButton, AddPluginMenuConfig } from 'ricos-types';
import { AddPluginMenu, SECTIONS } from 'wix-rich-content-editor';
import PluginMenuButton from './PluginMenuButton';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import type { IPluginMenuButtonClick } from './types';
import { PLUGIN_MENU_MODAL_ID } from './consts';
import { calcPluginModalLayout, calcPluginModalPlacement } from './utils';

interface Props {
  helpers: Helpers;
  pluginMenuButtonRef?: React.RefObject<HTMLElement>;
  addPluginMenuConfig?: AddPluginMenuConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: any;
}

interface IRenderPluginButton {
  (button: AddButton, onClick?: () => void, onButtonVisible?: () => void): JSX.Element;
}
interface IPluginMenuButton {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (props: { onButtonVisible?: () => void }) => JSX.Element;
  name?: string;
  section?: string;
}

const AddPluginMenuWrapper: React.FC<Props> = ({
  pluginMenuButtonRef,
  helpers,
  addPluginMenuConfig,
  plugins,
}) => {
  const { t, theme, languageDir, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);
  const uploadContext = useContext(UploadServiceContext);
  const pluginModalLayout = calcPluginModalLayout(isMobile);
  const pluginModalPlacement = calcPluginModalPlacement(isMobile, languageDir);

  const renderPluginButton: IRenderPluginButton = (
    { icon, label, tooltip },
    onClick,
    onButtonVisible
  ) => {
    return (
      <PluginMenuButton
        Icon={icon}
        label={label}
        onClick={onClick}
        tooltipText={t(tooltip)}
        t={t}
        languageDir={languageDir}
        onButtonVisible={onButtonVisible}
      />
    );
  };

  const onPluginMenuButtonClick: IPluginMenuButtonClick = (modal, command) => {
    modalService.closeModal(PLUGIN_MENU_MODAL_ID);
    return modal
      ? modalService?.openModal(modal.id, {
          positioning: {
            referenceElement: pluginMenuButtonRef?.current,
            placement: pluginModalPlacement,
          },
          layout: pluginModalLayout,
        })
      : command(getEditorCommands?.(), uploadContext);
  };

  const pluginMenuButtons: IPluginMenuButton[] = plugins
    .getAddButtons()
    .asArray()
    .map(addButton => {
      const button = addButton.getButton();
      const { command, modal } = button;
      const onButtonClick = () => onPluginMenuButtonClick(modal, command);
      return {
        component: props => renderPluginButton(button, onButtonClick, props.onButtonVisible),
        name: button.label,
        section: button.menuConfig?.group && SECTIONS[button.menuConfig?.group],
      };
    });

  return (
    <AddPluginMenu
      pluginMenuButtonRef={pluginMenuButtonRef}
      helpers={helpers}
      theme={theme}
      plugins={pluginMenuButtons}
      isMobile={isMobile}
      addPluginMenuConfig={addPluginMenuConfig}
      t={t}
      isActive
    />
  );
};

export default AddPluginMenuWrapper;
