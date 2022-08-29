export type IZindexLayer = 'TOOLBAR' | 'POPUP' | 'NOTIFICATION' | 'DIALOG' | 'TOOLTIP' | 'DRAWER';

export type IZindexLayers = {
  TOOLBAR: number;
  POPUP: number;
  DRAWER: number;
  DIALOG: number;
  TOOLTIP: number;
  NOTIFICATION: number;
};

export interface IZIndexService {
  getZIndex(layer: IZindexLayer): number;
}
