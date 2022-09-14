import type { RicosEditorProps } from 'ricos-common';
import {
  ACTION_BUTTON_TYPE,
  ANCHOR_TYPE,
  APP_EMBED_TYPE,
  AUDIO_TYPE,
  CODE_BLOCK_TYPE,
  COLLAPSIBLE_LIST_TYPE,
  DIVIDER_TYPE,
  EXTERNAL,
  FILE_UPLOAD_TYPE,
  GALLERY_TYPE,
  GIPHY_TYPE,
  HEADINGS_DROPDOWN_TYPE,
  HTML_TYPE,
  IMAGE_TYPE,
  INDENT_TYPE,
  LINE_SPACING_TYPE,
  LINK_BUTTON_TYPE,
  LINK_PREVIEW_TYPE,
  LINK_TYPE,
  MAP_TYPE,
  MENTION_TYPE,
  POLL_TYPE,
  SPOILER_TYPE,
  TABLE_TYPE,
  TEXT_COLOR_TYPE,
  Version,
  VIDEO_TYPE,
} from 'ricos-content';
import type { RicosEvents } from 'ricos-events';
import type { BICallbacks, EventData, ToolbarType, TopicDescriptor } from 'ricos-types';
import { Decoration_Type, Node_Type } from 'ricos-types';
import { TOOLBARS } from 'wix-rich-content-editor-common';

/**
 * Subscribes BI callback by name to proper topic
 */
const getBiCallbackToSubscribe =
  (events: RicosEvents, editorProps: RicosEditorProps) =>
  <K extends keyof BICallbacks>(
    topic: TopicDescriptor,
    name: K,
    eventDataToBICallbackParams: (data: EventData) => Parameters<NonNullable<BICallbacks[K]>>
  ) => {
    const callback = editorProps._rcProps?.helpers?.[name];
    if (!callback) {
      return { topic, cancel: () => {} };
    }
    return events.subscribe(
      topic,
      (_topic, data: EventData) => {
        const params = eventDataToBICallbackParams(data);
        callback.call(callback, ...params);
      },
      `${name} BI callback`
    );
  };

const toPluginId = (id: string) => id.split('.')[0] ?? id;

const toDraftId = (id: string) =>
  ({
    INDENT: INDENT_TYPE,
    LINE_SPACING: LINE_SPACING_TYPE,
    TextAlignment: 'textAlignment',
    [Decoration_Type.ANCHOR]: ANCHOR_TYPE,
    [Decoration_Type.BOLD]: 'Bold',
    [Decoration_Type.COLOR]: TEXT_COLOR_TYPE,
    [Decoration_Type.FONT_SIZE]: 'FONT_SIZE',
    [Decoration_Type.ITALIC]: 'Italic',
    [Decoration_Type.LINK]: LINK_TYPE,
    [Decoration_Type.MENTION]: MENTION_TYPE,
    [Decoration_Type.SPOILER]: SPOILER_TYPE,
    [Decoration_Type.UNDERLINE]: 'Underline',
    [Node_Type.APP_EMBED]: APP_EMBED_TYPE,
    [Node_Type.AUDIO]: AUDIO_TYPE,
    [Node_Type.BLOCKQUOTE]: 'Blockquote',
    [Node_Type.BULLETED_LIST]: 'unordered-list-item',
    [Node_Type.BUTTON]: LINK_BUTTON_TYPE,
    LINK_BUTTON: LINK_BUTTON_TYPE,
    ACTION_BUTTON: ACTION_BUTTON_TYPE,
    [Node_Type.CODE_BLOCK]: CODE_BLOCK_TYPE,
    [Node_Type.COLLAPSIBLE_LIST]: COLLAPSIBLE_LIST_TYPE,
    [Node_Type.DIVIDER]: DIVIDER_TYPE,
    [Node_Type.EMBED]: LINK_PREVIEW_TYPE,
    [Node_Type.EXTERNAL]: EXTERNAL,
    [Node_Type.FILE]: FILE_UPLOAD_TYPE,
    [Node_Type.GALLERY]: GALLERY_TYPE,
    [Node_Type.GIF]: GIPHY_TYPE,
    [Node_Type.HEADING]: HEADINGS_DROPDOWN_TYPE,
    [Node_Type.HTML]: HTML_TYPE,
    [Node_Type.IMAGE]: IMAGE_TYPE,
    [Node_Type.LINK_PREVIEW]: LINK_PREVIEW_TYPE,
    [Node_Type.MAP]: MAP_TYPE,
    [Node_Type.ORDERED_LIST]: 'ordered-list-item',
    [Node_Type.POLL]: POLL_TYPE,
    [Node_Type.TABLE]: TABLE_TYPE,
    [Node_Type.VIDEO]: VIDEO_TYPE,
  }[id] ?? id);

