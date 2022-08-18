import type { RicosEditorProps } from 'ricos-common';
import { Version } from 'ricos-content';
import type { RicosEvents } from 'ricos-events';
import type { BICallbacks, TopicDescriptor, EventData, ToolbarType } from 'ricos-types';
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

/**
   *  Maps BI callbacks to events.
   *  Callbacks:
        ✓  onContentEdited --> first edit
        ✓  onKeyboardShortcutAction
        ✓  onMediaUploadEnd
        ✓  onMediaUploadStart
        ✓  onPublish --> this one is handled separately in RicosEditor
        ✓  onOpenEditorSuccess --> editor mounted
        ☐  onPluginAction
        ☐  onChangePluginSettings
        ☐  onPluginAdd
        ☐  onPluginAddStep
        ☐  onPluginAddSuccess
        ☐  onPluginChange
        ☐  onPluginDelete
        ✓  onPluginModalOpened
        ☐  onPluginsPopOverClick
        ☐  onPluginsPopOverTabSwitch
        ☐  onMenuLoad --> add plugin menu rendered
        ☐  onInlineToolbarOpen --> plugin toolbar rendered
        ☐  onInlineToolbarOpen --> floating toolbar rendered
        ✓  onToolbarButtonClick --> formatting(inline,static,external) toolbar button click (includes value)
        ✓  onToolbarButtonClick --> add plugin menu/toolbar button click (includes value)
        ☐  onToolbarButtonClick --> plugin toolbar button click (includes value)
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
    ({ shortcutName }) => [{ buttonName: shortcutName, pluginId: '', version, contentId }]
  );

  subscribeCallback(
    'ricos.toolbars.functionality.buttonClick',
    'onToolbarButtonClick',
    ({ toolbarType, buttonId }: { toolbarType: ToolbarType; buttonId: string }) => [
      { version, contentId, buttonName: buttonId, type: toolbarType },
    ]
  );
  subscribeCallback('ricos.modals.functionality.modalOpened', 'onPluginModalOpened', ({ id }) => [
    {
      version,
      contentId,
      pluginId: id,
      // TODO: rework this
      entryType: TOOLBARS.INLINE,
      pluginDetails: {},
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
    'ricos.plugins.functionality.pluginAdd',
    'onPluginAddSuccess',
    ({ pluginId, params, entryPoint }) => [pluginId, entryPoint, params, version, contentId]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginDelete',
    'onPluginDelete',
    ({ pluginId, pluginDetails }) => [{ pluginId, pluginDetails, version, contentId }]
  );

  subscribeCallback(
    'ricos.plugins.functionality.pluginToolbarButtonClick',
    'onToolbarButtonClick',
    ({ pluginId, buttonName, value, nodeId, type }) => [
      { pluginId, buttonName, value, pluginUniqueId: nodeId, type, version, contentId },
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
    'ricos.modals.functionality.pluginChangeSettings',
    'onChangePluginSettings',
    ({ pluginId, actionName, value }) => [{ pluginId, actionName, value }]
  );

  subscribeCallback(
    'ricos.modals.functionality.pluginLinkable',
    'onPluginAction',
    ({ pluginId, link, nofollow, newTab, anchor }) => [
      'addPluginLink',
      {
        plugin_id: pluginId,
        params: { category: link ? 'web_address' : 'section', link, nofollow, newTab, anchor },
      },
    ]
  );
}
