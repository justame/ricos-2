import React from 'react';
import type { FC, ReactChild } from 'react';
import type { IPluginsEvents } from 'ricos-types';

export interface PluginsEventsContextProps {
  pluginsEvents: IPluginsEvents;
  children: ReactChild;
}

export const PluginsEventsContext = React.createContext<IPluginsEvents>(
  null as unknown as IPluginsEvents
);

export const PluginsEventsContextProvider: FC<PluginsEventsContextProps> = ({
  pluginsEvents,
  children,
}) => (
  <PluginsEventsContext.Provider value={pluginsEvents}>{children}</PluginsEventsContext.Provider>
);

export const withPluginsEventsContext = WrappedComponent => {
  return function (props) {
    return (
      <PluginsEventsContext.Consumer>
        {pluginsEvents => <WrappedComponent {...props} pluginsEvents={pluginsEvents} />}
      </PluginsEventsContext.Consumer>
    );
  };
};
