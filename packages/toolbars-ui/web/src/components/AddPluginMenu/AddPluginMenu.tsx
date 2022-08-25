import React, { useContext } from 'react';
import { EditorContext, RicosContext } from 'ricos-context';
import type { AddPluginMenuConfig, PluginAddButtons, PluginMenuItem } from 'ricos-types';
import type { Helpers } from 'wix-rich-content-common';
import { AddPluginMenu as AddPluginMenuComponent } from 'wix-rich-content-editor';
import PluginMenuButton from './PluginMenuButton';

interface Props {
  addButtons: PluginAddButtons;
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
  const { getEditorCommands } = useContext(EditorContext);

  const renderPluginButton = (menuItem: PluginMenuItem, onButtonVisible: () => void) => {
    const {
      presentation: { dataHook = '', label = '', icon = () => null, tooltip = '' } = {},
      getClickHandler,
    } = menuItem;
    const onClick = getClickHandler(getEditorCommands(), referenceElement?.current);
    return (
      <PluginMenuButton
        dataHook={dataHook}
        Icon={icon}
        label={label}
        onClick={onClick}
        tooltipText={tooltip}
        t={t}
        languageDir={languageDir}
        onButtonVisible={onButtonVisible}
      />
    );
  };

  const pluginMenuButtons: IPluginMenuButton[] = addButtons.asArray().map(addButton => {
    const menuItem = addButton.toPluginMenuItem();
    return {
      component: ({ onButtonVisible }: { onButtonVisible: () => void }) =>
        renderPluginButton(menuItem, onButtonVisible),
      name: menuItem.id,
      section: menuItem.section,
      searchTags: addButton.getTags(),
    };
  });

  const getPluginsByTag = tag => addButtons.byTag(tag).map(addButton => addButton.getButton().id);

  return (
    <AddPluginMenuComponent
      getPluginsByTag={getPluginsByTag}
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
