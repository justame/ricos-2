import type { ComponentType, FC, ReactChild } from 'react';
import React from 'react';
import type { IRicosEditor } from 'ricos-types';

type EditorContextProps = {
  editor: IRicosEditor;
  children: ReactChild;
};

export const EditorContext = React.createContext<IRicosEditor>(null as unknown as IRicosEditor);

export const EditorContextProvider: FC<EditorContextProps> = ({ editor, children }) => (
  <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
);

export const EditorContextConsumer = ({ children }) => (
  <EditorContext.Consumer>{value => children(value)}</EditorContext.Consumer>
);

export function withEditorContext<Props>(Component: ComponentType<Props>) {
  return (props: Props) => (
    <EditorContextConsumer>
      {(editor: IRicosEditor) => <Component {...props} editor={editor} />}
    </EditorContextConsumer>
  );
}
