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
      name: ToolbarType.FORMATTING,
      shouldCreate: () => ({
        desktop: false,
        mobile: {
          android: false,
          ios: false,
        },
      }),
      getButtons: () => ({
        desktop: textButtons?.desktop,
        mobile: {
          android: textButtons?.mobile,
          ios: textButtons?.mobile,
        },
      }),
    },
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
      getVisibilityFn: () => ({
        desktop: () => false,
        mobile: {
          ios: () => true,
          android: () => true,
        },
      }),
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
      getVisibilityFn: () => ({
        desktop: () => true,
        mobile: {
          ios: () => true,
          android: () => false,
        },
      }),
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
    },
  ];
}
