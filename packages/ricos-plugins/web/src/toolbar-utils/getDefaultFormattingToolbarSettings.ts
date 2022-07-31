import type { GetToolbarSettings } from 'ricos-types';
import { ToolbarType, DisplayMode } from 'ricos-types';

export function getDefaultFormattingToolbarSettings(
  toolbarSettingsProps: Parameters<GetToolbarSettings>[0]
): ReturnType<GetToolbarSettings> {
  const { textButtons } = toolbarSettingsProps;

  const defaultOffset = {
    desktop: { x: 0, y: 0 },
    mobile: {
      ios: { x: 0, y: 0 },
      android: { x: 0, y: 0 },
    },
  };

  const defaultDisplayOptions = {
    desktop: { displayMode: DisplayMode.NORMAL },
    mobile: {
      ios: { displayMode: DisplayMode.NORMAL },
      android: { displayMode: DisplayMode.NORMAL },
    },
  };

  const defaultToolbarDecorationFn = {
    desktop: () => null,
    mobile: {
      ios: () => null,
      android: () => null,
    },
  };

  return [
    {
      name: ToolbarType.MOBILE,
      shouldCreate: () => ({
        desktop: false,
        mobile: {
          ios: true,
          android: true,
        },
      }),
      getPositionOffset: () => defaultOffset,
      getDisplayOptions: () => defaultDisplayOptions,
      getToolbarDecorationFn: () => defaultToolbarDecorationFn,
      getButtons: () => {
        return {
          desktop: [],
          mobile: {
            ios: textButtons?.mobile,
            android: textButtons?.mobile,
          },
        };
      },
      // getTextPluginButtons: () => ({
      //   desktop: {},
      //   mobile: {
      //     ios: pluginTextButtons,
      //     android: pluginTextButtons,
      //   },
      // }),
      getVisibilityFn: () => ({
        desktop: () => false,
        mobile: {
          ios: () => true,
          android: () => true,
        },
      }),
      // getInstance: createMobileToolbar,
    },
    {
      name: ToolbarType.STATIC,
      shouldCreate: () => ({
        desktop: true,
        mobile: {
          ios: true,
          android: false,
        },
      }),
      getPositionOffset: () => defaultOffset,
      getDisplayOptions: () => defaultDisplayOptions,
      getToolbarDecorationFn: () => defaultToolbarDecorationFn,
      getButtons: () => ({
        desktop: textButtons?.desktop,
        mobile: {
          ios: [],
          android: [],
        },
      }),
      // getTextPluginButtons: () => ({
      //   desktop: pluginTextButtons,
      //   mobile: {
      //     ios: {},
      //     android: {},
      //   },
      // }),
      getVisibilityFn: () => ({
        desktop: () => true,
        mobile: {
          ios: () => true,
          android: () => false,
        },
      }),
      // getInstance: createStaticTextToolbar,
    },
    {
      name: ToolbarType.INLINE,
      shouldCreate: () => ({
        desktop: true,
        mobile: {
          ios: false,
          android: false,
        },
      }),
      getPositionOffset: () => defaultOffset,
      getDisplayOptions: () => defaultDisplayOptions,
      getToolbarDecorationFn: () => defaultToolbarDecorationFn,
      getButtons: () => ({
        desktop: textButtons?.desktop,
        mobile: {
          ios: textButtons?.mobile,
          android: [],
        },
      }),
      // getTextPluginButtons: () => ({
      //   desktop: pluginTextButtons,
      //   mobile: {
      //     ios: pluginTextButtons,
      //     android: {},
      //   },
      // }),
      // getVisibilityFn: () => ({
      //   desktop: defaultInlineToolbarVisibilityFn,
      //   mobile: {
      //     ios: defaultInlineToolbarVisibilityFn,
      //     android: defaultInlineToolbarVisibilityFn,
      //   },
      // }),
      // getInstance: createInlineTextToolbar,
    },
  ];
}
