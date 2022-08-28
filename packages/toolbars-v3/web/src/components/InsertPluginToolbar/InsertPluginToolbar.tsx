import type { Node } from 'prosemirror-model';
import React, { useContext } from 'react';
import { EditorContext, ModalContext } from 'ricos-context';
import type { PluginAddButton, PluginAddButtons } from 'ricos-types';
import { Content } from '../../Content';
import type { OverflowedItemsPosition } from '../../types';
import ToggleButton from '../buttons/ToggleButton/ToggleButton';
import RicosToolbarComponent from '../RicosToolbarComponent';
import styles from './insert-plugin-toolbar.scss';

interface Props {
  buttons: PluginAddButtons;
  referenceElement?: React.RefObject<HTMLElement>;
  onButtonClick: (button: PluginAddButton, e: Event) => void;
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
        <ToggleButton toolbarItem={toolbarItem} onClick={e => onButtonClick(addButton, e)} />
      ),
    };
  }, {});

  const modalService = useContext(ModalContext);

  return (
    <div className={styles.wrapper}>
      <RicosToolbarComponent
        toolbarItemsConfig={buttons.toToolbarButtonsConfig()}
        toolbarItemsRenders={renderers}
        content={content}
        editorCommands={getEditorCommands?.()}
        isMobile={false}
        overflowedItemsPosition={overflowedItemsPosition}
        onRequestToCloseMoreItemsModal={reason => {
          if (reason === 'clickOutside') {
            const openModals = modalService.getOpenModals();
            if (openModals.length > 0) {
              return false;
            }
          }
          return true;
        }}
      />
    </div>
  );
};

export default InsertPluginToolbar;
