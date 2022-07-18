import type { RicosEditorProps } from 'ricos-common';
import { RicosEvents } from 'ricos-events';
import { RicosModalService } from 'ricos-modals';
import { EditorPlugins } from 'ricos-plugins';
import { EditorKeyboardShortcuts } from 'ricos-shortcuts';
import { RicosStyles } from 'ricos-styles';
import type { EditorPlugin, Services } from 'ricos-types';
import pluginsConfigMerger from '../utils/pluginsConfigMerger/pluginsConfigMerger';

export class RicosServices implements Services {
  styles = new RicosStyles();

  private readonly events = new RicosEvents();

  modals = new RicosModalService(this.events);

  plugins = new EditorPlugins(this.modals);

  shortcuts = new EditorKeyboardShortcuts(this.events);

  private editorProps: RicosEditorProps;

  constructor(editorProps: RicosEditorProps) {
    this.editorProps = editorProps;
    this.initPlugins();
  }

  finalize() {
    this.plugins.destroy();
    this.modals.destroy();
    this.events.clear();
  }

  private initPlugins = () => {
    const { plugins, _rcProps } = this.editorProps;
    const configuredPlugins = pluginsConfigMerger(plugins, _rcProps) || [];
    configuredPlugins.forEach((plugin: EditorPlugin) => this.plugins.register(plugin));
    const { handleFileUpload, handleFileSelection } = _rcProps?.helpers || {};
    this.plugins.configure({ handleFileUpload, handleFileSelection });
  };

  private registerEvents() {}

  private subscribeEvents() {}
}
