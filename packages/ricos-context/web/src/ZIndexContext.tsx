import type { FC, ReactChild } from 'react';
import React from 'react';
import type { IZIndexService } from 'ricos-types';

type ZIndexContextProps = {
  zIndexService: IZIndexService;
  children: ReactChild;
};

export const ZIndexContext = React.createContext<IZIndexService>(null as unknown as IZIndexService);

export const ZIndexContextProvider: FC<ZIndexContextProps> = ({ zIndexService, children }) => (
  <ZIndexContext.Provider value={zIndexService}>{children}</ZIndexContext.Provider>
);
