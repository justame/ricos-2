import type { IToolbarItemConfigTiptap } from 'ricos-types';
import { flow } from 'fp-ts/function';
import { not } from 'fp-ts/Predicate';

const isSeparator = (button: IToolbarItemConfigTiptap): boolean =>
  button && button.id === 'separator';

const notSeparator = not(isSeparator);

const filterAdjacent = (buttons: IToolbarItemConfigTiptap[]): IToolbarItemConfigTiptap[] =>
  buttons.filter(
    (b, i) =>
      (notSeparator(buttons[i - 1]) && isSeparator(b)) ||
      (isSeparator(buttons[i - 1]) && notSeparator(b)) ||
      (notSeparator(buttons[i - 1]) && notSeparator(b))
  );

const filterEdges = (buttons: IToolbarItemConfigTiptap[]): IToolbarItemConfigTiptap[] =>
  buttons.filter(
    (b, i) => !(isSeparator(b) && i === 0) && !(isSeparator(b) && i === buttons.length - 1)
  );

export const cleanSeparators = flow(filterAdjacent, filterEdges);
