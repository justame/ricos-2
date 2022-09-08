import type { IZindexLayer, IZindexLayers, IZIndexService } from 'ricos-types';
import { isUndefined } from 'lodash';

const BASE_ZINDEX = {
  mobile: 100000, // due forum mobile dialog zindex
  desktop: 5000, //photo sutdio zindex - 6000, MM zindex - 10000
};
export class ZIndexService implements IZIndexService {
  zindexLayers: IZindexLayers;

  constructor(isMobile: boolean, baseZIndex?: number) {
    this.zindexLayers = this.getBaseZIndexLayers(
      isUndefined(baseZIndex) ? (isMobile ? BASE_ZINDEX.mobile : BASE_ZINDEX.desktop) : baseZIndex
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
