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

// WixData
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WixData = {
  TOOLBAR: ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX.TOOLBAR + 5000,
  POPUP: ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX.POPUP + 5000,
  DRAWER: ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX.DRAWER + 5000,
  DIALOG: ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX.DIALOG + 5000,
  TOOLTIP: ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX.TOOLTIP + 5000,
  NOTIFICATION: ZIndexService.DEFAULT_LAYERS_BASE_ZINDEX.NOTIFICATION + 5000,
};
