import React, { useContext } from 'react';
import type { Helpers } from 'wix-rich-content-common';
import type { AddButton, AddPluginMenuConfig, IPluginAddButtons } from 'ricos-types';
import { AddPluginMenu as AddPluginMenuComponent, SECTIONS } from 'wix-rich-content-editor';
import PluginMenuButton from './PluginMenuButton';
import { RicosContext, EditorContext, ModalContext, UploadContext } from 'ricos-context';
import { PLUGIN_MENU_MODAL_ID } from './consts';
import { calcPluginModalLayout, calcPluginModalPlacement } from './utils';

interface Props {
  addButtons: IPluginAddButtons;
  helpers?: Helpers;
  referenceElement?: React.RefObject<HTMLElement>;
  addPluginMenuConfig?: AddPluginMenuConfig;
}

interface IPluginMenuButton {
  component: (props: { onButtonVisible?: () => void }) => JSX.Element;
  name?: string;
  section?: string;
}

const AddPluginMenu: React.FC<Props> = ({
  referenceElement,
  helpers = {},
  addPluginMenuConfig,
  addButtons,
}) => {
  const { t, theme, languageDir, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const { getEditorCommands } = useContext(EditorContext);
  const uploadContext = useContext(UploadContext);
  const pluginModalLayout = calcPluginModalLayout(isMobile);
  const pluginModalPlacement = calcPluginModalPlacement(isMobile, languageDir);

  const renderPluginButton = (
    { icon, label, tooltip, dataHook }: AddButton,
    onClick: () => void,
    onButtonVisible: () => void
  ) => {
    return (
      <PluginMenuButton
        dataHook={dataHook}
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

  const onPluginMenuButtonClick = (button: AddButton) => {
    const { modal, command } = button;
    modalService.closeModal(PLUGIN_MENU_MODAL_ID);
    return modal
      ? modalService?.openModal(modal.id, {
          positioning: {
            referenceElement: referenceElement?.current,
            placement: pluginModalPlacement,
          },
          layout: pluginModalLayout,
        })
      : command(getEditorCommands?.());
  };

  const pluginMenuButtons: IPluginMenuButton[] = addButtons.asArray().map(addButton => {
    const button = addButton.getButton();
    const onButtonClick = () => onPluginMenuButtonClick(button);
    return {
      component: ({ onButtonVisible }: { onButtonVisible: () => void }) =>
        renderPluginButton(button, onButtonClick, onButtonVisible),
      name: button.label,
      section: button.menuConfig?.group && SECTIONS[button.menuConfig?.group],
    };
  });

  return (
    <AddPluginMenuComponent
      pluginMenuButtonRef={referenceElement}
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

export default AddPluginMenu;
