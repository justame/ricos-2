import type { Node } from 'prosemirror-model';
import React, { useContext } from 'react';
import { EditorContext } from 'ricos-context';
import RicosToolbarComponent from '../RicosToolbarComponent';
import { Content } from '../../Content';
import ToggleButton from '../buttons/ToggleButton/ToggleButton';
import styles from './insert-plugin-toolbar.scss';
import type { AddButton, PluginAddButtons } from 'ricos-types';
import type { OverflowedItemsPosition } from '../../types';

interface Props {
  buttons: PluginAddButtons;
  referenceElement?: React.RefObject<HTMLElement>;
  onButtonClick: (button: AddButton, e: Event) => void;
  overflowedItemsPosition?: OverflowedItemsPosition;
}

const InsertPluginToolbar: React.FC<Props> = ({
  buttons,
  onButtonClick,
  overflowedItemsPosition,
}) => {
  const { getEditorCommands } = useContext(EditorContext);
  const content = Content.create<Node[]>([]);

  const renderers = buttons.asArray().reduce((result, addButton) => {
    const button = addButton.getButton();
    return {
      ...result,
      [button.id]: toolbarItem => (
        <ToggleButton toolbarItem={toolbarItem} onClick={e => onButtonClick(button, e)} />
      ),
    };
  }, {});

  return (
    <div className={styles.wrapper}>
      <RicosToolbarComponent
        toolbarItemsConfig={buttons.toToolbarButtonsConfig()}
        toolbarItemsRenders={renderers}
        content={content}
        editorCommands={getEditorCommands?.()}
        isMobile={false}
        overflowedItemsPosition={overflowedItemsPosition}
      />
    </div>
  );
};

export default InsertPluginToolbar;
