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
} from 'ricos-types';
import { Selection } from './selection';
import { EditorStateQuery } from './state';
import { StylesQuery } from './style-query';
import { objectIncludes } from './utils';

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

  addQuery = (name: string, query: QueryItem) => {
    if (this.query[name]) {
      throw `Query ${name} already exists`;
    }
    this.query[name] = query;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coreQuery: Record<string, (...args) => any> = {
    activeTextStyles: textStyleName => {
      const selectedNodesTextStyles = this.selection()
        .doc.descendants(node => node.isText())
        .map(node => {
          return this.styles().getComputedTextStyle(node, textStyleName);
        });

      const activeTextStyles = selectedNodesTextStyles.filter(textStyle => !!textStyle);

      return activeTextStyles;
    },

    activeDecorationsByType: (decorationType: Decoration_Type, attrs?: Record<string, unknown>) => {
      const selectedNodesDecorations = this.selection()
        .doc.descendants(node => node.isText())
        .map(node => {
          return this.styles().getComputedDecoration(node, decorationType);
        });

      const allDecorations = [
        ...this.state().storedDecorations(),
        ...selectedNodesDecorations,
        ...this.selection().collapsedDecorations,
      ];

      const activeDecorations = allDecorations
        .filter(decoration => !!decoration)
        .filter(decoration => decoration?.type === decorationType)
        .filter(decoration => {
          return objectIncludes(decoration as Decoration, attrs || {}, { strict: false });
        });

      return activeDecorations;
    },
  };
}
