import type { TranslationFunction } from './commonTypes';
import type { EventRegistrar, EventSubscriptor } from './events';
import type { ModalService } from './modalTypes';
import type { RicosEditorPlugins } from './ricos-editor-plugins';
import type { ShortcutDataProvider, ShortcutRegistrar } from './shortcuts';
import type { AmbientStyles } from './styles';
import type { IRicosEditor } from './editor';
import type { IUpdateService, IUploadService } from './uploadServicesTypes';
import type { IRicosToolbars } from './ricos-toolbars';
import type { GeneralContext } from './context';
import type { IPluginsEvents } from './pluginsEventsTypes';

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
  editor: IRicosEditor;
  toolbars: IRicosToolbars;
  pluginsEvents: IPluginsEvents;
  context: Omit<GeneralContext, 'portal'>;
};
