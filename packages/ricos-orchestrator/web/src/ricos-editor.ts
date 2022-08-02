import type { RicosEditorProps } from 'ricos-common';
import type { RicosEvents } from 'ricos-events';
import type { RicosStyles } from 'ricos-styles';
import type {
  IContent,
  RicosEditorPlugins,
  IUpdateService,
  IUploadService,
  TranslationFunction,
  TiptapAdapter,
  IRicosEditor,
} from 'ricos-types';
import { initializeTiptapAdapter } from 'wix-tiptap-editor';
import type { RicosModalService } from 'ricos-modals';
import type { IShortcuts } from 'ricos-shortcuts';

type RicosProps = {
  events: RicosEvents;
  styles: RicosStyles;
  plugins: RicosEditorPlugins;
  updateService: IUpdateService;
  uploadService: IUploadService;
  t: TranslationFunction;
  content: IContent<unknown>;
  shortcuts: IShortcuts;
  modals: RicosModalService;
};

export class RicosEditor implements IRicosEditor {
  private tiptapAdapter: TiptapAdapter;

  constructor(editorProps: RicosEditorProps, ricosProps: RicosProps) {
    this.tiptapAdapter = initializeTiptapAdapter(editorProps, ricosProps);
  }

  get adapter() {
    return this.tiptapAdapter;
  }

  getEditorCommands = () => this.tiptapAdapter.getEditorCommands();
}
