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

</details>

<hr/>

## 8.71.23 (Jun 11, 2022)

## :house: Internal

- `audio`
  - [#3996](https://github.com/wix/ricos/pull/3996) add audio button
- `image`
  - [#4014](https://github.com/wix/ricos/pull/4014) replace button
- `ricos-context`
  - [#4020](https://github.com/wix/ricos/pull/4020) package added

## 8.71.22 (Jun 9, 2022)

## :bug: Bug Fix

- `viewer`
  - [#4011](https://github.com/wix/ricos/pull/4011) fix text-align override

## 8.71.21 (Jun 8, 2022)

## :bug: Bug Fix

- `editor`
  - [#4010](https://github.com/wix/ricos/pull/4010) fix reset to default paragraph\headings style
- `viewer`
  - [#4011](https://github.com/wix/ricos/pull/4011) fix text-align override

## :house: Internal

- `ricos-editor`
  - [#3973](https://github.com/wix/ricos/pull/3973) add `insertBlockWithBlankLines` commands to tiptap `editorCommands`
- `general`
  - [#4007](https://github.com/wix/ricos/pull/4007) deprecate draft data in upload service
- `image`
  - [#4007](https://github.com/wix/ricos/pull/4007) image tiptap addButtons
- `ricos-styles`
  - [#3993](https://github.com/wix/ricos/pull/3993) `fromNode` document style support
- `gallery`
  - [#3992](https://github.com/wix/ricos/pull/3992) gallery tiptap add button

## 8.71.20 (Jun 6, 2022)

## :bug: Bug Fix

- `table`
  - [#3985](https://github.com/wix/ricos/pull/3985) fix editor crash on invalid content
- `mentions`
  - [#3959](https://github.com/wix/ricos/pull/3959) fix mentions backspace issue && refactor ui
- `image`
  - [#3991](https://github.com/wix/ricos/pull/3991) fix settings scroll

## :house: Internal

- `ricos-plugins`
  - [#3972](https://github.com/wix/ricos/pull/3972) media upload add buttons support
- `file-plugin`
  - [#3972](https://github.com/wix/ricos/pull/3972) expose addButton
- `audio`
  - [#3938](https://github.com/wix/ricos/pull/3938) use uploadService
- `ricos-editor`
  - [#3939](https://github.com/wix/ricos/pull/3939) add horizontal add plugin menu & mobile ui
  - [#3981](https://github.com/wix/ricos/pull/3981) fix horizontalAddPluginMenu open modal func
  - [#3972](https://github.com/wix/ricos/pull/3972) media upload add buttons support
- `general`
  - [#3967](https://github.com/wix/ricos/pull/3967) tiptap type changed to ricos schema type
- `ricos-converters`
  - [#3980](https://github.com/wix/ricos/pull/3980) add rich content schema normalizer under experiment
  - [#3984](https://github.com/wix/ricos/pull/3984) document style in tiptap schema

## 8.71.19 (Jun 2, 2022)

### :bug: Bug Fix

- `toolbars-v2`
  - [#3961](https://github.com/wix/ricos/pull/3961) modal overflow logic using only getBoundingClientRect (under experiment)
- `ricos-editor`
  - [#3892](https://github.com/wix/ricos/pull/3892) adjust plus button position using offset on tiptap
- `audio`
  - [#3950](https://github.com/wix/ricos/pull/3950) fix audio slider & duration ui

## :house: Internal

- `ricos-converters`
  - [#3932](https://github.com/wix/ricos/pull/3932) package added
  - [#3949](https://github.com/wix/ricos/pull/3949) [converters] separated to modules
- `ricos-modals`
  - [#3957](https://github.com/wix/ricos/pull/3957) add toolbar layout to ricos modals
- `ricos-plugins ricos-editor toolbar-v3`
  - [#3890](https://github.com/wix/ricos/pull/3890) `pluginToolbar` API

## 8.71.18 (May 29, 2022)

### :bug: Bug Fix

- `toolbars-new`
  - [#3910](https://github.com/wix/ricos/pull/3910) hot fix: modal buttons - when text and atomic plugin selected
- `ricos-schema`
  - [#3879](https://github.com/wix/ricos/pull/3879) `documentStyle` schema support `lineHeight` and `NodeStyle = {paddingTop, paddingBoyttom}`
- `ricos-content`
  - [#3879](https://github.com/wix/ricos/pull/3879) fix `fontSize` and `documentStyle` converters
- `mentions`
  - [#3912](https://github.com/wix/ricos/pull/3912) fix mentions white space issue && refactor ui
- `audio`
  - [#3916](https://github.com/wix/ricos/pull/3916) fix audio ui & onAtomicBlockFocus issue
- `mentions`
  - [#3936](https://github.com/wix/ricos/pull/3936) fix modals transparent bg color

### :house: Internal

- `ricos-editor`
  - [#3898](https://github.com/wix/ricos/pull/3898) StylesContext integration in RicosEditor (tiptap)
- `ricos-styles`
  - [#3896](https://github.com/wix/ricos/pull/3896) Decorations and TextStyle aggregates
  - [#3898](https://github.com/wix/ricos/pull/3898) StylesContext

## 8.71.17 (May 24, 2022)

### :bug: Bug Fix

- `tiptap-extensions`
  - [#3894](https://github.com/wix/ricos/pull/3894) link fixes
- `mentions`
  - [#3871](https://github.com/wix/ricos/pull/3871) allow spaces in tiptap mentions
  - [#3868](https://github.com/wix/ricos/pull/3868) fix mentions popover ui
  - [#3878](https://github.com/wix/ricos/pull/3878) fix mentions selected / hovered background
- `settings-modals`
  - [#3867](https://github.com/wix/ricos/pull/3867) relate experiments & getComponentData as optional
- `ricos-editor`
  - [#3885](https://github.com/wix/ricos/pull/3885) fix modal scoping issue /use RicosPortal in RicosModal
  - [#3886](https://github.com/wix/ricos/pull/3886) fix flaky plus button position on tiptap

### :house: Internal

- `ricos-editor`
  - [#3888](https://github.com/wix/ricos/pull/3888) tiptap getContentTraits
- `plugins`
  - [#3869](https://github.com/wix/ricos/pull/3869) tiptap formatting extensions style wiring
- `ricos-styles`

  - [#3870](https://github.com/wix/ricos/pull/3870) ricos-styles package

- `ricos-content`

  - [#3873](https://github.com/wix/ricos/pull/3873) expose getTextDirection from ricos-content package

  </details>
  <hr/>

## 8.71.16 (May 17, 2022)

### :house: Internal

- `storybook`

  - [#3864](https://github.com/wix/ricos/pull/3864) add tiptap to Theme stories

- `tiptap-editor`

  - [#3865](https://github.com/wix/ricos/pull/3865) tiptap editor instance via context

- `ricos-editor

  - [#3866](https://github.com/wix/ricos/pull/3866) Ricos Portal

## 8.71.15 (May 15, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3859](https://github.com/wix/ricos/pull/3859) theme tiptap

## 8.71.14 (May 15, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3860](https://github.com/wix/ricos/pull/3860) fix crash on undefined experiments

### :house: Internal

- `tiptap-editor`
  - [#3855](https://github.com/wix/ricos/pull/3855) Extensions: settings injected to component
- `ricos-editor`
  - [#3825](https://github.com/wix/ricos/pull/3825) tiptap getContent & getContentPromise

## 8.71.13 (May 12, 2022)

### :house: Internal

- `tiptap-editor`
  - [#3849](https://github.com/wix/ricos/pull/3849) upload service adujustments for tiptap

## 8.71.12 (May 12, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3742](https://github.com/wix/ricos/pull/3742) `isBusy` indicates files and galleries uploads
- `tiptap-extensions`
  - [#3728](https://github.com/wix/ricos/pull/3728) auto text direction in tiptap fixed

### :house: Internal

- `general`
  - [#3728](https://github.com/wix/ricos/pull/3728) RicosEditor API types moved to ricos-types
- `ricos-editor`

  - [#3728](https://github.com/wix/ricos/pull/3728) individual reconfiguration of extensions according to RicosEditor props
  - [#3844](https://github.com/wix/ricos/pull/3844) tiptap plugins config merger
  - [#3843](https://github.com/wix/ricos/pull/3843) tiptap theme strategy
  - [#3832](https://github.com/wix/ricos/pull/3832) add config to floatingPluginMenu and refactor modal positioning & layouts

- `ricos-shortcuts`
  - [#3835](https://github.com/wix/ricos/pull/3835) react-hotkeys works with tiptap
  - [#3841](https://github.com/wix/ricos/pull/3841) fix keys

## 8.71.11 (May 9, 2022)

### :bug: Bug Fix

- `gallery`
  - [#3839](https://github.com/wix/ricos/pull/3839) update gallery items in settings when new files are uploaded

## 8.71.10 (May 8, 2022)

### :house: Internal

- `upload-service`
  - [#3809](https://github.com/wix/ricos/pull/3809) upload on paste & experiment renaming

## 8.71.9 (May 8, 2022)

### :house: Internal

- `ricos-shortcuts`
  - [#3827](https://github.com/wix/ricos/pull/3827) package added

## 8.71.8 (May 4, 2022)

### :house: Internal

- `ricos-editor`
  - [#3821](https://github.com/wix/ricos/pull/3821) Error boundary + onError wiring

### :bug: Bug Fix

- `toolbars-new`
  - [#3829](https://github.com/wix/ricos/pull/3829) fix provided-container-toolbar query selector

## 8.71.7 (May 2, 2022)

### :house: Internal

- `ricos-editor`

  - [#3814](https://github.com/wix/ricos/pull/3814) wire draftEditorSettings to tiptap html attributes

- `ricos-editor`
  - [#3800](https://github.com/wix/ricos/pull/3800) connect add plugin + button to modal services

## 8.71.6 (May 2, 2022)

### :feat: New Feature

- `text-color`
  - [#3812](https://github.com/wix/ricos/pull/3812) support consumer's colors in tiptap (color1,...)

### :bug: Bug Fix

- `ricos-editor`
  - [#3799](https://github.com/wix/ricos/pull/3799) fix add plugin menu position & dir

### :house: Internal

- `editor-common`
  - [#3806](https://github.com/wix/ricos/pull/3806) RicosContext split from translation handling
  - [#3803](https://github.com/wix/ricos/pull/3803) Modals/Context refactoring
- `toolbars-v3`
  - [#3804](https://github.com/wix/ricos/pull/3804) `tiptapPluginToolbarConfig` and delete atomic nodes action

## 8.71.5 (May 1, 2022)

### :bug: Bug Fix

- `plugin-video`
  - [#3776](https://github.com/wix/ricos/pull/3776) fix legacy video modal upload context usage

### :house: Internal

- `ricos-editor`
  - [#3773](https://github.com/wix/ricos/pull/3773) keyboard shortcuts: domain model
  - [#3785](https://github.com/wix/ricos/pull/3785) add floating plugin menu button for tiptap editor
  - [#3797](https://github.com/wix/ricos/pull/3797) editor's API tests (ref & publish)

### :nail_care: Polish

- `audio`
  - [#3772](https://github.com/wix/ricos/pull/3772) add settings footer buttons
  - [#3790](https://github.com/wix/ricos/pull/3790) mobile native loader (mobile forward comptability)
- `ricos-editor`
  - [#3784](https://github.com/wix/ricos/pull/3784) RicosEditorRef
- `ricos-editor`
  - [#3791](https://github.com/wix/ricos/pull/3791) FullRicosEditorTiptap impl RicosEditorRef
- `ricos-editor`
  - [#3792](https://github.com/wix/ricos/pull/3792) tiptap publish

## 8.71.4 (April 25, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3775](https://github.com/wix/ricos/pull/3775) fix `RicosEditor` export

### :house: Internal

- `file-upload`
  - [#3771](https://github.com/wix/ricos/pull/3771) file replace button under `useNewUploadContext` experiment

## 8.71.3 (April 24, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3770](https://github.com/wix/ricos/pull/3770) ricos editor's ref

## 8.71.2 (April 24, 2022)

### :house: Internal

- `*`
  - [#3572](https://github.com/wix/ricos/pull/3572) media upload mechanism overhaul, open `useNewUploadContext` experiment

## 8.71.1 (April 20, 2022)

### :bug: Bug Fix

- `ricos-content`
  - [#3769](https://github.com/wix/ricos/pull/3769) blockquote refined-node type

## 8.71.0 (April 20, 2022)

### :feat: New Feature

- `ricos-content`
  - [#3761](https://github.com/wix/ricos/pull/3761) toDraft: ignoreUnsupportedTypes option

### :bug: Bug Fix

- `ricos-common`
  - [#3766](https://github.com/wix/ricos/pull/3766) restore translation to rich-content-common

## 8.70.46 (April 19, 2022)

### :bug: Bug Fix

- `audio`
  - [#3760](https://github.com/wix/ricos/pull/3760) fix getAudioSrc func

## 8.70.45 (April 19, 2022)

### :bug: Bug Fix

- `ricos-content`
  - [#3733](https://github.com/wix/ricos/pull/3733) fix OrderedListNode & BulletedListNode refined node types

## 8.70.44 (April 19, 2022)

### :bug: Bug Fix

- `audio`
  - [#3757](https://github.com/wix/ricos/pull/3757) fix coverImage & error toast issues

## 8.70.43 (April 19, 2022)

### :bug: Bug Fix

- `tiptap`
  - [#3752](https://github.com/wix/ricos/pull/3752) fix emoji content with inline styles (all containers)
- `ricos-content`
  - [#3753](https://github.com/wix/ricos/pull/3753) ckeditor/preprocess: wrapNakedStyledSpanWithP rule added

## 8.70.42 (April 18, 2022)

### :bug: Bug Fix

- `gallery`
  - [#3748](https://github.com/wix/ricos/pull/3748) use hash for deterministic masonry layout
- `tiptap`
  - [#3752](https://github.com/wix/ricos/pull/3752) fix emoji content with inline styles

## 8.70.41 (April 17, 2022)

### :bug: Bug Fix

- `video`
  - [#3737](https://github.com/wix/ricos/pull/#3737) fix "getInternalPlayer().play(), play is not a function"
- `audio`
  - [#3738](https://github.com/wix/ricos/pull/3738) fix audio tags issue & added BI
- `ui-components`
  - [#3745](https://github.com/wix/ricos/pull/#3745) add loader to SettingsAddItem component

## 8.70.40 (April 13, 2022)

### :bug: Bug Fix

- `more-menu`
  - [#3734](https://github.com/wix/ricos/pull/3734) fix icon
- `video`
  - [#3735](https://github.com/wix/ricos/pull/3735) fix replace video src bug on ios

## 8.70.39 (April 12, 2022)

### :nail_care: Polish

- `audio`
  - [#3730](https://github.com/wix/ricos/pull/3730) refactor audio TypeScript

## 8.70.38 (April 11, 2022)

### :house: Internal

- `audio`
  - [#3724](https://github.com/wix/ricos/pull/3724) add audio to storybook

### :bug: Bug Fix

- `audio`
  - [#3721](https://github.com/wix/ricos/pull/3721) add err msg when upload fails & some bug fixes
- `poll`
  - [#3726](https://github.com/wix/ricos/pull/3726) fix validation schema error

## 8.70.37 (April 11, 2022)

### :bug: Bug Fix

- `audio`
  - [#3718](https://github.com/wix/ricos/pull/3718) fix audio bi & a11y (clear naming for screen readers)
- `button`
  - [#3719](https://github.com/wix/ricos/pull/3719) fix button settings BM theming

### :house: Internal

- `tiptap-editor`
  - [#3722](https://github.com/wix/ricos/pull/3722) dev-tools applied if debug is ON

## 8.70.36 (April 7, 2022)

### :bug: Bug Fix

- `audio`
  - [#3713](https://github.com/wix/ricos/pull/3713) fix settings ui & force audio tag usage
  - [#3715](https://github.com/wix/ricos/pull/3715) refactor docs & some bug fixes

## 8.70.35 (April 6, 2022)

### :bug: Bug Fix

- `more-menu`
  - [#3711](https://github.com/wix/ricos/pull/3711) fix: filter out shortcut plugins from more menu

## 8.70.34 (April 6, 2022)

### :bug: Bug Fix

- `video`
  - [#3682](https://github.com/wix/ricos/pull/3682) fix video duration on tiptap and converter
- `audio`
  - [#3701](https://github.com/wix/ricos/pull/3701) add missing audio imports

### :house: Internal

- `audio`
  - [#3692](https://github.com/wix/ricos/pull/3692) add audio tests
  - [#3707](https://github.com/wix/ricos/pull/3707) add audio bi
  - [#3710](https://github.com/wix/ricos/pull/3710) add tiptap support

### :nail_care: Polish

- `audio`
- [#3700](https://github.com/wix/ricos/pull/3700) change TextInput doubleClick prop name

## 8.70.33 (April 4, 2022)

### :bug: Bug Fix

- `audio`
- [#3697](https://github.com/wix/ricos/pull/3697) fix audio settings ui & handle tags error on audio upload

### :book: Documentation

- `audio`
- [#3689](https://github.com/wix/ricos/pull/3689) add audio docs

## 8.70.32 (April 3, 2022)

### :bug: Bug Fix

- `polls-plugin`
  - [#3687](https://github.com/wix/ricos/pull/3687) fix polls schema error
- `unsupported-blocks`
  - [#3688](https://github.com/wix/ricos/pull/3688) default label instead of prop
- `adsense`
  - [#3690](https://github.com/wix/ricos/pull/3690) fix adsense doesnt show in the editor

## 8.70.31 (Mar 31, 2022)

### :bug: Bug Fix

- `ricos-content`
  - [#3677](https://github.com/wix/ricos/pull/3677) draft converters: button converter considers button type
- `audio`
  - [#3681](https://github.com/wix/ricos/pull/3681) add placeholders & fix wiring
  - [#3670](https://github.com/wix/ricos/pull/3670) add oneapp wiring
- `image`
  - [#3686](https://github.com/wix/ricos/pull/3686) fix image settings crashing when experiments is undefined

## 8.70.30 (Mar 30, 2022)

### :rocket: New Feature

- `mention-plugin`
  - [#3675](https://github.com/wix/ricos/pull/3675) add viewer/loadable entry
- `audio`
  - [#3676](https://github.com/wix/ricos/pull/3676) add viewer/loadable entry

## 8.70.29 (Mar 30, 2022)

### :bug: Bug Fix

- `ricos-schema`
  - [#3635](https://github.com/wix/ricos/pull/3635) add blockquote indentation
- `audio`
  - [#3673](https://github.com/wix/ricos/pull/3673) fix image settings & context menu scroll

## 8.70.28 (Mar 28, 2022)

### :bug: Bug Fix

- `ricos-schema`
  - [#3617](https://github.com/wix/ricos/pull/3617) add lists indentation
- `toolbars-new/ui-components`
  - [#3665](https://github.com/wix/ricos/pull/3665) wire icons color
- `ricos-viewer`
  - [#3667](https://github.com/wix/ricos/pull/3667) support print css
  - `audio`
  - [#3666](https://github.com/wix/ricos/pull/3666) fix audio data loader & settings replace modal

## 8.70.27 (Mar 27, 2022)

### :bug: Bug Fix

- `toolbars-new`
  - [#3655](https://github.com/wix/ricos/pull/3655) headings panel hover gap and line height
- `toolbars-new`
  - [#3655](https://github.com/wix/ricos/pull/3655) headings panel hover gap and line height
- `audio`
  - [#3661](https://github.com/wix/ricos/pull/3661) fix audio image upload & audio data builder
- `plugin-button`
  - [#3660](https://github.com/wix/ricos/pull/3660) extend button round corners

### :rocket: New Feature

- `media-plugins`
  - [#3597](https://github.com/wix/ricos/pull/3597) upload progress- add loading percentage update api

## 8.70.26 (Mar 27, 2022)

### :house: Internal

- `tiptap-editor`
  - [#3647](https://github.com/wix/ricos/pull/3647) NodeViewContent passed within PluginProps to component
  - [#3652](https://github.com/wix/ricos/pull/3652) hasUnsupportedContent lib exposed
  - [#3648](https://github.com/wix/ricos/pull/3648) unsupported extensions: prevent 'type' attribute name collision
  - [#3653](https://github.com/wix/ricos/pull/3653) unsupported extensions: non-editable non-selectable component, data preserved
- `audio`
  - [#3649](https://github.com/wix/ricos/pull/3649) add ModalBaseActionHoc experiment & some code refactor
  - [#3654](https://github.com/wix/ricos/pull/3654) clean audio config

## 8.70.25 (Mar 24, 2022)

### :bug: Bug Fix

- `plugins`

  - [#3639](https://github.com/wix/ricos/pull/3639) RicosExtension exposes dynamicConfiguration API

- `ricos-content`
  - [#3638](https://github.com/wix/ricos/pull/3638) bugfix: remove invalid inline style ranges

## 8.70.23 (Mar 24, 2022)

### :bug: Bug Fix

- `audio`
  - [#3640](https://github.com/wix/ricos/pull/3640) fix audio loader & getAudioSrc func
- `gallery`
  - [#3641](https://github.com/wix/ricos/pull/3641) fix settings theming
- `ricos-content`
  - [#3630](https://github.com/wix/ricos/pull/3630) Prevent converter crash on documentStyle w/ nulls

## 8.70.22 (Mar 23, 2022)

### :house: Internal

- `audio`
  - [#3636](https://github.com/wix/ricos/pull/3636) refactor audioData import fix css dir & add loader

## 8.70.21 (Mar 22, 2022)

### :Bug Fix

- `file-upload`
  - [#3633](https://github.com/wix/ricos/pull/3633) tiptap translator type fix

### :house: Internal

- `audio`
  - [#3620](https://github.com/wix/ricos/pull/3620) add react player
  - [#3626](https://github.com/wix/ricos/pull/3626) add spotify embed

### :nail_care: Polish

- `toolbars-new`
  - [#3629](https://github.com/wix/ricos/pull/3629) wire font size input to bizMgr

## 8.70.20 (Mar 21, 2022)

### :rocket: New Feature

- `ricos-content`
  - [#3615](https://github.com/wix/ricos/pull/3615) add PollNode to RefinedNode type

### :Bug Fix

- `file-upload`
  - [#3619](https://github.com/wix/ricos/pull/3619) settings modal design fixes

### :house: Internal

- `ricos-common`
  - [#3623](https://github.com/wix/ricos/pull/3623) add settings disabled theme type
- `audio`
  - [#3618](https://github.com/wix/ricos/pull/3618) add audio modal settings modal
- `polls`
  - [#3622](https://github.com/wix/ricos/pull/3622) fix polls in json schema

## 8.70.19 (Mar 15, 2022)

### :house: Internal

- `audio`
  - [#3539](https://github.com/wix/ricos/pull/3539) add audio mocks and button types
- `audio`
  - [#3550](https://github.com/wix/ricos/pull/3550) add audio modal & inline toolbar
- `common`
  - [#3608](https://github.com/wix/ricos/pull/3608) cleanup experiment from anchor scroll

### :nail_care: Polish

- `[ui-components]`
  - [#3561](https://github.com/wix/ricos/pull/3561) refactor tabs & mediaupoadmodal a11y behavior

### :Bug Fix

- `[editor]`
  - [#3614](https://github.com/wix/ricos/pull/3614) input fields font family inheritance

## 8.70.18 (Mar 14, 2022)

### :Bug Fix

- `ui-components`
  - [#3611](https://github.com/wix/ricos/pull/3611) fix selectionlist subtext issue in case of undefined item & wire link title in toolbars-new

## 8.70.17 (Mar 14, 2022)

### :Bug Fix

- `theme`
  - [#3602](https://github.com/wix/ricos/pull/3602) fix toolbars-new & ui-components bizMgr theming
  - [#3605](https://github.com/wix/ricos/pull/3605) fix toolbars & slider bizMgr theming
  - [#3610](https://github.com/wix/ricos/pull/3610) fix toolbars-new bizMgr theming
- `vertical-embed`
  - [#3564](https://github.com/wix/ricos/pull/3564) add disable mode to vertical-embed

## 8.70.16 (Mar 13, 2022)

### :house: Internal

- `file-upload`
  - [#3600](https://github.com/wix/ricos/pull/3600) fix pdf viewer loading experiment
  - [#3601](https://github.com/wix/ricos/pull/3601) fix tiptap editor crash with files in content
- `bundle-analyzer`
  - [#3580](https://github.com/wix/ricos/pull/3580) Speedup (use esbuild for minify) and general cleanup of code
  - [#3580](https://github.com/wix/ricos/pull/3580) general cleanup of code
  - [#3580](https://github.com/wix/ricos/pull/3580) fix bundle size measurement (webpack config)
- `examples + e2e`
  - [#3580](https://github.com/wix/ricos/pull/3580) Speedup (use esbuild)
  - [#3580](https://github.com/wix/ricos/pull/3580) Fix typescript
- `ricos-types`
  - [#3603](https://github.com/wix/ricos/pull/3603) add bg-color type to RicosSettingsStyles

## 8.70.15 (Mar 10, 2022)

### :bug: Bug Fix

- `theme`
  - [#3599](https://github.com/wix/ricos/pull/3599) fix alignment icons color

## 8.70.14 (Mar 9, 2022)

### :bug: Bug Fix

- `theme`
  - [#3594](https://github.com/wix/ricos/pull/3594) fix bizMgr theming
- `theme`
  - [#3595](https://github.com/wix/ricos/pull/3595) fix bizMgr theming gallery/polls settings & toolbar buttons

## 8.70.13 (Mar 8, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3591](https://github.com/wix/ricos/pull/3591) access tiptap-editor-state-translator under experiment detach-commands

### :house: Internal

- `editor`
  - [#3584](https://github.com/wix/ricos/pull/3584) chore(experiments): merge `pastedFilesSupport`

## 8.70.12 (Mar 7, 2022)

### :bug: Bug Fix

- `tiptap-editor`
  - [#3581](https://github.com/wix/ricos/pull/3581) tiptap/unsupported-mark: attributes passed to extension
- `wix-rich-content-common`
  - [#3587](https://github.com/wix/ricos/pull/3587) change ricos-types from dev-dep back to to dep

### :house: Internal

- `file-upload`
  - [#3370](https://github.com/wix/ricos/pull/3370) open pdf viewer experiment `enableFilePluginPDFViewer`
  - [#3583](https://github.com/wix/ricos/pull/3583) refactor file mock upload urls

## 8.70.11 (Mar 6, 2022)

### :bug: Bug Fix

- `tiptap-extensions`
  - [#3579](https://github.com/wix/ricos/pull/3579) spoiler extension priority
- `plugin-video`
  - [#3582](https://github.com/wix/ricos/pull/3582) fix video infinite loader

## 8.70.10 (Mar 3, 2022)

### :bug: Bug Fix

- `ricos-content`
  - [#3577](https://github.com/wix/ricos/pull/3577) ck-editor/parser: "b, strong to bold" rule added; span rule fix

### :nail_care: Polish

- `common`
  - [#3578](https://github.com/wix/ricos/pull/3578) change color 4 & color 3 default values

## 8.70.9 (March 2, 2022)

### :bug: Bug Fix

- `theme`

  - [#3555](https://github.com/wix/ricos/pull/3555) expand custom styles api (quote,code-block,mentions)

- `ricos-content`
  - [#3569](https://github.com/wix/ricos/pull/3569) add `embed` plugin to converters
-

## 8.70.8 (Feb 27, 2022)

### :bug: Bug Fix

- `ricos-content`
  - [#3560](https://github.com/wix/ricos/pull/3560) ck-editor fromHtml: "wrap a in li" support added
  - [#3568](https://github.com/wix/ricos/pull/3568) ck-editor fromHtml: "leaf p to div" rule removed

### :house: Internal

- `[ricos-editor]`
  - [#3457](https://github.com/wix/ricos/pull/3457) command & ricos-content PoC
  - [#3563](https://github.com/wix/ricos/pull/3563) editor-commands refactoring: RicosNode => Editable

## 8.70.7 (Feb 21, 2022)

### :house: Internal

- `ui-components`
  - [#3546](https://github.com/wix/ricos/pull/3546) refactor mediaUploadModal & add icons

## 8.70.5 (Feb 20, 2022)

### :bug: Bug Fix

- `gallery`
  - [#3547](https://github.com/wix/ricos/pull/3547) gallery modal scroll fix
- `toolbars-new`
  - [#3549](https://github.com/wix/ricos/pull/3549) edit link from link toolbar

### :house: Internal

- `audio`
  - [#3543](https://github.com/wix/ricos/pull/3543) audio imports

## 8.70.4 (Feb 20, 2022)

### :bug: Bug Fix

- `general`
  - [#3537](https://github.com/wix/ricos/pull/3537) settings modal scroll fix

### :house: Internal

- `ui-components`
  - [#3538](https://github.com/wix/ricos/pull/3538) revert file input BI
- `toolbar`
  - [#3541](https://github.com/wix/ricos/pull/3541) Fix Plugin Toolbar inherited line-height

### :nail_care: Polish

- `editor`
  - [#3534](https://github.com/wix/ricos/pull/3534) Remove 'Loading...' string from dynamically loaded modals
- `theme`
  - [#3540](https://github.com/wix/ricos/pull/3540) Support seperator height API
- `general`
  - [#3545](https://github.com/wix/ricos/pull/3545) replace newSettingsUi experiment to newSettingsModals

## 8.70.2 (Feb 17, 2022)

### :bug: Bug Fix

- `tiptap`
  - [#3529](https://github.com/wix/ricos/pull/3529) add empty line below & above nodes

### :rocket: New Feature

- `tiptap-extensions`
  - [#3522](https://github.com/wix/ricos/pull/3522) groups based filtering

## 8.70.1 (Feb 16, 2022)

### :bug: Bug Fix

- `video`
  - [#3488](https://github.com/wix/ricos/pull/3488) fix facebook duration data in mobile

## 8.70.0 (Feb 16, 2022)

### :rocket: New Feature

- `ricos-schema`
  - [#3509](https://github.com/wix/ricos/pull/3509) add audio-schema

## 8.69.29 (Feb 16, 2022)

### :bug: Bug Fix

- `table/vertical-embed`
  - [#3511](https://github.com/wix/ricos/pull/3511) fix vertical embed pop-over position & table title dir
- `general`
  - [#3513](https://github.com/wix/ricos/pull/3513) fix text secondary color
- `editor`
  - [#3496](https://github.com/wix/ricos/pull/3496) fix invisible spacings difference from viewer
- `tiptap`
  - [#3515](https://github.com/wix/ricos/pull/3515) fix unique id extension
- `tiptap`
  - [#3519](https://github.com/wix/ricos/pull/3519) fix video selection on safari
- `tiptap`
  - [#3518](https://github.com/wix/ricos/pull/3518) fix divider selection on safari

### :house: Internal

- `sound-cloud`
  - [#3514](https://github.com/wix/ricos/pull/3514) cleanup sound-cloud package
- `editor-modal`
  - [#3521](https://github.com/wix/ricos/pull/3521) use editor commands in settings modal

## 8.69.27 (Feb 13, 2022)

### :house: Internal

- `schema/audio`
  - [#3507](https://github.com/wix/ricos/pull/3507) revert audio-schema

## 8.69.26 (Feb 13, 2022)

### :nail_care: Polish

- `theme`
  - [#3494](https://github.com/wix/ricos/pull/3494) Support Font Family Inheritence

## 8.69.25 (Feb 13, 2022)

### :bug: Bug Fix

- `ricos-content`
  - [#3500](https://github.com/wix/ricos/pull/3500) fromHtml/ck-editor: iframeToVimeoVideo rule added
- `gallery image`
  - [#3502](https://github.com/wix/ricos/pull/3502) fix error state display
- `text color\highlight`
  - [#3505](https://github.com/wix/ricos/pull/3505) fix `inlineStyleMapper` viewer endpoint

## 8.69.24 (Feb 10, 2022)

### :bug: Bug Fix

- `table/giphy`
  - [#3495](https://github.com/wix/ricos/pull/3495) fix modals ui on mobile

## 8.69.23 (Feb 10, 2022)

### :bug: Bug Fix

- `media-plugins`
  - [#3474](https://github.com/wix/ricos/pull/3474) raise generic error toast when local load fails and raise error in console
- `ricos-content`
  - [#3499](https://github.com/wix/ricos/pull/3499) fix `fromDraft` `inlineStyles` to `textDecoration` converter
- `link-preview`
  - [#3501](https://github.com/wix/ricos/pull/3501) fix styles on loadable viewer

### :house: Internal

- `ricos-schema`
  - [#3478](https://github.com/wix/ricos/pull/3478) add `pdfSettings` to file plugin data

### :nail_care: Polish

- `image`
  - [#3493](https://github.com/wix/ricos/pull/3493) use quality preload for PNG when enc_auto is enabled

## 8.69.22 (Feb 8, 2022)

### :bug: Bug Fix

- `video`
  - [#3483](https://github.com/wix/ricos/pull/3483) fix new video modal on mobile
- `ricos-content`
  - [#3486](https://github.com/wix/ricos/pull/3486) toDraft: empty list item protection

### :house: Internal

- `undo redo`
  - [#3485](https://github.com/wix/ricos/pull/3485) BI events for undo redo shortcuts and buttons

## 8.69.20 (Feb 7, 2022)

### :bug: Bug Fix

- `polls-collapsible-list`
  - [#3479](https://github.com/wix/ricos/pull/3479) fix polls & collapsible-list settings ui
- `toolbars-new`
  - [#3482](https://github.com/wix/ricos/pull/3482) fix custom spacing key

## 8.69.19 (Feb 6, 2022)

### :bug: Bug Fix

- `editor`
  - [#3470](https://github.com/wix/ricos/pull/3470) wire editor's placeholder font-family & font-size

## 8.69.18 (Feb 6, 2022)

### :bug: Bug Fix

- `ui-components/link-preview/vertical-embed`
  - [#3472](https://github.com/wix/ricos/pull/3472) fix social-embed ui & vertical-embed save logic on mobile
- `ui-components`
  - [#3471](https://github.com/wix/ricos/pull/3471) fix labeled-toggle text dir

## 8.69.17 (Feb 6, 2022)

### :nail_care: Polish

- `image`
  - [#3465](https://github.com/wix/ricos/pull/3465) use `enc_auto` on generated image URLs

## 8.69.16 (Feb 3, 2022)

### :nail_care: Polish

- `ui-components-video`
  - [#3450](https://github.com/wix/ricos/pull/3450) refactor new input-modals ui and added tests

## 8.69.15 (Feb 2, 2022)

### :bug: Bug Fix

- `editor`
  - [#3456](https://github.com/wix/ricos/pull/3456) external toolbar atomic plugin Insertion (merge experiment)

### :nail_care: Polish

- `*`
  - [#3455](https://github.com/wix/ricos/pull/3455) fix js sourcemap

## 8.69.14 (Feb 1, 2022)

### :bug: Bug Fix

- `ricos-content`

  - [#3446](https://github.com/wix/ricos/pull/3446) fix fromHtml/ck-editor span rules

- `map-settings-modal`
  - [#3436](https://github.com/wix/ricos/pull/3436) update plugin data on editing under modalsWithEditorCommands experiment
- `link-preview-loadable`

  - [#3439](https://github.com/wix/ricos/pull/3439) fix link preview styles in viewer loadable

- `toolbars-new`
  - [#3440](https://github.com/wix/ricos/pull/3440) headings update panel content menu apply button
- `video-modal`

  - [#3442](https://github.com/wix/ricos/pull/3442) fix modals tab switch and click BI
  - [#3444](https://github.com/wix/ricos/pull/3444) fix modals ui on resize

- `Docs`

  - [#3445](https://github.com/wix/ricos/pull/3445) upgrade ricos version in docs packages to fix broken styles

- `Editor-modal`
  - [#3451](https://github.com/wix/ricos/pull/3451) fix app crashes on opening link&headings modals when modalsWithEditorCommands experiments on

### :nail_care: Polish

- `button`

  - [#3438](https://github.com/wix/ricos/pull/3438) refactor button settings ui

- `general`
  - [#3447](https://github.com/wix/ricos/pull/3447) refactor maps image video new settings ui

## 8.69.13 (Jan 31, 2022)

### :nail_care: Polish

- `button-modal`
  - [#3434](https://github.com/wix/ricos/pull/3434) refactor button settings modal

### :bug: Bug Fix

- `common`
  - [#3432](https://github.com/wix/ricos/pull/3432) fix tooltip position non relative to scroll position

### :house: Internal

- `general`
  - [#3429](https://github.com/wix/ricos/pull/3429) add a fixed header style to plugins settings
- `general`
  - [#3430](https://github.com/wix/ricos/pull/3430) new settings ui refactor

## 8.69.12 (Jan 30, 2022)

### :house: Internal

- `plugin-commons`
  - [#3431](https://github.com/wix/ricos/pull/3431) fix input buttons `onPluginAdd` BI event

## 8.69.10 (Jan 26, 2022)

### :bug: Bug Fix

- `gallery`
  - [#3428](https://github.com/wix/ricos/pull/3428) fix settings media section layout

## 8.69.9 (Jan 26, 2022)

### :house: Internal

- `video`
  - [#3424](https://github.com/wix/ricos/pull/3424) refactor upload & tab switch bi events
- `audio`
  - [#3426](https://github.com/wix/ricos/pull/3426) add audio imports to test-env/storybook/bundle-analyzer
- `image`
  - [#3412](https://github.com/wix/ricos/pull/3412) performance: prevent double adjusment of DPI

## 8.69.8 (Jan 25, 2022)

### :bug: Bug Fix

- `ricos-content`
  - [#3422](https://github.com/wix/ricos/pull/3422) from-html crash in ck-editor
- `editor`
  - [#3416](https://github.com/wix/ricos/pull/3416) Insert atomic plugin below focused atomic plugin (instead replacing it)

## 8.69.7 (Jan 24, 2022)

### :bug: Bug Fix

- `general`
  - [#3419](https://github.com/wix/ricos/pull/3419) new settings ui refactor & ui bug gallery a11y & selectionListItem ui
  - [#3411](https://github.com/wix/ricos/pull/3411) new settings ui refactor & ui bug fixes
- `ui-components`
  - [#3413](https://github.com/wix/ricos/pull/3413) fix slider ui on firefox

### :house: Internal

- `video`
  - [#3414](https://github.com/wix/ricos/pull/3414) fix upload & tab switch bi events

## 8.69.6 (Jan 20, 2022)

### :house: Internal

- `*`
  - [#3410](https://github.com/wix/ricos/pull/3410) Add oneApp entries without css import

## 8.69.5 (Jan 20, 2022)

### :bug: Bug Fix

- `plugin-table`

  - [#3409](https://github.com/wix/ricos/pull/3409) fix: parse columns width to integers

- `plugin-image`
  - [#3408](https://github.com/wix/ricos/pull/3408) fix: preload image width by size config

## 8.69.4 (Jan 19, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3407](https://github.com/wix/ricos/pull/3407) notes indicator horizontal position

## 8.69.3 (Jan 19, 2022)

### :bug: Bug Fix

- `vertical-embed`
  - [#3404](https://github.com/wix/ricos/pull/3404) loadable entry
- `image-plugin`
  - [#3396](https://github.com/wix/ricos/pull/3396) CLS fix: add width & height attributes to img tag

## 8.69.1 (Jan 17, 2022)

### :nail_care: Polish

- `ricos-content`
  - [#3400](https://github.com/wix/ricos/pull/3400) velo-adapter: extractor and modifier are now combined under `select`

## 8.69.0 (Jan 17, 2022)

### :house: Internal

- `ricos-schema`
  - [#3382](https://github.com/wix/ricos/pull/3382) `unannotated-pii-fields` flynt rule
- `ricos-content`
  - [#3349](https://github.com/wix/ricos/pull/3349) refactor keyAndBullet test

### :rocket: New Feature

- `*`
  - [#3399](https://github.com/wix/ricos/pull/3399) separate viewer and editor styles & include css inside js bundled files

## 8.68.2 (Jan 17, 2022)

### :nail_care: Polish

- `ricos-content`
  - [#3397](https://github.com/wix/ricos/pull/3397) velo-adapter: modifier syntax

### :bug: Bug Fix

- `tiptap`
  - [#3395](https://github.com/wix/ricos/pull/3395) link-preview: fix tiptap extension definition

## 8.68.1 (Jan 14, 2022)

### :bug: Bug Fix

- `schema`

  - [#3388](https://github.com/wix/ricos/pull/3388) add emoji to draft schema

- `toolbars-new`
  - [#3378](https://github.com/wix/ricos/pull/3378) fix headings panel context menu dimensions

## 8.68.0 (Jan 12, 2022)

### :rocket: New Feature

- `mention-plugin`
  - [#3377](https://github.com/wix/ricos/pull/3377) add supportWhitespace config

### :bug: Bug Fix

- `toolbars-new`
  - [#3379](https://github.com/wix/ricos/pull/3379) static toolbar overflow

## 8.67.3 (Jan 11, 2022)

### :house: Internal

- `editor-modals`
  - [#3337](https://github.com/wix/ricos/pull/3337) using editor commands in settings modals under modalsWithEditorCommands experiment

## 8.67.2 (Jan 11, 2022)

### :house: Internal

- `*`

  - [#3354](https://github.com/wix/ricos/pull/3354) revert

## 8.67.1 (Jan 11, 2022)

### :house: Internal

- `general`
  - [#3376](https://github.com/wix/ricos/pull/3376) implemented bi-events for switching tabs and clicking buttons in video/vertical-social embed popovers

## 8.67.0 (Jan 11, 2022)

### :rocket: New Feature

- `*`
  - [#3354](https://github.com/wix/ricos/pull/3354) separate viewer and editor styles & include css inside js bundled files

## 8.66.14 (Jan 09, 2022)

### :nail_care: Polish

- `general`
  - [#3373](https://github.com/wix/ricos/pull/3373) refactor pluginpopoverclick bi naming

## 8.66.13 (Jan 09, 2022)

### :house: Internal

- `general`
  - [#3361](https://github.com/wix/ricos/pull/3361) add pluginpopoverclick & pluginpopovertabswitch bi events

## 8.66.12 (Jan 07, 2022)

### :bug: Bug Fix

- `video`
  - [#3369](https://github.com/wix/ricos/pull/3369) fix onProgress throws an error

## 8.66.11 (Jan 06, 2022)

### :bug: Bug Fix

- `ricos-editor`
  - [#3366](https://github.com/wix/ricos/pull/3366) fix sideBlockComponent position

### :house: Internal

- `collapsible-list`
  - [#3364](https://github.com/wix/ricos/pull/3364) add plugin headings to supported plugins
- `audio`
  - [#3367](https://github.com/wix/ricos/pull/3367) generated audio plugin

## 8.66.8 (Jan 04, 2022)

### :bug: Bug Fix

- `vertical-embed`
  - [#3362](https://github.com/wix/ricos/pull/3362) fix vertical embed image on SSR

## 8.66.7 (Jan 04, 2022)

### :house: Internal

- `general`
  - [#3353](https://github.com/wix/ricos/pull/3353) add title prop when using SettingsMobileHeader
- `tiptap-editor`
  - [#3356](https://github.com/wix/ricos/pull/3356) unique-id gets types in runtime

### :bug: Bug Fix

- `social-embed`
  - [#3348](https://github.com/wix/ricos/pull/3348) insert buttons tooltip translation
- `tiptap`
  - [#3360](https://github.com/wix/ricos/pull/3360) fix undo redo

## 8.66.6 (Jan 03, 2022)

- `vertical-embed`
  - [#3351](https://github.com/wix/ricos/pull/3351) fix toDraft convertor

## 8.66.5 (Jan 02, 2022)

- `vertical-embed`
  - [#3347](https://github.com/wix/ricos/pull/3347) fix performance: load vertical image in smaller size

## 8.66.4 (Jan 02, 2022)

### :house: Internal

- `gallery`
  - [#3252](https://github.com/wix/ricos/pull/3252) refactor gallery settings modal
- `general`
  - [#3332](https://github.com/wix/ricos/pull/3332) created selectionListItem component and consume it in settings
- `general`
  - [#3345](https://github.com/wix/ricos/pull/3345) created settingsAddItem component and consume it in settings modal + ui fixes in tabs & labeledToggle
- `polls`
  - [#3315](https://github.com/wix/ricos/pull/3315) refactor polls settings modal
- `ricos-content`
  - [#3243](https://github.com/wix/ricos/pull/3243) velo adapter API - refinements

## 8.66.3 (Dec 30, 2021)

### :house: Internal

- `ricos-content`
  - [#3338](https://github.com/wix/ricos/pull/3338) fix `documentStyle` decorations converter to draft
- `general`
  - [#3342](https://github.com/wix/ricos/pull/3342) created settingsPanelHeader component and consume it in settings modal

### :house: Internal

- `tiptap-editor`
  - [#3343](https://github.com/wix/ricos/pull/3343) add text-align extension
- `tiptap-editor`
  - [#3344](https://github.com/wix/ricos/pull/3344) add undo-redo to adapter

## 8.66.2 (Dec 29, 2021)

### :bug: Bug Fix

- `headings`
  - [#3163](https://github.com/wix/ricos/pull/3163) fix lists wiring to `documentStyle`

### :house: Internal

- `schema`
  - [#3311](https://github.com/wix/ricos/pull/3311) add `mobileNumberOfColumns` to gallery schema to allow adaptivity between mobile and desktop

## 8.66.1 (Dec 29, 2021)

### :house: Internal

- `tiptap-extensions`
  - [#3333](https://github.com/wix/ricos/pull/3333) link fixes
- `general`
  - [#3334](https://github.com/wix/ricos/pull/3334) revert settings-modal-scroll fix

## 8.66.0 (Dec 29, 2021)

### :rocket: New Feature

- `video`
  - [#3301](https://github.com/wix/ricos/pull/3301) add duration to video content
  - [#3301](https://github.com/wix/ricos/pull/3301) add onProgress/progressInterval to video settings

## 8.65.29 (Dec 29, 2021)

### :rocket: New Feature

- `video`
  - [#3304](https://github.com/wix/ricos/pull/3304) duration schema

### :house: Internal

- `general`
  - [#3329](https://github.com/wix/ricos/pull/3329) add `forceConsistentCasingInFileNames: true` to tsconfig compiler options

### :bug: Bug Fix

- `settings-modal`
  - [#3290](https://github.com/wix/ricos/pull/3290) revert settings-modal using editor commands

## 8.65.28 (Dec 27, 2021)

### :bug: Bug Fix

- `video`
  - [#3331](https://github.com/wix/ricos/pull/3331) fix video-modal ui when opened from the replace button

### :house: Internal

- `tiptap-extensions`
  - [#3330](https://github.com/wix/ricos/pull/3330) placeholder & text direction

## 8.65.27 (Dec 27, 2021)

### :house: Internal

- `ui-components`
  - [#3325](https://github.com/wix/ricos/pull/3325) revert settingspanleheader component
- `link`
  - [#3326](https://github.com/wix/ricos/pull/3326) tiptap-based link extension moved to tiptap-extensions

## 8.65.26 (Dec 26, 2021)

### :bug: Bug Fix

- `gallery`
  - [#3321](https://github.com/wix/ricos/pull/3321) fix handle file selection from settings modal

### :house: Internal

- `ui-components`
  - [#3319](https://github.com/wix/ricos/pull/3319) revert commit 042e5525faa55043f20006059276b4af06b112f0

## 8.65.25 (Dec 26, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#3308](https://github.com/wix/ricos/pull/3308) fix faulty draft values

### :house: Internal

- `tiptap-extensions`
  - [#3318](https://github.com/wix/ricos/pull/3318) tiptap: unsupported content extensions

## 8.65.24 (Dec 26, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3313](https://github.com/wix/ricos/pull/3313) fix headings update context menu display
- `gallery`
  - [#3317](https://github.com/wix/ricos/pull/3317) display video play icon
- `fullscreen`
  - [#3317](https://github.com/wix/ricos/pull/3317) display video play icon

### :house: Internal

- `plugin-commons`
  - [#3302](https://github.com/wix/ricos/pull/3302) refactor color-picker
- `gallery`
  - [#3316](https://github.com/wix/ricos/pull/3316) performance improvement

## 8.65.23 (Dec 23, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3263](https://github.com/wix/ricos/pull/3263) fix color picker-closing when there is a 'mouseup' event outside of the modal
- `toolbars-new`
  - [#3307](https://github.com/wix/ricos/pull/3307) fix toolbar buttons color on BM theme

## 8.65.22 (Dec 23, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#3305](https://github.com/wix/ricos/pull/3305) ckeditor html parser: gaps
  - [#3306](https://github.com/wix/ricos/pull/3306) normalizer maps sound-cloud to video

## 8.65.21 (Dec 23, 2021)

### :bug: Bug Fix

- `plugin-common`
  - [#3280](https://github.com/wix/ricos/pull/3280) fix plugin toolbar position in rtl
- `collapsible-list`
  - [#3297](https://github.com/wix/ricos/pull/3297) fix re-render answer content on collpase/expand

## 8.65.20 (Dec 23, 2021)

### :house: Internal

- `general`
  - [#3299](https://github.com/wix/ricos/pull/3299) `onPluginAdd` and `onPluginAddSuccess` BI events for image uploads and emojis
- `common`

  - [#3300](https://github.com/wix/ricos/pull/3300) add new types to `RicosSettingsStyles`

### :nail_care: Polish

- `ui-components`
  - [#3257](https://github.com/wix/ricos/pull/3257) created label component and consume it in ui-components/collapsible-List/polls

## 8.65.19 (Dec 22, 2021)

### :bug: Bug Fix

- `viewer`
  - [#3295](https://github.com/wix/ricos/pull/3295) fix duplicate links with justification on safari

## 8.65.18 (Dec 22, 2021)

### :bug: Bug Fix

- `vertical-embed`
  - [#3281](https://github.com/wix/ricos/pull/3281) fix image in print mode
- `editor-common`

  - [#3284](https://github.com/wix/ricos/pull/3284) fix basic link panel ui

### :house: Internal

- `tiptap-extensions`
  - [#3288](https://github.com/wix/ricos/pull/3288) all tiptap extensions refactored to RicosExtensions

## 8.65.17 (Dec 19, 2021)

### :bug: Bug Fix

- `ui-components`

  - [#3273](https://github.com/wix/ricos/pull/3273) fix slider ui on rtl sites

- `ricos-content`
  - [#3276](https://github.com/wix/ricos/pull/3276) fromDraft conversion: handle invalid link types

### ::house: Internal

- `ricos-editor`
  - [#3277](https://github.com/wix/ricos/pull/3277) add global context to ricos-modal

## 8.65.16 (Dec 16, 2021)

### :bug: Bug Fix

- `ricos-content`

  - [#3271](https://github.com/wix/ricos/pull/3271) fromDraft conversion: pass opts to nestedNodesConverters

- `toolbars-new`

  - [#3261](https://github.com/wix/ricos/pull/3261) add BI to link modal in new toolbar

- `fullscreen`

  - [#3274](https://github.com/wix/ricos/pull/3274) fullscreen opens on the correct image on mobile

- `mentions`
  - [#3235](https://github.com/wix/ricos/pull/3235) allow whitespaces

## 8.65.15 (Dec 16, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3265](https://github.com/wix/ricos/pull/3265) fix font size display when selection is collapsed (in static toolbar)
- `ricos-content`
  - [#3269](https://github.com/wix/ricos/pull/3269) fromHtml/ck-editor: `<br>` preprocessed in text nodes only

## 8.65.14 (Dec 15, 2021)

### :bug: Bug Fix

- `tiptap-editor`
  - [#3267](https://github.com/wix/ricos/pull/3267) tiptap, prosemirror added to rollup externals

## 8.65.13 (Dec 15, 2021)

Release of v8.65.2 failed

## 8.65.12 (Dec 15, 2021)

### :bug: Bug Fix

- `viewer`
  - [#3266](https://github.com/wix/ricos/pull/3266) fix ordered-lists numbering line-height issue (under `fixListLineHeight` experiment)
- `e2e`
  - [#3266](https://github.com/wix/ricos/pull/3266) fix ordered-lists numbering line-height issue (under `fixListLineHeight` experiment)
- `toolbars-new`
  - [#3264](https://github.com/wix/ricos/pull/3264) click on gaps between buttons

### :book: Documentation

- [#3253](https://github.com/wix/ricos/pull/3253) new toolbar api - buttonsOverrides

## 8.65.11 (Dec 15, 2021)

### :bug: Bug Fix

- `viewer`
  - [#3262](https://github.com/wix/ricos/pull/3262) fix ordered-lists numbering line-height issue (under `fixListLineHeight` experiment)

## 8.65.10 (Dec 15, 2021)

### :rocket: New Feature

- `ricos-editor`
  - [#3182](https://github.com/wix/ricos/pull/3182) sideBlockComponent config (Notes integration)

## 8.65.9 (Dec 15, 2021)

### :bug: Bug Fix

- `tiptap-editor`

  - [#3256](https://github.com/wix/ricos/pull/3256) NodeExtension config defaults

- `editor` `viewer`

  - [#3195](https://github.com/wix/ricos/pull/3195) fixed tab size for identation (under `fixedTabSize` experiment)

- `ricos-content`

  - [#3247](https://github.com/wix/ricos/pull/3247) fix crash on no-data plugins

### :house: Internal

- `tiptap-extensions`
  - [#3260](https://github.com/wix/ricos/pull/3260) refactored italic, headings, underline
- `video/vertical-social-embed`
  - [#3259](https://github.com/wix/ricos/pull/3259) Combine new-modals experiments into one

## 8.65.8 (Dec 13, 2021)

### :bug: Bug Fix

- `viewer`

  - [#3231](https://github.com/wix/ricos/pull/3231) fix line-height diff when plugin-line-height & paragraph line height (customStyles api) are both applied on list

## 8.65.7 (Dec 13, 2021)

### :bug: Bug Fix

- `toolbars-new`

  - [#3220](https://github.com/wix/ricos/pull/3220) disable toolbar when atomic plugin selected
  - [#3236](https://github.com/wix/ricos/pull/3236) color picker buttons in static toolbar when collapsed

- `editor-common`
  - [#3239](https://github.com/wix/ricos/pull/3239) improve overflow utils logic

### :house: Internal

- `tiptap-editor`
  - [#3246](https://github.com/wix/ricos/pull/3246) React vs HTML node extension models
- `tiptap-extensions`
  - [#3248](https://github.com/wix/ricos/pull/3248) refactored bold, paragraph, spoiler extensions

## 8.65.6 (Dec 09, 2021)

### :bug: Bug Fix

- `tiptap-editor`
  - [#3234](https://github.com/wix/ricos/pull/3234) core commands added to core configs
- `tiptap-editor`
  - [#3240](https://github.com/wix/ricos/pull/3240) fix deleteNode command to delete also first node
- `draft-schema`
  - [#3214](https://github.com/wix/ricos/pull/3214) add validation test to draft schema

## 8.65.5 (Dec 09, 2021)

### :bug: Bug Fix

- `toolbars-new/editorCommands`
  - [#3028](https://github.com/wix/ricos/pull/3028) fix code-block action in the new toolbar
  - [#3224](https://github.com/wix/ricos/pull/3224) fix font size display when empty blocks are in selection
- `gallery`
  - [#3225](https://github.com/wix/ricos/pull/3225) fix image margin on mobile sliders
  - [#3228](https://github.com/wix/ricos/pull/3228) fix organize media settings top buttons push items down
- `tooltip`
  - [#3218](https://github.com/wix/ricos/pull/3218) wire font family for BM theme
- `button`
  - [#3238](https://github.com/wix/ricos/pull/3238) fix color picker style inside settings modal

### :house: Internal

- `tiptap-editor`
  - [#3217](https://github.com/wix/ricos/pull/3217) pinned tiptap versions
- `tiptap-extensions`
  - [#3229](https://github.com/wix/ricos/pull/3229) core extensions moved to separate package
- `ricos-tiptap-types`
  - [#3229](https://github.com/wix/ricos/pull/3229) public tiptap related types moved to separate package
- `toolbars-new`
  - [#3232](https://github.com/wix/ricos/pull/3232) `toolbarInputButton` supports disable prop
- `ui-components`
  - [#3233](https://github.com/wix/ricos/pull/3233) refactor settings-mobile-header/button components
  - [#3244](https://github.com/wix/ricos/pull/3244) refactor slider components

## 8.65.4 (Dec 06, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#3215](https://github.com/wix/ricos/pull/3215) fixed memory leak in fromDraft caused by generateId

## 8.65.3 (Dec 06, 2021)

### :bug: Bug Fix

- `ricos-editor`
  - [#3232](https://github.com/wix/ricos/pull/3232) fix new formatting toolbar crash

## 8.65.2 (Dec 05, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3211](https://github.com/wix/ricos/pull/3211) font size dropdown a11y

## 8.65.1 (Dec 05, 2021)

### :bug: Bug Fix

- `tiptap-editor`
  - [#3210](https://github.com/wix/ricos/pull/3210) set focus to editor in decoration commands
- `tiptap-editor`
  - [#3206](https://github.com/wix/ricos/pull/3206) add mentions plugin

## 8.65.0 (Dec 05, 2021)

### :rocket: New Feature

- `*`
  - [#3203](https://github.com/wix/ricos/pull/3203) icons bm theme wiring
  - [#3207](https://github.com/wix/ricos/pull/3207) bg & hover color bm theme wiring
- `ricos-editor`
  - [#3182](https://github.com/wix/ricos/pull/3182) sideBlockComponent config (Notes integration)

### :bug: Bug Fix

- `html`
  - [#3204](https://github.com/wix/ricos/pull/3204) add `allowFullScreen` to html iframe

### :house: Internal

- `common`
  - [#3202](https://github.com/wix/ricos/pull/3202) add `documentStyle` to the old schema
- `ricos-content`
  - [#3187](https://github.com/wix/ricos/pull/3187) `fromDraft` gallery converter `thumbnails.placement` defaults to `NONE`
- `schema`
  - [#3187](https://github.com/wix/ricos/pull/3187) add `NONE` value to gallery thumbnails.placement enum

### :nail_care: Polish

- `general`
  - [#3186](https://github.com/wix/ricos/pull/3186) use button component in table settings and refactor color picker ui

## 8.64.1 (Dec 02, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#3201](https://github.com/wix/ricos/pull/3201) fromHtml/ck-editor: text and links under root are handled

## 8.64.0 (Dec 02, 2021)

### :rocket: New Feature

- `general`
  - [#3178](https://github.com/wix/ricos/pull/3178) font-family BM theme wiring
  - [#3181](https://github.com/wix/ricos/pull/3181) box-shadow & border-radius BM theme wiring
  - [#3185](https://github.com/wix/ricos/pull/3185) inputs/text color BM theme wiring

### :bug: Bug Fix

- `toolbars-new`
  - [#3188](https://github.com/wix/ricos/pull/3188) mobile basic link panel
- `html`
  - [#3191](https://github.com/wix/ricos/pull/3191) html iframe sandbox allows fullscreen
- `headings`
  - [#3196](https://github.com/wix/ricos/pull/3196) new dropdown style and a11y fixes for safari
- `vertical-embed`
  - [#3199](https://github.com/wix/ricos/pull/3199) reduce verticals image size

## 8.63.7 (Nov 30, 2021)

### :bug: Bug Fix

- `button`
  - [#3172](https://github.com/wix/ricos/pull/3172) prevent default space/enter onKeyDown
- `toolbars-new`
  - [#3173](https://github.com/wix/ricos/pull/3173) mobile add plugin button when side toolbar disabled from config

## 8.63.6 (Nov 29, 2021)

### :house: Internal

- `common`
  - [#3170](https://github.com/wix/ricos/pull/3170) collapsible list schema validator
- `file-upload`
  - [#3169](https://github.com/wix/ricos/pull/3169) enable `useFilePluginAutoDownloadLinkRef` experiment

### :bug: Bug Fix

- `collapsible-list`
  - [#3171](https://github.com/wix/ricos/pull/3171) disable expand/collapse onClick auto-scroll

## 8.63.4 (Nov 29, 2021)

### :bug: Bug Fix

- `gallery`
  - [#3165](https://github.com/wix/ricos/pull/3165) fix height issues on scroll direction change
- `file-upload`
  - [#3167](https://github.com/wix/ricos/pull/3167) fix icon colors wiring
- `ricos-content`
  - [#3166](https://github.com/wix/ricos/pull/3166) `<br>` handled in `fromHtml/ck-editor`

### :house: Internal

- `video - ui-components`
  - [#3159](https://github.com/wix/ricos/pull/3159) move upload modal-UI into ui-components
- `link`
  - [#3166](https://github.com/wix/ricos/pull/3166) LinkViewer handles `tel:` links (Viewer only)

## 8.63.3 (Nov 25, 2021)

### :bug: Bug Fix

- `gallery`
  - [#3136](https://github.com/wix/ricos/pull/3136) fix gallery items `itemId` generation
- `plugin-giphy`
  - [#2312](https://github.com/wix/ricos/pull/2312) TS & Add missing hotkeys to giphy selector and more descriptive alt text
- `fullscreen`
  - [#3162](https://github.com/wix/ricos/pull/3162) videos pause when scrolled out of view
  - [#3082](https://github.com/wix/ricos/pull/3082) image centered correctly on mobile

## 8.63.2 (Nov 24, 2021)

### :nail_care: Polish

- `ricos-schema`
  - [#3140](https://github.com/wix/ricos/pull/3140) Expose RichContent based on integer enum

## 8.63.1 (Nov 23, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#3156](https://github.com/wix/ricos/pull/3156) fromHtml: undefined node protected

## 8.63.0 (Nov 22, 2021)

### :bug: Bug Fix

- `gallery`
  - [#3153](https://github.com/wix/ricos/pull/3153) item titles don't appear on gallery container hover

### :house: Internal

- `gallery`
  - [#3152](https://github.com/wix/ricos/pull/3152) update `ProGallery` version to `3.1.38`

## 8.62.0 (Nov 22, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#3147](https://github.com/wix/ricos/pull/3147) Metadata Utils ([Docs](https://ricos.js.org/docs/content_api/metadata_utils_api))

### :house: Internal

- `toolbars-new`
  - [#3144](https://github.com/wix/ricos/pull/3144) refactor: get toolbar settings from config

### :bug: Bug Fix

- `toolbars-new`
  - [#3148](https://github.com/wix/ricos/pull/3148) edit button in link toolbar on mobile
- `gallery`
  - [#3151](https://github.com/wix/ricos/pull/3151) gallery videos plays on click, controls are displayed, fullscreen opens on icon click only
- `fullscreen`
  - [#3151](https://github.com/wix/ricos/pull/3151) videos play on click, controls are displayed

## 8.61.9 (Nov 21, 2021)

### :bug: Bug Fix

- `tiptap-editor`
  - [#3145](https://github.com/wix/ricos/pull/3145) fix onAtomicBlockFocus to be called on text blocks, onChange callback to be called on selection change, fix hasInlineStyle command

## 8.61.8 (Nov 21, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3142](https://github.com/wix/ricos/pull/3142) fix headings dropdown tooltips
  - [#3143](https://github.com/wix/ricos/pull/3143) buttons active status wired to `documentStyle`

## 8.61.7 (Nov 21, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3137](https://github.com/wix/ricos/pull/3137) fix panel header keys
  - [#3136](https://github.com/wix/ricos/pull/3136) code and quote blocks not clearing on second click
- `table`
  - [#3141](https://github.com/wix/ricos/pull/3141) fix cells group alignment

## 8.61.6 (Nov 18, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3135](https://github.com/wix/ricos/pull/3135) support shouldCreate config
  - [#3128](https://github.com/wix/ricos/pull/3128) headings dropdown options tooltips
- `viewer`
  - [#3128](https://github.com/wix/ricos/pull/3128) link colors overriden by `documentStyle`
- `ricos-content`
  - [#3131](https://github.com/wix/ricos/pull/3131) convertJsonToStruct validation logic fix

## 8.61.5 (Nov 18, 2021)

### :bug: Bug Fix

- `tiptap`
  - [#3132](https://github.com/wix/ricos/pull/3132) fixed on atomic block focus
  - [#3133](https://github.com/wix/ricos/pull/3133) External Toolbar Crash bix

## 8.61.4 (Nov 17, 2021)

### :bug: Bug Fix

- `general`
  - [#3119](https://github.com/wix/ricos/pull/3119) Fix font-family and color wiring on modals
- `video/ui-components`
  - [#3127](https://github.com/wix/ricos/pull/3127) Fix language dir and input border radius

### :house: Internal

- `*`
  - [#3061](https://github.com/wix/ricos/pull/3061) RichContent ID

## 8.61.3 (Nov 17, 2021)

### :bug: Bug Fix

- `headings`
  - [#3125](https://github.com/wix/ricos/pull/3125) update heading also removes line height from block style

## 8.61.2 (Nov 17, 2021)

### :bug: Bug Fix

- `video`
  - [#3121](https://github.com/wix/ricos/pull/3121) Fix new video modal style
- `vertical-embed`
  - [#3123](https://github.com/wix/ricos/pull/3123) bug fix scroll to selected item
- `ricos-content`
  - [#3124](https://github.com/wix/ricos/pull/3124) external type in fromDraft/toDraft

## 8.61.1 (Nov 16, 2021)

### :bug: Bug Fix

- `social-polls`
  - [#3122](https://github.com/wix/ricos/pull/3122) Polls a11y

## 8.61.0 (Nov 16, 2021)

### :rocket: New Feature

- `plugin-headings toolbars-new`
  - [#2987](https://github.com/wix/ricos/pull/2987) `allowHeadingCustomization` prop enables headings customization modal in the new formatting toolbar

### :bug: Bug Fix

- `vertical-embed`
  - [#3118](https://github.com/wix/ricos/pull/3118) Fix new vertical-embed modal style

## 8.60.2 (Nov 16, 2021)

### :house: Internal

- `ricos-content`
  - [#3117](https://github.com/wix/ricos/pull/3117) export convert function

## 8.60.1 (Nov 15, 2021)

### :bug: Bug Fix

- `more-menu`
  - [#1513](https://github.com/wix/ricos/pull/1513) fix more menu position

## 8.60.0 (Nov 15, 2021)

### :rocket: New Feature

- `ricos-editor`
  - [#3068](https://github.com/wix/ricos/pull/3068) **beta** Editor Commands API support for Notes

### :bug: Bug Fix

- `toolbars-new`

  - [#3108](https://github.com/wix/ricos/pull/3108) Fix getsSpacing function to operate when the default line spacing is not defined

- `image-plugin`
  - [#3112](https://github.com/wix/ricos/pull/3112) fix a11y on enter

### :house: Internal

- `editor viewer`
  - [#3006](https://github.com/wix/ricos/pull/3006) `documentStyle` and headings customization support

## 8.59.3 (Nov 14, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3090](https://github.com/wix/ricos/pull/3090) support custom link config

## 8.59.2 (Nov 13, 2021)

- `viewer`
  - [#3011](https://github.com/wix/ricos/pull/3011) Full Screen Optmization - a11y & mobile experiment
- `tiptap`
  - [#3104](https://github.com/wix/ricos/pull/3104) support on atomic block focus callback

## 8.59.1 (Nov 10, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#3075](https://github.com/wix/ricos/pull/3075) disable link when atomic block is selected
- `table`
  - [#3091](https://github.com/wix/ricos/pull/3091) clean unwanted separators from toolbar
- `ricos-content`
  - [#3092](https://github.com/wix/ricos/pull/3092) ckeditor parser: text-in-root rule
  - [#3095](https://github.com/wix/ricos/pull/3095) EXTERNAL type mapped to plugin data
- `editor-common`
  - [#3094](https://github.com/wix/ricos/pull/3094) anchor in new toolbar on mobile

### :house: Internal

- `example`
  - [#3076](https://github.com/wix/ricos/pull/3076) new toolbar - default in example + add dedicated button in settings
- `toolbars-new`
  - [#3099](https://github.com/wix/ricos/pull/3099) added datahooks

### :nail_care: Polish

- `toolbars-new`
  - [#3097](https://github.com/wix/ricos/pull/3097) refactor new toolbar modals position

## 8.59.0 (Nov 9, 2021)

### :rocket: New Feature

- `ricos-schema`
  - [#3054](https://github.com/wix/ricos/pull/3054) EXTERNAL type
- `ricos-content`
  - [#3054](https://github.com/wix/ricos/pull/3054) to/fromDraft: EXTERNAL type supported
  - [#3056](https://github.com/wix/ricos/pull/3056) EXTERNAL type in EditorCommands

### :bug: Bug Fix

- `toolbar-new`
  - [#3066](https://github.com/wix/ricos/pull/3066) fix color-picker modal style for mobile devices
  - [#3078](https://github.com/wix/ricos/pull/3078) refactor toolbar modals position and width
- `toolbars`
  - [#3063](https://github.com/wix/ricos/pull/3063) ui changes in static text toolbars (old/new toolbar)
- `ricos-content`
  - [#3083](https://github.com/wix/ricos/pull/3083) Fix fromHtml parser rules

### :house: Internal

- `ricos-content`
  - [#3071](https://github.com/wix/ricos/pull/3071) Content API: generic modifier and extractor
- `toolbars-new`
  - [#3073](https://github.com/wix/ricos/pull/3073) update and add datahooks to the new-toolbar testing
- `tiptap`
  - [#3080](https://github.com/wix/ricos/pull/3080) add insertNode, updateNodeById, and setNode core commands

### :nail_care: Polish

- `polls`
  - [#3026](https://github.com/wix/ricos/pull/3026) refactor settings mobile header / add polls to plugin menu

## 8.58.3 (Nov 2, 2021)

### :house: Internal

- `tiptap plugins`
  - [#3047](https://github.com/wix/ricos/pull/3047) add plugins to tiptap [video, gif, file, gallery, code-block, spoiler, color]
- `video`
  - [#3050](https://github.com/wix/ricos/pull/3050) open video modal when embed from youtube

## 8.58.2 (Nov 1, 2021)

### :house: Internal

- `schema`
  - [#3049](https://github.com/wix/ricos/pull/3049) generate-plugin-defaults generates link decoration defaults

### :bug: Bug Fix

- `schema`
  - add verticala embed schema to content state schemas

## 8.58.1 (Oct 27, 2021)

### :rocket: New Feature

- `social-polls`
  - [#3041](https://github.com/wix/ricos/pull/3041) fallback user

## 8.58.0 (Oct 27, 2021)

### :rocket: New Feature

- `social-polls`
  - [#3025](https://github.com/wix/ricos/pull/3025) refactor polls config API & normalize poll data
- `editor`
  - [#3028](https://github.com/wix/ricos/pull/3028) plugin menu shortcuts

### :bug: Bug Fix

- `social-polls`
  - [#3020](https://github.com/wix/ricos/pull/3020) fix settings separator style
- `gallery`
  - [#3033](https://github.com/wix/ricos/pull/3033) fix settings separator style

### :house: Internal

- `editor-common`
  - [#3030](https://github.com/wix/ricos/pull/3030) refactor getModalStyles (changed modal position when opened from plugin menu)
- `general`
  - [#3023](https://github.com/wix/ricos/pull/3023) add BI events to formatting shortcuts

### :book: Documentation

- [#3037](https://github.com/wix/ricos/pull/3037) FromDraftOptions

### :nail_care: Polish

- `ricos-schema`
  - [#2927](https://github.com/wix/ricos/pull/2927) text decorations and `documentStyle` schema

## 8.57.0 (Oct 25, 2021)

### :rocket: New Feature

- `viewer`
  - [#3012](https://github.com/wix/ricos/pull/3012) print mode - fix page break in the middle of list item

### :bug: Bug Fix

- `ricos-content`
  - [#3019](https://github.com/wix/ricos/pull/3019) fromDraft: Invalid entity key protected

### :nail_care: Polish

- `ui-components`
  - [#2999](https://github.com/wix/ricos/pull/2999) fix action buttons keyboard navigation order
- `vertical-embed`
  - [#3005](https://github.com/wix/ricos/pull/3005) vertical-embed modal new design
- `line-spacing`
  - [#3009](https://github.com/wix/ricos/pull/3009) add custom line-height selection to the line-heights options display
- `ricos-content`
  - [#3016](https://github.com/wix/ricos/pull/3016) Polls Content Builder API support
- `ui-components/video/vertical-social-embed`
  - [#3018](https://github.com/wix/ricos/pull/3018) new modals general code / style refactor

### :house: Internal

- `schema`
  - [#3013](https://github.com/wix/ricos/pull/3013) undefined fields added to plugin defaults JSON
- `divider`
  - [#3017](https://github.com/wix/ricos/pull/3017) set divider width to 100% and remove editor bounds consideration

## 8.56.5 (Oct 18, 2021)

### :house: Internal

- `ricos-content`
  - [#96dce6a](https://github.com/wix/ricos/commit/96dce6a93b8f4227dfa86c801b77b349049a4ee0)velo adapter - image element source's regex fix

## 8.56.4 (Oct 18, 2021)

### :house: Internal

- `video/linkpreview/ui-components`
  - [#3010](https://github.com/wix/ricos/pull/3010) new modals general refactor
- `ricos-content`
  - [#3007](https://github.com/wix/ricos/pull/3007) velo adapter bundle size improvement

### :nail_care: Polish

- `common/toolbars-new`
  - [#2996](https://github.com/wix/ricos/pull/2996) created border-box mixin and used it in the new toolbar modals

### :bug: Bug Fix

- `viewer`
  - [#3004](https://github.com/wix/ricos/pull/3004) fix ios text highlight on blankspaces
- `[toolbars-new]`
  - [#2991](https://github.com/wix/ricos/pull/2991) close modals on escape

## 8.56.3 (Oct 17, 2021)

### :nail_care: Polish

- `social-polls`
  - [#2899](https://github.com/wix/ricos/pull/2899) fix missing import wix validations for polls schema

## 8.56.2 (Oct 16, 2021)

### :house: Internal

- `ricos-content`
  - [#3000](https://github.com/wix/ricos/pull/3000) velo adapter: fix `parseImageElement` scoped variable

## 8.56.1 (Oct 14, 2021)

### :nail_care: Polish

- `social-polls`
  - [#2899](https://github.com/wix/ricos/pull/2899) polls schema

## 8.56.0 (Oct 14, 2021)

### :nail_care: Polish

- `plugin-video`
  - [#2985](https://github.com/wix/ricos/pull/2985) video modal new design
- `social-embed`
  - [#2986](https://github.com/wix/ricos/pull/2986) social-embed modal new design

### :bug: Bug Fix

- `toolbars-new`
  - [#2982](https://github.com/wix/ricos/pull/2982) fix Link-modal style

### :rocket: New Feature

- `toolbars-new`
  - [#2921](https://github.com/wix/ricos/pull/2921) custom font size dropdown and `toolbarInputButton`
- `ricos-content`
  - [#2994](https://github.com/wix/ricos/pull/2994) velo adapter: modify functionality with callback support

### :house: Internal

- `toolbars-new`
  - [#2968](https://github.com/wix/ricos/pull/2968) refactor line-spacing (set to default when there is no line-spacing)
- `ricos-content`
  - [#2992](https://github.com/wix/ricos/pull/2992) velo adapter: refactoring + folder lib rename

## 8.55.3 (Oct 11, 2021)

### :house: Internal

- `[ui-components]`
  - [#2984](https://github.com/wix/ricos/pull/2984) Fix Typescript issue

## 8.55.2 (Oct 11, 2021)

### :house: Internal

- `*`
  - [#2933](https://github.com/wix/ricos/pull/2933) JS to TS conversion + rollup configuration
- `common`
  - [#2980](https://github.com/wix/ricos/pull/2980) cleanup schema errors

## 8.55.1 (Oct 11, 2021)

### :rocket: New Feature

- `social-polls`
  - [#2964](https://github.com/wix/ricos/pull/2964) `pollServiceApi` config

### :house: Internal

- `social-polls`
  - [#2964](https://github.com/wix/ricos/pull/2964) add `PollsServiceMock` and normalize polls data under `normalizePoll` experiment

## 8.55.0 (Oct 11, 2021)

### :rocket: New Feature

- `ui-components`
  - [#2955](https://github.com/wix/ricos/pull/2955) new text-input-modal (url/search) component
- `ricos-content`
  - [#2966](https://github.com/wix/ricos/pull/2966) ContentAPI adapter for simplified builder API

### :bug: Bug Fix

- `table-plugin`
  - [#2972](https://github.com/wix/ricos/pull/2972) fix columns width on SSR
- `viewer`
  - [#2962](https://github.com/wix/ricos/pull/2962) fix alignment position of Map plugin

### :house: Internal

- `tiptap-editor`
  - [#2971](https://github.com/wix/ricos/pull/2971) refactor according to domain model

### :book: Documentation

- [#2976](https://github.com/wix/ricos/pull/2976) plugin DoD

## 8.54.3 (Oct 10, 2021)

### :bug: Bug Fix

- `editor viewer`
  - [#2969](https://github.com/wix/ricos/pull/2969) fix text highlight parsing issue

## 8.54.2 (Oct 7, 2021)

### :bug: Bug Fix

- `fullscreen`
  - [#2946](https://github.com/wix/ricos/pull/2946) fix a11y keyboard navigation (desktop) and screen reader
- `external-toolbar`
  - [#2947](https://github.com/wix/ricos/pull/2947) new icons for external toolbar (under specs.ricos.newFormattingToolbar experiment)
- `toolbars-new`
  - [#2958](https://github.com/wix/ricos/pull/2958) fix color-picker/modals a11y
- `video-plugin`
  - [#2963](https://github.com/wix/ricos/pull/2963) add spoiler to url video settings modal
- `link-preview-popover`
  - [#2956](https://github.com/wix/ricos/pull/2956) display link preview popover only on external links
- `schema-validations`
  - [#2957](https://github.com/wix/ricos/pull/2957) cleanup schema validation errors

### :house: Internal

- `color-picker`
  - [#2961](https://github.com/wix/ricos/pull/2961) refactor: send arguments in object (in ColorPicker props function)

## 8.54.1 (Oct 3, 2021)

### :bug: Bug Fix

- `editor`
  - [#2954](https://github.com/wix/ricos/pull/2954) support editor shortcuts with keyCode
- `ui-components`
  - [#2917](https://github.com/wix/ricos/pull/2917) refactor tabs component style

### :nail_care: Polish

- `ricos-schema`
  - [#2948](https://github.com/wix/ricos/pull/2948) font size schema

## 8.54.0 (Oct 3, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2945](https://github.com/wix/ricos/pull/2945) Content API: Table, CollapsibleList, Gif, Map, Embed builders

### :bug: Bug Fix

- `toolbars-new`
  - [#2932](https://github.com/wix/ricos/pull/2932) fix modals keyboard navigation (accessibility)
- `plugin-commons`
  - [#2950](https://github.com/wix/ricos/pull/2950) fix color picker modal crashing when color isn't defined

## 8.53.4 (Sep 25, 2021)

### :house: Internal

- `tiptap`
  - [#2930](https://github.com/wix/ricos/pull/2930) Tiptap & new toolbars integration (formatting & link)

## 8.53.3 (Sep 23, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#2937](https://github.com/wix/ricos/pull/2937) mobile flaky switching between text and link toolbar + remove dependent in old toolbars logic

## 8.53.2 (Sep 23, 2021)

- `ricos-schema`
  - [#2759](https://github.com/wix/ricos/pull/2759) button schema
  - [#2928](https://github.com/wix/ricos/pull/2928) disable polls from schema & content api until schema is final
- `html plugin`

  - [#2934](https://github.com/wix/ricos/pull/2934) `forceIframeSandboxDomain` experiment (for debugging)

- `a11y`
  - [#2935](https://github.com/wix/ricos/pull/2935) add presentation role to empty lines to skip reading by screen readers

## 8.53.1 (Sep 19, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#2931](https://github.com/wix/ricos/pull/2931) fix mobile scroll behavior + fix separator height bug in ios safari
- `link`
  - [#2929](https://github.com/wix/ricos/pull/2929) fix a11y in link modal

## 8.53.0 (Sep 14, 2021)

### :house: Internal

- `editor`
  - [#2922](https://github.com/wix/ricos/pull/2922) deprecate `UseUndoForPlugins` experiment, enable undo-redo for plugins out of the box

## 8.52.7 (Sep 13, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#2924](https://github.com/wix/ricos/pull/2924) fix alignment modal display in mobile
- `editor-common`
  - [#2923](https://github.com/wix/ricos/pull/2923) fix missing values of rel object

## 8.52.6 (Sep 9, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#2915](https://github.com/wix/ricos/pull/2915) fix modals border-radius, buttons font-family wiring, custom-line-spacing inputs width and added alignments-tooltip
- `*`
  - [#2919](https://github.com/wix/ricos/pull/2919) missing plugin buttons in toolbar

### :house: Internal

- `editor viewer common`

  - [#2811](https://github.com/wix/ricos/pull/2811) custom draft inline styles infra and custom font size editor viewer support

- `color`
  - [#2920](https://github.com/wix/ricos/pull/2920) fix text color\highlight inline mappers exports

## 8.52.5 (Sep 7, 2021)

### :bug: Bug Fix

- `giphy`
  - [#b93796e](https://github.com/wix/ricos/commit/b93796e3336b848ee830ba3285bf4453817bb393) handle crush when downsized & downsized_still are null

## 8.52.4 (Sep 5, 2021)

### :house: Internal

- `ui-components`

  - [#2908](https://github.com/wix/ricos/pull/2908) refactor button component - removed classname prop

### :bug: Bug Fix

- `toolbars-new`
  - [#2913](https://github.com/wix/ricos/pull/2913) improve buttons filters (separators, installed plugins, headings/title

## 8.52.3 (Sep 2, 2021)

### :bug: Bug Fix

- `social-polls`
  - [#2912](https://github.com/wix/ricos/pull/2912) `enableVoteRole` config

## 8.52.2 (Sep 1, 2021)

### :bug: Bug Fix

- `toolbars-new`
  - [#2910](https://github.com/wix/ricos/pull/2910) filter separators from buttons list
- `toolbars-new`
  - [#2906](https://github.com/wix/ricos/pull/2906) link input - cleanup preventDefault
- `editor-common/toolbars-new`
  - [#2902](https://github.com/wix/ricos/pull/2902) fix link-modal input behavior on focus
- `divider`
  - [#2903](https://github.com/wix/ricos/pull/2903) move `divider-component` to fix Loadable support

### :house: Internal

- `general`
  - [#2911](https://github.com/wix/ricos/pull/2911) fix rollup-externals (tiptap-react excluded)

## 8.52.1 (Sep 1, 2021)

### :bug: Bug Fix

- `ricos-editor`
  - [#2898](https://github.com/wix/ricos/pull/2898) update new toolbars on editor changed

## 8.52.0 (Sep 1, 2021)

### :rocket: New Feature

- `ricos-common`
  - [#2890](https://github.com/wix/ricos/pull/2890) Theme - `settingsStyles`

### :house: Internal

- `ricos-content`
  - [#2901](https://github.com/wix/ricos/pull/2901) refactor of html convertor

## 8.51.2 (Aug 31, 2021)

### :house: Internal

- `social-polls`
  - [#2900](https://github.com/wix/ricos/pull/2900) remove settings from data (siteToken)

## 8.51.1 (Aug 30, 2021)

### :house: Internal

- `ricos-schema`
  - [#2705](https://github.com/wix/ricos/pull/2705) table schema

## 8.51.0 (Aug 30, 2021)

### :rocket: New Feature

- `toolbars`
  - [#2328](https://github.com/wix/ricos/pull/2328) new formatting toolbar & link toolbar (under experiment)

## 8.50.2 (Aug 29, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#9542a83](https://github.com/wix/ricos/commit/9542a831953185d665b98b13f02b1315cef948b3) fix textWrap normalize when plugin's config is undefined

## 8.50.1 (Aug 26, 2021)

### :bug: Bug Fix

- `*`
  - [#2891](https://github.com/wix/ricos/pull/2891) fix textWrap in content

## 8.50.0 (Aug 26, 2021)

### :rocket: New Feature

- `link-preview-popover`
  - [#2881](https://github.com/wix/ricos/pull/2881) Link Preview Popover

## 8.49.8 (Aug 25, 2021)

### :bug: Bug Fix

- `collapsible-list`
  - [#2889](https://github.com/wix/ricos/pull/2889) fix editor stuck (read-only mode) when deleting collapsible

### :house: Internal

- `ricos-schema`
  - [#2680](https://github.com/wix/ricos/pull/2680) collapsible list schema

## 8.49.7 (Aug 25, 2021)

### :nail_care: Polish

- `ricos-content`
  - [#2876](https://github.com/wix/ricos/pull/2876) html convertor now preserves text formatting (highlight & color)
- `ui-components`
  - [#2865](https://github.com/wix/ricos/pull/2865) refactor ActionButtons and SettingsMobileHeader components

### :house: Internal

- `scripts`
  - [#2885](https://github.com/wix/ricos/pull/2885) `updateBaselines` updates translatablesMock.json according to changes

## 8.49.6 (Aug 23, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2844](https://github.com/wix/ricos/pull/2844) Translatables API

### :bug: Bug Fix

- `general`

  - [#2859](https://github.com/wix/ricos/pull/2859) wire button/link-preview/file-upload font family
  - [#2877](https://github.com/wix/ricos/pull/2877) fix webpackChunkName syntax

- `gif`
  - [#1102d70](https://github.com/wix/ricos/commit/1102d70e51d5ada621b7cbccfc7bcb1159c2d459) toolbar crush when downsized_small is null

## 8.49.5 (Aug 19, 2021)

### :bug: Bug Fix

- `table`
  - [#2874](https://github.com/wix/ricos/pull/2874) override sideToolbar onClick config when use it from table

## 8.49.4 (Aug 18, 2021)

### :bug: Bug Fix

- `table`
  - [#2871](https://github.com/wix/ricos/pull/2871) fix: wiring table theme on biz manager
- `table`
  - [#2869](https://github.com/wix/ricos/pull/2869) fix: add overlay to table external modal

## 8.49.3 (Aug 18, 2021)

### :rocket: New Feature

- `*`
  - [#2850](https://github.com/wix/ricos/pull/2850) textWrap

### :house: Internal

- `ricos-schema`
  - [#2864](https://github.com/wix/ricos/pull/2864) generate plugin defaults in build time
- `ui-components`
  - [#2839](https://github.com/wix/ricos/pull/2839) refactor SettingsMobileHeader component and consume it in Button/CollapsibleList/Map/Link-modal/UrlInputModal
- `e2e`
  - [#2860](https://github.com/wix/ricos/pull/2860) add TypeScript support for Cypress
  - [#2863](https://github.com/wix/ricos/pull/2863) update Cypress to v8
- `example`
  - [#2862](https://github.com/wix/ricos/pull/2862) add eslint support
- `social-polls`
  - [#2024](https://github.com/wix/ricos/pull/2024) add Poll story & rendering tests
  - [#2870](https://github.com/wix/ricos/pull/2870) loadable support

### :nail_care: Polish

- `link`
  - [#2828](https://github.com/wix/ricos/pull/2828) fix link data values
- `plugin-button`
  - [#2856](https://github.com/wix/ricos/pull/2856) refactor SettingsPanelFooter usage and deleted some css
- `Tooltip`
  - [#2839](https://github.com/wix/ricos/pull/2839) refactor tooltip style

### :bug: Bug Fix

- `link`
  - [#2855](https://github.com/wix/ricos/pull/2855) fix: shift+enter break link string

### :book: Documentation

- `extractAppEmbedData` API docs added

## 8.49.2 (Aug 14, 2021)

### :bug: Bug Fix

- `vertical-embed`
  - [#2852](https://github.com/wix/ricos/pull/2852) fix booking description

## 8.49.1 (Aug 13, 2021)

### :nail_care: Polish

- `ricos-schema`
  - [#2507](https://github.com/wix/ricos/pull/2507) gallery schema

## 8.49.0 (Aug 12, 2021)

### :bug: Bug Fix

- `plugin-common`

  - [#2842](https://github.com/wix/ricos/pull/2842) fix link toolbar shortcut

### :house: Internal

- `gallery`
  - [#2754](https://github.com/wix/ricos/pull/2754) remove `itemId` from content
  - [#2799](https://github.com/wix/ricos/pull/2799) calculate thumbnail spacings on runtime normalize content before `8.49.0`

## 8.48.4 (Aug 10, 2021)

### :bug: Bug Fix

- `collapsible-list`
  - [#2831](https://github.com/wix/ricos/pull/2831) add collapsible_list to INSERT_PLUGIN_BUTTONS
- `ricos-viewer` `ricos-editor`
  - [#2840](https://github.com/wix/ricos/pull/2840) expose `iframeSandboxDomain` prop on editor & viewer fix

## 8.48.3 (Aug 09, 2021)

### :bug: Bug Fix

- `link`
  - [#2830](https://github.com/wix/ricos/pull/2830) fix modal design when opened using image toolbar

### :nail_care: Polish

- `ricos-viewer` `ricos-editor`
  - [#2836](https://github.com/wix/ricos/pull/2836) expose `iframeSandboxDomain` prop on editor & viewer

### :house: Internal

- `editor-common`
  - [#2824](https://github.com/wix/ricos/pull/2824) overflowUtils - support overflow from bottom + change returned value

## 8.48.2 (Aug 05, 2021)

### :rocket: New Feature

- `*`
  - [#2817](https://github.com/wix/ricos/pull/2817) [performance] add loading=lazy attribute to images and iframes (lazyImagesAndIframes experiment)

### :house: Internal

- `tiptap`
  - [#2815](https://github.com/wix/ricos/pull/2815) external `addNodeViewHOC` for generic extensions
  - [#2825](https://github.com/wix/ricos/pull/2825) tiptap focus extensions

### :bug: Bug Fix

- `link`
  - [#2822](https://github.com/wix/ricos/pull/2822) fix default checkboxes and add placeholder to link input
- `*`
  - [#2826](https://github.com/wix/ricos/pull/2826) fix full height modals overrides by bm's header
- `link-preview`
  - [#2827](https://github.com/wix/ricos/pull/2827) fix verticals embed svg's width & height

## 8.48.1 (Aug 03, 2021)

### :bug: Bug Fix

- `ricos-common`
  - [#2831](https://github.com/wix/ricos/pull/2831) add collapsible_list plugin to INSERT_PLUGIN_BUTTONS
- `editor`
  - [#2813](https://github.com/wix/ricos/pull/2813) fix rel value not applying in link panel by config

### :house: Internal

- `tiptap`
  - [#2800](https://github.com/wix/ricos/pull/2800) image plugin endpoint for tiptap editor
  - [#2814](https://github.com/wix/ricos/pull/2814) `ExtensionBuilder` + divider refactor
- `image`
  - [#2800](https://github.com/wix/ricos/pull/2800) image plugin endpoint for tiptap editor
- `social-polls`
  - [#2809](https://github.com/wix/ricos/pull/2809) revert loadable support (fixes css issues)

## 8.48.0 (Aug 03, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2804](https://github.com/wix/ricos/pull/2804) extractAppEmbedData

### :nail_care: Polish

- `schema`
  - [#2662](https://github.com/wix/ricos/pull/2662) FileSource contains `privacy`, `id` fields
  - [#2662](https://github.com/wix/ricos/pull/2662) FileSource's `custom` field deprecation

### :bug: Bug Fix

- `ricos-content`
  - [#2812](https://github.com/wix/ricos/pull/2812) fix fromHtml/ck-editor/parser span rules
- `link`
  - [#2802](https://github.com/wix/ricos/pull/2802) fix modal design when opened using external toolbar
  - [#2803](https://github.com/wix/ricos/pull/2803) fix default value for newTab checkbox (true by default)

## 8.47.15 (Aug 01, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#2797](https://github.com/wix/ricos/pull/2797) ckeditor html parser: line-height in lists fixed
  - [#2797](https://github.com/wix/ricos/pull/2797) ckeditor html parser: `<br>` => new line rule fixed
  - [#2797](https://github.com/wix/ricos/pull/2797) ckeditor html parser: image custom width parsing
  - [#2798](https://github.com/wix/ricos/pull/2798) extract-media: invalid data protected and tested

## 8.47.14 (Jul 29, 2021)

### :bug: Bug Fix

- `hashtag`
  - [#2796](https://github.com/wix/ricos/pull/2796) disable hashtag inside quotes for avoid hashtag in code-snippet selectors

## 8.47.13 (Jul 29, 2021)

### :house: Internal

- `ricos-schema`
  - [#2777](https://github.com/wix/ricos/pull/2777) gif schema
- `ricos-content`
  - [#2790](https://github.com/wix/ricos/pull/2790) fix `convertContainerData` converters (from&toDraft)
- `image`
  - [#2793](https://github.com/wix/ricos/pull/2793) merge image quality preload experiment

### :bug: Bug Fix

- `ricos-content`
  - [#2787](https://github.com/wix/ricos/pull/2787) toDraft preprocess => ckeditor parser postprocess
- `editor`
  - [#2794](https://github.com/wix/ricos/pull/2794) copy/paste supports spacing & indentation

## 8.47.12 (Jul 27, 2021)

### :bug: Bug Fix

- `loadable`
  - [#2786](https://github.com/wix/ricos/pull/2786) add loadable entry to files and fix createLoadable script

## 8.47.11 (Jul 27, 2021)

### :bug: Bug Fix

- `editor`
  - [#2659](https://github.com/wix/ricos/pull/2659) close plugin menu on mobile after adding a plugin

## 8.47.10 (Jul 27, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#2784](https://github.com/wix/ricos/pull/2784) fromHtml: ckeditor parser rules fixed

## 8.47.9 (July 26, 2021)

### :house: Internal

- `loadable`
  - [#2782](https://github.com/wix/ricos/pull/2770) add loadable support for atomic plugins

## 8.47.8 (July 26, 2021)

### :bug: Bug Fix

- `html-plugin`
  - [#2769](https://github.com/wix/ricos/pull/2769) src validation
- `table`
  - [#2773](https://github.com/wix/ricos/pull/2773) update table toolbar position

### :house: Internal

- `ui-components`
  - [#2770](https://github.com/wix/ricos/pull/2770) refactor Button/TextInput/InputWithLabel
    components
- `ui-components`
  - [#2779](https://github.com/wix/ricos/pull/2779) revert changes in TextInput/InputWithLabel
    components

## 8.47.7 (July 25, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2765](https://github.com/wix/ricos/pull/2765) addAppEmbed, addLinkPreview APIs added to Content Builder

### :nail_care: Polish

- `floadable`
  - [#2766](https://github.com/wix/ricos/pull/2766) loadable cjs fix

## 8.47.6 (July 21, 2021)

### :house: Internal

- `*`
  - [#2762](https://github.com/wix/ricos/pull/2762) make downshift external

## 8.47.5 (July 21, 2021)

### :house: Internal

- `file`
  - [#2761](https://github.com/wix/ricos/pull/2761) loadable support

## 8.47.4 (July 21, 2021)

### :house: Internal

- `ricos-common`
  - [#2744](https://github.com/wix/ricos/pull/2744) move `imageUtils` from `ricos-content` to `common` package

### :nail_care: Polish

- `ricos-schema`
  - [#2744](https://github.com/wix/ricos/pull/2744) rename unique node identifier from `key` to `id`
- `rich-content-common`
  - [#2755](https://github.com/wix/ricos/pull/2755) `i18next` extranaliziation and version bump (v11)

## 8.47.3 (July 20, 2021)

### :bug: Bug Fix

- `*`
  - [#2753](https://github.com/wix/ricos/pull/2753) fix webpackChunkName magic comments
  - [#2749](https://github.com/wix/ricos/pull/2749) remove string.matchAll to work in safari 12

## 8.47.1 (July 19, 2021)

### :bug: Bug Fix

- `table`
  - [#2748](https://github.com/wix/ricos/pull/2748) fix tables component data from store override

## 8.47.0 (July 19, 2021)

### :rocket: New Feature

- `ricos-content`

  - [#2740](https://github.com/wix/ricos/pull/2740) fromHtml/CKEditor convertor
  - [#2740](https://github.com/wix/ricos/pull/2740) `fromHtml` converter now exposed as `server-side-converters/fromRichTextHtml`

### :bug: Bug Fix

- `editor`
  - [#2708](https://github.com/wix/ricos/pull/2708) error boundary lifted from RCE to Ricos
- `loadable`
  - [#2745](https://github.com/wix/ricos/pull/2745) CJS bundle fix

## 8.46.19 (July 18, 2021)

### :house: Internal

- `scripts`
  - [#2750](https://github.com/wix/ricos/pull/2750) updateBaselines - normalize keys in baselines

## 8.46.18 (July 17, 2021)

### :nail_care: Polish

- `loadable`
  - [#2736](https://github.com/wix/ricos/pull/2736) Loadable CJS & bundle improvments

## 8.46.17 (July 16, 2021)

### :rocket: New Feature

- `image gallery video`
  - [#2727](https://github.com/wix/ricos/pull/2727) Loadable Support

### :house: Internal

- `ui-components`
- [#2643](https://github.com/wix/ricos/pull/2643) moved ActionButtons into ui-components and some code refactor

### :bug: Bug Fix

- `image`
  - [#2716](https://github.com/wix/ricos/pull/2716) fix image caption clipping in editor
- `ricos-content`
  - [#2731](https://github.com/wix/ricos/pull/2731) ES5 compatible fix

## 8.46.16 (July 15, 2021)

### :bug: Bug Fix

- `common`
  - [#2729](https://github.com/wix/ricos/pull/2729) fix tooltip in ssr - regression from 8.46.13
- `html`
  - [#2728](https://github.com/wix/ricos/pull/2728) allow popups from embed

## 8.46.15 (July 15, 2021)

### :house: Internal

- `ricos-schema`
  - [#2701](https://github.com/wix/ricos/pull/2701) add new vertical embed schema

## 8.46.14 (July 15, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#2717](https://github.com/wix/ricos/pull/2717) getImgSrc removed from converters
- `common`
  - [#2726](https://github.com/wix/ricos/pull/2726) fix tooltip in ssr - regression from 8.46.13

## 8.46.13 (July 14, 2021)

### :bug: Bug Fix

- `common`
  - [#2721](https://github.com/wix/ricos/pull/2721) fix tooltip doesn't hide + preload tooltip

## 8.46.12 (July 14, 2021)

### :house: Internal

- `plugin-commons`
  - [#2712](https://github.com/wix/ricos/pull/2712) upload functionality isolated from plugins (revert 8.46.6)

## 8.46.11 (July 14, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#2715](https://github.com/wix/ricos/pull/2715) replace Object.fromEntries for backwards compatibility

## 8.46.9 (July 13, 2021)

### :house: Internal

- `spoiler`
  - [#2704](https://github.com/wix/ricos/pull/2704) spoiler schema
- `vertical-embed`
  - [#2687](https://github.com/wix/ricos/pull/2687) move ui component creation from serverless to client side

## 8.46.8 (July 13, 2021)

### :bug: Bug Fix

- `editor-common`
  - [#2685](https://github.com/wix/ricos/pull/2685) color utils for editor commands

### :nail_care: Polish

- `table`
  - [#2682](https://github.com/wix/ricos/pull/2682) add localeContent support
- `collapsible-list`
  - [#2682](https://github.com/wix/ricos/pull/2682) add localeContent support

### :house: Internal

- `editor-common`
  - [#2663](https://github.com/wix/ricos/pull/2663) moved SearchIcon/ErrorIcon into ui-components folder

## 8.46.5 (July 4, 2021)

### :house: Internal

- `tiptap-editor`
  - [#2673](https://github.com/wix/ricos/pull/2673) convert tiptap to ES5

## 8.46.4 (July 4, 2021)

### :house: Internal

- `plugin-commons`
  - [#2581](https://github.com/wix/ricos/pull/2581) unify media upload functionality and extract from plugins

## 8.46.3 (July 3, 2021)

### :nail_care

- `gallery/image`
  - [#2649](https://github.com/wix/ricos/pull/2649) remove unused config

## 8.46.0 (Jun 29, 2021)

### :bug: Bug Fix

- `spoiler`
  - [#2657](https://github.com/wix/ricos/pull/2657) remove spoiler toggle from media settings modal

## 8.45.2 (Jun 29, 2021)

### :nail_care: Polish

- `collapsible-list`
  - [#2639](https://github.com/wix/ricos/pull/2639) Collapsible's default direction is based on locale (ltr/rtl)
- `editor`
  - [#2655](https://github.com/wix/ricos/pull/2655) Plus Icon (add plugin) position fixed based on focused block's size

### :house: Internal

- `editor-common`
  - [#2650](https://github.com/wix/ricos/pull/2650) moved FocusManager/FocusTrapReact/RichContentModal into ui-components folder

## 8.45.1 (Jun 29, 2021)

### :bug: Bug Fix

- `fullscreen`
  - [#2625](https://github.com/wix/ricos/pull/2625) images with download enabled can be downloaded from fullscreen
- `file-upload`
  - [#2479](https://github.com/wix/ricos/pull/2479) show loader when content has `tempData`
- `link`
  - [#2214](https://github.com/wix/ricos/pull/2214) disable link button when atomic block is selected

## 8.45.0 (Jun 28, 2021)

### :bug: Bug Fix

- `link-preview`
  - [#2651](https://github.com/wix/ricos/pull/2651) support link preview without image

### :rocket: New Feature

- `locale content`
  - [#2648](https://github.com/wix/ricos/pull/2648) add locale content to ricos-editor api

## 8.44.7 (Jun 28, 2021)

### :bug: Bug Fix

- `plugin-commons`
  - [#2652](https://github.com/wix/ricos/pull/2652) scroll to plugins on creation

## 8.44.6 (Jun 28, 2021)

### :house: Internal

- `ricos-editor`
  - [#2641](https://github.com/wix/ricos/pull/2641) RicosEditor uses TiptapAPI based on experiment
- `ricos-content`
  - [#2645](https://github.com/wix/ricos/pull/2645) lodash/fp replaced with fp-ts

### :nail_care: Polish

- `editor`
  - [#2580](https://github.com/wix/ricos/pull/2580) Editor Commands improvements
- `link`
  - [#2637](https://github.com/wix/ricos/pull/2637) Sponsored tooltip in link panel

## 8.44.5 (Jun 20, 2021)

### :house: Internal

- `ricos-viewer`
  - [#2634](https://github.com/wix/ricos/pull/2634) `onViewerLoaded` contains `url` field
- `ricos-editor`
  - [#2632](https://github.com/wix/ricos/pull/2632) `onOpenEditorSuccess` contains `toolbarType` field

## 8.44.4 (Jun 18, 2021)

### :bug: Bug Fix

- `editor-common`
  - [#2629](https://github.com/wix/ricos/pull/2629) render wrapper modal (fix's polls insert modal)

## 8.44.3 (Jun 17, 2021)

### :house: Internal

- `editor-common`
  - [#2622](https://github.com/wix/ricos/pull/2622) moved textSearchInput/Separator/Dropdown components into ui-components folder
  - [#2619](https://github.com/wix/ricos/pull/2619) moved RadioGroup/InfoIcon/Checkbox components into ui-components folder
- `ricos-content`
  - [#2610](https://github.com/wix/ricos/pull/2610) tiptap converters fixed
  - [#2628](https://github.com/wix/ricos/pull/2628) `extract` & `modify` API exposed via libs folder
- `editor`
  - [#2585](https://github.com/wix/ricos/pull/2585) `onToolbarButtonClick` callback hook

## 8.44.2 (Jun 14, 2021)

### :house: Internal

- `plugin-commons`
  - [#2608](https://github.com/wix/ricos/pull/2608) moved SettingsMobileHeader/UrlInputModal components into ui-components folder
- `tiptap-editor`
  - [#2546](https://github.com/wix/ricos/pull/2546) package added

## 8.44.1 (Jun 9, 2021)

### :bug: Bug Fix

- `editor`
  - [#2593](https://github.com/wix/ricos/pull/2593) fix cut behavior
  - [#2603](https://github.com/wix/ricos/pull/2603) fix insertDecoration (link) from Editor Commands
- `link`
  - [#2586](https://github.com/wix/ricos/pull/2586) support anchor from outer editor into collapsible list
- `button`
  - [#2609](https://github.com/wix/ricos/pull/2609) Default Colors were always shown on settings panel configurations

### :nail_care: Polish

- `schema`
  - [#2606](https://github.com/wix/ricos/pull/2606) code block type refactor

### :house: Internal

- `ui-components`
  - [#2607](https://github.com/wix/ricos/pull/2607) moved SelectionList/Tabs/Tab/Image/SliderPanel components into ui-components folder

## 8.44.0 (Jun 8, 2021)

### :house: Internal

- `ui-components`
  - [#2596](https://github.com/wix/ricos/pull/2596) moved fileInput component into ui-components folder
  - [#2582](https://github.com/wix/ricos/pull/2582) moved Panel component into ui-components folder
  - [#2599](https://github.com/wix/ricos/pull/2599) moved RadioGroupVertical component into ui-components folder
  - [#2599](https://github.com/wix/ricos/pull/2599) moved RadioGroupHorizontal component into ui-components folder
  - [#2602](https://github.com/wix/ricos/pull/2602) moved Slider component into ui-components folder
  - [#2602](https://github.com/wix/ricos/pull/2602) moved SliderWithInput component into ui-components folder
  - [#2577](https://github.com/wix/ricos/pull/2577) moved Loader component into ui-components folder
  - [#2582](https://github.com/wix/ricos/pull/2582) moved Panel component into ui-components folder
  - [#2599](https://github.com/wix/ricos/pull/2599) moved SettingsPanelFooter component into ui-components folder
  - [#2604](https://github.com/wix/ricos/pull/2604) moved TextInput component into ui-components folder
  - [#2571](https://github.com/wix/ricos/pull/2571) moved SettingsSection component into ui-components folder

### :rocket: New Feature

- `spoiler`
  - [#2326](https://github.com/wix/ricos/pull/2326) remove spoiler from inline toolbar and add it to settings modal

## 8.43.1 (Jun 6, 2021)

### :bug: Bug Fix

- `ricos-content`
  - [#2594](https://github.com/wix/ricos/pull/2594) list style removal

## 8.43.0 (Jun 6, 2021)

### :house: Internal

- `gallery`
  - [#2590](https://github.com/wix/ricos/pull/2590) bump `ProGallery` to v3.1.14

## 8.42.2 (Jun 6, 2021)

### :bug: Bug Fix

- `common`
  - [#2592](https://github.com/wix/ricos/pull/2592) disable justification on SSR

## 8.42.1 (Jun 3, 2021)

### :nail_care: Polish

- `link`
  - [#2588](https://github.com/wix/ricos/pull/2588) hide sponsored checkbox in link panel by default

### :rocket: New Feature

- `ricos-editor`
  - [#2584](https://github.com/wix/ricos/pull/2584) `onContentEdited` callback

### :house: Internal

- `ui-components`
  - [#2575](https://github.com/wix/ricos/pull/2575) moved InputWithLabel component into ui-components folder

## 8.42.0 (Jun 3, 2021)

### :rocket: New Feature

- `collapsible-list`
  - [#2565](https://github.com/wix/ricos/pull/2565) Collapsible List Plugin
- `link`
  - [#2107](https://github.com/wix/ricos/pull/2107) Link SEO, added `sponsored` checkbox

### :nail_care: Polish

- `link`
  - [#2107](https://github.com/wix/ricos/pull/2107) Link components

### :book: Documentation

- `link`
  - [#2107](https://github.com/wix/ricos/pull/2107) `linkPanelSettings` & `linkSettings` API update

## 8.41.0 (Jun 2, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2573](https://github.com/wix/ricos/pull/2573) content extractor API
  - [#2567](https://github.com/wix/ricos/pull/2567) content modifier API

### :house: Internal

- `ui-components`
  - [#2579](https://github.com/wix/ricos/pull/2579) made ui-components public

## 8.40.1 (Jun 1, 2021)

### :bug: Bug Fix

- `common`
  - [#2572](https://github.com/wix/ricos/pull/2572) fix double link when text is justified on safari/firefox

### :house: Internal

- `ui-components`
  - [#2553](https://github.com/wix/ricos/pull/2553) moved labeledToggle component into ui-components
  - [#2563](https://github.com/wix/ricos/pull/2563) moved Button component into ui-components folder

## 8.40.0 (May 31, 2021)

### :house: Internal

- `*`
  - [#2464](https://github.com/wix/ricos/pull/2464) update to rollup 2

## 8.39.1 (May 31, 2021)

### :bug: Bug Fix

- `button`
  - [#2561](https://github.com/wix/ricos/pull/2561) link data rendered in action button

### :nail_care: Polish

- `general`
  - [#2487](https://github.com/wix/ricos/pull/2487) keyboard shortcuts

### :house: Internal

- `ui-components`
  - [#2564](https://github.com/wix/ricos/pull/2564) moved MediaItemErrMsg component into ui-components folder

## 8.39.0 (May 27, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2559](https://github.com/wix/ricos/pull/2559) getContentLength

### :house: Internal

- `ui-components`
  - [#2549](https://github.com/wix/ricos/pull/2549) new folder to concentrate all the ui component

### :bug: Bug Fix

- `ricos-common`
  - [#2560](https://github.com/wix/ricos/pull/2560) theme's `palette` object printed error for single field input

## 8.38.0 (May 27, 2021)

### :rocket: New Feature

- `ricos-schema`
  - [#2543](https://github.com/wix/ricos/pull/2543) containerData width field refactor

## 8.37.0 (May 27, 2021)

### :nail_care: Polish

- `plugin-commons`
  - [#2552](https://github.com/wix/ricos/pull/2552) `addPluginStep` params specification for polls plugin
- `ricos-common`
  - [#2555](https://github.com/wix/ricos/pull/2555) theme's `palette` object can receive partial object (e.g. only actionColor)

### :rocket: New Feature

- `ricos-content`
  - [#2550](https://github.com/wix/ricos/pull/2550) media extractor for SEO
- `plugin-commons`
  - [#2554](https://github.com/wix/ricos/pull/2554) `onPluginModalOpened` callback
- `editor`
  - [#2557](https://github.com/wix/ricos/pull/2557) `onMenuLoad` callback

### :house: Internal

- `gallery`
  - [#2558](https://github.com/wix/ricos/pull/2558) revert to pro gallery back to v2 (requested by blog)

## 8.36.6 (May 26, 2021)

### :bug: Bug Fix

- `button`
  - [#2545](https://github.com/wix/ricos/pull/2545) Wire to palette colors when created

### :house: Internal

- `template-atomic-plugin`
  - [#2547](https://github.com/wix/ricos/pull/2547) Fixed lint issues when creating a new plugin
- `storybook`
  - [#2548](https://github.com/wix/ricos/pull/2548) button coverage
- `e2e`
  - [#2548](https://github.com/wix/ricos/pull/2548) button coverage

## 8.36.5 (May 25, 2021)

### :bug: Bug Fix

- `viewer` `editor`
  - [#2540](https://github.com/wix/ricos/pull/2540) Fix text justification alignment in firefox/safari

### :nail_care: Polish

- `plugin-button`
  - [#2537](https://github.com/wix/ricos/pull/2537) remove button presets

### :house: Internal

- `common`
  - [#2403](https://github.com/wix/ricos/pull/2403) `ThemeData` object is now passed inside `config`, available for plugins

## 8.36.4 (May 25, 2021)

### :nail_care: Polish

- `ricos-schema`
  - [#2520](https://github.com/wix/ricos/pull/2520) added a style property to Node, representing node-level styles
- `ricos-content`
  - [#2520](https://github.com/wix/ricos/pull/2520) added a style property to Node, representing node-level styles

### :house: Internal

- `ricos-viewer`
  - [#2534](https://github.com/wix/ricos/pull/2534) unit test - `onViewerLoaded`
- `ricos-editor`
  - [#2534](https://github.com/wix/ricos/pull/2534) unit test - `onOpenEditorSuccess`

## 8.36.3 (May 23, 2021)

### :bug: Bug Fix

- `ricos-viewer`
  - [#2531](https://github.com/wix/ricos/pull/2531) callbacks - `onViewerLoaded` not called

## 8.36.2 (May 23, 2021)

### :bug: Bug Fix

- `plugin-commons`
  - [#2525](https://github.com/wix/ricos/pull/2525) fix onPluginAdd timing
  - [#2527](https://github.com/wix/ricos/pull/2527) fix onPluginAddStep's `pluginDetails` (blockKey)
- `undo-redo`
  - [#2530](https://github.com/wix/ricos/pull/2530) fix mobile buttons tooltip

### :house: Internal

- `gallery`
  - [#2463](https://github.com/wix/ricos/pull/2463) bump `ProGallery` to v3.1.14

## 8.36.1 (May 20, 2021)

### :bug: Bug Fix

- `text selection toolbar`
  - [#2522](https://github.com/wix/ricos/pull/2522) import textSelectionToolbar styles from ricos viewer

## 8.36.0 (May 19, 2021)

### :rocket: New Feature

- `editor viewer`
  - [#2459](https://github.com/wix/ricos/pull/2459) added `customAnchorScroll` prop support through `linkSettings`
- `plugin-commons`
  - [#2519](https://github.com/wix/ricos/pull/2519) `uiSettings.linkPanel.externalPopups` config for link popup appearance
- `text-selection-toolbar`
  - [#2508](https://github.com/wix-private/wix-ricos/pull/2508) add textSelectionToolbar api to ricos-viewer

### :bug: Bug Fix

- `*`
  - [#2517](https://github.com/wix/ricos/pull/2517) settings action color fix - several elements were wired to use fallback mechanism, unnecessarily
- `link-toolbar`
  - [#2515](https://github.com/wix/ricos/pull/2515) update link toolbar when moving from link to link
- `plugin-commons`
  - [#2514](https://github.com/wix/ricos/pull/2514) check if plugin container exists before using it
  - [#2516](https://github.com/wix/ricos/pull/2516) set a threshold for waiting for a component to load (for scrolling)

## 8.35.0 (May 17, 2021)

### :rocket: New Feature

- `link`
  - [#2511](https://github.com/wix/ricos/pull/2511) `toolbar.inlineToolbar` config added (disables inline link toolbar)

### :bug: Bug Fix

- `ricos-editor`
  - [#2512](https://github.com/wix/ricos/pull/2512) null content defaults to empty in `getContentTraits`
- `file-upload`
  - [#2510](https://github.com/wix/ricos/pull/2510) add 'download' key

## 8.34.3 (May 14, 2011)

### :bug: Bug Fix

- `text-toolbar-selection`
  - [#2509](https://github.com/wix/ricos/pull/2509) fix scrollY toolbar position

## 8.34.2 (May 13, 2011)

### :bug: Bug Fix

- `plugin-commons`
  - [#2416](https://github.com/wix/ricos/pull/2416) fix sliders drag and input issues

### :nail_care: Polish

- `editor`
  - [#2489](https://github.com/wix/ricos/pull/2489) fix action color on editor element focus (+ fallback box-shadow)
- `image`
  - [#2488](https://github.com/wix/ricos/pull/2488) fix caption text styling to match ricos theme
  - [#2507](https://github.com/wix/ricos/pull/2507) new theme guideline for caption text when link is attached
- `common`
  - [#2489](https://github.com/wix/ricos/pull/2489) fix action color on editor element focus (+ fallback box-shadow)
  - [#2486](https://github.com/wix/ricos/pull/2486) onViewerLoaded now contains `pluginsCount`

## 8.34.1 (May 11, 2021)

### :rocket: New Feature

- `image`
  - [#2483](https://github.com/wix/ricos/pull/2483) remove unsharp mask from image url's (experiment `removeUsmFromImageUrls`)

### :nail_care: Polish

- `viewer`
  - [#2482](https://github.com/wix/ricos/pull/2482) Fix hooks order & add first and last hooks

## 8.34.0 (May 10, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2480](https://github.com/wix/ricos/pull/2480) ContentBuilder: addBulletList, addOrderedList

### :book: Documentation

- [#2480](https://github.com/wix/ricos/pull/2480) Content Builder API

## 8.33.2 (May 10, 2021)

### :house: Internal

- `storybook`
  - [#2472](https://github.com/wix/ricos/pull/2472) ContentBuilder API - added additional plugins

### :nail_care: Polish

- `plugin-headings`
  - [#2454](https://github.com/wix/ricos/pull/2454) clear `h1` wire on experiment `useHeadingOne`
- `ricos-content`
  - [#2462](https://github.com/wix/ricos/pull/2462) remove unfinalized plugins from ContentAPI

### :rocket: New Feature

- `collapsible-list`
  - [#2455](https://github.com/wix/ricos/commit/2455) copy/paste plugin
  - [#2441](https://github.com/wix/ricos/commit/2441) scroll to item on expand/collapse
  - [#2441](https://github.com/wix/ricos/commit/2441) (Command | Ctrl) + A shortcut selects all content in section
- `table`
  - [#2455](https://github.com/wix/ricos/commit/2455) copy/paste plugin

### :bug: Bug Fix

- `editor`
  - [#2451](https://github.com/wix/ricos/pull/2451) render static toolbar buttons on undo-redo changes
- `general`
  - [#2442](https://github.com/wix/ricos/pull/2442) modal's accessibility

### :house: Internal

- `e2e`
  - [#2458](https://github.com/wix/ricos/pull/2458) update to cypress 7

## 8.33.1 (May 6, 2021)

### :book: Documentation

- `storybook`
  - [#2421](https://github.com/wix/ricos/pull/2421) ContentBuilder API

### :bug: Bug Fix

- `external-toolbar`
  - [#2424](https://github.com/wix/ricos/pull/2424) add table to external toolbar
- `plugin-commons`
  - [#2446](https://github.com/wix/ricos/pull/2446) link entry removed rather set to null on link removal
- `link`
  - [#2435](https://github.com/wix/ricos/pull/2435) static toolbar link popup styles fixed
- `general`
  - [#2435](https://github.com/wix/ricos/pull/2435) ClickOutside for inline popups supports drag out
- `html-embed`
  - [#2450](https://github.com/wix/ricos/pull/2450) fixes embeded iframes width to be 100% fixed

### :nail_care: Polish

- `ricos-content`
  - [#2421](https://github.com/wix/ricos/pull/2421) ContentBuilder exposed separately

## 8.33.0 (May 3, 2021)

### :rocket: New Feature

- `file-upload`
  - [#2330](https://github.com/wix/ricos/commit/2330) add responsive design
- `gallery`
  - [#2364](https://github.com/wix/ricos/pull/2364) gallery settings for mobile devices

### :bug: Bug Fix

- `ricos-viewer`
  - [#2427](https://github.com/wix/ricos/pull/2427) support RichContentViewer's `addAnchors` prop

### :house: Internal

- `editor`
  - [#2397](https://github.com/wix/ricos/pull/2397) fix undo experiment collapsible-list crash

## 8.32.0 (May 2, 2021)

### :rocket: New Feature

- `ricos-editor`
  - [#2413](https://github.com/wix/ricos/pull/2413) action color can now be separated for settings panels & focus on plugin. See [settingsActionColor & focusActionColor API](https://ricos.js.org/docs/ricos/Theming#settingsactioncolor)

### :bug: Bug Fix

- `plugin-commons`
  - [#2397](https://github.com/wix/ricos/pull/2397) scroll to plugin added out of view
- `gallery`
  - [#2402](https://github.com/wix/ricos/pull/2402) galleries on horizontal `scrollDirection` have height and arrows

### :house: Internal

- `e2e`
  - [#2381](https://github.com/wix/ricos/pull/2381) undo redo tests improvement

## 8.31.3 (April 28, 2021)

### :nail_care: Polish

- `schema`
  - [#2419](https://github.com/wix/ricos/pull/2419) remove `rich_content` proto package

## 8.31.2 (April 28, 2021)

### :bug: Bug Fix

- `TextSelectionToolbar`
  - [#2417](https://github.com/wix/ricos/pull/2417) fix position + css
- `ricos-content`
  - [#c9a1453f](https://github.com/wix/ricos/commit/c9a1453f) fix link compare

## 8.31.1 (April 28, 2021)

### :nail_care: Polish

- `schema`
  - [#2411](https://github.com/wix/ricos/pull/2411) change wix rich content schema proto package name

## 8.31.0 (April 28, 2021)

### :rocket: New Feature

- `mentions`
  - [#2407](https://github.com/wix/ricos/pull/2407) add onMentionHover

## 8.30.4 (April 25, 2021)

### :house: Internal

- `fullscreen`
  - [#2392](https://github.com/wix/ricos/pull/2392) replace content-box with border-box
- `docs`
  - [#2337](https://github.com/wix/ricos/pull/2337) docs removed from workspaces (build failure fix)

### :bug: Bug Fix

- `image viewer`
  - [#2398](https://github.com/wix/ricos/pull/2398) Avoid exception when image src missing
- `editor`
  - [#2385](https://github.com/wix/ricos/pull/2385) toolbar shortcuts in mac & windows

## 8.30.3 (April 22, 2021)

### :bug: Bug Fix

- `image`
  - [#2390](https://github.com/wix/ricos/pull/2390) click on image caption doesnt open expand mode
- `ricos-content`
  - [#2393](https://github.com/wix/ricos/pull/2393) draft converters handle undefined values in content

## 8.30.2 (April 22, 2021)

### :bug: Bug Fix

- `editor`
  - [#2380](https://github.com/wix/ricos/pull/2380) delete last quote block before atomic block
- `external-toolbar`
  - [#2391](https://github.com/wix/ricos/pull/2391) add events and bookings to vertical embed

## 8.30.1 (April 21, 2021)

### :bug: Bug Fix

- `ricos-schema`
  - [#e728b63](https://github.com/wix/ricos/commit/e728b63) add missing import for wix proto validations

## 8.30.0 (April 20, 2021)

### :rocket: New Feature

- `schema`
  - [#2373](https://github.com/wix/ricos/pull/2373) rich content schema set to version 1 🥇
- `ricos-content`
  - [#2382](https://github.com/wix/ricos/pull/2382) add `delimiter` option to `toPlainText`
- `button`
  - [#2056](https://github.com/wix/ricos/pull/2056) resizable buttons

### :nail_care: Polish

- `schema`
  - [#2373](https://github.com/wix/ricos/pull/2373) use protobuf native Timestamp

### :bug: Bug Fix

- `editor`
  - [#2378](https://github.com/wix/ricos/pull/2378) link modal supports image links (static toolbar flow)
  - [#2386](https://github.com/wix/ricos/pull/2386) clear unsupported plugins from pasted content
  - [#2387](https://github.com/wix/ricos/pull/2387) editor commands allows any data for draft types
- `link`
  - [#2384](https://github.com/wix/ricos/pull/2384) anchor - fix preview config (crash on componentDidMount)
- `gallery`
  - [#2379](https://github.com/wix/ricos/pull/2379) gallery loader disappears only when all items are uploaded

### :nail_care: Polish

- `schema`
  - [#2383](https://github.com/wix/ricos/pull/2383) fix link schema

## 8.29.12 (April 13, 2021)

### :house: Internal

- `editor`
  - [#2356](https://github.com/wix/ricos/pull/2356) toolbar navigation with keyboard

## 8.29.8 (April 13, 2021)

### :house: Internal

- `scripts`
  - trigger loki in npm publish script

## 8.29.7 (April 13, 2021)

### :bug: Bug Fix

- `ricos-viewer`
  - [#2370](https://github.com/wix/ricos/pull/2370) fullscreen loads on remount on mobile

## 8.29.6 (April 13, 2021)

### :bug: Bug Fix

- `schema`
  - [#2374](https://github.com/wix/ricos/pull/2374) remove wix.api.format URL proto option

## 8.29.5 (April 12, 2021)

### :bug: Bug Fix

- `image`
  - [#2369](https://github.com/wix/ricos/pull/2369) Support preload image when pasting images using handleFileSelection
- `editor`
  - [#2367](https://github.com/wix/ricos/pull/2367) Fix plus button to follow after input pointer

### :house: Internal

- `editor-common`
  - [#2361](https://github.com/wix/ricos/pull/2361) fix undo experiment for table

## 8.29.4 (April 11, 2021)

### :bug: Bug Fix

- `fullscreen`
  - [#2357](https://github.com/wix/ricos/pull/2357) fix fullscreen display when images expand is disabled and added uni-tests
- `editor-common`
  - [#2368](https://github.com/wix/ricos/pull/2368) fix android issues (update draftjs)
- `general`
  - [#2349](https://github.com/wix/ricos/pull/2349) inline plugin popups in static formatting toolbar

### :house: Internal

- `editor-common`
  - [#2358](https://github.com/wix/ricos/pull/2358) skip ghost changes on empty collapsible-lists in undo stack
- `button-link`
  - [#2362](https://github.com/wix/ricos/pull/2362) add button link bi

## 8.29.3 (April 7, 2021)

### :rocket: New Feature

- `editor`
  - [#2350](https://github.com/wix/ricos/pull/2350) Paste & drop images support

### :bug: Bug Fix

- `toolbar`
  - [#1882](https://github.com/wix/ricos/pull/1882) fix buttons bg color issue with mobile "false hover"
- `common`
  - [#2344](https://github.com/wix/ricos/pull/2344) fix tooltip z-index for media settings modal

## 8.29.2 (April 6, 2021)

### :rocket: New Feature

- `ricos-editor`
  - [#2044](https://github.com/wix/ricos/pull/2044) **beta** Editor Commands

### :nail_care: Polish

- `image`
  - [#2343](https://github.com/wix/ricos/pull/2343) skip LCP optimization for png and mobile

### :bug: Bug Fix

- `mentions`

  - [#2345](https://github.com/wix/ricos/pull/2345) fix panel overflow

## 8.29.1 (April 4, 2021)

### :bug: Bug Fix

- `link`
  - [#2339](https://github.com/wix/ricos/pull/2339) link panel popup styles for static toolbar
- `plugin-commons`
  - [#2339](https://github.com/wix/ricos/pull/2339) color-picker: scrollbars in saturation picker
- `text-slection-toolbar`
  - [#2327](https://github.com/wix/ricos/pull/2327) fix position of text-selection-toolbar in lists
- `plugin-image`
  - [#2341](https://github.com/wix/ricos/pull/2341) native selection file accepts only supported image extensions

### :house: Internal

- `editor editor-common plugin-undo-redo`
  - [#1847](https://github.com/wix/ricos/pull/1847) undo redo for plugin customisations experiment enabled

## 8.29.0 (April 1, 2021)

### :rocket: New Feature

- `plugin-image`
  - [#2176](https://github.com/wix/ricos/pull/2176) update image settings modal to have download and expand options using toggle buttons

### :bug: Bug Fix

- `gallery`
  - [#1705](https://github.com/wix/ricos/pull/1705) fix gallery layout styles default and thumbnails ratio
- `ricos-editor`
  - [#2336](https://github.com/wix/ricos/pull/2336) blocks with errors filter fix

## 8.28.0 (Mar 31, 2021)

### :rocket: New Feature

- `plugin-video`
  - [#2331](https://github.com/wix/ricos/pull/2331) added new settings panel for custom videos with download toggle
- `plugin-gallery`
  - [#2096](https://github.com/wix/ricos/pull/2096) update gallery settings modal to have download and expand options using toggle buttons

### :house: Internal

- `unsupported-blocks/collapsible-list/table/spoiler`
  - [#2307](https://github.com/wix/ricos/pull/2307) clean disable-right-click prop from unnecessary components
- `plugin-table`
  - [#2303](https://github.com/wix/ricos/pull/2303) add table bi
- `ricos-content`
  - [#2237](https://github.com/wix/ricos/pull/2237) ContentAPI infra added
- `general`
  - [#2237](https://github.com/wix/ricos/pull/2237) tsconfig: strictPropertyInitialization; eslint: lines-between-class-members rules

### :bug: Bug Fix

- `image`
  - [#2327](https://github.com/wix/ricos/pull/2327) aria-hidden attribute fixed
- `plugin-spoiler`
  - [#2308](https://github.com/wix/ricos/pull/2308) increase blur for media, change spoiler button position in formatting toolbar, change spoiler icon
- `plugin-link-preview`
  - [#2324](https://github.com/wix/ricos/pull/2324) remove large space from plugin bottom

### :nail_care: Polish

- `common`
  - [#2327](https://github.com/wix/ricos/pull/2327) TextButtonMapping and InlineToolbarButton types improved

## 8.27.8 (Mar 30, 2021)

- `ricos-content`
  - [#8d2b66e](https://github.com/wix/ricos/commit/8d2b66e) add ensure content methods to converters entry point

## 8.27.7 (Mar 25, 2021)

### :bug: Bug Fix

- `plugin-spoiler`
  - [#2318](https://github.com/wix/ricos/pull/2318) filter spoilered media from preview

### :nail_care: Polish

- `plugin-headings`
  - [#2321](https://github.com/wix/ricos/pull/2321) Heading 1 can now be enabled via feature toggle `useHeadingOne` (only applicable for default config)

## 8.27.5 (Mar 24, 2021)

### :bug: Bug Fix

- `color-picker`
  - [#2159](https://github.com/wix/ricos/pull/2159) update color-picker style for mobile devices

### :house: Internal

- `editor-common`
  - [#2317](https://github.com/wix/ricos/pull/2317) deprecation of old `EditorEventsContext` through `index.ts` file

## 8.27.4 (Mar 18, 2021)

### :nail_care: Polish

- `plugin-headings`
  - [#2309](https://github.com/wix/ricos/pull/2309) `Heading 1` is now supported
- `plugin-headings`
  - [#2310](https://github.com/wix/ricos/pull/2310) `Heading 1` is visible by default

## 8.27.2 (Mar 15, 2021)

### :bug: Bug Fix

- `unsupported-blocks`
  - [#2292](https://github.com/wix/ricos/pull/#2292) fix unsupported-blocks text height and font size
- `gallery`
  - [#2290](https://github.com/wix/ricos/pull/2290) gallery doesnt require data to handle error, supported file types checked locally
- `fullscreen`
  - [#2273](https://github.com/wix/ricos/pull/2273) fix dimension issues

## 8.27.1 (Mar 10, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2287](https://github.com/wix/ricos/pull/2287) compareDraftContent util exposed
- `plugin-link`
  - [#2262](https://github.com/wix/ricos/pull/2262) `onViewerAction` callback hook now supports link click events
- `plugin-menu`
  - [#2285](https://github.com/wix/ricos/pull/2285) new advanced section

### :nail_care: Polish

- `ricos-viewer`
  - performance improvment for non-english locale

## 8.26.2 (March 8, 2021)

### :bug: Bug Fix

- `viewer`
  - [#2282](https://github.com/wix/ricos/pull/2282) `customStyles` unordered lists - now influenced by paragraph styles

## 8.26.1 (March 8, 2021)

### :bug: Bug Fix

- `headings`
  - [#2278](https://github.com/wix/ricos/pull/2278) triple click display the right heading type
- `viewer`
  - [#2281](https://github.com/wix/ricos/pull/2281) `customStyles` paragraph styles influence on ordered lists

## 8.26.0 (March 8, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2261](https://github.com/wix/ricos/pull/2261) `fromHtml` and `toHtml` utility functions convert between rich content and HTML

## 8.25.4 (March 5, 2021)

### :bug: Bug Fix

- `fullscreen`
  - [#2260](https://github.com/wix/ricos/pull/2260) fix mobile dimension issues
- `ricos-editor`
  - [#2257](https://github.com/wix/ricos/pull/2257) `getContent` removes blocks with errors from innerRCE blocks

## 8.25.2 (March 4, 2021)

### :bug: Bug Fix

- `ricos-common`
  - [#2239](https://github.com/wix/ricos/pull/2239) `customStyles`:
    - `p` will no longer override elements of all textual entities
    - `lineHeight` of an element is now automatically set to 1.5 to keep ratio of growing text (unless provided).

## 8.25.1 (March 2, 2021)

### :bug: Bug Fix

- `table`
  - [#2252](https://github.com/wix/ricos/pull/2252) drag and drop preview position

## 8.25.0 (March 2, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2234](https://github.com/wix/ricos/pull/2234) `fromPlainText` utility converts plain text to rich content

### :nail_care: Polish

- `docs`
  - [#2241](https://github.com/wix/ricos/pull/2241) `EditorEventsContext` - doc page improved

### :bug: Bug Fix

- `image-viewer`
  - [#2251](https://github.com/wix/ricos/pull/2251) fix useSrcSet use

## 8.24.1 (March 1, 2021)

### :nail_care: Polish

- `editor-common`
  - [#2203](https://github.com/wix/ricos/pull/2203) `EditorEventsContext` separated into lib
- `ricos-viewer`
  - [#2217](https://github.com/wix/ricos/pull/2217) render full-screen on hover

### :house: Internal

- `bundle-analyzer`
  - [#2238](https://github.com/wix/ricos/pull/2238) editor-common bundle size fixture

### :rocket: New Feature

- `ricos-theme`
  - [#2230](https://github.com/wix/ricos/pull/2230) `paletteConfig` - configurations for theme. `shouldColorContainer` boolean field

## 8.24.0 (Feb 28, 2021)

### :rocket: New Feature

- `color`
  - [#2225](https://github.com/wix/ricos/pull/2225) Override panel position

### :bug: Bug Fix

- `video`
  - [#2212](https://github.com/wix/ricos/pull/2212) fix crash when data is not provided upon upload error

### :nail_care: Polish

- `ricos-content`
  - [#2192](https://github.com/wix/ricos/pull/2192) Truncate - docs & finialize API

## 8.23.1 (Feb 27, 2021)

### :bug: Bug Fix

- `plugin-commons`
  - [#2216](https://github.com/wix/ricos/pull/2216) display error on block when unsupported error key is given when file upload fails

### :house: Internal

- `e2e`
  - [#2220](https://github.com/wix/ricos/pull/2220) tests env fix - load theme on SSR, and remove seoMode for non-seo tests

### :nail_care: Polish

- `ricos-viewer`
  - [#2222](https://github.com/wix/ricos/pull/2222) optimization(translations): skip redundant remount
- `image`
  - [#2213](https://github.com/wix/ricos/pull/2213) increase preload quality

## 8.23.0 (Feb 24, 2021)

### :rocket: New Feature

- `fullScreen`
  - [#2206](https://github.com/wix/ricos/pull/2206) fullscreen styles are bundled and so there's no need to import its `styles.min.css`

## 8.22.9 (Feb 24, 2021)

### :bug: Bug Fix

- `common`
  - [#2199](https://github.com/wix/ricos/pull/2199) bgColor fallback was undefined, influencing plugins

### :house: Internal

- `storybook`
  - [#2191](https://github.com/wix/ricos/pull/2191) Theming - Custom Styles + refactor

### :nail_care: Polish

- `image`
  - [#2207](https://github.com/wix/ricos/pull/2207) quality preload experiment

## 8.22.8 (Feb 23, 2021)

### :bug: Bug Fix

- `editor`
  - [#2193](https://github.com/wix/ricos/pull/2193) fix content re-render issue
- `viewer`
  - [#2193](https://github.com/wix/ricos/pull/2193) fix content re-render issue

## 8.22.7 (Feb 22, 2021)

### :bug: Bug Fix

- `plugin-link`
  - [#2182](https://github.com/wix/ricos/pull/2182) open link panel from external toolbar in mobile

### :house: Internal

- `common`
  - [#2189](https://github.com/wix/ricos/pull/2189) experiments: support non-boolean values

## 8.22.6 (Feb 22, 2021)

### :nail_care: Polish

- `image`
  - [#2184](https://github.com/wix/ricos/pull/2184) thumbnail quality by `imageThumbnailQuality` experiment

## 8.22.5 (Feb 21, 2021)

### :bug: Bug Fix

- `ricos-common`
  - [#2183](https://github.com/wix/ricos/pull/2183) `customStyles` fix css-injection with `;` char

## 8.22.4 (Feb 21, 2021)

- `common`
  - [#2157](https://github.com/wix/ricos/pull/2157) feature(truncateContentState): additional params support & "Read More" usage example

## 8.22.3 (Feb 20, 2021)

### :rocket: New Feature

- `fullScreen`
  - [#2069](https://github.com/wix/ricos/pull/2069) allow full-screen mode for inner-rce images and organize full-screen images in order

### :house: Internal

- `ricos-viewer`
  - [#2168](https://github.com/wix/ricos/pull/2168) load fullscreen modal if content includes images

## 8.22.2 (Feb 18, 2021)

### :house: Internal

- `image`
  - [#2167](https://github.com/wix/ricos/pull/2167) image config type contains optional `consumer` field for Photo Studio's internal BI

## 8.22.1 (Feb 18, 2021)

### :house: Internal

- `common`
  - [#2161](https://github.com/wix/ricos/pull/2161) add container width optional prop

### :bug: Bug Fix

- `editor`
  - [#2164](https://github.com/wix/ricos/pull/2164) fix Ricos `bgColor` not taking effect
- `viewer`
  - [#2164](https://github.com/wix/ricos/pull/2164) fix Ricos `bgColor` not taking effect

## 8.22.0 (Feb 16, 2021)

### :rocket: New Feature

- `ricos-editor`
  - [#2153](https://github.com/wix/ricos/pull/2153) getContentTraits expose isLastChangeEdit

### :bug: Bug Fix

- `link`
  - [#2144](https://github.com/wix/ricos/pull/2144) static toolbar - link modal style fix

### :house: Internal

- `ricos-editor`
  - [#2090](https://github.com/wix/ricos/pull/2090) callback `onPluginAddStep` is now available for hooking
  - [#2156](https://github.com/wix/ricos/pull/2156) callback `onPluginAddStep` - added version field
- `example`
  - [#2151](https://github.com/wix/ricos/pull/2151) allow editing content in new `RichContent` schema via "Use New Content" setting

## 8.21.1 (Feb 14, 2021)

### :bug: Bug Fix

- `*`
  - [#2134](https://github.com/wix/ricos/pull/2134) fix `onViewerAction` arguments order

### :house: Internal

- `viewer`
  - [#2138](https://github.com/wix/ricos/pull/2138) viewer performance

## 8.21.0 (Feb 10, 2021)

### :rocket: New Feature

- `gallery`
  - [#1926](https://github.com/wix/ricos/pull/1926) upload video items in gallery (will be available through wix-ricos soon)

### :bug: Bug Fix

- `vertical-embed`
  - [#2127](https://github.com/wix/ricos/pull/2127) fix css issues

## 8.20.0 (Feb 9, 2021)

### :rocket: New Feature

- `ricos-editor`
  - [#2120](https://github.com/wix/ricos/pull/2120) modal events in internal modal handling

### :bug: Bug Fix

- `link`
  - [#2119](https://github.com/wix/ricos/pull/2119) anchors issues in editor

## 8.19.4 (Feb 8, 2021)

### :bug: Bug Fix

- `vertical-embed`
  - [#2118](https://github.com/wix/ricos/pull/2118) fix css

## 8.19.3 (Feb 8, 2021)

### :bug: Bug Fix

- `headings`
  - [#2116](https://github.com/wix/ricos/pull/2116) headings toolbar in external modal
- `link-preview`
  - [#2112](https://github.com/wix/ricos/pull/2112) fix link-preview link data (rel & target)

## 8.19.2 (Feb 8, 2021)

### :bug: Bug Fix

- `editor`
  - [#2099](https://github.com/wix/ricos/pull/2099) fix `onOpenEditorSuccess` unwanted triggers
- `viewer`
  - [#2099](https://github.com/wix/ricos/pull/2099) fix `onViewerLoaded` unwanted triggers
- `link`
  - [#2108](https://github.com/wix/ricos/pull/2108) fix anchor not scrolling in wix site
- `editor`
  - [#2111](https://github.com/wix/ricos/pull/2111) fix horizontal side toolbar theme

### :house: Internal

- `button`
  - [#2082](https://github.com/wix/ricos/pull/2082) remove link data from action-button

## 8.19.1 (Feb 6, 2021)

### :bug: Bug Fix

- `image`
  - [#2101](https://github.com/wix/ricos/pull/2101) remove duplication of images in browsers reader mode
- `ricos-common`
  - [#2102](https://github.com/wix/ricos/pull/2102) experiments API: wix-experiments compatibility

## 8.19.0 (Feb 4, 2021)

### :rocket: New Feature

- `common`
  - [#2081](https://github.com/wix/ricos/pull/2081) support for palette colors 3 & 4 (`disabledTextColor` & `textColorLow`)
  - [#2079](https://github.com/wix/ricos/pull/2079) experiments infra

### :bug: Bug Fix

- `unsupported-blocks`
  - [#2078](https://github.com/wix/ricos/pull/2078) fix unsupported-blocks container height issue

## 8.18.3 (Feb 2, 2021)

### :bug: Bug Fix

- `inner-modal`
  - [#2076](https://github.com/wix/ricos/pull/2076) vertical overflow issue

## 8.18.1 (Feb 2, 2021)

### :bug: Bug Fix

- `ricos-editor`
  - [#2073](https://github.com/wix/ricos/pull/2073) isContentChanged fixed

## 8.18.0 (Jan 31, 2021)

### :rocket: New Feature

- `ricos-common`
  - [#2065](https://github.com/wix/ricos/pull/2065) add textAlignment prop

## 8.17.11 (Jan 27, 2021)

### :bug: Bug Fix

- `unsupported-blocks`
  - [#2058](https://github.com/wix/ricos/pull/2058) bg color update

## 8.17.10 (Jan 27, 2021)

### :bug: Bug Fix

- `link`
  - [#2049](https://github.com/wix/ricos/pull/2049) fix url data changing rel/target when only one of them is present

## 8.17.9 (Jan 26, 2021)

### :bug: Bug Fix

- `link`
  - [#2038](https://github.com/wix/ricos/pull/2038) fix anchor's tag overriding url,add `href` value & remove `siteUrl` prop

## 8.17.8 (Jan 25, 2021)

### :rocket: New Feature

- `editor`
  - [#2034](https://github.com/wix/ricos/pull/2034) maxTextLength prop added

### :bug: Bug Fix

- `table`
  - [#2046](https://github.com/wix/ricos/pull/2046) cell selection background color style

## 8.17.7 (Jan 25, 2021)

### :bug: Bug Fix

- `ricos-common`
  - [#2041](https://github.com/wix/ricos/pull/2041) remove draft dependency in migration tool

## 8.17.6 (Jan 22, 2021)

### :rocket: New Feature

- `ricos-content`
  - [#2006](https://github.com/wix/ricos/pull/2006) `toPlainText` utility converts rich content to plain text

### :house: Internal

- `example`
  - [#2026](https://github.com/wix/ricos/pull/2026) convert to TypeScript
- `storybook`
  - [#2026](https://github.com/wix/ricos/pull/2026) convert to TypeScript
- `e2e`
  - [#2026](https://github.com/wix/ricos/pull/2026) convert test-env to TypeScript

## 8.17.5 (Jan 20, 2021)

### :house: Internal

- `gallery`
  - [#2023](https://github.com/wix/ricos/pull/2023) bump pro-gallery to 2.4.13

## 8.17.4 (Jan 20, 2021)

### :bug: Bug Fix

- `link`
  - [#2021](https://github.com/wix/ricos/pull/2021) fix anchors click deletes url params
  - [#2022](https://github.com/wix/ricos/pull/2021) fix link panel in Safari

## 8.17.3 (Jan 19, 2021)

### :bug: Bug Fix

- `editor`
  - [#2019](https://github.com/wix/ricos/pull/2019) fix inline toolbar ui bug

## 8.17.2 (Jan 19, 2021)

### :house: Internal

- `common`
  - [#2012](https://github.com/wix/ricos/pull/2012) merge translations

## 8.17.0 (Jan 19, 2021)

### :rocket: New Feature

- `common`
  - [#1970](https://github.com/wix/ricos/pull/1970) new theme palette fields: `textColorLow`, `disabledColor`, `fallbackColor`

### :bug: Bug Fix

- `table`
  - [#2002](https://github.com/wix/ricos/pull/2002) fix reset to default colors for table
- `table`
  - [#1999](https://github.com/wix/ricos/pull/1999) prevent wix focus accessibility

## 8.16.0 (Jan 18, 2021)

### :rocket: New Feature

- `unsupportedBlocks`
  - [#2005](https://github.com/wix/ricos/pull/2005) new plugin for informing oneApp users when plugin isn't supported

## 8.15.4 (Jan 18, 2021)

### :bug: Bug Fix

- `unsupportedBlocks`
  - [#1993](https://github.com/wix/ricos/pull/1993) update unsupported-blocks translation keys

### :house: Internal

- `e2e`
  - [#1983](https://github.com/wix/ricos/commit/1983) extend url limit length
- `editor`
  - [#1996](https://github.com/wix/ricos/commit/1996) add support for new error codes, split `ErrorToast` component for scalability
- `editor-common`
  - [#1996](https://github.com/wix/ricos/commit/1996) add new media upload error translation keys
- `unsupported-blocks`
  - [#1987](https://github.com/wix/ricos/pull/1987) unsupported-blocks test
- `color-picker`
  - [#2000](https://github.com/wix/ricos/pull/2000) remove position fixed from reset button

## 8.15.3 (Jan 14, 2021)

### :rocket: New Feature

- `ricos-editor`
  - [#1990](https://github.com/wix/ricos/pull/1990) `RICOS_PUBLISH` event

## 8.15.2 (Jan 14, 2021)

### :house: Internal

- `common`
  - [#1994](https://github.com/wix/ricos/commit/1994) added new media upload error keys

## 8.15.1 (Jan 13, 2021)

### :book: Documentation

- `unsupportedBlocks`
  - [#1985](https://github.com/wix/ricos/pull/1985) unsupported-blocks-plugin documentation

## 8.15.0 (Jan 12, 2021)

### :rocket: New Feature

- `unsupportedBlocks`
  - [#1969](https://github.com/wix/ricos/pull/1969) new plugin for informing oneApp users when plugin isn't supported

## 8.14.2 (Jan 12, 2021)

### :bug: Bug Fix

- `table`
  - [#1972](https://github.com/wix/ricos/commit/1972) fix table responsive and table resize
- `table`
  - [#1980](https://github.com/wix/ricos/commit/1980) fix table cell content align on edit
- `table`
  - [#1949](https://github.com/wix/ricos/commit/1949) fix table theme wiring
- `table`
  - [#1957](https://github.com/wix/ricos/commit/1957) fix table keyboard behavior, ui fixes, disable drag preview scroll
- `table`
  - [#1975](https://github.com/wix/ricos/commit/1975) add the option to reorder row to first place
- `table`
  - [#1974](https://github.com/wix/ricos/commit/1974) fix rows and columns selection on edit cell

## 8.14.1 (Jan 11, 2021)

### :bug: Bug Fix

- `editor`
  - [#1973](https://github.com/wix/ricos/commit/1973) fix `convertToRaw` when inner-rce is undefined (only for Rce-on-Rce plugins)

## 8.14.0 (Jan 10, 2021)

### :rocket: New Feature

- `ricos-viewer`
  - [#1916](https://github.com/wix/ricos/pull/1916) customize fullscreen `backgroundColor` and `foregroundColor` via `fullscreenProps` object in `mediaSettings`
- `fullscreen`
  - [#1916](https://github.com/wix/ricos/pull/1916) `backgroundColor` and `foregroundColor` props support, icon design improvement

### :bug: Bug Fix

- `image`
  - [#1968](https://github.com/wix/ricos/commit/1968) image preview isn't displayed with error

### :house: Internal

- `editor`
  - [#1968](https://github.com/wix/ricos/commit/1968) error toast custom messages don't go through translation (i18next console warnings fix)

## 8.13.3 (Jan 7, 2021)

- `editor-common`
  - [#1966](https://github.com/wix/ricos/pull/1966) export withEditorContext

## 8.13.2 (Jan 7, 2021)

- `editor-common`
  - [#1965](https://github.com/wix/ricos/pull/1965) Editor context lib

## 8.13.1 (Jan 7, 2021)

### :bug: Bug Fix

- `link`
  - [#c3b615bc](https://github.com/wix/ricos/commit/c3b615bc) link not working in viewer

## 8.13.0 (Jan 6, 2021)

### :rocket: New Feature

- `link`
  - [#1958](https://github.com/wix/ricos/pull/1958) add `disableAutoLink` & refactor `externalLink` to `customLink`

### :book: Documentation

- `link`
  - [#1958](https://github.com/wix/ricos/pull/1958) Update link documentation with `customLink` & `disableAutoLink` capabilities

### :bug: Bug Fix

- `ricos-editor`
  - [#1963](https://github.com/wix/ricos/pull/1963) wrapped with EditorEventsContext using typed forwardRef

## 8.12.1 (Jan 6, 2021)

### :bug: Bug Fix

- `fullscreen`
  - [#1959](https://github.com/wix/ricos/pull/1959) fix horizontal orientation image view
- `file-upload`
  - [#1962](https://github.com/wix/ricos/pull/1962) fix autodownload file after url resolve

## 8.12.0 (Jan 6, 2021)

### :rocket: New Feature

- `editor`
  - [#1954](https://github.com/wix/ricos/pull/1954) Returning `not-handled` from handlePastedText goes to our implementation of paste
- `ricos-editor`
  - [#1956](https://github.com/wix/ricos/pull/1956) publish API: `getContent(postId, isPublish)` deprecation warning; `editorEvents.publish()` + `editorRef.publish()` APIs added

### :house: Internal

- `gallery`
  - [#1947](https://github.com/wix/ricos/pull/1947) bump pro-gallery to 2.4.7

## 8.11.5 (Jan 5, 2021)

### :rocket: New Feature

- `editor`
  - [#1944](https://github.com/wix/ricos/pull/1944) improve inline color filtering from pasted text
- `link`
  - [#1892](https://github.com/wix/ricos/pull/1892) external link

### :bug: Bug Fix

- `link`
  - [#1941](https://github.com/wix/ricos/pull/1941) fix: selection after adding link

## 8.11.4 (Jan 3, 2021)

### :bug: Bug Fix

- `text-color`
  - [#1930](https://github.com/wix/ricos/pull/1930) fix color picker css

## 8.11.3 (Jan 3, 2021)

### :rocket: New Feature

- `editor`
  - [#1939](https://github.com/wix/ricos/pull/1939) allow api to disable input (`props.handleBeforeInput` can return handled)

### :bug: Bug Fix

- `editor`
  - [#1938](https://github.com/wix/ricos/pull/1938) call updateEditorState when new editorState is given (by passing `callOnChangeOnNewEditorState` = true prop)

## 8.11.2 (Dec 31, 2020)

### :bug: Bug Fix

- `vertical-embed`
  - [#1934](https://github.com/wix/ricos/pull/1934) Mobile UI fix

## 8.11.1 (Dec 31, 2020)

### :bug: Bug Fix

- `editor`
  - [#1924](https://github.com/wix/ricos/pull/1924) addPluginMenu - fix override plugin menu styles on mobile
- `inner-rce`
  - [#1932](https://github.com/wix/ricos/pull/1932) disable footer toolbar when inner rce is in focus
- `gallery`
  - [#1935](https://github.com/wix/ricos/pull/1935) disable progress in mobile native loader

## 8.11.0 (Dec 28, 2020)

### :rocket: New Feature

- `viewer`
  - [#1915](https://github.com/wix/ricos/pull/1915) `onViewerLoaded` callback is now added to helpers
  - [#1921](https://github.com/wix/ricos/pull/1921) `onViewerLoaded` callback includes `isPreview`
- `editor`
  - [#1922](https://github.com/wix/ricos/pull/1922) `onOpenEditorSuccess` callback is now added to helpers
  - [#1917](https://github.com/wix/ricos/pull/1917) better support of inline colors on pasted text & disable applying inline color `black` (for theme)

### :house: Internal

- `table`
  - [#1401](https://github.com/wix/ricos/pull/1401) **beta** add table plugin

## 8.10.2 (Dec 27, 2020)

### :bug: Bug Fix

- `gallery`
  - [#1908](https://github.com/wix/ricos/pull/1908) remove option to choose videos in native selection

## 8.10.1 (Dec 22, 2020)

### :bug: Bug Fix

- `gallery`
  - [#1298](https://github.com/wix/ricos/pull/1298) fix mobile native item loader

### :book: Documentation

- [#1899](https://github.com/wix/ricos/pull/1899) algolia search integrated

## 8.10.0 (Dec 22, 2020)

### :rocket: New Feature

- `ricos-editor`
  - [#1886](https://github.com/wix/ricos/pull/1886) `injectedContent` prop allows injecting content to mounted editor without remount

### :bug: Bug Fix

- `gallery`
  - [#1897](https://github.com/wix/ricos/pull/1897) fix gallery styles (college layout)

## 8.9.2 (Dec 21, 2020)

### :bug: Bug Fix

- `link`
  - [#1884](https://github.com/wix/ricos/pull/1884) fix opening different link modal when using keyboard shortcut & externalToolbar

### :house: Internal

- `editor`
  - [#1890](https://github.com/wix/ricos/pull/1890) switch from react-click-outside to 'react-click-outsider'

## 8.9.1 (Dec 21, 2020)

### :house: Internal

- `native-polyfill`
  - [#1887](https://github.com/wix/ricos/pull/1887) add native polyfills (button, collapsible-list, link-preview & sound-cloud)

## 8.9.0 (Dec 20, 2020)

### :rocket: New Feature

- `ricos-editor`
  - [#1875](https://github.com/wix/ricos/pull/1875) onChange `traits` param added (`{ isEmpty, isContentChanged }`)
- `mobileNativeLoader`
  - [#1867](https://github.com/wix/ricos/pull/1867) create mobile native plugin loader bundle
- `gallery`
  - [#1881](https://github.com/wix/ricos/pull/1881) mobile native item loader

### :house: Internal

- `editor-common`
  - [#1880](https://github.com/wix/ricos/pull/1880) moved `handleUndoRedoCommands` to editor-common

## 8.8.2 (Dec 16, 2020)

### :bug: Bug Fix

- `editor`
  - [#1845](https://github.com/wix/ricos/pull/1845) disable list item block type override when single block is pasted

## 8.8.1 (Dec 14, 2020)

### :bug: Bug Fix

- `button`
  - [#1860](https://github.com/wix/ricos/pull/1860) fix `open in a new tab` radio button behaviour
- `emoji`
  - [#1864](https://github.com/wix/ricos/pull/1864) fix the external toolbar popup styles
- `giphy`
  - [#1864](https://github.com/wix/ricos/pull/1864) fix the external toolbar popup styles

## 8.8.0 (Dec 13, 2020)

### :rocket: New Feature

- `theming`
  - [#1862](https://github.com/wix/ricos/pull/1862) quote border color

### :bug: Bug Fix

- `editor`
  - [#1859](https://github.com/wix/ricos/pull/1859) fix footerToolbarButtons height change after font properties changes (size, lineHeight, etc)
- `link`
  - [#1863](https://github.com/wix/ricos/pull/1863) fix - after adding a link the text after is not remained underlined
- `emoji` - [#1864](https://github.com/wix/ricos/pull/1864) fix external toolbar popup styles
- `giphy` - [#1864](https://github.com/wix/ricos/pull/1864) fix external toolbar popup styles

### :book: Documentation

- [#1856](https://github.com/wix/ricos/pull/1856) README + documentation improved

## 8.7.6 (Dec 11, 2020)

### :bug: Bug Fix

- `vertical embed`
  - [#1855](https://github.com/wix/ricos/pull/1855) Theme adaption

## 8.7.5 (Dec 10, 2020)

### :bug: Bug Fix

- `gallery`
  - [#1853](https://github.com/wix/ricos/pull/1853) removed image titles from mobile galleries

## 8.7.4 (Dec 10, 2020)

### :bug: Bug Fix

- `ricos-editor`
  - [#1850](https://github.com/wix/ricos/pull/1850) settings modal overlay appears above wix ad

### :house: Internal

- `test-env`
  - [#1848](https://github.com/wix/ricos/pull/1848) theme `customStyles` coverage

## 8.7.3 (Dec 10, 2020)

### :rocket: New Feature

- `editor`
  - [#1830](https://github.com/wix/ricos/pull/1830) conditional buttons

## 8.7.2 (Dec 9, 2020)

### :bug: Bug Fix

- `giphy`
  - [#1840](https://github.com/wix/ricos/pull/1840) prevent giphy crash on bad content
- `headers-markdown`
  - [#1841](https://github.com/wix/ricos/pull/1841) don't pull `wix-rich-content-plugin-commons` into viewer

## 8.7.1 (Dec 8, 2020)

### :house: Internal

- `gallery`
  - [#1838](https://github.com/wix/ricos/pull/1838) bump pro-gallery to 2.3.0
- `general`
  - [#1836](https://github.com/wix/ricos/pull/1836) moved to midgard-yarn

## 8.7.0 (Dec 7, 2020)

### :rocket: New Feature

- `editor`
  - [#1814](https://github.com/wix/ricos/pull/1814) onChange `traits` param added (`{ isEmpty, isContentChanged }`)

### :bug: Bug Fix

- `file-upload`
  - [#1799](https://github.com/wix/ricos/pull/1799) remove example `resolveFileUrl` from Ricos default
- `fullscreen`
  - [#1828](https://github.com/wix/ricos/pull/1828) fix mobile swipe crash

### :house: Internal

- `fullscreen`
  - [#1828](https://github.com/wix/ricos/pull/1828) split `Fullscreen` to `Fullscreen` and `InnerFullscreen` and improved image index tracking

## 8.6.5 (Dec 3, 2020)

### :bug: Bug Fix

- `fullscreen`
  - [#1819](https://github.com/wix/ricos/pull/1819) fix buttons on safari
- `ricos-common`
  - [#1820](https://github.com/wix/ricos/pull/1820) themeUtils.ts: `trimEnd` changed to `replace` for older browsers compatibility

## 8.6.4 (Dec 2, 2020)

### :bug: Bug Fix

- `spoiler`
  - [#1815](https://github.com/wix/ricos/pull/1815) fix passing static funcs (from SpoilerEditorWrapper into WrappedComponent)
- `image`
  - [#1576](https://github.com/wix/ricos/pull/1576) images smaller than 150px retain their alignment and size, larger images are spread coast to coast

### :house: Internal

- `test-env`
  - [#1815](https://github.com/wix/ricos/pull/1815) add all-images-cases fixtures

## 8.6.3 (Dec 2, 2020)

### :rocket: New Feature

- `ricos-common`

  - [#1808](https://github.com/wix/ricos/pull/1808) buttons' custom color ([customStyles API](https://wix.github.io/ricos/docs/ricos/theming#custom-styles))

- `collapsible-list`
  - [#1798](https://github.com/wix/ricos/pull/1798) collapsible-list screen reader (accessibility)

### :bug: Bug Fix

- `gallery`
  - [#1811](https://github.com/wix/ricos/pull/1811) gallery item titles appearing on mobile
- `fullscreen`
  - [#1809](https://github.com/wix/ricos/pull/1809) item titles appearing in expand mode

### :house: Internal

- `storybook`
  - [#1800](https://github.com/wix/ricos/pull/1800) improved error toasts story
- `gallery`
  - [#1811](https://github.com/wix/ricos/pull/1811) externel renderers for gallery info boxes

### :book: Documentation

- [#1800](https://github.com/wix/ricos/pull/1800) media plugins upload documentation

## 8.6.2 (Nov 27, 2020)

### :nail_care: New Feature

- [#1772](https://github.com/wix/ricos/pull/1772) :leaves: Tree-shakeable entries for plugins' viewers and libs (no more `cjs` imports )

### :bug: Bug Fix

- `viewer`
  - [#1780](https://github.com/wix/ricos/pull/1780) preview interaction block wrapping logic refactored
- `image`
  - [#1793](https://github.com/wix/ricos/pull/1793) blurry images in Safari when reloading the page

### :book: Documentation

- [#1788](https://github.com/wix/ricos/pull/1788) improved theme API documentation

### :house: Internal

- `plugin-commons`
  - [#1771](https://github.com/wix/ricos/pull/1771) remove old & incorrect scss classifiers
- `editor`
  - [#1791](https://github.com/wix/ricos/pull/1791) add missing types in `createPlugins`
- `editor-common`
  - [#1791](https://github.com/wix/ricos/pull/1791) add missing types in `getModalStyles`
- `e2e`
  - [#1792](https://github.com/wix/ricos/pull/1792) blog theme inheritance coverage

## 8.6.1 (Nov 23, 2020)

### :rocket: New Feature

- `spoiler`

  - [#1774](https://github.com/wix/ricos/pull/1774) spoiler plugin for image, gallery and video

### :bug: Bug Fix

- `viewer`
  - [#1780](https://github.com/wix/ricos/pull/1780) preview interaction block wrapping logic refactored
- `gallery`
  - [#1776](https://github.com/wix/ricos/pull/1776) fix gallery flickering
- `editor`
  - [#1784](https://github.com/wix/ricos/pull/1784) fix switching focus between inner-rce's in composition mode (Draft-js & Android with Google Keyboard issues)

### :book: Documentation

- [#1782](https://github.com/wix/ricos/pull/1782) legacy docs cleanu

### :house: Internal

- `editor`
  - [#1778](https://github.com/wix/ricos/pull/1778) remove react-dom/server

## 8.6.0 (Nov 16, 2020)

### :rocket: New Feature

- `general`
  - [#1762](https://github.com/wix/ricos/pull/1762) externalise image-client-api and import from image-client-api/dist/imageClientSDK

### :bug: Bug Fix

- `collapsible-list`
  - [#1766](https://github.com/wix/ricos/pull/1766) collapsible-list's viewer accessibility

## 8.5.1 (Nov 16, 2020)

### :bug: Bug Fix

- `undo-redo`
  - [#1763](https://github.com/wix/ricos/pull/1763) fix undo-redo behaviour on android phones
- `headers-markdown`
  - [#1764](https://github.com/wix/ricos/pull/1764) fix decorator function

## 8.5.0 (Nov 15, 2020)

### :rocket: New Feature

- `editor`
  - [#1751](https://github.com/wix/ricos/pull/1751) pasted headings will be converted to supported headings

### :bug: Bug Fix

- `common`
  - [#1761](https://github.com/wix/ricos/pull/1761) customStyles: keep `.text` color as `unset` if custom paragraph color was not defined.
- `collapsible-list`
  - [#1759](https://github.com/wix/ricos/pull/1759) fix collapsible-list's focus when editor is not focused
- `social-polls`
  - [#1748](https://github.com/wix/ricos/pull/1748) editor accessibility

### :house: Internal

- `editor`
  - [#1725](https://github.com/wix/ricos/pull/1725) save EditorState instead of ContentState (rce-in-rce)

## 8.4.8 (Nov 12, 2020)

### :bug: Bug Fix

- `headings`
  - [#1752](https://github.com/wix/ricos/pull/1752) fix headings drop down customization & changed `dropDownOptions` prop to `customHeadings`

### :house: Internal

- `general`
  - [#1747](https://github.com/wix/ricos/pull/1747) defined API for all editor & viewer plugins

## 8.4.7 (Nov 12, 2020)

### :house: Internal

- `viewer`
  - [#1750](https://github.com/wix/ricos/pull/1750) bundle size optimzation: editor translations are excluded from bundle
- `editor`

  - [#1756](https://github.com/wix/ricos/pull/1756) fix `onMediaUploadEnd` BI data arguments

### :bug: Bug Fix

- `general`
  - [#1749](https://github.com/wix/ricos/pull/1749) ui fix for error display in galleries and images
- `editor`
  - [#1754](https://github.com/wix/ricos/pull/1754) fix toast styles on mobile

## 8.4.6 (Nov 11, 2020)

### :bug: Bug Fix

- `file-upload`
  - [#1717](https://github.com/wix/ricos/pull/1717) cursor pointer on hover
- `editor`
  - [#1746](https://github.com/wix/ricos/pull/1746) media BI object properties fix

## 8.4.5 (Nov 11, 2020)

### :bug: Bug Fix

- `common`
  - [#1743](https://github.com/wix/ricos/pull/1743) customStyles `list` inherits `p` values

## 8.4.4 (Nov 10, 2020)

### :bug: Bug Fix

- `plugin-commons`
  - [#1721](https://github.com/wix/ricos/pull/1721) fix `isFocused = true` prop value when plugin is selected (not focused)
- `collapsible-list`
  - [#1721](https://github.com/wix/ricos/pull/1721) disable text selection when collapsible-list is selected (not focused)
- `common`
  - [#1742](https://github.com/wix/ricos/pull/1742) unset default `.text` fontSize

### :house: Internal

- `vertical-embed`
  - [#1736](https://github.com/wix/ricos/pull/1736) update mocks and add translations
- `gallery`
  - [#1739](https://github.com/wix/ricos/pull/1739) bump pro gallery version to 2.2.16

## 8.4.3 (Nov 5, 2020)

### :bug: Bug Fix

- `viewer`

  - [#1731](https://github.com/wix/ricos/pull/1731) fix justify in safari/firefox (adjust previous fix for the new dom structure)

## 8.4.2 (Nov 5, 2020)

### :rocket: New Feature

- `ricos-common`
  - [#1724](https://github.com/wix/ricos/pull/1724) `theme` - support RGB & RGBA colors in `Palette` object

### :bug: Bug Fix

- `viewer`
  - [#1730](https://github.com/wix/ricos/pull/1730) fix invalid inline plugins crash

### :house: Internal

- `focus-plugin`
  - [#1728](https://github.com/wix/ricos/pull/1728) use forked plugin from npm instead of github

## 8.4.1 (Nov 4, 2020)

### :bug: Bug Fix

- `ricos-common`
  - [#1718](https://github.com/wix/ricos/pull/1718) `theme` - fix transparency support
- `ricos-common`
  - [#1719](https://github.com/wix/ricos/pull/1719) `theme` - fix customStyles API ensure safety of overrides
- `anchor`
  - [#1726](https://github.com/wix/ricos/pull/1726) add optional siteUrl in config (SEO)

### :house: Internal

- `e2e-tests`
  - [#1152](https://github.com/wix/ricos/pull/1152) insert plugins tests added (including native upload tests)

## 8.4.0 (Nov 2, 2020)

### :rocket: New Feature

- `ricos-common`
  - [#1651](https://github.com/wix/ricos/pull/1651) theme API features ([Check it out](https://wix.github.io/ricos/docs/ricos/theming))
    - typography API - fontFamily
    - custom fields addition
- `editor`
  - [#1706](https://github.com/wix/ricos/pull/1706) pasting text with formatting from other editors (Google Docs, MS Word..)

### :bug: Bug Fix

- `editor-common`
  - [#1707](https://github.com/wix/ricos/pull/1707) fix checkbox focus-ring

### :house: Internal

- `ricos-common`
  - [#1651](https://github.com/wix/ricos/pull/1651) themeStrategy refactor, automated css-vars generation, theme unit tests
- `docs`
  - [#1651](https://github.com/wix/ricos/pull/1651) Detailed `RicosTheme` Documentation
- `preview`
  - [#1697](https://github.com/wix/ricos/pull/1697) preview logic moved to ricos-content
- `file-upload`
  - [#1714](https://github.com/wix/ricos/pull/1714) default `resolveFileUrl` is not merged directly to config

## 8.3.0 (Oct 28, 2020)

### :rocket: New Feature

- `ricos-editor`
  - [#1637](https://github.com/wix/ricos/pull/1637) added `shouldRemoveErrorBlocks` option to `getContent` defaults to `true`

## 8.2.1 (Oct 28, 2020)

### :rocket: New Feature

- `vertical-embed`
  - [#1684](https://github.com/wix/ricos/pull/1684) add slimLayout setting

### :bug: Bug Fix

- `editor`
  - [#1693](https://github.com/wix/ricos/pull/1693) onMediaUploadEnd arguments fix
  - [#1688](https://github.com/wix/ricos/pull/1688) link preview is disabled in inner-rce

### :house: Internal

- `templates`
  - [#1643](https://github.com/wix/ricos/pull/1643) converted to TS and moved from scripts to packages folder
- `general`
  - [#1643](https://github.com/wix/ricos/pull/1643) converted RichContentEditor, RichContentViewer and many plugin and utility files to TS
  - [#1695](https://github.com/wix/ricos/pull/1695) update webpack-merge "merge" function consumption
- `gallery`
  - [#1698](https://github.com/wix/ricos/pull/1698) bump pro gallery version to 2.2.8

## 8.2.0 (Oct 23, 2020)

### :rocket: New Feature

- `quote`
  - [#1683](https://github.com/wix/ricos/pull/1683) aligned quote - quote's position is based on alignment (with support for blog's theme)

### :bug: Bug Fix

- `giphy`
  - [#1690](https://github.com/wix/ricos/pull/1690) a11y improved in popup
- `emoji`
  - [#1690](https://github.com/wix/ricos/pull/1690) a11y improved in popup
- `plugin-link`
  - [#1666](https://github.com/wix/ricos/pull/1666) anchor - scroll location on sites with fixed headers
- `collapsible-list`
  - [#1687](https://github.com/wix/ricos/pull/1687) fix "getIn" error (draftjs bug)

### :book: Documentation

- `emoji`
  - [#1633](https://github.com/wix/ricos/pull/1633) Emoji Plugin Docs

### :house: Internal

- `e2e-tests`
  - [#1681](https://github.com/wix/ricos/pull/1681) Consumers themes(only Blog for now) added to RicosTestApp

## 8.1.4 (Oct 20, 2020)

### :rocket: New Feature

- `ricos-editor`
  - [#1674](https://github.com/wix/ricos/pull/1674) support `container` in ModalSettings

## 8.1.3 (Oct 19, 2020)

### :rocket: New Feature

- `vertical embed`
  - [#1585](https://github.com/wix/ricos/pull/1585) vertical embed modal ui

### :house: Internal

- `gallery`
  - [#1664](https://github.com/wix/ricos/pull/1664) bump pro gallery version to 2.2.0
- `docs`
  - [#1645](https://github.com/wix/ricos/pull/1645) upgrade to v8
  - [#1655](https://github.com/wix/ricos/pull/1655) google api key security issue
- `quote`
  - [#1667](https://github.com/wix/ricos/pull/1667) revert of #1602: aligned quote - quote's position is based on alignment (theme breaking change)

### :bug: Bug Fix

- `editor-common`
  - [#1650](https://github.com/wix/ricos/pull/1650) fix modals text color issue on dark theme
- `ricos-editor`
  - [#1669](https://github.com/wix/ricos/pull/1669) fix inline toolbar plugins with modal in inner-rce

### :book: Documentation

- `text-color`
  - [#1654](https://github.com/wix/ricos/pull/1654) Text Color and Highlight Plugins Docs
- `code-block`
  - [#1640](https://github.com/wix/ricos/pull/1640) Code Block Plugin Docs
- `button`
  - [#1656](https://github.com/wix/ricos/pull/1656) Buttons Plugin Docs

## 8.1.1 (Oct 16, 2020)

### :house: Internal

- `gallery`
  - [#1649](https://github.com/wix/ricos/pull/1649) bump pro gallery version to 2.1.4

### :book: Documentation

- `map`
  - [#1638](https://github.com/wix/ricos/pull/1638) Map Plugin Docs
- `hashtag`
  - [#1929fd3](https://github.com/wix/ricos/commit/1929fd3) Hashtag Plugin Docs
- `image`
  - [#a8dc79c](https://github.com/wix/ricos/commit/a8dc79c) Image Plugin Docs
- `video`
  - [#a8dc79c](https://github.com/wix/ricos/commit/a8dc79c) Video Plugin Docs

## 8.1.0 (Oct 15, 2020)

### :rocket: New Feature

- `quote`
  - [#1602](https://github.com/wix/ricos/pull/1602) aligned quote - quote's position is based on alignment

### :bug: Bug Fix

- `list`
  - [#1632](https://github.com/wix/ricos/pull/1632) centered lists
- `collapsible-list`
  - [#1629](https://github.com/wix/ricos/pull/1629) bug fixes

### :house: Internal

- `collapsible-list`
  - [#1596](https://github.com/wix/ricos/pull/1596) bundle size reduced

### :book: Documentation

- `gallery`
  - [#1641](https://github.com/wix/ricos/pull/1641) Gallery Plugin Docs
- `divider`
  - [#1634](https://github.com/wix/ricos/pull/1634) Divider Plugin Docs
- `file-upload`
  - [#1644](https://github.com/wix/ricos/pull/1644) File Upload Plugin Docs

## 8.0.1 (Oct 14, 2020)

### :rocket: New Feature

- `general`
  - [#1630](https://github.com/wix/ricos/pull/1630) theme updates:
    - default font is now `HelveticaNeue`, replacing `Helvetica` and `Avenir` instances
    - tooltips background is no longer transparent (100% black)
    - toolbars `hover` color is now 6% transparent dark (instead of 6% transparent action-color)
- `ricos-editor`
  - [#1627](https://github.com/wix/ricos/pull/1627) added `ricos-editor-modal` class to the editor modal
- `ricos-content`
  - [#1622](https://github.com/wix/ricos/pull/1622) `isContentStateEmpty` util
- `quote`
  - [#1602](https://github.com/wix/ricos/pull/1602) aligned quote - quote's position is based on alignment

### :bug: Bug Fix

- `general`
  - [#1630](https://github.com/wix/ricos/pull/1630) theme fixes:
    - color picker - border circling the picked color was mispositioned
    - plugin toolbar - several menu buttons height was different, creating a misalignment
- `storybook`
  - [#1630](https://github.com/wix/ricos/pull/1630) fixed total bold font in RicosTheme page
- `collapsible-list`
  - [#1631](https://github.com/wix/ricos/pull/1631) buttons wiring

### :house: Internal

- `general`
  - [#1586](https://github.com/wix/ricos/pull/1586) media upload and errors BI callbacks `onMediaUploadStart` and `onMediaUploadEnd` support
- `exampleApp`
  - [#1630](https://github.com/wix/ricos/pull/1630) changed theme color of plugin toolbar hover
- `polls`
  - [#1628](https://github.com/wix/ricos/pull/1628) bundle size reduced

## 8.0.0 TSLA5000 (Oct 12, 2020)

[Migration guide](https://wix.github.io/ricos/docs/ricos/migrations/v7-to-v8)

### :rocket: New Feature

- `editor`
  - [#1561](https://github.com/wix/ricos/pull/1561) new design implementation (plugins toolbar & inline toolbar) - active background & hover background
  - [#1561](https://github.com/wix/ricos/pull/1561) mobile's static-toolbar new design implementation
  - [#1614](https://github.com/wix/ricos/pull/1614) +more button color change
- `mentions`
  - [#1561](https://github.com/wix/ricos/pull/1561) new design implementation
- `ricos-theme`
  - [#1561](https://github.com/wix/ricos/pull/1561) 3-Colors Palette Object is now supported
- `ricos-common`
  - [#1608](https://github.com/wix/ricos/pull/1608) eliminate `createTheme` necessity from theme prop
- `link-preview`
  - [#1614](https://github.com/wix/ricos/pull/1614) `hover` color change
- `vertical-embed`
  - [#1614](https://github.com/wix/ricos/pull/1614) pluginMenu's svg colors' fix when hovering

### :house: Internal

- `ricos-theme`
  - [#1561](https://github.com/wix/ricos/pull/1561) themeStrategy: JSS is replaced with CSS-Vars, improving bundle size
- `ricos-common`
  - [#1608](https://github.com/wix/ricos/pull/1608) merge `ricos-theme` into `ricos-common`
- `e2e`
  - [#1601](https://github.com/wix/ricos/pull/1601) media tests fixes

### :bug: Bug Fix

- `gallery`
  - [#1601](https://github.com/wix/ricos/pull/1601) correct image is displayed on horizontal layouts
- `editor`
  - [#1623](https://github.com/wix/ricos/pull/1623) toast link font styles
- `collapsible-list`
  - [#1595](https://github.com/wix/ricos/pull/1595) Firefox bugs & css fixes

## 7.21.4 (Oct 8, 2020)

### :rocket: New Feature

- `video`
  - [#1621](https://github.com/wix/ricos/pull/1621) add `disableDownload` option

## 7.21.3 (Oct 7, 2020)

### :bug: Bug Fix

- `link-toolbar`
  - [#1615](https://github.com/wix/ricos/pull/1615) fix visibility (available to open from keyboard)

### :book: Documentation

- `giphy`
  - [#1613](https://github.com/wix/ricos/pull/1613) Giphy Plugin Docs

## 7.21.2 (Oct 5, 2020)

### :rocket: New Feature

- `editor`
  - [#1535](https://github.com/wix/ricos/pull/1535) BI - `onPluginAddSuccess` - a new content mutation event, triggered when a plugin is successfully added.
- `common`
  - [#1597](https://github.com/wix/ricos/pull/1597) getTextDirection is exported as lib

### :bug: Bug Fix

- `viewer`
  - [#1582](https://github.com/wix/ricos/pull/1582) the helpers prop was undefined, breaking BI callbacks
- `plugin-link`
  - [#1580](https://github.com/wix/ricos/pull/1580) link panel width in safari
- `ricos-editor`
  - [#1570](https://github.com/wix/ricos/pull/1570) removed condition restricting onChange to only be triggered when ContentState changes
- `editor`
  - [#1594](https://github.com/wix/ricos/pull/1594) toast styles fix - line breaks and z-index above all

### :house: Internal

- `e2e`
  - [#1583](https://github.com/wix/ricos/pull/1583) new: theming coverage
  - [#1570](https://github.com/wix/ricos/pull/1570) RicosTestApp uses the ricos API onChange function
- `general`
  - [#1581](https://github.com/wix/ricos/pull/1581) removed tsconfig files in packages

## 7.21.1 (Sep 29, 2020)

### :house: Internal

- `inner-rce`
  - [#1579](https://github.com/wix/ricos/pull/1579) create new contentState without version
- `collapsible-list` _alpha_
  - [#4bcd4c57](https://github.com/wix/ricos/commit/4bcd4c57) publish collapsible-list to npm

## 7.21.0 (Sep 29, 2020)

### :rocket: New Feature

- `collapsible-list` _alpha_
  - [#1416](https://github.com/wix/ricos/pull/1416) Collapsible List plugin
- `editor`

  - [#1418](https://github.com/wix/ricos/pull/1418) error toast appears when uploading media fails

### :bug: Bug Fix

- `fullscreen`
  - [#1563](https://github.com/wix/ricos/pull/1563) fix wix ad covering fullscreen buttons
- `html-embed`
  - [#1554](https://github.com/wix/ricos/pull/1554) fixes embedded iframes width to be 100% fixed

### :house: Internal

- `ricos-content`
  - [#1573](https://github.com/wix/ricos/pull/1573) [#1574](https://github.com/wix/ricos/pull/1574) types: noImplicitAny applied
- `editor`
  - [#1556](https://github.com/wix/ricos/pull/1556) fix editorStateConversion import size
  - [#1418](https://github.com/wix/ricos/pull/1418) `Toast` and `ErrorToast` components
- `plugin-commons`
  - [#1566](https://github.com/wix/ricos/pull/1566) move rtl/ltr icons from polls to plugin-commons package
- `general`
  - [#1559](https://github.com/wix/ricos/pull/1559) converted to yarn workspaces
- `vertical embed`
  - [#1552](https://github.com/wix/ricos/pull/1552) send locale to verticalsApi

## 7.20.4 (Sep 21, 2020)

### :bug: Bug Fix

- `ricos-content`
  - align versions mismatch

## 7.20.3 (Sep 21, 2020)

### :bug: Bug Fix

- `viewer`
  - [#1557](https://github.com/wix/ricos/pull/1557) fix viewer justify css for safari and firefox
- `preview`
  - [#1562](https://github.com/wix/ricos/pull/1562) readMore display edgecase fix + gallery responsiveness
- `ricos-theme`
  - [#1558](https://github.com/wix/ricos/pull/1558) inlineToolbar style fixes:
    - fixed buttons active state design
    - fixed heading button position (vertical alignment)
    - better specified ExternalToolbar's style as it was side-affected by the changes
- `rollup`
  - [#1564](https://github.com/wix/ricos/pull/1564) Externalize react-player

### :house: Internal

- `e2e`
  - [#1555](https://github.com/wix/ricos/pull/1555) stabalise flaky gallery tests
- `general`
  - [#1556](https://github.com/wix/ricos/pull/1556) converted rollup to typescript

## 7.20.2 (Sep 16, 2020)

### :rocket: New Feature

- `storybook`
  - [#1495](https://github.com/wix/ricos/pull/1495) added preview's default rules display under the `Preview` -> `Rules` page.
- `preview`
  - [#1495](https://github.com/wix/ricos/pull/1495) API Changes:
    - `previewSettings()` (ricos export) was renamed to `createPreview()` to match ricos convention (similar to `createTheme()`)
    - `PreviewSettings` interface was renamed to `PreviewConfig` to better represent its meaning
    - `ellipsis` param in `ReadMore` is no longer overridable, as it is now implemented with `-webkit-line-clam` which doesn't support it

### :bug: Bug Fix

- `ricos-theme`
  - [#1550](https://github.com/wix/ricos/pull/1550) fixes:
    - plugin menu color fix
    - resize handles color fix
    - brightness threshold to activate fallback color - raised
  - [#1558](https://github.com/wix/ricos/pull/1558) inlineToolbar style fixes:
    - fixed buttons active state design
    - fixed heading button position (vertical alignment)
    - better specified ExternalToolbar's style as it was side-affected by the changes

### :house: Internal

- `preview`
  - [#1495](https://github.com/wix/ricos/pull/1495) converted from JS to TS. Also:
    - removed comments
    - removed redundant code from `Preview.jsx`
- `text-selection-toolbar`
  - [#1412](https://github.com/wix/ricos/pull/1412) text selection toolbar example in storybook
- `storybook`
  - [#1412](https://github.com/wix/ricos/pull/1412) text selection toolbar example
- `ricos-theme`
  - [#1550](https://github.com/wix/ricos/pull/1550) removed unused-by-design colors from palette (secondary, color4, color7)
- `gallery`
  - [#1511](https://github.com/wix/ricos/pull/1511) bump pg version to 2.1.29

## 7.19.3 (Sep 13, 2020)

### :bug: Bug Fix

- `ricos-editor`
  - [#1542](https://github.com/wix/ricos/pull/1542) fixed appearance of inlineToolbarButtons to the new design
  - [#1548](https://github.com/wix/ricos/pull/1548) accept only valid draft-js props in `draftEditorSettings`

### :rocket: New Feature

- `ricos-content`
  - [#1527](https://github.com/wix/ricos/pull/1527) Platform agnostic package for handling Ricos content

### :house: Internal

- `general`
  - [#1544](https://github.com/wix/ricos/pull/1544) one-line index files removed
- `exampleApp`
  - [#1541](https://github.com/wix/ricos/pull/1541) file upload native\media manager toggle in gear icon
  - [#1537](https://github.com/wix/ricos/pull/1537) bi callback `onViewerAction` outputs to console.log

### :book: Documentation

- [#1546](https://github.com/wix/ricos/pull/1546) external toolbar customization docs

## 7.19.2 (Sep 9, 2020)

### :bug: Bug Fix

- `editor-common`
  - [#1539](https://github.com/wix/ricos/pull/1539) moved EditorEvents back to editor-common

## 7.19.1 (Sep 8, 2020)

### :house: Internal

- `general`
  - [#1536](https://github.com/wix/ricos/pull/1536) renamed onAction BI callback to onViewerAction

## 7.19.0 (Sep 8, 2020)

### :rocket: New Feature

- `ricos-theme`
  - [#1500](https://github.com/wix/ricos/pull/1500) extracting ricos theme to dedicated package, to allow opt-in (bundlesize concern)
- `plugin-commons`
  - [#1498](https://github.com/wix/ricos/pull/1498) plugin related stuff moved from `editor-common` to a separate package

### :bug: Bug Fix

- `viewer`
  - [#1487](https://github.com/wix/ricos/pull/1487) fix viewer justify css for safari and firefox
- `plugin-commons`
  - [#1526](https://github.com/wix/ricos/pull/1526) UrlInputModal theme/style override workaround
- `editor`
  - [#1519](https://github.com/wix/ricos/pull/1519) external toolbars: inline style toggling fixed
  - [#1520](https://github.com/wix/ricos/pull/1520) inner modal theme
- `plugin-link`
  - [#1521](https://github.com/wix/ricos/pull/1521) fix basic link panel wiring
  - [#1531](https://github.com/wix/ricos/pull/1531) fix linkColor not shown on initial render (SSR)
- `preview`
  - [#1523](https://github.com/wix/ricos/pull/1523) readMore hashtags & mentions callbacks functionality
  - [#1524](https://github.com/wix/ricos/pull/1524) text fragments edge case
- `ricos-viewer`
  - [#1522](https://github.com/wix/ricos/pull/1522) incorrect gallery image index in fullscreen
- `emoji-plugin`
  - [#1510](https://github.com/wix/ricos/pull/1510) emoji preview modal anchor bug fix

### :house: Internal

- `e2e`
  - [#1509](https://github.com/wix/ricos/pull/1509) test html plugin change url
- `ricos-theme`
  - [#1515](https://github.com/wix/ricos/pull/1515) bundle size improved by removing unused JSS plugins
- `general`
  - [#1525](https://github.com/wix/ricos/pull/1525) typed theme functions for all plugins
  - [#1528](https://github.com/wix/ricos/pull/1528) fixed `npm run watch` command for several packages
- `storybook`
  - [#1533](https://github.com/wix/ricos/pull/1533) ricos theme's palette examples are more realistic

## 7.18.3 (Sep 3, 2020)

### :bug: Bug Fix

- `ricos-editor`
  - [#1508](https://github.com/wix/ricos/pull/1508) child (RCE) props were never updated

## 7.18.2 (Sep 3, 2020)

### :bug: Bug Fix

- `all`
  - [#1505](https://github.com/wix/ricos/pull/1505) restore last rule semicolon in rtl directivies in all packages dist/styles.min.css

## 7.18.1 (Sep 2, 2020)

### :bug: Bug Fix

- `preview`
  - [#1507](https://github.com/wix/ricos/pull/1507) readMore wasn't shown when gallery-plugin was the only plugin in the content
- `editor-common`
  - [#7a2902dd](https://github.com/wix/ricos/commit/7a2902dd) fix error on ResizeObserver when inlineToolbar's getVisibilityFn = () => false

## 7.18.0 (Sep 2, 2020)

### :rocket: New Feature

- `gallery`
  - [#1406](https://github.com/wix/ricos/pull/1406) override default plugin dataConfig object from config
- `preview`
  - [#1502](https://github.com/wix/ricos/pull/1502) allow gallery size modification

### :bug: Bug Fix

- `ricos-viewer`
  - [#1501](https://github.com/wix/ricos/pull/1501) fullscreen mobile awareness
- `common`
  - [#1504](https://github.com/wix/ricos/pull/1504) fix: lists alignment in rtl

## 7.17.1 (Sep 1, 2020)

### :bug: Bug Fix

- `editor-common`
  - [#1503](https://github.com/wix/ricos/pull/1503) @wix/draft-js@0.0.10 -- bugfix for Chrome 85

## 7.17.0 (Sep 1, 2020)

### :rocket: New Feature

- `fullscreen`
  - [#1154](https://github.com/wix/ricos/pull/1154) exapnd mode with titles and fullscreen compatability, major design changes and responsiveness, `isMobile` prop support
- `gallery`
  - [#1483](https://github.com/wix/ricos/pull/1483) upload error in gallery settings display with tooltip

### :bug: Bug Fix

- `video`
  - [#1490](https://github.com/wix/ricos/pull/1490) pixel perfect ratio. Fixes blog automation.
- `preview`
  - [#1499](https://github.com/wix/ricos/pull/1499) fix flaky e2e tests
  - [#1482](https://github.com/wix/ricos/pull/1482) ReadMore click expands the full content
  - [#1485](https://github.com/wix/ricos/pull/1485) fix readmore visibility when there are multiple text fragments
  - [#1492](https://github.com/wix/ricos/pull/1492) edge case of 1 image + {x} plugins prevented display of "read more" label
- `plugins`
  - [#1481](https://github.com/wix/ricos/pull/1481) line-spacing & text-color: external toolbar dropdown styles fixed
- `ricos-editor`
  - [#1450](https://github.com/wix/ricos/pull/1450) getContentPromise - add flush option to fix mobile composition mode
- `modals empty state`
  - [#1493](https://github.com/wix/ricos/pull/1493) fix giphy's and side menu's empty state ui.

### :house: Internal

- `e2e`
  - [#1479](https://github.com/wix/ricos/pull/1479) test html plugin choose url option
- `file-upload`

  - [#1411](https://github.com/wix/ricos/pull/1411) errors saved in component data

## 7.16.15 (Aug 24, 2020)

### :rocket: New Feature

- `image`
  - [#1408](https://github.com/wix/ricos/pull/1408) upload error displays in image settings

### :bug: Bug Fix

- `preview`
  - [#1426](https://github.com/wix/ricos/pull/1426) Read More label at the bottom, label toggling for Read More
- `ricos-editor`
  - [#1476](https://github.com/wix/ricos/pull/1476) onChange is called when upload starts/ends
  - [#1478](https://github.com/wix/ricos/pull/1478) removed div element wrapping RCE affecting styling

### :house: Internal

- `general`
  - [#1408](https://github.com/wix/ricos/pull/1408) media upload errors saved and handled from component data

## 7.16.14 (Aug 23, 2020)

### :bug: Bug Fix

- `ricos-editor`
  - [#1471](https://github.com/wix/ricos/pull/1471) missing height in ricos editor wrapping div
- `editor-common`
  - [#1473](https://github.com/wix/ricos/pull/1473) fix RadioGroup not working in html plugin

## 7.16.12 (Aug 20, 2020)

### :bug: Bug Fix

- `ricos-editor`
  - [#1470](https://github.com/wix/ricos/pull/1470/) multiple editors support (react-modal bug fix)

## 7.16.11 (Aug 20, 2020)

### :bug: Bug Fix

- `image`
  - [#1467](https://github.com/wix/ricos/pull/1467) image caption aligned correctly in rtl
- `fullscreen`
  - [#1468](https://github.com/wix/ricos/pull/1468) add pro gallery css to fullscreen css
  - [#1432](https://github.com/wix/ricos/pull/1468) fix resolution on mobile

## 7.16.10 (Aug 19, 2020)

### :bug: Bug Fix

- `editor`
  - [#1466](https://github.com/wix/ricos/pull/1466) default formatting toolbars change - remove first divider

## 7.16.9 (Aug 18, 2020)

### :bug: Bug Fix

- `editor`
  - [#1463](https://github.com/wix/ricos/pull/1463) external formatting toolbar: preserve selection on inline style change
  - fixtate 'draftjs-conductor' version due to broken es5
- `file-upload`
  - [#1465](https://github.com/wix/ricos/pull/1465) remove dependency of file type, long extension clipping and otherIcon themeing fix

## 7.16.8 (Aug 18, 2020)

### :bug: Bug Fix

- `file-upload`
  - [#1459](https://github.com/wix/ricos/pull/1459) fix icon colors and theme wiring, replace full width with best fit

## 7.16.6 (Aug 16, 2020)

### :rocket: New Feature

- `common`
  - [#1452](https://github.com/wix/ricos/pull/1452) debugging info reported to console if `debug` query param added

### :bug: Bug Fix

- `editor`
  - [#1454](https://github.com/wix/ricos/pull/1454) RichContentEditor: draft `handleBeforeInput` params passed to `props.handleBeforeInput`
- `editor-common`
  - [#1448](https://github.com/wix/ricos/pull/1448) colorPicker reset to default and + button (regression from 7.16.3, PR#1428)
- `ricos-editor`
  - [#1456](https://github.com/wix/ricos/pull/1456) modal `removeChild` issue
- `editor`
  - [#1453](https://github.com/wix/ricos/pull/1453) fix list theming editor & viewer

## 7.16.4 (Aug 13, 2020)

### :rocket: New Feature

- `editor`
  - [#1370](https://github.com/wix/ricos/pull/1370) external toolbar API updated
- `ricos-editor`
  - [#1417](https://github.com/wix/ricos/pull/1417) `onBusyChange` notifies when editor is handling upload in media plugins
- `video`
  - [#1424](https://github.com/wix/ricos/pull/1424) validate input url (#1424)
- `image` `gallery`
  - [#1431](https://github.com/wix/ricos/pull/1431) `disableExpand` config allows disabling expand mode
- `ricos-driver`
  - [#1423](https://github.com/wix/ricos/pull/1423) Isolated package for exporting selectors

### :bug: Bug Fix

- `general`
  - [#1428](https://github.com/wix/ricos/pull/1428) add preventDefault to toolbars
- `preview`
  - [#1419](https://github.com/wix/ricos/pull/1419) fixed image counter + display `seeFullPost` only if 1 < imgCount < 5
  - [#1425](https://github.com/wix/ricos/pull/1425) `onPreviewExpand` callback to determine if content was expanded (full-view)
- `ricos-editor`
  - [#1447](https://github.com/wix/ricos/pull/1447) `onChange` is called only when content changes

## 7.16.3 (Aug 4, 2020)

### :bug: Bug Fix

- `general`
  - [#1413](https://github.com/wix/ricos/pull/1413) improve performance - mainly disable the rendering of toolbars when they are not needed
  - [#1413](https://github.com/wix/ricos/pull/1413) fix many react warnings for keys

## 7.16.2 (Aug 4, 2020)

### :bug: Bug Fix

- `general`
  - [#1420](https://github.com/wix/ricos/pull/1420) added lib entry points to to babel transpilation
- `common`
  - [#1415](https://github.com/wix/ricos/pull/1415) tooltip setstate on an unmounted component and ssr hydration fixed
- `editor`
  - [#1410](https://github.com/wix/ricos/pull/1410) fix space deletes atomic block by disabling keyboard inputs on atomic blocks
  - [#1381](https://github.com/wix/ricos/pull/1381) fix blur editor on esc click

## 7.16.1 (Aug 2, 2020)

### :bug: Bug Fix

- `plugin-link`
  - [#1409](https://github.com/wix/ricos/pull/1409) link viewer without onClick from settings
- `plugin-link`
  - [#1402](https://github.com/wix/ricos/pull/1402) anchor - config changes, ricos documentation, schema fix

## 7.16.0 (Jul 30, 2020)

### :rocket: New Feature

- `gallery`
  - [#1373](https://github.com/wix/ricos/pull/1373) gallery plugin upload error handling
- `file-upload`
  - [#1138](https://github.com/wix/ricos/pull/1138) plugin design overhaul
- `text-selection-toolbar`

  - [#1397](https://github.com/wix/ricos/pull/1397) text selection toolbar & tweet button

## 7.15.4 (Jul 29, 2020)

### :bug: Bug Fix

- `image`
  - [#1399](https://github.com/wix/ricos/pull/1399) link in image viewer
- `viewer`
  - [#1395](https://github.com/wix/ricos/pull/1395) remove react-dom/server from viewer dependencies (reduce bundle size)
  - [#1404](https://github.com/wix/ricos/pull/1404) change viewer justify css
- `ricos-editor`
  - [#1405](https://github.com/wix/ricos/pull/1405) OpenModal crash when no modalStyles sent (giphy modal bug)
- `adsense`
  - [#1403](https://github.com/wix/ricos/pull/1403) Edit Panel UI
- `general`
  - [#1400](https://github.com/wix/ricos/pull/1400) missing type definitions for viewer and lib entrypoints

## 7.15.3 (Jul 28, 2020)

### :bug: Bug Fix

- `ricos`
  - [#1391](https://github.com/wix/ricos/pull/1391) provides the correct translations given a locale
  - [#1384](https://github.com/wix/ricos/pull/1384) mentions - type difference for editor/viewer

### :rocket: New Feature

- `spoiler`
  - [#1194](https://github.com/wix/ricos/pull/1194) Spoiler plugin for text

## 7.15.1 (Jul 27, 2020)

### :bug: Bug Fix

- `plugin-link`
  - [#1393](https://github.com/wix/ricos/pull/1393) fix position of anchors dropdown filter

## 7.15.0 (Jul 27, 2020)

### :rocket: New Feature

- `plugin-link`
  - [#1142](https://github.com/wix/ricos/pull/1142) anchors

## 7.14.0 (Jul 26, 2020)

### :rocket: New Feature

- `editor-common`
  - [#1382](https://github.com/wix/ricos/pull/1382) dynamic position for plugin/inline toolbar on mobile

### :bug: Bug Fix

- `general`
  - [#1345](https://github.com/wix/ricos/pull/1345) fix tooltip for multiple editor/viewer
- `editor`
  - [#1379](https://github.com/wix/ricos/pull/1379) prevent wix focus-ring (formatting toolbar corruption)
  - [#1388](https://github.com/wix/ricos/pull/1388) add shortcut handling for cmd+shift+j instead of draft-js inline styling handling
- `list`
  - [#1377](https://github.com/wix/ricos/pull/1377) lists position next to atomic blocks with alignment
- `ricos`
  - [#1378](https://github.com/wix/ricos/pull/1378) fixed modal theme of multiple instances
  - [#1383](https://github.com/wix/ricos/pull/1383) modification of [#1378](https://github.com/wix/ricos/pull/1378) to apply to ricos only
- `image`
  - [#1386](https://github.com/wix/ricos/pull/1386) image accessibility - when image selected, enter or space click open fullscreen
- `editor-common`
  - [#1382](https://github.com/wix/ricos/pull/1382) resizeObserver undefined error fixed
  - [#1385](https://github.com/wix/ricos/pull/1385) added CharacterMetadata & BlockMap to exposed draft-js types

## 7.13.2 (Jul 23, 2020)

### :bug: Bug Fix

- `editor`
  - [#1379](https://github.com/wix/ricos/pull/1379) prevent wix focus-ring (formatting toolbar corruption)
- `fullscreen`
  - [#1380](https://github.com/wix/ricos/pull/1380) incorrect url for small images leading to blurry display + unit tests

## 7.13.1 (Jul 22, 2020)

### :rocket: New Feature

- `ricos-common`
  - [#1371](https://github.com/wix/ricos/pull/1371) completed missing props in Ricos API from rich-content API

### :bug: Bug Fix

- `ricos`
  - [#1375](https://github.com/wix/ricos/pull/1375) theme fix for multiple instances of RicosEditor / RicosViewer
- `editor-common`
  - [#1340](https://github.com/wix/ricos/pull/1340) plugin toolbar fixed position after resize

## 7.13.0 (Jul 20, 2020)

### :rocket: New Feature

- `preview`
  - [#1356](https://github.com/wix/ricos/pull/1356) support video in gallery
  - [#1369](https://github.com/wix/ricos/pull/1369) preview content examples in storybook
- `storybook`
  - [#1369](https://github.com/wix/ricos/pull/1369) preview content examples
- `giphy`
  - [#1358](https://github.com/wix/ricos/pull/1358) gif preview modal empty state
- `ricos-viewer`
  - [#1249](https://github.com/wix/ricos/pull/1249) preview strategy

### :bug: Bug Fix

- `gallery`
  - [#1362](https://github.com/wix/ricos/pull/1362) fix rtl
- `preview`
  - [#1361](https://github.com/wix/ricos/pull/1361) readMore - removed automatic scroll to top page
  - [#1366](https://github.com/wix/ricos/pull/1366) support multiple vids, gifs & wix media
- `gallery`
  - [#1366](https://github.com/wix/ricos/pull/1366) support multiple vids, gifs & wix media
- `editor`
  - [#1364](https://github.com/wix/ricos/pull/1364) lists plugin: remove buggy conversion from - or \* chars to list

## 7.12.3 (Jul 15, 2020)

### :bug: Bug Fix

- `fullscreen`
  - [#1359](https://github.com/wix/ricos/pull/1359) fix when direction=RTL
- `editor-common`
  - [#1343](https://github.com/wix/ricos/pull/1343) draftUtils.ts - fixed getEntities types
  - [#1352](https://github.com/wix/ricos/pull/1352) insertPlugins modals theme prop was broken (videoPlugin in particular)
- `viewer`
  - [#1352](https://github.com/wix/ricos/pull/1352) anchors fix: exclude inline plugins

## 7.12.2 (Jul 13, 2020)

### :bug: Bug Fix

- `preview`
  - [#1341](https://github.com/wix/ricos/pull/1341) inlineStyles - corrected offset of readMore
- `ricos-editor`
  - [#1348](https://github.com/wix/ricos/pull/1348) bump zIndex to 20000 (to overcome wix site styles)

## 7.12.1 (Jul 13, 2020)

### :bug: Bug Fix

- `editor`
  - [#1327](https://github.com/wix/ricos/pull/1327) fix alignment toolbar scrollbars in windows
  - [#1328](https://github.com/wix/ricos/pull/1328) external toolbar API: multiple editors / multiple toolbars support
  - [#1308](https://github.com/wix/ricos/pull/1308) theme - default font reverted to Helvetica
- `preview`
  - [#1248](https://github.com/wix/ricos/pull/1248) fix multi-block calculation (3 lines bug)
- `viewer`
  - [#1308](https://github.com/wix/ricos/pull/1308) theme - default font reverted to Helvetica
  - [#1342](https://github.com/wix/ricos/pull/1342) breaks when there is a link in a list (regression from 7.11.0)
- `gallery`
  - [#1322](https://github.com/wix/ricos/pull/1322) gallery image title font size is fixed to 14px
  - [#1334](https://github.com/wix/ricos/pull/1334) render SSR when in SEO view mode
- `general`
  - [#1336](https://github.com/wix/ricos/pull/1336) solved type definition issues caused by JS files

## 7.12.0 (Jul 8, 2020)

### :rocket: New Feature

- `viewer`
  - [#1265](https://github.com/wix/ricos/pull/1265) paywall seo support

### :bug: Bug Fix

- `common`
  - [#1310](https://github.com/wix/ricos/pull/1310) long numbered list appears broken
- `viewer`
  - [#1318](https://github.com/wix/ricos/pull/1318) add rtl-ignore comments
- `image`
  - [#1321](https://github.com/wix/ricos/pull/1321) link-redirect text in image settings
- `ricos`
  - [#1301](https://github.com/wix/ricos/pull/1301) themeStrategy manages instance state with closure
- `ricos-viewer`
  - [#1300](https://github.com/wix/ricos/pull/1300) missing imported styles
- `ricos-editor`
  - [#1300](https://github.com/wix/ricos/pull/1300) missing imported styles
  - [#1296](https://github.com/wix/ricos/pull/1296) Editor Modal z-index increase
  - [#1303](https://github.com/wix/ricos/pull/1303) actionColor fix for "more+" button
  - [#1304](https://github.com/wix/ricos/pull/1304) textColor fix for plugin (+) button
  - [#1305](https://github.com/wix/ricos/pull/1305) theme - toolbar white on white
  - [#1306](https://github.com/wix/ricos/pull/1306) theme - codeblock wiring
  - [#1307](https://github.com/wix/ricos/pull/1307) theme - mentions

### :house: Internal

- `plugins-bundle-analyzer`
  - [#1302](https://github.com/wix/ricos/pull/1302) converted analyzer to typescript

## 7.11.0 (Jun 30, 2020)

### :rocket: New Feature

- `polls` _alpha_
  - [#1290](https://github.com/wix/ricos/pull/1290) add plugin
- `text-selection-toolbar`
  - [#1233](https://github.com/wix/ricos/pull/1233) toolbar fixes, twitter design and remove viewer id
- `viewer`
  - [#1282](https://github.com/wix/ricos/pull/1282) Ad placeholder - support block type

### :bug: Bug Fix

- `text-color`
  - [#1279](https://github.com/wix/ricos/pull/1279) text & highlight color in mobile
- `image`
  - [#1277](https://github.com/wix/ricos/pull/1277) image with link in initial state
- `viewer`
  - [#1285](https://github.com/wix/ricos/pull/1285) text alignment with punctuation

### :house: Internal

- `common`
  - [#1288](https://github.com/wix/ricos/pull/1288) add changes for polls
- `editor-common`
  - [#1287](https://github.com/wix/ricos/pull/1287) add changes for polls
- `test-env`
  - [#1286](https://github.com/wix/ricos/pull/1286) update setSelection for Editor and Viewer

## 7.10.8 (Jun 28, 2020)

### :bug: Bug Fix

- `video`
  - [#1267](https://github.com/wix/ricos/pull/1267) Trim URL input
- `gallery`
  - [#1273](https://github.com/wix/ricos/pull/1273) gallery opens on correct image in rtl
- `mentions`
  - [#1275](https://github.com/wix/ricos/pull/1275) `onMentionClick` callback is called on viewer
- `common`
  - [#1274](https://github.com/wix/ricos/pull/1274) viewer text direction

### :house: Internal

- `general`
  - [#1256](https://github.com/wix/ricos/pull/1256) migrated from flow types to TypeScrip
- `editor-common`
  - [#1278](https://github.com/wix/ricos/pull/1278) support decoratorTrigger for composition mode

## 7.10.7 (Jun 21, 2020)

### :rocket: New Feature

- `adsense`
  - [#1179](https://github.com/wix/ricos/pull/1179) add adsense plugin

### :bug: Bug Fix

- `link-toolbar`
  - [#1238](https://github.com/wix/ricos/pull/1238) hover on url behavior
- `gallery`
  - [#1227](https://github.com/wix/ricos/pull/1227) gallery cursor is pointer when items are clickable
  - [#1225](https://github.com/wix/ricos/pull/1225) accepts only supported filetypes
- `image`
  - [#1241](https://github.com/wix/ricos/pull/1241) insert link to image will not close the toolbar
- `editor`
  - [#1243](https://github.com/wix/ricos/pull/1243) when pasting text with hyperlinks, spaces deleted
  - [#1252](https://github.com/wix/ricos/pull/1252) blur editor on esc keypress
- `ricos`
  - [#1257](https://github.com/wix/ricos/pull/1257) fix side toolbar's plus button alignment
- `editor` `viewer`
  - [#1242](https://github.com/wix/ricos/pull/1242) support normalize config with removeInvalidInlinePlugins

### :house: Internal

- `general`
  - [#1244](https://github.com/wix/ricos/pull/1244) support TypeScript in all packages
- `image`
  - [#1264](https://github.com/wix/ricos/pull/1264) loader for oneApp - 'loading' in component data

## 7.10.6 (Jun 14, 2020)

### :rocket: New Feature

- `ricos`
  - [#1214](https://github.com/wix/ricos/pull/1214) Modal API

### :bug: Bug Fix

- `ricos`
  - [#1229](https://github.com/wix/ricos/pull/1229) fix(rollup): reduce bundlesize on legacy child support
- `common`
  - [#1186](https://github.com/wix/ricos/pull/1186) block alignment with indentation
- `editor`
  - [#1190](https://github.com/wix/ricos/pull/1190) handle pasted text on atomic blocks keeps their entities

### :house: Internal

- `test-env`
  - [#1216](https://github.com/wix/ricos/pull/1216) complete ricos coverage of e2e tests
- `ricos-viewer`
  - [#1239](https://github.com/wix/ricos/pull/1239) functionality common to editor and viewer was moved to new package `ricos-common`

## 7.10.5 (Jun 9, 2020)

### :bug: Bug Fix

- `gallery`
  - [#1224](https://github.com/wix/ricos/pull/1224) bump pro gallery version to 1.10.21

## 7.10.4 (Jun 8, 2020)

### :bug: Bug Fix

- `gallery`
  - [#1221](https://github.com/wix/ricos/pull/1221) some layouts missing css. Regression from 7.9.1

## 7.10.3 (Jun 7, 2020)

### :bug: Bug Fix

- `common`
  - [#1181](https://github.com/wix/ricos/pull/1181) lists alignment
- `gallery`
  - [#1217](https://github.com/wix/ricos/pull/1217) some layouts missing css. Regression from 7.9.1

### :house: Internal

- `ricos`
  - [#1182](https://github.com/wix/ricos/pull/1182) UnitTest: child props must be equal both as wrapper and non-wrapper
  - [#1121](https://github.com/wix/ricos/pull/1121) fix JSS big warning in the console (classnames not found)
- `test-env`
  - [#1210](https://github.com/wix/ricos/pull/1210) ricos coverage of `rendering.e2e` and `renderingSsr.e2e`

## 7.10.2 (Jun 4, 2020)

fix bad release in 7.10.1

## 7.10.1 (Jun 4, 2020)

### :rocket: New Feature

- `editor-common`
  - [#1147](https://github.com/wix/ricos/pull/1147) error message with icon
- `video`
  - [#1175](https://github.com/wix/ricos/pull/1175) new design to video overlay in editor

### :bug: Bug Fix

- `headings`
  - [#1199](https://github.com/wix/ricos/pull/1199) change the tooltip of heading's button
- `gallery`
  - [#1168](https://github.com/wix/ricos/pull/1168) bump pro gallery version to 1.10.17
  - [#1206](https://github.com/wix/ricos/pull/1206) bump pro gallery version to 1.10.19
- `ricos-viewer`
  - [#1197](https://github.com/wix/ricos/pull/1197) mobile not working with static text toolbar
- `image`
  - [#1136](https://github.com/wix/ricos/pull/1136) loader for oneApp

### :house: Internal

- `test-env`
  - [#1195](https://github.com/wix/ricos/pull/1195) ricos coverage of `plugin-link-preview` and `plugin-html`

## 7.9.1 (Jun 2, 2020)

### :bug: Bug Fix

- `fullscreen`
  - [#1189](https://github.com/wix/ricos/pull/1189) image not centered when wrapped in rtl

## 7.9.0 (Jun 2, 2020)

### :rocket: New Feature

- `general`
  - [#1143](https://github.com/wix/ricos/pull/1143) Dynamic import to 'react-color'
  - [#1158](https://github.com/wix/ricos/pull/1158) Dynamic import to 'react-window' and DownShift

### :bug: Bug Fix

- `video`
  - [#1185](https://github.com/wix/ricos/pull/1185) close button in video selection modal on mobile
- `image plugin`
  - [#1148](https://github.com/wix/ricos/pull/1148) resize Image: change the manual minimum size of an image to 20px
- `ricos-viewer`
  - [#1149](https://github.com/wix/ricos/pull/1149) doesnt add internal ricos modal if child has modal
- `gallery`
  - [#1151](https://github.com/wix/ricos/pull/1151) item id had '.' in it. It's not handled well in the gallery
  - [#1167](https://github.com/wix/ricos/pull/1167) styles fix for chrome 83
- `video`
  - [#1134](https://github.com/wix/ricos/pull/1134) onVideoSelected didn't update data correctly
- `file-upload`
  - [#1087](https://github.com/wix/ricos/pull/1087) multiple files upload
- `html-plugin`
  - [#1169](https://github.com/wix/ricos/pull/1169) website url

### :house: Internal

- `storybook`
  - [#1176](https://github.com/wix/ricos/pull/1176) isMobile automatic determination
- `ricos`
  - [#1172](https://github.com/wix/ricos/pull/1172) ThemeStrategy throws error when Palette is given with missing colors
- `test-env`
  - [#1183](https://github.com/wix/ricos/pull/1183) ricos coverage of file-upload + rename from wrapper
  - [#1188](https://github.com/wix/ricos/pull/1188) fix link-preview `enableEmbed` on RicosTestApp

## 7.8.0 (May 25, 2020)

### :rocket: New Feature

- `headings`
  - [#901](https://github.com/wix/ricos/pull/901) adding plugin headings with dropdown option

### :bug: Bug Fix

- `ricos-viewer`
  - [#1132](https://github.com/wix/ricos/pull/1132) enable palettes in theme API
- `editor`
  - [#1137](https://github.com/wix/ricos/pull/1137) 'Enter' click preserves alignment style

### :house: Internal

- `editor-common`
  - [1054](https://github.com/wix/ricos/pull/1054) refactor calculateDiff

## 7.7.1 (May 21, 2020)

### :bug: Bug Fix

- `file`
  - [#1129](https://github.com/wix/ricos/pull/1129) file block not showing

## 7.7.0 (May 20, 2020)

### :rocket: New Feature

- `editor` `viewer`
  - [#1091](https://github.com/wix/ricos/pull/1091) add iframeSandboxDomain prop for iframe security
- `editor`
  - [#1041](https://github.com/wix/ricos/pull/1041) shift+tab click deletes tab character ('\t')
  - [#1065](https://github.com/wix/ricos/pull/1065) backspace click at start of block decrease indentation
  - [#1084](https://github.com/wix/ricos/pull/1084) external toolbar API added
- `wrapper`
  - [#1003](https://github.com/wix/ricos/pull/1003) RichContentWrapper was split into RicosEditor & RicosViewer
  - [#1115](https://github.com/wix/ricos/pull/1115) Improved RicosEditor API of getContent + onChange
- `viewer`
  - [#1093](https://github.com/wix/ricos/pull/1093) viewerAction callback in helpers is now supported, triggered on image expand (gallery & viewer)
  - [#1116](https://github.com/wix/ricos/pull/1116) renamed onViewerAction to onAction + order of arguments

### :bug: Bug Fix

- `wrapper` `viewer`
  - [#1101](https://github.com/wix/ricos/pull/1101) fix hashtag decorator in viewer
- `plugins`
  - [#1084](https://github.com/wix/ricos/pull/1084) svg icon id conflicts fixed
- `giphy`
  - [#1110](https://github.com/wix/ricos/pull/1110) giphy toolbar not showing after giphy is added
- `link-preview`
  - [#1048](https://github.com/wix/ricos/pull/1048) fix enable link preview and link embed by default
- `file-upload`
  - [#1082](https://github.com/wix/ricos/pull/1082) error handling fix
- `common`
  - [#1092](https://github.com/wix/ricos/pull/1092) text indentation not showing in rtl
- `toolbars`
  - [#1125](https://github.com/wix/ricos/pull/1125) atomic toolbars position in mobile
- `html plugin`
  - [#1126](https://github.com/wix/ricos/pull/1126) fix html iframe src height and remove html initial state

### :house: Internal

- `exampleApp`
  - [0f849222](https://github.com/wix/ricos/commit/0f849222) fix translations
  - [#1113](https://github.com/wix/ricos/pull/1113) fix: Tooltips don't render in the correct translations
- `storybook`
  - [#1003](https://github.com/wix/ricos/pull/1003) story for wrapper handling of static text toolbar
  - [#1084](https://github.com/wix/ricos/pull/1084) external plugin sidebar added
- `storybook`
  - [#1084](https://github.com/wix/ricos/pull/1084) initial intent example added
- `editor`
  - [#1078](https://github.com/wix/ricos/pull/1078) insert buttons at the beginning of the inline toolbar
- `editor` `viewer`
  - [#1090](https://github.com/wix/ricos/pull/1090) support normalize config with {disableInlineImages: false/true}
- `general`
  - [#1122](https://github.com/wix/ricos/pull/1122) Adding github action that updates the baselineBundleSizes after merge

## 7.6.1 (May 11, 2020)

### :bug: Bug Fix

- `editor-common`
  - [#1046](https://github.com/wix/ricos/pull/1046) cursor jumps to start of editor on close modal
- `editor`
  - [#1059](https://github.com/wix/ricos/pull/1059) fix getToolbarSettings Api to work

### :house: Internal

- `wrapper`
  - [#993](https://github.com/wix/ricos/pull/993) remove `!important` usage + deep merge jss styles
  - [#1031](https://github.com/wix/ricos/pull/1031) fixed build warning - "punycode" library

## 7.6.0 (May 5, 2020)

### :rocket: New Feature

- `indent`
  - [#898](https://github.com/wix/ricos/pull/898) text indentation
- `viewer`
  - [#1005](https://github.com/wix/ricos/pull/1005) add viewMode SEO to ProGallery

### :bug: Bug Fix

- `social-modals`
  - [#1037](https://github.com/wix/ricos/pull/1037) disable text input autocomplete
- `vertical embed`
  - [#1036](https://github.com/wix/ricos/pull/1036) dropdown for search opens automatically when typing text for search
- `gallery`
  - [#1020](https://github.com/wix/ricos/pull/1020) gallery accepts window as scrollingElement

## 7.5.0 (May 5, 2020)

### :rocket: New Feature

- `button`
  - [#958](https://github.com/wix/ricos/pull/958) action button plugin - button with onClick callback
- `plugin menu`
  - [#739](https://github.com/wix/ricos/pull/739) new plugin menu (side menu) with much better UX/UI for many plugins

### :bug: Bug Fix

- `video`
  - [#1004](https://github.com/wix/ricos/pull/1004) fix external video metadata
- `editor`
  - [#941](https://github.com/wix/ricos/pull/941) add tooltips for settings panels
- `preview`
  - [#999](https://github.com/wix/ricos/pull/999) giphy metadata is handled correctly by image and gallery data mergers
- `gallery`
  - [#1006](https://github.com/wix/ricos/pull/1006) expand icon appears only on hovered image

### :house: Internal

- `wrapper`
  - [#980](https://github.com/wix/ricos/pull/980) createEmpty import
  - [#983](https://github.com/wix/ricos/pull/983) fix custom inlineStyleMappers (viewer)
- `general`
  - [#982](https://github.com/wix/ricos/pull/982) `npm run watch` fixed to work concurrently with `flow` + `npm run e2e:debug` fixed to wait on serve ready
- `storybook`
  - [#958](https://github.com/wix/ricos/pull/958) Buttons story added (Action & Link buttons)

## 7.4.6 (May 3, 2020)

### :bug: Bug Fix

- `editor-common`
  - [#994](https://github.com/wix/ricos/pull/994) cursor doesn't disappear when adding plugin
- `gallery`
  - [#990](https://github.com/wix/ricos/pull/990) height not updating when changing width

### :house: Internal

- `wrapper`
  - [#980](https://github.com/wix/ricos/pull/980) createEmpty import
- `general`
  - [#965](https://github.com/wix/ricos/pull/965) fix: gitPRComment overrides the content of the PR comment
  - [#985](https://github.com/wix/ricos/pull/985) enable publishing with custom npm tag
  - [#988](https://github.com/wix/ricos/pull/988) Adding 'build:analyze:viewer' and 'build:analyze:editor' scripts instead of 'build:analyze' script

## 7.4.5 (Apr 28, 2020)

### :rocket: New Feature

- `image` `video`
  - [#972](https://github.com/wix/ricos/pull/972) handle upload error - show message on block

### :bug: Bug Fix

- `editor`
  - [#951](https://github.com/wix/ricos/pull/951) fix: tooltip opacity
  - [#957](https://github.com/wix/ricos/pull/957) fix: command+ctrl+j creates code block on mac
- `map`
  - [#959](https://github.com/wix/ricos/pull/959) modal settings fixed (convention) & made compatible with wrapper palette colors
- `emoji`
  - [#973](https://github.com/wix/ricos/pull/973) was using old editor and editor-common dependencies
- `video`
  - [#974](https://github.com/wix/ricos/pull/960) video file upload not working when block isn't selected
- `gallery`
  - [#963](https://github.com/wix/ricos/pull/963) fix:Gallery doesn't show more then 3 images on load

### :house: Internal

- `editor`
  - [#936](https://github.com/wix/ricos/pull/936) arrangement of inline toolbar buttons
- `wrapper`
  - [#956](https://github.com/wix/ricos/pull/956) bi getData will now contain `forPublish` argument
  - [#966](https://github.com/wix/ricos/pull/966) passing RCE/RCV to wrapper is no longer required
  - [#975](https://github.com/wix/ricos/pull/975) ssr fix - render suspense after mount
  - [#977](https://github.com/wix/ricos/pull/977) wrapper exports its type declarations
- `preview`
  - [#962](https://github.com/wix/ricos/pull/962) interactions improved; read-more displays html

## 7.3.5 (Apr 21, 2020)

### :bug: Bug Fix

- `plugin-emoji`
  - [#948](https://github.com/wix/ricos/pull/948) es5 `const` in react-icons node module. Extract the needed icons and removed the dependency on 'react-icons'
- `map`
  - [#939](https://github.com/wix/ricos/pull/939) Map Settings: dynamic style replaced with theme
- `editor`
  - [#917](https://github.com/wix/ricos/pull/917) add tooltips for drop down buttons

### :house: Internal

- `general`
  - [#927](https://github.com/wix/ricos/pull/927) Adding GitHub action that compares and fails if one of the current bundle sizes grows more then 5KB

## 7.3.4 (Apr 21, 2020)

### :house: Internal

- `editor`
  - [#912](https://github.com/wix/ricos/pull/912) publish api
- `wrapper`
  - [#912](https://github.com/wix/ricos/pull/912) onChange handle inside wrapper
- `editor-common`
  - [#912](https://github.com/wix/ricos/pull/912) getPostContentSummary updated

### :bug: Bug Fix

- `code-block`
  - [#943](https://github.com/wix/ricos/pull/943) Adding code block with backward direction of selection
- `giphy`
  - [#945](https://github.com/wix/ricos/pull/945) Restore auto-focus after add giphy

### :house: Internal

- `wrapper`
  - [#931](https://github.com/wix/ricos/pull/931) added internal static toolbar support

## 7.3.3 (Apr 20, 2020)

### :bug: Bug Fix

- `viewer`
  - [#929](https://github.com/wix/ricos/pull/929) fix: empty lists viewer issues

### :rocket: New Feature

- `viewer`
  - [#908](https://github.com/wix/ricos/pull/908) Support Viewer predefined anchors

### :house: Internal

- `vertical-embed`
  - [#728](https://github.com/wix/ricos/pull/728) Vertical Embed Plugin - alpha verison
- `wrapper`
  - [#935](https://github.com/wix/ricos/pull/935) back-office theme will appear as default theme for now

## 7.3.2 (Apr 16, 2020)

### :bug: Bug Fix

- `link-preview`
  - [#924](https://github.com/wix/ricos/pull/924) disable link preview/embed when entered inside a list

## 7.3.1 (Apr 15, 2020)

### :bug: Bug Fix

- `editor-common`
  - [#913](https://github.com/wix/ricos/pull/913) onChange - calculateDiff is debounced, for better performance
- `viewer`
  - [#923](https://github.com/wix/ricos/pull/923) fix: inline styles in lists breaking viewer

### :house: Internal

- `wrapper`
  - [#919](https://github.com/wix/ricos/pull/919) added internal mobile support
  - [#920](https://github.com/wix/ricos/pull/920) refactor: `FullscreenRenderer.tsx`, `ModalRenderer.tsx`
  - [#918](https://github.com/wix/ricos/pull/918)
    - viewer is now re-rendered for new initialState prop (fix)
- `storybook`
  - [#918](https://github.com/wix/ricos/pull/918)
    - hotfix (`editor` prop replaced with `isEditor`)
    - live example app (viewer + editor side by side)
    - live example app in palettes page

## 7.3.0 (Apr 13, 2020)

### :rocket: New Feature

- `list`
  - [#815](https://github.com/wix/ricos/pull/815) nested lists
- `editor`
  - [#906](https://github.com/wix/ricos/pull/906) editor supports entering tab character ('\t') by clicking on tab
- `theme + wrapper: gallery, plugins & modals`
  - [#828](https://github.com/wix/ricos/pull/828) style update related to a lot of components + wrapper compatibility.

### :bug: Bug Fix

- `preview`
  - [#903](https://github.com/wix/ricos/pull/903) gallery fixed; resize flapping fixed
- `gallery`
  - [#909](https://github.com/wix/ricos/pull/909) gallery size
- `editor`
  - [#914](https://github.com/wix/ricos/pull/914) updating tooltips keys

### :house: Internal

- `wrapper`
  - [#907](https://github.com/wix/ricos/pull/907) converted `wix-rich-content-wrapper` to typescript

## 7.2.0 (Apr 8, 2020)

### :rocket: New Feature

- `link`
  - [#750](https://github.com/wix/ricos/pull/750) link toolbar

### :bug: Bug Fix

- `gallery`
  - [#879](https://github.com/wix/ricos/pull/879) gallery size - regression from #879
  - [#872](https://github.com/wix/ricos/pull/872) fix: gallery sliders css in mozilla firefox
- `plugins`
  - [#778](https://github.com/wix/ricos/pull/880) fix focus on plugins insert buttons click
- `link`
  - [#904](https://github.com/wix/ricos/pull/904) fix saving data of "target" and "rel" link(the checkboxes in Link Panel)
  - [#902](https://github.com/wix/ricos/pull/902) mobile - cancel in link panel changed the cursor
- 'editor'
  - [#894](https://github.com/wix/ricos/pull/894) text position after enter & disable paste text with style CODE

### :house: Internal

- `storybook`
  - [#891](https://github.com/wix/ricos/pull/891) fixed textHighlightPlugin color (intro.js)
- `general`
  - [#905](https://github.com/wix/ricos/pull/905) refactor - remove getConfigByFormFactor.js

## 7.1.5 (Apr 4, 2020)

### :bug: Bug Fix

- `gallery`
  - [#879](https://github.com/wix/ricos/pull/879) blurry pictures & not rendering
  - [#877](https://github.com/wix/ricos/pull/877) fix gallery plugin blurry pictures
- `link-preview`
  - [#871](https://github.com/wix/ricos/pull/871) maxwidth
- `general`
  - [#889](https://github.com/wix/ricos/pull/889) fix all plugins max-width for inline size

### :house: Internal

- `general`
  - [#878](https://github.com/wix/ricos/pull/878) added git comment to pr's containing surge-examples url's

## 7.1.4 (Apr 2, 2020)

### :rocket: New Feature

- `html`
  - [#868](https://github.com/wix/ricos/pull/868) save on click outside in html plugin
- `embed`
  - [#689](https://github.com/wix/ricos/pull/689) embed for supported links

### :bug: Bug Fix

- `editor-common`
  - [#547](https://github.com/wix/ricos/pull/547) accessibility issue fixed: focus on hidden elements when tab-clicking
  - [#873](https://github.com/wix/ricos/pull/873) fix: ctrl/command support in win/osx
- `viewer`
  - [#867](https://github.com/wix/ricos/pull/867) contextual props are passed to interactions

### :house: Internal

- `emoji`
  - [#870](https://github.com/wix/ricos/pull/870) reduce the bundle size of plugin emoji

## 7.1.3 (Mar 30, 2020)

### :bug: Bug Fix

- `general`
  - [#843](https://github.com/wix/ricos/pull/843) fix: mouse up event on overlay triggered the closing the modals
- `editor`
  - [#862](https://github.com/wix/ricos/pull/862) fix inline resize reset on reload of editor
- `image`
  - [#853](https://github.com/wix/ricos/pull/853) Image Original Size for images of width 350px and above

### :house: Internal

- `examples`
  - [#850](https://github.com/wix/ricos/pull/850) fix performance
  - [#850](https://github.com/wix/ricos/pull/850) save content to local storage
- `wrapper`
  - [#852](https://github.com/wix/ricos/pull/852) strategies create configs & not functions
- `viewer`
  - [#861](https://github.com/wix/ricos/pull/861) text direction util improved; tests added
  - [#846](https://github.com/wix/ricos/pull/846) switch to forked redraft (`wix-redraft`)
- `e2e`
  - [#860](https://github.com/wix/ricos/pull/860) Images original size test

## 7.1.2 (Mar 25, 2020)

### :rocket: New Feature

- `html`
  - [#826](https://github.com/wix/ricos/pull/826) initial state for html plugin
- `gallery`
  - [#833](https://github.com/wix/ricos/pull/833) elipsis for too long image titles

### :house: Internal

- `gallery`
  - [#833](https://github.com/wix/ricos/pull/833) using alt property instead of title for altText fixes mobile titles

### :bug: Bug Fix

- `link-preview`
  - [#841](https://github.com/wix/ricos/pull/841) link preview fixes
- `fullscreen`
  - [#842](https://github.com/wix/ricos/pull/842) itemId for legacy image type

## 7.1.1 (Mar 25, 2020)

### :house: Internal

- `wrapper`
  - jss dependencies as external to resolve cjs issue

## 7.1.0 (Mar 25, 2020)

### :rocket: New Feature

- `code-block`
  - [#827](https://github.com/wix/ricos/pull/827) selection starts in the block
- `link-preview`
  - [#653](https://github.com/wix/ricos/pull/653) add link preview

### :bug: Bug Fix

- `text-color`
  - [#805](https://github.com/wix/ricos/pull/805) adding a text color/highlight works on mobile
- `plugins`
  - [#778](https://github.com/wix/ricos/pull/778) fix sizeFullWidth
- `common`
  - [#814](https://github.com/wix/ricos/pull/814) fix: adding support for H4, H5, H6
- `viewer`
  - [#832](https://github.com/wix/ricos/pull/832) fix emoji in rtl
- `editor`
  - [d486af87](https://github.com/wix/ricos/commit/d486af87) fix plain text paste
  - [#790](https://github.com/wix/ricos/pull/790) convertToRaw - block.data converted correctly, Fixes line spacing
  - [#820](https://github.com/wix/ricos/pull/820) remove custom getBlockRenderMap.js (mobile fix)
- `fullscreen`
  - [#830](https://github.com/wix/ricos/pull/830) expand button always appears on hover
- `editor-common`
  - [#829](https://github.com/wix/ricos/pull/829) replace draft-js w/ @wix/draft-js

### :house: Internal

- `general`
  - [#720](https://github.com/wix/ricos/pull/720) mobile example app styles issues
  - [#835](https://github.com/wix/ricos/pull/835) 'fullwidth' fixed in example on ipad
- `wrapper`
  - [#817](https://github.com/wix/ricos/pull/817) bugfix: removed override of props
  - [#810](https://github.com/wix/ricos/pull/810) added palettes & fixed toolbarButton color
  - [#818](https://github.com/wix/ricos/pull/818) bugfix: inlineStyleMappers - removed empty typeMappers + improved storybook example
  - [#819](https://github.com/wix/ricos/pull/819) improve: replaced "aphrodite" with "jss"
  - [#822](https://github.com/wix/ricos/pull/822) ssr fix - render suspense only after component is imported
  - [#816](https://github.com/wix/ricos/pull/816) wrapper theme: gallery settings modal
- `e2e`
  - [#795](https://github.com/wix/ricos/pull/795) new images-sizes fixture
  - [#759](https://github.com/wix/ricos/pull/759) adding tests for emoji plugin (in rtl and plugins tests)

## 7.0.2 (Mar 20, 2020)

### :house: Internal

- `wrapper`
  - [#804](https://github.com/wix/ricos/pull/804) engine-wrapper refactored
  - [#806](https://github.com/wix/ricos/pull/806) locale dynamic import
  - [#807](https://github.com/wix/ricos/pull/807) include common styles in styles.min.css
  - [#709](https://github.com/wix/ricos/pull/709) support inlineStyleMappers
- `editor-common`
  - `convertFromHTML` exposed for Forum usage

## 7.0.1 (Mar 18, 2020)

### :house: Internal

- `editor`
  - [#801](https://github.com/wix/ricos/pull/801) `editorStateConversion.js` consume `draft-js` directly to prevent bundle bloat of lib

## 7.0.0 (Mar 17, 2020)

### :boom: Breaking Change

- `editor`
  - [#752](https://github.com/wix/ricos/pull/752) Move draft-js to dependency from peerDependency [Migration Detials](https://github.com/wix/ricos/wiki/RCE-V.7-Migration-Guide)

### :rocket: New Feature

- `fullscreen`
  - [#776](https://github.com/wix/ricos/pull/776) fullscreen closes on Esc key press

### :bug: Bug Fix

- `gallery`
  - [#775](https://github.com/wix/ricos/pull/775) adding videos to gallery
