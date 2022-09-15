/* eslint-disable fp/no-loops */
import { Decoration } from 'prosemirror-view';
import styles from './controllers.scss';
import { TableQuery } from '../TableQuery';

export const dragPreviewDecoration = state => {
  const { selection } = state;
  const table = TableQuery.of(selection);
  const parentStart = table.getStartPos();

  const dragPreview = document.createElement('div');
  dragPreview.classList.add(styles.tableDragPreview);
  dragPreview.id = 'dragPreview';

  return [Decoration.widget(parentStart, dragPreview)];
};
