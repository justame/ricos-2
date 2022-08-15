import { Node_Type } from 'wix-rich-content-common';
import { TIPTAP_TABLE_ROW_TYPE, TIPTAP_TABLE_CELL_TYPE } from 'ricos-content';

export const getDefaultTable = (rowNum, colNum) => {
  return Array(rowNum)
    .fill(0)
    .map(_ => ({
      type: TIPTAP_TABLE_ROW_TYPE,
      content: Array(colNum)
        .fill(0)
        .map(_ => ({
          type: TIPTAP_TABLE_CELL_TYPE,
          content: [
            {
              type: Node_Type.PARAGRAPH,
              content: [],
            },
          ],
        })),
    }));
};
