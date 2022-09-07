import type { QueryItem } from 'ricos-types';

const NAME = 'activeTextStyles';
const activeTextStyles: QueryItem =
  ({ editorQuery }) =>
  textStyleName => {
    const selectedNodesTextStyles = editorQuery
      .selection()
      .doc.descendants(node => node.isTextBlock())
      .map(node => {
        return editorQuery.styles().getComputedTextStyle(node, textStyleName);
      });

    const activeTextStyles = selectedNodesTextStyles.filter(textStyle => !!textStyle);

    return activeTextStyles;
  };

export default { NAME, query: activeTextStyles };