/**
   *  Maps BI callbacks to events.
   *  Callbacks:
        ✓  onContentEdited --> first edit
        ✓  onKeyboardShortcutAction
        ✓  onMediaUploadEnd
        ✓  onMediaUploadStart
        ✓  onPublish --> this one is handled separately in RicosEditor
        ✓  onOpenEditorSuccess --> editor mounted
        ☐  onPluginAction --> check scope
        ✓  onChangePluginSettings
        ✓  onPluginAdd
        ✓  onPluginAddStep --> replaced by onPluginModalOpened
        ✓  onPluginAddSuccess
        ☐  onPluginChange
        ✓  onPluginDelete
        ✓  onPluginModalOpened
        ✓  onPluginsPopOverClick
        ✓  onPluginsPopOverTabSwitch
        ☐  onMenuLoad --> add plugin menu rendered
        ☐  onInlineToolbarOpen --> plugin toolbar rendered
        ☐  onInlineToolbarOpen --> floating toolbar rendered
        ✓  onToolbarButtonClick --> formatting(inline,static,external) toolbar button click (includes value)
        ✓  onToolbarButtonClick --> add plugin menu/toolbar button click (includes value)
        ✓  onToolbarButtonClick --> plugin toolbar button click (includes value)
        ☐  onVideoSelected --> ?
   *
   */
export function mapBiCallbacksToSubscriptions(editorProps: RicosEditorProps, events: RicosEvents) {
  const version = Version.currentVersion;
  const contentId = editorProps.content?.ID;
  const subscribeCallback = getBiCallbackToSubscribe(events, editorProps);

  subscribeCallback('ricos.editor.instance.loaded', 'onOpenEditorSuccess', () => [
    version,
    TOOLBARS.INLINE, // TODO: check meaning
    contentId,
  ]);

  subscribeCallback('ricos.editor.functionality.firstEdit', 'onContentEdited', () => [
    { version, contentId },
  ]);

  subscribeCallback(
    'ricos.shortcuts.functionality.applied',
    'onKeyboardShortcutAction',
    ({ shortcutName }) => [
      {
        buttonName: toDraftId(toPluginId(shortcutName)),
        pluginId: toDraftId(toPluginId(shortcutName)),
        version,
        contentId,
      },
    ]
  );

  subscribeCallback(
    'ricos.toolbars.functionality.buttonClick',
    'onToolbarButtonClick',
    ({ toolbarType, buttonId }: { toolbarType: ToolbarType; buttonId: string }) => [
      { version, contentId, buttonName: toDraftId(toPluginId(buttonId)), type: toolbarType },
    ]
  );
  subscribeCallback('ricos.modals.functionality.modalOpened', 'onPluginModalOpened', ({ id }) => [
    {
      version,
      contentId,
      pluginId: toDraftId(toPluginId(id)),
      // TODO: rework this
      entryType: TOOLBARS.INLINE,
      pluginDetails: { modalId: id },
      entryPoint: TOOLBARS.INLINE,
    },
  ]);

  subscribeCallback(
    'ricos.upload.functionality.uploadStarted',
    'onMediaUploadStart',
    ({ correlationId, pluginId, fileSize, mediaType }) => [
      correlationId,
      pluginId,
      fileSize,
      mediaType,
      version,
      contentId,
    ]
  );

  subscribeCallback(
    'ricos.upload.functionality.uploadFinished',
    'onMediaUploadEnd',
    ({ correlationId, pluginId, duration, fileSize, mediaType, isSuccess, errorType }) => [
      correlationId,
      pluginId,
      duration,
      fileSize,
      mediaType,
      isSuccess,
      errorType,
      version,
      contentId,
    ]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginAddSuccess',
    'onPluginAddSuccess',
    ({ pluginId, params, entryPoint }) => [
      toDraftId(toPluginId(pluginId)),
      entryPoint,
      params,
      version,
      contentId,
    ]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginAdd',
    'onPluginAdd',
    ({ pluginId, entryPoint }) => [toDraftId(toPluginId(pluginId)), entryPoint, version, contentId]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginDelete',
    'onPluginDelete',
    ({ pluginId, pluginDetails }) => [
      { pluginId: toDraftId(toPluginId(pluginId)), pluginDetails, version, contentId },
    ]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginToolbarButtonClick',
    'onToolbarButtonClick',
    ({ pluginId, buttonName, value, nodeId, type }) => [
      {
        pluginId: toDraftId(toPluginId(pluginId)),
        buttonName,
        value,
        pluginUniqueId: nodeId,
        type,
        version,
        contentId,
      },
    ]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginPopoverClick',
    'onPluginsPopOverClick',
    ({ pluginId, buttonName }) => [{ pluginId, buttonName }]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginPopoverTabSwitch',
    'onPluginsPopOverTabSwitch',
    ({ pluginId, buttonName }) => [{ pluginId, buttonName }]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginPopoverSearch',
    'onPluginAction',
    ({ pluginId, searchTerm }) => ['searchInsideThePlugin', { plugin_id: pluginId, searchTerm }]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginChangeSettings',
    'onChangePluginSettings',
    ({ pluginId, nodeId, actionName, value }) => [{ pluginId, nodeId, actionName, value }]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginLinkable',
    'onPluginAction',
    ({ pluginId, nodeId, link, nofollow, newTab, anchor }) => [
      'addPluginLink',
      {
        plugin_id: toDraftId(toPluginId(pluginId)),
        nodeId,
        params: { category: link ? 'web_address' : 'section', link, nofollow, newTab, anchor },
      },
    ]
  );
}
