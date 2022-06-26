import type { ComponentType, FC, ReactChild } from 'react';
import React from 'react';
import type { EventRegistrar, EventSubscriptor } from 'ricos-types';

type EventsContextProps = {
  events: EventRegistrar & EventSubscriptor;
  children: ReactChild;
};

export const EventsContext = React.createContext<EventRegistrar & EventSubscriptor>(
  null as unknown as EventRegistrar & EventSubscriptor
);

export const EventsContextProvider: FC<EventsContextProps> = ({ events, children }) => (
  <EventsContext.Provider value={events}>{children}</EventsContext.Provider>
);

export const EventsContextConsumer = ({ children }) => (
  <EventsContext.Consumer>{value => children(value)}</EventsContext.Consumer>
);

export function withEventsContext<Props>(Component: ComponentType<Props>) {
  return (props: Props) => (
    <EventsContextConsumer>
      {(value: EventRegistrar & EventSubscriptor) => <Component {...props} events={value} />}
    </EventsContextConsumer>
  );
}
