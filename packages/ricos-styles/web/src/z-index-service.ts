import type { IZindexLayer, IZindexLayers, IZIndexService } from 'ricos-types';

const BASE_ZINDEX = {
  mobile: 100000, // due forum mobile dialog zindex
  desktop: 5000, //photo sutdio zindex - 6000, MM zindex - 10000
};
export class ZIndexService implements IZIndexService {
  zindexLayers: IZindexLayers;

  constructor(isMobile: boolean) {
    this.zindexLayers = this.getBaseZIndexLayers(
      isMobile ? BASE_ZINDEX.mobile : BASE_ZINDEX.desktop
    );
  }

  setDefaultZIndex(baseZIndex: number) {
    this.zindexLayers = this.getBaseZIndexLayers(baseZIndex);
  }

  getZIndex(layer: IZindexLayer): number {
    return this.zindexLayers[layer];
  }

  getBaseZIndexLayers(baseZIndex: number): IZindexLayers {
    return {
      TOOLBAR: 100 + baseZIndex,
      POPUP: 200 + baseZIndex,
      DRAWER: 300 + baseZIndex,
      DIALOG: 300 + baseZIndex,
      TOOLTIP: 400 + baseZIndex,
      NOTIFICATION: 500 + baseZIndex,
    };
  }
}
