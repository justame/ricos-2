import type { ComponentType, FC, ReactChild } from 'react';
import React from 'react';
import type { ShortcutRegistrar } from 'ricos-types';

type ShortcutsContextProps = {
  shortcuts: ShortcutRegistrar;
  children: ReactChild;
};

export const ShortcutsContext = React.createContext<ShortcutRegistrar>(
  null as unknown as ShortcutRegistrar
);

export const ShortcutsContextProvider: FC<ShortcutsContextProps> = ({ shortcuts, children }) => (
  <ShortcutsContext.Provider value={shortcuts}>{children}</ShortcutsContext.Provider>
);

export const ShortcutsContextConsumer = ({ children }) => (
  <ShortcutsContext.Consumer>{value => children(value)}</ShortcutsContext.Consumer>
);

export function withShortcutsContext<Props>(Component: ComponentType<Props>) {
  return (props: Props) => (
    <ShortcutsContextConsumer>
      {(shortcuts: ShortcutRegistrar) => <Component {...props} shortcuts={shortcuts} />}
    </ShortcutsContextConsumer>
  );
}
