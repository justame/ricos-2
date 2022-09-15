import type { QueryItem } from 'ricos-types';

const NAME = 'isSingleRootTextBlock';
const isSingleRootTextBlock: QueryItem =
  ({ editorQuery }) =>
  () => {
    return (
      !editorQuery.query.isMultipleSelection() &&
      !!editorQuery.selection().doc?.children?.[0].isTextBlock()
    );
  };

export default { NAME, query: isSingleRootTextBlock };
