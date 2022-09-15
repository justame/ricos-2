import type { QueryItem } from 'ricos-types';

const NAME = 'isMultipleSelection';
const isMultipleSelection: QueryItem =
  ({ editorQuery }) =>
  () => {
    return editorQuery.selection().doc?.children?.length > 1;
  };

export default { NAME, query: isMultipleSelection };
