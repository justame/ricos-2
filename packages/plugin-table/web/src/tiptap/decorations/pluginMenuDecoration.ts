import { Decoration } from 'prosemirror-view';
import styles from '../../../statics/styles/side-toolbar.scss';
import { PLUGIN_MENU_HORIZONTAL_MODAL_ID } from 'ricos-types';
import type { Layout, Placement } from 'wix-rich-content-common';
import { pluginMenuIcon } from './svgs';
import { posToDOMRect } from '@tiptap/core';
import { TABLE_PLUGIN_MENU_BUTTON_ID } from '../consts';

const calculateOffsetTop = (editor, elementReference) => {
  const { selection } = editor.state;
  const currentPosition = posToDOMRect(editor.view, selection.from, selection.to);
  const offsetTop = elementReference?.getBoundingClientRect().top || 0;
  const { top = 0 } = currentPosition;
  const lineHeightOffset = 2;
  const topWithOffset =
    Math.floor(top - offsetTop) !== 0 ? Math.floor(top - offsetTop - lineHeightOffset) : 0;
  const topPosition = top !== 0 ? Math.abs(topWithOffset) + 5 : 5;
  return `${topPosition}px`;
};

export const pluginMenuDecoration = ($cell, editor, services) => {
  const {
    modals: modalService,
    context: { languageDir },
  } = services;
  const pos = $cell.pos + 1;
  const layout: Layout = 'toolbar';
  const placement: Placement = languageDir === 'ltr' ? 'right-start' : 'left-start';

  const plusButton = document.createElement('button');

  setTimeout(() => {
    plusButton.style.top = calculateOffsetTop(editor, plusButton);
    plusButton.style.visibility = 'visible';
  }, 0);

  plusButton.onclick = () => {
    if (modalService.isModalOpen(PLUGIN_MENU_HORIZONTAL_MODAL_ID)) {
      modalService.closeModal(PLUGIN_MENU_HORIZONTAL_MODAL_ID);
      plusButton.classList.remove(styles.sideToolbar_popupOpen);
    } else {
      modalService.openModal(PLUGIN_MENU_HORIZONTAL_MODAL_ID, {
        positioning: { referenceElement: plusButton, placement },
        layout,
        componentProps: {
          referenceElement: plusButton,
        },
      });
      plusButton.classList.add(styles.sideToolbar_popupOpen);
    }
  };

  plusButton.innerHTML = pluginMenuIcon;
  plusButton.classList.add(styles.sideToolbar_floatingIcon);
  plusButton.classList.add(styles[languageDir]);
  plusButton.id = TABLE_PLUGIN_MENU_BUTTON_ID;
  plusButton.style.visibility = 'hidden';
  return Decoration.widget(pos, plusButton);
};
