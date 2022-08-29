import type { IZindexLayer, IZindexLayers, IZIndexService } from 'ricos-types';
export class ZIndexService implements IZIndexService {
  static DEFAULT_LAYERS_BASE_ZINDEX: IZindexLayers = {
    TOOLBAR: 100,
    POPUP: 200,
    DRAWER: 300,
    DIALOG: 300,
    TOOLTIP: 400,
    NOTIFICATION: 500,
  };

  zindexLayers: IZindexLayers;

  constructor(zIndexLayers?: Partial<IZindexLayers>) {
    this.zindexLayers = ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX;
    if (zIndexLayers) {
      this.zindexLayers = {
        ...ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX,
        ...zIndexLayers,
      };
    }
  }

  getZIndex(layer: IZindexLayer): number {
    return this.zindexLayers[layer];
  }
}
