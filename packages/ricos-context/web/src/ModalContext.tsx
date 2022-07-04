import type { ComponentType, FC, ReactChild } from 'react';
import React from 'react';
import type { ModalService } from 'ricos-types';

type ModalContextProps = {
  modalService: ModalService;
  children: ReactChild;
};

export const ModalContext = React.createContext<ModalService>(null as unknown as ModalService);

export const ModalContextProvider: FC<ModalContextProps> = ({ modalService, children }) => (
  <ModalContext.Provider value={modalService}>{children}</ModalContext.Provider>
);

export const ModalContextConsumer = ({ children }) => (
  <ModalContext.Consumer>{value => children(value)}</ModalContext.Consumer>
);

export function withModalContext<Props>(Component: ComponentType<Props>) {
  return function (props: Props) {
    return (
      <ModalContext.Consumer>
        {modalService => <Component {...props} modalService={modalService} />}
      </ModalContext.Consumer>
    );
  };
}
