import type { TranslationFunction } from './commonTypes';
import type { ModalService } from './modalTypes';
import type { RicosEditorPlugins } from './ricos-editor-plugins';
import type { ShortcutDataProvider, ShortcutRegistrar } from './shortcuts';
import type { AmbientStyles } from './styles';
import type { EditorEventSource, IRicosEditor, UploadObserver } from './editor';
import type { IUpdateService, IUploadService } from './uploadServicesTypes';
import type { IRicosToolbars } from './ricos-toolbars';
import type { GeneralContext } from './context';
import type { IPluginsEvents } from './pluginsEventsTypes';
import type { IZIndexService } from './z-index-layers';
import type { IEditorQuery } from './query';

export type RicosServices = {
  styles: AmbientStyles;
  plugins: RicosEditorPlugins;
  uploadService: IUploadService;
  updateService: IUpdateService;
  t: TranslationFunction;
  shortcuts: ShortcutRegistrar & ShortcutDataProvider;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  modals: ModalService;
  editor: IRicosEditor & UploadObserver & EditorEventSource;
  toolbars: IRicosToolbars;
  pluginsEvents: IPluginsEvents;
  context: Omit<GeneralContext, 'portal'>;
  zIndexService: IZIndexService;
  editorQuery: IEditorQuery;
};
