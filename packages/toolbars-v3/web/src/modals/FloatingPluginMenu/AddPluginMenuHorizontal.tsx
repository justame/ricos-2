import React, { useContext } from 'react';
import { EditorContext } from 'ricos-context';
import type { PluginAddButton, RicosEditorPlugins } from 'ricos-types';
import InsertPluginToolbar from '../../components/InsertPluginToolbar/InsertPluginToolbar';
import styles from './styles/floating-add-plugin-menu.scss';
interface Props {
  referenceElement?: React.RefObject<HTMLElement>;
  plugins: RicosEditorPlugins;
}

const AddPluginMenuHorizontal: React.FC<Props> = ({ referenceElement, plugins }) => {
  const { getEditorCommands } = useContext(EditorContext);

  const onButtonClick = (addButton: PluginAddButton) => {
    const menuItem = addButton.toHorizontalMenuItem();
    return menuItem.getClickHandler(getEditorCommands?.(), referenceElement?.current)();
  };

  return (
    <div className={styles.addPluginMenu_horizontal_wrapper} data-hook="addPluginMenuHorizontal">
      <InsertPluginToolbar buttons={plugins.getAddButtons()} onButtonClick={onButtonClick} />
    </div>
  );
};

export default AddPluginMenuHorizontal;
