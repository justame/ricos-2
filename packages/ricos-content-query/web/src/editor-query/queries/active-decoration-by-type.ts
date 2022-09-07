import type { Decoration } from 'ricos-schema';
import type { Decoration_Type, QueryItem } from 'ricos-types';
import { objectIncludes } from '../utils';

const NAME = 'activeDecorationsByType';

const activeDecorationsByType: QueryItem =
  ({ editorQuery }) =>
  (decorationType: Decoration_Type, attrs?: Record<string, unknown>) => {
    const selectedNodesDecorations = editorQuery
      .selection()
      .doc.descendants(node => node.isText())
      .map(node => {
        return editorQuery.styles().getComputedDecoration(node, decorationType);
      });
    const allDecorations = [
      ...editorQuery.state().storedDecorations(),
      ...selectedNodesDecorations,
      ...editorQuery.selection().collapsedDecorations,
    ];

    const activeDecorations = allDecorations
      .filter(decoration => !!decoration)
      .filter(decoration => decoration?.type === decorationType)
      .filter(decoration => {
        return objectIncludes(decoration as Decoration, attrs || {}, { strict: false });
      });

    return activeDecorations;
  };

export default { NAME, query: activeDecorationsByType };
