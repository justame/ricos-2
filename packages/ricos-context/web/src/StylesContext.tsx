import type { ComponentType, FC, ReactChild } from 'react';
import React from 'react';
import type { AmbientStyles } from 'ricos-types';

export const StylesContext = React.createContext<AmbientStyles>(null as unknown as AmbientStyles);

type StylesContextProps = {
  styles: AmbientStyles;
  children: ReactChild;
};

export const StylesContextProvider: FC<StylesContextProps> = ({ styles, children }) => (
  <StylesContext.Provider value={styles}>{children}</StylesContext.Provider>
);

export const StylesContextConsumer = ({ children }) => (
  <StylesContext.Consumer>{value => children(value)}</StylesContext.Consumer>
);

export function withStylesContext<Props>(Component: ComponentType<Props>) {
  return (props: Props) => (
    <StylesContextConsumer>
      {(value: AmbientStyles) => <Component {...props} styles={value} />}
    </StylesContextConsumer>
  );
}
