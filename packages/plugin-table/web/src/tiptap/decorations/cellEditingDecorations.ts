import { Decoration } from 'prosemirror-view';
import styles from '../plugins/table.scss';

export const cellEditingDecorations = $cell => {
  const pos = $cell.pos + 1;
  const backgroundColor = $cell.nodeAfter.attrs.cellStyle?.backgroundColor || 'white';
  const decorations: Decoration[] = [];

  const editCellRight = document.createElement('div');
  editCellRight.classList.add(styles.editCellR);
  editCellRight.style.backgroundColor = backgroundColor;
  decorations.push(Decoration.widget(pos, editCellRight));

  const editCellLeft = document.createElement('div');
  editCellLeft.classList.add(styles.editCellL);
  editCellLeft.style.backgroundColor = backgroundColor;
  decorations.push(Decoration.widget(pos, editCellLeft));

  const editCellBottom = document.createElement('div');
  editCellBottom.classList.add(styles.editCellB);
  decorations.push(Decoration.widget(pos, editCellBottom));

  const editCellTop = document.createElement('div');
  editCellTop.classList.add(styles.editCellT);
  decorations.push(Decoration.widget(pos, editCellTop));

  return decorations;
};
