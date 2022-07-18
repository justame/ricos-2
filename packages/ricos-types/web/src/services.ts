import type { IEditorPlugins } from './editorPluginTypes';
import type { ModalService } from './modalTypes';
import type { ShortcutRegistrar } from './shortcuts';
import type { AmbientStyles } from './styles';
import type { IUpdateService, IUploadService } from './uploadServicesTypes';

export interface Services {
  styles: AmbientStyles;
  plugins: IEditorPlugins;
  modals: ModalService;
  shortcuts: ShortcutRegistrar;
  // tiptapAdapter: TiptapAdapter;
  uploadService: IUploadService;
  updateService: IUpdateService;
  // toolbars;
  // editor: Editor;

  /**
   * Lifecycle finalization
   *
   * Unregisters modals, shortcuts, plugins, events
   *
   * @memberof RicosServices
   */
  finalize: () => void;
}
