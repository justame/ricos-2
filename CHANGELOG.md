# Changelog

> **Tags:**
>
> - :boom: Breaking Change
> - :rocket: New Feature
> - :bug: Bug Fix
> - :book: Documentation
> - :house: Internal
> - :nail_care: Polish

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master but are not yet released.
    Click to see more.
  </summary>

## :bug: Bug Fix

- `ricos-styles`
  - [#4072](https://github.com/wix/ricos/pull/4072) empty doc style & tests

## :house: Internal

- `ricos-events`
  - [#4050](https://github.com/wix/ricos/pull/4050) `ricos-events` package added
- `ricos-modals`
  - [#4050](https://github.com/wix/ricos/pull/4050) ModalContext separated from ModalProvider, and moved to `ricos-context`
- `ricos-plugins/toolbars-v3`
  - [#4071](https://github.com/wix/ricos/pull/4071) delete resolvers - revert #4061 & code cleanup

</details>

<hr/>

## 8.71.31 (Jun 23, 2022)

## :bug: Bug Fix

- `audio`
  - [#4040](https://github.com/wix/ricos/pull/4040) fix audio replace on tiptap editor
  - [#4049](https://github.com/wix/ricos/pull/4049) fix audio data on replace
  - [#4056](https://github.com/wix/ricos/pull/4056) fix data on tiptap replace -`video-social/vertical-embed`
  - [#4049](https://github.com/wix/ricos/pull/4049) fix popovers ui on mobile when opened from external toolbar
- `ricos-editor`
  - [#4064](https://github.com/wix/ricos/pull/4064) fix toolbars should create

## :house: Internal

- `tiptap-extensions`
  - [#4053](https://github.com/wix/ricos/pull/4053) bold/italic toggles with styles (theme,documentStyle) support
  - [#4055](https://github.com/wix/ricos/pull/4055) update document style command

## 8.71.30 (Jun 20, 2022)

## :bug: Bug Fix

- `video`
  - [#4048](https:// github.com/wix/ricos/pull/4048) Fix right click while video download is disabled

## 8.71.28 (Jun 15, 2022)

## :bug: Bug Fix

- `gif`
  - [#4045](https:// github.com/wix/ricos/pull/4045) Fix editor crash because gif config API

## 8.71.27 (Jun 15, 2022)

## :bug: Bug Fix

- `translations`
  - [#4042](https:// github.com/wix/ricos/pull/4042) English fallback for non-supported languages

## 8.71.26 (Jun 14, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4025](https://github.com/wix/ricos/pull/4025) fix open modal func on FloatingAddPluginMenu
  - [#4038](https://github.com/wix/ricos/pull/4038) plugins initialized with updated settings

## :house: Internal

- `gallery`
  - [#4027](https://github.com/wix/ricos/pull/4027) add media button
- `file-upload`
  - [#4027](https://github.com/wix/ricos/pull/4027) file replace button
- `toolbars-v3`
  - [#4006](https://github.com/wix/ricos/pull/4006) move FloatingPluginMenu to toolbars-v3 and split to smaller components
- `ricos-converters`
  - [#4021](https://github.com/wix/ricos/pull/4021) tiptap converters for single node
