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

## :house: Internal

- `gallery`
  - [#4183](https://github.com/wix/ricos/pull/4183) refactor settings button dataHook & settings modal
- `ricos-editor`
  - [#4185](https://github.com/wix/ricos/pull/4185) locale resource wraps full ricos editor

## :bug: Bug Fix

- `shortcuts`
  - [#4186](https://github.com/wix/ricos/pull/4186) modal registration in aggregate rather component
- `tiptap-editor`
  - [#4173](https://github.com/wix/ricos/pull/4173) onLoad handler on tiptap editor create
- `ricos-editor`
  - [#4168](https://github.com/wix/ricos/pull/4168) insert plugins external toolbar api for tiptap (wip)
- `collapsible-list`
  - [#4182](https://github.com/wix/ricos/pull/4182) drag and drop of list items on tiptap

</details>

## 8.71.46 (Jul 14, 2022)

## :bug: Bug Fix

- `polls-plugin`
  - [#4180](https://github.com/wix/ricos/pull/4180) fix polls selection on android

## 8.71.45 (Jul 14, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4177](https://github.com/wix/ricos/pull/4177) fix ricos-portal zIndex

## :house: Internal

- `ricos-types ricos-plugins`
  - [#4178](https://github.com/wix/ricos/pull/4178) change `addButton` command type to recieve `uploadService` instead of `uploadContext`

## 8.71.44 (Jul 12, 2022)

## :bug: Bug Fix

- `ricos-content`
  - [#4169](https://github.com/wix/ricos/pull/4169) createEmptyContent adds a paragraph by default
- `ricos-editor`
  - [#4167](https://github.com/wix/ricos/pull/4167) fix toolbars should create (mobile)

## :house: Internal

- `video`
  - [#4077](https://github.com/wix/ricos/pull/4077) add tiptap settings button

## 8.71.43 (Jul 11, 2022)

- `link`
  - [#4123](https://github.com/wix/ricos/pull/4123) detect all mail tlds

## 8.71.42 (Jul 11, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4162](https://github.com/wix/ricos/pull/4162) fix FullRicosEditor service lifecycle
- `ricos-schema`
  - [#4163](https://github.com/wix/ricos/pull/4163) remove node style margins

## 8.71.41 (Jul 10, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4161](https://github.com/wix/ricos/pull/4161) fix tiptap/RicosEditor ref API

## :house: Internal

- `html-plugin`
  - [#4153](https://github.com/wix/ricos/pull/4153) tiptap html width and height sliders
- `tiptap-toobar-v3`
  - [#4156](https://github.com/wix/ricos/pull/4156) fix footer toolbar overflow behaviour
- `link-preview`
  - [#4158](https://github.com/wix/ricos/pull/4158) fix image display on tiptap

## 8.71.40 (Jul 10, 2022)

## :bug: Bug Fix

- `tiptap-extensions`
  - [#4088](https://github.com/wix/ricos/pull/4088) fix headings & lists alignment ,indent & text direction (lists wip)

## :house: Internal

- `ricos-events`
  - [#4149](https://github.com/wix/ricos/pull/4149) getAllTopics; publishOnce; duplication errors
- `poll/tiptap`
  - [#4098](https://github.com/wix/ricos/pull/4098) add Design/Settings/Layout toolbar buttons

## 8.71.38 (Jul 9, 2022)

## :bug: Bug Fix

- `ricos-content-query`
  - [#4147](https://github.com/wix/ricos/pull/4147) remove anchorable nodes query from lib to index
- `ricos-editor/tiptap`
  - [#4146](https://github.com/wix/ricos/pull/4146) fix getEditorCommands from editor ref

## 8.71.37 (Jul 7, 2022)

## :bug: Bug Fix

- `ricos-content`

  - [#4103](https://github.com/wix/ricos/pull/4103) fix normalizeUrl func to handle "mailto:" url's

- `ricos-editor`
  - [#4137](https://github.com/wix/ricos/pull/4137) use RicosPortal in TextFormattingToolbars.tsx

## :house: Internal

- `divider/tiptap`
  - [#4110](https://github.com/wix/ricos/pull/4110) tiptap - add toolbar size & line-style buttons
- `ricos-modals`
  - [#4133](https://github.com/wix/ricos/pull/4133) ModalRenderer: event subscription management
- `tiptap-extensions`
  - [#4138](https://github.com/wix/ricos/pull/4138) fix text overflow
- `tiptap-toobar-v3`
  - [#4142](https://github.com/wix/ricos/pull/4142) resolvers fix and modals z-index in viewer

## 8.71.36 (Jul 3, 2022)

## :bug: Bug Fix

- `tiptap-extensions`
  - [#4105](https://github.com/wix/ricos/pull/4105) fix break on no-config plugins

## 8.71.34 (Jul 3, 2022)

## :house: Internal

- `tiptap-extensions`

  - [#4083](https://github.com/wix/ricos/pull/4083) paragraph & blockquote with alignment/text direction/indent draft behaviour in tiptap
  - [#4085](https://github.com/wix/ricos/pull/4085) soft new line command on shift+enter
  - [#4093](https://github.com/wix/ricos/pull/4093) overlay group added to file + verticalEmbed
  - [#4091](https://github.com/wix/ricos/pull/4091) ricos-styles extension gets Styles via options rather command

- `tiptap-editor`

  - [#4091](https://github.com/wix/ricos/pull/4091) initialized with services (events, styles, plugins)

- `ricos-styles`

  - [#4091](https://github.com/wix/ricos/pull/4091) context and implementation separated (similar to other services)

- `ricos-shortcuts`
  - [#4091](https://github.com/wix/ricos/pull/4091) Shortcuts gets Events dependency via constructor

## 8.71.33 (Jun 27, 2022)

## :bug: Bug Fix

- `tiptap-extensions`
  - [#4081](https://github.com/wix/ricos/pull/4081) unsupported text node styles returns decoration undefined
  - [#4029](https://github.com/wix/ricos/pull/4029) background color for paragraph\headings nodes theme support
  - [#4082](https://github.com/wix/ricos/pull/4082) overlay extension added

## :house: Internal

- `ricos-shortcuts`
  - [#4078](https://github.com/wix/ricos/pull/4078) Shortcuts context to support events and styles

## 8.71.32 (Jun 26, 2022)

## :bug: Bug Fix

- `ricos-styles`
  - [#4072](https://github.com/wix/ricos/pull/4072) empty doc style & tests
- `image-plugin`
  - [#4075](https://github.com/wix/ricos/pull/4075) images inside table settings modal

## :house: Internal

- `ricos-events`
  - [#4050](https://github.com/wix/ricos/pull/4050) `ricos-events` package added
- `ricos-modals`
  - [#4050](https://github.com/wix/ricos/pull/4050) ModalContext separated from ModalProvider, and moved to `ricos-context`
- `ricos-plugins/toolbars-v3`
  - [#4071](https://github.com/wix/ricos/pull/4071) delete resolvers - revert #4061 & code cleanup

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
- `ricos-converters`
  - [#4065](https://github.com/wix/ricos/pull/4065) added missing tiptap converters
