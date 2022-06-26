import type { ComponentType } from 'react';
import React from 'react';
import type { RicosTheme, RicosPortal } from 'ricos-types';
import type { GeneralContext } from './types';

export const RicosContext = React.createContext<GeneralContext>({
  locale: 'en',
  localeContent: 'en',
  experiments: {},
  isMobile: false,
  t: (text: string) => text,
  languageDir: 'ltr',
  theme: {} as RicosTheme,
  portal: null as unknown as RicosPortal,
});

export const RicosContextProvider = ({
  children,
  isMobile,
  locale,
  localeContent,
  experiments,
  languageDir,
  theme,
  t,
  portal,
}) => {
  return (
    <RicosContext.Provider
      value={{
        t,
        locale,
        localeContent,
        isMobile,
        experiments,
        languageDir,
        theme,
        portal,
      }}
    >
      {React.cloneElement(React.Children.only(children))}
    </RicosContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withRicosContext<T = any>(Component: ComponentType<T>) {
  return (props: T) => {
    return (
      <RicosContext.Consumer>
        {(value: GeneralContext) => <Component {...props} ricosContext={value} />}
      </RicosContext.Consumer>
    );
  };
}

export const RicosContextConsumer = ({ children }) => {
  return (
    <RicosContext.Consumer>{(value: GeneralContext) => children(value)}</RicosContext.Consumer>
  );
};
