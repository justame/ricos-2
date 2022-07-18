import type {
  IMessage,
  UploadedData,
  IMediaPluginService,
  EditorCommands,
  PluginsDataMap,
  IUpdateService,
} from 'ricos-types';

const doesNodeExist = (nodeId: string, editorCommands?: EditorCommands) =>
  editorCommands?.getAllBlocksKeys().includes(nodeId);

// Think of a noun.
export class UpdateService implements IUpdateService {
  EditorCommands!: EditorCommands;

  setEditorCommands(editorCommands: EditorCommands) {
    this.EditorCommands = editorCommands;
  }

  updatePluginData(
    uploadedData: UploadedData,
    nodeId: string,
    type: string,
    mediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) {
    if (doesNodeExist(nodeId, this.EditorCommands)) {
      const componentData = this.EditorCommands?.getBlockComponentData(nodeId);
      const newComponentData = mediaPluginService.createPluginData(
        uploadedData,
        componentData,
        fileState
      );
      this.EditorCommands?.setBlock(nodeId, type as keyof PluginsDataMap, newComponentData, {
        isRicosSchema: true,
      });
    }
  }

  updateLoadingState(
    url: unknown,
    file: File,
    nodeId: string,
    type: string,
    mediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) {
    if (doesNodeExist(nodeId, this.EditorCommands)) {
      const currentComponentData = this.EditorCommands?.getBlockComponentData(nodeId);
      const {
        componentState,
        componentData,
        fileState: newFileState,
      } = mediaPluginService.createLoadingData(file, url, currentComponentData, fileState);

      this.EditorCommands?.setBlock(
        nodeId,
        type as keyof PluginsDataMap,
        { ...componentData, ...componentState },
        {
          isRicosSchema: true,
        }
      );
      return newFileState;
    }
  }

  updateErrorState(
    error: IMessage,
    nodeId: string,
    type: string,
    mediaPluginService: IMediaPluginService,
    fileState?: Record<string, string | number>
  ) {
    if (doesNodeExist(nodeId, this.EditorCommands)) {
      const componentData = this.EditorCommands?.getBlockComponentData(nodeId);
      const newComponentData = mediaPluginService.createErrorData(error, componentData, fileState);
      this.EditorCommands?.setBlock(nodeId, type as keyof PluginsDataMap, newComponentData);
    }
  }
}
