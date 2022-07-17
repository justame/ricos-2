import type { SelectionState } from 'wix-rich-content-editor-common';
import { BUTTON_TYPES, createBlock, EditorState } from 'wix-rich-content-editor-common';
import type { IUploadService, IUpdateService } from 'ricos-types';
import type {
  Helpers,
  ToolbarType,
  TranslationFunction,
  RichContentTheme,
  CloseModalFunction,
  InsertButton,
  ToolbarButtonProps,
  Pubsub,
  EditorPluginConfig,
  GetEditorState,
  onPluginAddStepArgs,
  PluginAddParams,
  SetEditorState,
  AvailableExperiments,
  ImageComponentData,
  VideoComponentData,
  FileComponentData,
} from 'wix-rich-content-common';
import { GALLERY_TYPE, Version } from 'wix-rich-content-common';
import { getPluginParams } from './getPluginParams';

type fileData = ImageComponentData | VideoComponentData | FileComponentData;

export function generateInsertPluginButtonProps({
  blockType,
  button,
  helpers,
  pubsub,
  commonPubsub,
  settings,
  t,
  theme,
  isMobile,
  pluginDefaults,
  getEditorState,
  setEditorState,
  toolbarName,
  pluginMenuButtonRef,
  closePluginMenu,
  experiments = {},
  uploadService,
  updateService,
}: {
  blockType: string;
  button: InsertButton;
  helpers: Helpers;
  pubsub: Pubsub;
  commonPubsub: Pubsub;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any> & EditorPluginConfig;
  t: TranslationFunction;
  theme?: RichContentTheme;
  isMobile: boolean;
  pluginDefaults: Record<string, unknown>;
  getEditorState: GetEditorState;
  setEditorState: SetEditorState;
  toolbarName: ToolbarType;
  pluginMenuButtonRef?: HTMLElement;
  closePluginMenu?: CloseModalFunction;
  experiments?: AvailableExperiments;
  uploadService?: IUploadService;
  updateService?: IUpdateService;
}): ToolbarButtonProps {
  const onPluginAdd = () => helpers?.onPluginAdd?.(blockType, toolbarName);
  const onPluginAddStep = (
    step: onPluginAddStepArgs['step'],
    blockKey: string,
    params?: PluginAddParams
  ) => {
    helpers?.onPluginAddStep?.({
      version: Version.currentVersion,
      entryType: toolbarName, //plusButton = SIDE, moreButton = SHORTCUT, footer = FOOTER
      entryPoint: toolbarName,
      params,
      pluginId: blockType,
      pluginDetails: blockKey,
      step,
    });
  };
  const onPluginModalOpened = () => {
    helpers?.onPluginModalOpened?.({
      version: Version.currentVersion,
      entryType: toolbarName,
      entryPoint: toolbarName,
      pluginId: blockType,
      pluginDetails: undefined,
    });
  };
  const onPluginAddSuccess = (params = {}) =>
    helpers?.onPluginAddSuccess?.(blockType, toolbarName, params);

  function addBlock(data, beforeAdd?: (blockKey: string, params?: PluginAddParams) => void) {
    const { componentData } = data;
    const { newBlock, newSelection, newEditorState } = createBlock(
      getEditorState(),
      componentData,
      blockType
    );
    const params = getPluginParams(data, blockType);
    const blockKey = newBlock.getKey();
    beforeAdd?.(blockKey, params);
    setEditorState(EditorState.forceSelection(newEditorState, newSelection));
    onPluginAddSuccess(params); //TOOD: support pluginDetails / pluginUniqueId
    return { newBlock, newSelection, newEditorState };
  }

  function addCustomBlock(buttonData: InsertButton) {
    onPluginAdd();
    buttonData.addBlockHandler?.(getEditorState());
    onPluginAddSuccess();
  }

  function createBlocksFromFiles(
    files: File[] | (File[] | fileData[])[] | fileData[],
    data,
    type: string,
    updateEntity: (blockKey: string, file: File | File[] | fileData | fileData[]) => void
  ) {
    let editorState = getEditorState();
    let selection: SelectionState | undefined;
    onPluginAdd();
    const updateEntities: (() => void)[] = [];
    files.forEach((file: File | File[] | fileData | fileData[]) => {
      const { newBlock, newSelection, newEditorState } = createBlock(editorState, data, type);
      editorState = newEditorState;
      selection = selection || newSelection;
      updateEntities.push(() => updateEntity(newBlock.getKey(), file));
      onPluginAddSuccess({ pluginDetails: newBlock.getKey() });
    });

    return {
      newEditorState: editorState,
      newSelection: selection as SelectionState,
      updateEntities,
    };
  }

  function onClick(event: MouseEvent) {
    event.preventDefault();
    const { name, componentData, type } = button;
    const shouldClosePluginMenu = !isMobile || (isMobile && type !== 'modal');
    switch (type) {
      case 'file':
        toggleFileSelection();
        break;
      case 'modal':
        toggleButtonModal(event);
        break;
      case 'custom-block':
        addCustomBlock(button);
        break;
      case BUTTON_TYPES.BUTTON:
        onPluginAdd();
        if (button.onClick) {
          button.onClick(event);
        } else {
          addBlock({ name, componentData });
        }
        break;
      default:
        onPluginAdd();
        addBlock({ name, componentData });
        break;
    }
    shouldClosePluginMenu && closePluginMenu?.();
  }

  function shouldCreateGallery(files) {
    return (
      blockType === GALLERY_TYPE ||
      (pluginDefaults[GALLERY_TYPE] && settings.createGalleryForMultipleImages && files.length > 1)
    );
  }

  function handleFileChange(
    files: File[] | fileData[],
    updateEntity: (blockKey: string, file: File | File[] | fileData | fileData[]) => void
  ) {
    if (files.length > 0) {
      const galleryData = pluginDefaults[GALLERY_TYPE];
      const { newEditorState, newSelection, updateEntities } = shouldCreateGallery(files)
        ? createBlocksFromFiles([files], galleryData, GALLERY_TYPE, updateEntity)
        : createBlocksFromFiles(files, button.componentData, blockType, updateEntity);
      setEditorState(EditorState.forceSelection(newEditorState, newSelection));
      updateEntities.forEach(updateEntity => updateEntity());
    }
  }

  function onChange(files: File[]) {
    const updateEntity = (blockKey: string, file: File) => {
      const state = { userSelectedFiles: { files: Array.isArray(file) ? file : [file] } };
      commonPubsub.set('initialState_' + blockKey, state);
    };
    return handleFileChange(files, updateEntity);
  }

  function handleExternalFileChanged({ data, error }) {
    if (data) {
      const handleFilesAdded = shouldCreateGallery(data)
        ? (blockKey: string) => commonPubsub.getBlockHandler('galleryHandleFilesAdded', blockKey)
        : (blockKey: string) => pubsub.getBlockHandler('handleFilesAdded', blockKey);
      const updateEntity = (blockKey: string, file: fileData) => {
        onPluginAddStep('FileUploadDialog', blockKey);
        setTimeout(() => {
          handleFilesAdded(blockKey)({ data: file, error });
        });
      };
      handleFileChange(data, updateEntity);
    }
  }

  function toggleButtonModal(event) {
    onPluginAdd();
    if (helpers && helpers.openModal) {
      onPluginModalOpened();
      let modalStyles = {};
      if (button.modalStyles) {
        modalStyles = button.modalStyles;
        // relies on button ref
      } else if (button.modalStylesFn) {
        modalStyles = button.modalStylesFn({
          buttonRef: pluginMenuButtonRef || event.target,
          pubsub,
          toolbarName,
        });
      }

      let addedBlockKey;

      helpers.openModal({
        modalName: button.modalName,
        modalElement: button.modalElement,
        modalDecorations: button.modalDecorations,
        buttonRef: event.target,
        modalStyles,
        theme,
        componentData: button.componentData,
        onConfirm: componentData => {
          const data = { componentData, buttonName: button.name };
          const blockData = addBlock(data, (key, params) =>
            onPluginAddStep('PluginModal', key, params)
          );
          addedBlockKey = blockData.newBlock;
          return blockData;
        },
        pubsub,
        helpers,
        t,
        isMobile,
        blockKey: addedBlockKey,
        toolbarName,
        pluginId: blockType,
      });
    }
  }

  function toggleFileSelection() {
    if (settings?.handleFileSelection) {
      settings.handleFileSelection(handleExternalFileChanged);
    } else if (helpers?.handleFileSelection) {
      const multiple = !!button.multi;
      helpers.handleFileSelection(
        undefined,
        multiple,
        handleExternalFileChanged,
        undefined,
        button.componentData
      );
    }
  }

  function isFileInput() {
    return (
      button.type === BUTTON_TYPES.FILE &&
      !settings.handleFileSelection &&
      !helpers.handleFileSelection
    );
  }

  function getButtonType() {
    return isFileInput() ? BUTTON_TYPES.FILE : BUTTON_TYPES.BUTTON;
  }

  function getPropsByButtonType(type) {
    return {
      [BUTTON_TYPES.FILE]: { onChange, accept: settings.accept, multiple: button.multi },
      [BUTTON_TYPES.BUTTON]: { onClick },
    }[type];
  }

  return {
    name: button.name,
    getIcon: button.getIcon,
    tooltip: button.tooltip,
    dataHook: `${button.name}`,
    getLabel: () => t(button.name),
    isDisabled: button.isDisabled || (() => false),
    isActive: button.isActive || (() => false),
    type: getButtonType(),
    toolbars: button.toolbars,
    ...getPropsByButtonType(getButtonType()),
  };
}
