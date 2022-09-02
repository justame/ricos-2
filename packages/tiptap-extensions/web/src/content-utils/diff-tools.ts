import type { Fragment, Node } from 'prosemirror-model';
import type { Transaction } from 'prosemirror-state';
import type { TextStyle } from 'ricos-schema';
import { TextStyle_TextAlignment } from 'ricos-schema';
import type { ContentDiff } from './content-change';
import { ContentChange } from './content-change';
import { Range } from './range';

/*
 * A content change can be thought as an old range replaced with a new range.
 */
export const getDiffRanges = (
  baseline: Fragment,
  changes: Fragment
): { oldRange: Range; newRange: Range } => {
  const from = baseline.findDiffStart(changes);
  const to = baseline.findDiffEnd(changes);

  // console.debug('RAW RANGE', from, to); // eslint-disable-line no-console

  // identical fragments
  if (from === null || to === null) {
    return { newRange: Range.empty, oldRange: Range.empty };
  }

  // 2 or more duplicate symbols typed bug?
  if (from > to.a || from > to.b) {
    return { newRange: new Range(from, to.a), oldRange: new Range(from, to.b) };
  }

  return { newRange: new Range(from, to.b), oldRange: new Range(from, to.a) };
};

export const isIgnoredTransaction = (transaction: Transaction): boolean =>
  ['unique-id', 'trailingNodeInsertion'].some(key => transaction.getMeta(key));

/*
 * Returns content slices from the old and new state, according to the old and new ranges.
 */
export const getContentChange = (
  baseline: Node,
  changes: Node,
  { oldRange, newRange }: { oldRange: Range; newRange: Range }
): ContentChange => {
  const oldSlice = baseline.slice(oldRange.from, oldRange.to);
  const newSlice = changes.slice(newRange.from, newRange.to);

  return new ContentChange(oldSlice, newSlice);
};

export const isParagraphReplacement = (paragraphChanges: ContentDiff[]) =>
  paragraphChanges.length === 2 &&
  paragraphChanges[0].change === 'delete' &&
  paragraphChanges[1].change === 'insert' &&
  paragraphChanges[0].data?.id === paragraphChanges[1].data?.id;

// TODO: makee this part of the ContentChange class
export const reportTextStyleDiff = (
  paragraphChanges: ContentDiff[],
  onPluginAdded: (pluginId: string, params: Record<string, unknown>) => boolean,
  onPluginDeleted: (pluginId: string) => boolean
) => {
  if (isParagraphReplacement(paragraphChanges)) {
    if (
      (paragraphChanges[0].data?.textStyle as TextStyle).textAlignment !==
      (paragraphChanges[1].data?.textStyle as TextStyle).textAlignment
    ) {
      if (
        (paragraphChanges[1].data?.textStyle as TextStyle).textAlignment !==
        TextStyle_TextAlignment.AUTO
      ) {
        onPluginAdded('textAlignment', {
          textAlignment: (paragraphChanges[1].data?.textStyle as TextStyle).textAlignment,
        });
      } else {
        onPluginDeleted('textAlignment');
      }
    }
    if (
      (paragraphChanges[0].data?.textStyle as TextStyle).lineHeight !==
      (paragraphChanges[1].data?.textStyle as TextStyle).lineHeight
    ) {
      if ((paragraphChanges[1].data?.textStyle as TextStyle).lineHeight) {
        onPluginAdded('lineHeight', {
          lineHeight: (paragraphChanges[1].data?.textStyle as TextStyle).lineHeight,
        });
      } else {
        onPluginDeleted('lineHeight');
      }
    }
  }
};
