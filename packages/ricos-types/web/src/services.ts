import type { TranslationFunction } from './commonTypes';
import type { EventRegistrar, EventSubscriptor } from './events';
import type { ModalService } from './modalTypes';
import type { RicosEditorPlugins } from './ricos-editor-plugins';
import type { ShortcutDataProvider, ShortcutRegistrar } from './shortcuts';
import type { AmbientStyles } from './styles';
import type { TiptapAdapter } from './tiptap';
import type { IUpdateService, IUploadService } from './uploadServicesTypes';

export type RicosServices = {
  events: EventRegistrar & EventSubscriptor;
  styles: AmbientStyles;
  plugins: RicosEditorPlugins;
  uploadService: IUploadService;
  updateService: IUpdateService;
  t: TranslationFunction;
  shortcuts: ShortcutRegistrar & ShortcutDataProvider;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  modals: ModalService;
  tiptapAdapter: TiptapAdapter;
};
