import type { EditorPluginConfig, ViewerPluginConfig } from 'wix-rich-content-common';
import { Node_Type } from 'wix-rich-content-common';

export const TABLE_TYPE = 'wix-rich-content-plugin-table';

export const tableModals = {
  insert: `${Node_Type.TABLE}.insert`,
};
export interface TablePluginEditorConfig extends EditorPluginConfig {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
export interface TablePluginViewerConfig extends ViewerPluginConfig {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
