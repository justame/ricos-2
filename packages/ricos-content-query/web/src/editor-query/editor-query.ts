import type { Editor } from '@tiptap/core';
import type { Decoration } from 'ricos-schema';
import type { RicosStyles } from 'ricos-styles';
import type {
  Decoration_Type,
  IEditorQuery,
  IEditorStateQuery,
  ISelection,
  IStylesQuery,
  QueryItem,
  TextAlignment,
  QueryItemCreator,
} from 'ricos-types';
import { Selection } from './selection';
import { EditorStateQuery } from './state';
import { StylesQuery } from './style-query';
import { objectIncludes } from './utils';
import { getTextDirection } from 'ricos-content';

export class EditorQuery implements IEditorQuery {
  private _selection: ISelection;

  private _styles: IStylesQuery;

  private _state: IEditorStateQuery;

  // eslint-disable-next-line no-useless-constructor
  constructor(private editor: Editor, private ricosStyles: RicosStyles) {
    this._selection = new Selection(this.editor);
    this._state = new EditorStateQuery(this.editor);

    // add when styles theme or  doc change event
    this._styles = new StylesQuery(this.ricosStyles);

    this.editor.on('update', () => {
      this._selection = new Selection(this.editor);
    });

    this.editor.on('selectionUpdate', () => {
      this._selection = new Selection(this.editor);
    });
  }

  selection(): ISelection {
    return this._selection;
  }

  state(): IEditorStateQuery {
    return this._state;
  }

  styles(): IStylesQuery {
    return this._styles;
  }

  query: Record<string, QueryItem> = {};

  addQuery = (name: string, query: QueryItemCreator) => {
    if (this.query[name]) {
      throw `Query ${name} already exists`;
    }
    this.query[name] = query({ editorQuery: this });
  };
}
