import React from 'react';
import type { FC, ReactChild } from 'react';
import type { RicosEditorPlugins } from 'ricos-types';

export interface PluginsContextProps {
  plugins: RicosEditorPlugins;
  children: ReactChild;
}

export const PluginsContext = React.createContext<RicosEditorPlugins>(
  null as unknown as RicosEditorPlugins
);

export const PluginsContextProvider: FC<PluginsContextProps> = ({ plugins, children }) => (
  <PluginsContext.Provider value={plugins}>{children}</PluginsContext.Provider>
);

export const withPluginsContext = WrappedComponent => {
  return function (props) {
    return (
      <PluginsContext.Consumer>
        {plugins => <WrappedComponent {...props} plugins={plugins} />}
      </PluginsContext.Consumer>
    );
  };
};
