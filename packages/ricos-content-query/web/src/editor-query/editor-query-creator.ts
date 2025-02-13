import type { Editor } from '@tiptap/core';
import type { RicosStyles } from 'ricos-styles';
import type { IEditorQuery } from 'ricos-types';
import { EditorQuery } from './editor-query';
import {
  activeDecorationsByTypeQuery,
  activeTextStylesQuery,
  isSingleRootTextBlock,
  isMultipleSelection,
} from './queries';

const editorQueryCreator = (editor: Editor, ricosStyles: RicosStyles): IEditorQuery => {
  const editorQuery = new EditorQuery(editor, ricosStyles);

  editorQuery.addQuery(activeDecorationsByTypeQuery.NAME, activeDecorationsByTypeQuery.query);
  editorQuery.addQuery(activeTextStylesQuery.NAME, activeTextStylesQuery.query);
  editorQuery.addQuery(isSingleRootTextBlock.NAME, isSingleRootTextBlock.query);
  editorQuery.addQuery(isMultipleSelection.NAME, isMultipleSelection.query);

  editorQuery.query;
  return editorQuery;
};

export { editorQueryCreator };
