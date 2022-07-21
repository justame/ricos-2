import type { ComponentType, FC, ReactChild } from 'react';
import React from 'react';
import type { TiptapAdapter } from 'ricos-types';

type EditorContextProps = {
  adapter: TiptapAdapter;
  children: ReactChild;
};

export const EditorContext = React.createContext<TiptapAdapter>(null as unknown as TiptapAdapter);

export const EditorContextProvider: FC<EditorContextProps> = ({ adapter, children }) => (
  <EditorContext.Provider value={adapter}>{children}</EditorContext.Provider>
);

export const EditorContextConsumer = ({ children }) => (
  <EditorContext.Consumer>{value => children(value)}</EditorContext.Consumer>
);

export function withEditorContext<Props>(Component: ComponentType<Props>) {
  return (props: Props) => (
    <EditorContextConsumer>
      {(adapter: TiptapAdapter) => <Component {...props} editor={adapter} />}
    </EditorContextConsumer>
  );
}
