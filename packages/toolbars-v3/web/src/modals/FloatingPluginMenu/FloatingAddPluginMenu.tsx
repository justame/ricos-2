import React, { useContext, useRef, useEffect } from 'react';
import styles from './styles/floating-add-plugin-menu.scss';
import { PLACEMENTS, LAYOUTS } from 'ricos-modals';
import EditorSelectionToPosition from './EditorSelectionToPosition';
import PlusButton from './PlusButton';
import { PLUGIN_MENU_MODAL_ID } from 'wix-rich-content-toolbars-ui';
import { PLUGIN_MENU_HORIZONTAL_MODAL_ID } from './consts';
import { RicosContext, EditorContext, ModalContext } from 'ricos-context';
import AddPluginMenuHorizontal from './AddPluginMenuHorizontal';
import type { AddPluginMenuConfig, Helpers } from 'wix-rich-content-common';
import type { ModalService } from 'ricos-types';

interface Props {
  addPluginMenuConfig?: AddPluginMenuConfig;
  helpers?: Helpers;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: any;
}

const FloatingAddPluginMenu: React.FC<Props> = ({ addPluginMenuConfig, plugins }) => {
  const floatingMenuWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalService: ModalService = useContext(ModalContext) || {};
  const { languageDir, isMobile } = useContext(RicosContext) || {};
  const { tiptapEditor } = useContext(EditorContext);
  const isHorizontalMenu =
    !isMobile && (!addPluginMenuConfig || addPluginMenuConfig?.horizontalMenuLayout);
  const layout = LAYOUTS.TOOLBAR;
  const placement = languageDir === 'ltr' ? PLACEMENTS.RIGHT_START : PLACEMENTS.LEFT_START;
  const MODAL_ID = isHorizontalMenu ? PLUGIN_MENU_HORIZONTAL_MODAL_ID : PLUGIN_MENU_MODAL_ID;

  useEffect(() => {
    isHorizontalMenu &&
      modalService.register({
        id: PLUGIN_MENU_HORIZONTAL_MODAL_ID,
        Component: props => (
          <AddPluginMenuHorizontal referenceElement={buttonRef} plugins={plugins} {...props} />
        ),
      });
  }, []);

  const calcButtonPosition = (position: DOMRect): { top: string } => {
    const offsetTop = floatingMenuWrapperRef?.current?.getBoundingClientRect().top || 0;
    const { top = 0 } = position;
    const lineHeightOffset = 2;
    const topWithOffset =
      Math.floor(top - offsetTop) !== 0 ? Math.floor(top - offsetTop - lineHeightOffset) : 0;
    const topPosition = top !== 0 ? Math.abs(topWithOffset) : 0;
    return { top: `${topPosition}px` };
  };

  const toggleAddPluginMenu = () => {
    modalService?.isModalOpen(MODAL_ID)
      ? modalService?.closeModal(MODAL_ID)
      : modalService?.openModal(MODAL_ID, {
          positioning: { referenceElement: buttonRef?.current, placement },
          layout,
          componentProps: {
            referenceElement: buttonRef,
          },
        });
  };

  return !isMobile ? (
    <div
      dir={languageDir}
      className={styles.floatingAddPluginMenu_wrapper}
      ref={floatingMenuWrapperRef}
      data-hook={'floatingAddPluginMenu'}
    >
      <EditorSelectionToPosition editor={tiptapEditor}>
        {position => (
          <PlusButton
            onClick={toggleAddPluginMenu}
            position={calcButtonPosition(position)}
            ref={buttonRef}
          />
        )}
      </EditorSelectionToPosition>
    </div>
  ) : null;
};

export default FloatingAddPluginMenu;
