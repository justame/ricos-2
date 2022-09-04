import { not } from 'fp-ts/Predicate';
import type { Fragment, Node } from 'prosemirror-model';
import type { Transaction } from 'prosemirror-state';
import type { Link, TextStyle } from 'ricos-schema';
import { Decoration_Type, Link_Target, Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import type { ContentDiff, ContentDiffType } from './content-change';
import { ContentChange } from './content-change';
import { Range } from './range';

export type LinkNodeData = {
  pluginId: ContentDiffType;
  link?: string;
  newTab?: boolean;
  rel?: string;
  nofollow?: boolean;
  anchor?: string;
  nodeId: string;
};

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

export const reportGenericDiff = (
  diffs: ContentDiff[],
  onPluginAdded: (pluginId: string, params: Record<string, unknown>) => boolean,
  onPluginDeleted: (pluginId: string) => boolean
) =>
  diffs
    .filter(not(hasIgnoredType))
    .filter(diff => diff.type !== Decoration_Type.LINK && diff.type !== Decoration_Type.ANCHOR)
    .forEach(({ type, change, data }) => {
      if (change === 'insert') {
        onPluginAdded(type, data || {});
      } else if (change === 'delete') {
        onPluginDeleted(type);
      }
    });

// TODO: this filter should move to upper level
const hasIgnoredType = (diff: ContentDiff) =>
  [
    Node_Type.PARAGRAPH,
    'text',
    Node_Type.LIST_ITEM,
    Node_Type.COLLAPSIBLE_ITEM,
    Node_Type.COLLAPSIBLE_ITEM_BODY,
    Node_Type.COLLAPSIBLE_ITEM_TITLE,
    Node_Type.TABLE_ROW,
    Node_Type.TABLE_CELL,
  ].includes(diff.type);

export const reportTextStyleDiff = (
  diffs: ContentDiff[],
  onPluginAdded: (pluginId: string, params: Record<string, unknown>) => boolean,
  onPluginDeleted: (pluginId: string) => boolean
) => {
  const paragraphChanges = diffs.filter(diff => diff.type === Node_Type.PARAGRAPH);
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

export const reportLinkDiff = (
  diffs: ContentDiff[],
  onLinkAdded: (data: LinkNodeData) => boolean,
  onPluginDeleted: (pluginId: string) => boolean
) =>
  diffs
    .filter(diff => diff.type === Decoration_Type.LINK || diff.type === Decoration_Type.ANCHOR)
    .forEach(({ change, data, type }) => {
      if (change === 'insert') {
        const link = (data?.link || {}) as Link;
        const linkData: LinkNodeData = {
          anchor: data?.anchor as string | undefined,
          link: link.url,
          nofollow: link.rel?.nofollow,
          newTab: link.target === Link_Target.BLANK,
          pluginId: type,
          nodeId: '',
        };
        onLinkAdded(linkData);
      } else if (change === 'delete') {
        onPluginDeleted(type);
      }
    });
