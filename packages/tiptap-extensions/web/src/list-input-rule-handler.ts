/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExtendedRegExpMatchArray, InputRule } from '@tiptap/core';
import { callOrReturn } from '@tiptap/core';
import type { NodeType, Node as ProseMirrorNode } from 'prosemirror-model';
import { canJoin, findWrapping } from 'prosemirror-transform';
import { Node_Type } from 'ricos-schema';

type InputRuleHandler = (config: {
  type: NodeType;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
  joinPredicate?: (match: ExtendedRegExpMatchArray, node: ProseMirrorNode) => boolean;
}) => InputRule['handler'];

export const createListInputRuleHandler: InputRuleHandler =
  ({ type, getAttributes, joinPredicate }) =>
  ({ state, range, match }) => {
    const attributes = callOrReturn(getAttributes, undefined, match) || {};
    const { from, to } = state.selection;

    let shouldApplyRule = true;
    state.doc.nodesBetween(from, to, (node, pos) => {
      const $pos = state.doc.resolve(pos);
      if (
        (node.isTextblock && node.type.name !== Node_Type.PARAGRAPH) ||
        $pos.parent.type.name === Node_Type.LIST_ITEM
      ) {
        shouldApplyRule = false;
        return false;
      }
    });
    if (shouldApplyRule) {
      const tr = state.tr.delete(range.from, range.to);
      const $start = tr.doc.resolve(range.from);
      const blockRange = $start.blockRange();
      const wrapping = blockRange && findWrapping(blockRange, type, attributes);

      if (!wrapping) {
        return null;
      }

      tr.wrap(blockRange, wrapping);

      const before = tr.doc.resolve(range.from - 1).nodeBefore;

      if (
        before &&
        before.type === type &&
        canJoin(tr.doc, range.from - 1) &&
        (!joinPredicate || joinPredicate(match, before))
      ) {
        tr.join(range.from - 1);
      }
    }
  };
