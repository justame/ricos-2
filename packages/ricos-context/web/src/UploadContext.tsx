import type { ComponentType, FC, ReactChild } from 'react';
import React from 'react';
import type { IUpdateService, IUploadService, UploadContextType } from 'ricos-types';

type UploadContextProps = {
  uploadService: IUploadService;
  updateService: IUpdateService;
  children: ReactChild;
};

export const UploadContext = React.createContext<UploadContextType>(
  null as unknown as UploadContextType
);

export const UploadContextProvider: FC<UploadContextProps> = ({
  uploadService,
  updateService,
  children,
}) => {
  return (
    <UploadContext.Provider value={{ uploadService, updateService }}>
      {children}
    </UploadContext.Provider>
  );
};

export const UploadContextConsumer = ({ children }) => (
  <UploadContext.Consumer>{value => children(value)}</UploadContext.Consumer>
);

export function withUploadContext<Props>(Component: ComponentType<Props>) {
  return function (props: Props) {
    return (
      <UploadContext.Consumer>
        {({ uploadService, updateService }) => (
          <Component {...props} uploadService={uploadService} updateService={updateService} />
        )}
      </UploadContext.Consumer>
    );
  };
}
