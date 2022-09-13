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

</details>

## 8.72.65 (Sep 13, 2022)

## :bug: Bug Fix

- `ricos-plugins`
  - [#4592](https://github.com/wix/ricos/pull/4592) external insert plugins toolbar support toolbar settings
- `ricos schema ricos content`
  - [#4475](https://github.com/wix/ricos/pull/4475) add `source: 'HTML | ADSENSE` property to html schema

## 8.72.64 (Sep 13, 2022)

## :house: Internal

- `ricos-editor`
  - [#4613](https://github.com/wix/ricos/pull/4613) `injectedContent` support in tiptap

## 8.72.63 (Sep 12, 2022)

## :bug: Bug Fix

- `table`
  - [#4603](https://github.com/wix/ricos/pull/4603) add colorPicker modal

## 8.72.62 (Sep 11, 2022)

## :house: Internal

- `ricos-editor`
  - [#4595](https://github.com/wix/ricos/pull/4595) `rceNext` prop

## :bug: Bug Fix

- `html`
  - [#4604](https://github.com/wix/ricos/pull/4604) change from html code to html url
- `collapsible-list`
  - [#4605](https://github.com/wix/ricos/pull/4605) drag & drop handler

## 8.72.61 (Sep 11, 2022)

## :bug: Bug Fix

- `image`
  - [#4599](https://github.com/wix/ricos/pull/4599) fix accessibility prop for non-interactive image
- `button`
  - [#4598](https://github.com/wix/ricos/pull/4598) fix text alignment for mobile
- `button`
  - [#4600](https://github.com/wix/ricos/pull/4600) fix letters cut off
- `tiptap-button`
  - [#4600](https://github.com/wix/ricos/pull/4600) fix editor crash when press enter inside button settings

## 8.72.60 (Sep 07, 2022)

## :bug: Bug Fix

- `tiptap-extensions`
  - [#4587](https://github.com/wix/ricos/pull/4587) anchor - add offset when scrolling to anchor
- `gallery`
  - [#4593](https://github.com/wix/ricos/pull/4593) add timeout between uploads
- `ricos-content-query`
  - [#4586](https://github.com/wix/ricos/pull/4586) fix getAnchorableNodesQuery duplicate nodes (blockquote + paragraph)

## :nail_care: Polish

- `tiptap-editor`
  - [#4589](https://github.com/wix/ricos/pull/4589) support setting modals zIndex by theme API

## 8.72.59 (Sep 07, 2022)

## :bug: Bug Fix

- `tiptap-extensions`
  - [#4584](https://github.com/wix/ricos/pull/4584) fix link & anchor inline style
- `toolbar-modals`
  - [#4585](https://github.com/wix/ricos/pull/4585) add heading one thumbnail in anchor panel
- `image gallery file-upload`
  - [#4590](https://github.com/wix/ricos/pull/4590) deep copy files before uploading (safari multiple upload fix)

## 8.72.58 (Sep 06, 2022)

## :bug: Bug Fix

- `gallery`
  - [#4580](https://github.com/wix/ricos/pull/4580) toolbar upload button accepted files fix
- `editor`
  - [#4583](https://github.com/wix/ricos/pull/4583) error toast unsupported error key fallbacks to error message

## 8.72.57 (Sep 06, 2022)

## :bug: Bug Fix

- `common-plugins`
  - [#4553](https://github.com/wix/ricos/pull/4553) support individual alignment buttons in external toolbar
- `plugin-headings`
  - [#4565](https://github.com/wix/ricos/pull/4565) support title button in external toolbar
- `gallery`
  - [#4576](https://github.com/wix/ricos/pull/4576) fix safari multiple image upload tiptap

## 8.72.56 (Sep 06, 2022)

## :bug: Bug Fix

- `ricos-modals/toolbars-v3`
  - [#4573](https://github.com/wix/ricos/pull/4573) fix modals outline style and refactor editLinkButton active indicator

## 8.72.55 (Sep 05, 2022)

## :house: Internal

- `tiptap-extensions`
  - skipContentDiff key added (#4577)

## 8.72.54 (Sep 5, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4541](https://github.com/wix/ricos/pull/4541) add missing locale prop
- `image`
  - [#4570](https://github.com/wix/ricos/pull/4570) remove edit image button on mobile tiptap
- `collapsible-list`
  - [#4572](https://github.com/wix/ricos/pull/4572) collapsible list default direction by `languageDir` on tiptap

## 8.72.53 (Sep 5, 2022)

## :bug: Bug Fix

- `gallery`
  - [#4568](https://github.com/wix/ricos/pull/4568) fix video upload and loading state tiptap
- `ricos-styles`
  - [#4567](https://github.com/wix/ricos/pull/4567) preprocess text style (line-height)
- `ricos-editor`
  - [#4558](https://github.com/wix/ricos/pull/4558) editor height with toolbars positions (footer)

## 8.72.52 (Sep 5, 2022)

## :house: Internal

- `wix-image`
  - [#4566](https://github.com/wix/ricos/pull/4566) @wix/image upgrade 1.42.0

## :bug: Bug Fix

- `ricos-modals`
  - [#4562](https://github.com/wix/ricos/pull/4562) fix popover and toolbar modal height

## :nail_care: Polish

- `plugin-toolbar`
  - [#4559](https://github.com/wix/ricos/pull/4559) refactor plugin toolbar active button

## 8.72.51 (Sep 4, 2022)

## :nail_care: Polish

- `editor`
  - [#4550](https://github.com/wix/ricos/pull/4550) support external container scrolling element

## :bug: Bug Fix

- `ricos-content`
  - [#4540](https://github.com/wix/ricos/pull/4540) CKEditor/parser adds color rules, supports `u`, `em`
- `button/divider`
  - [#4557](https://github.com/wix/ricos/pull/4557) fix plugin toolbar buttons visibility on mobile

## 8.72.50 (Sep 2, 2022)

## :bug: Bug Fix

- `ricos-plugins`
  - [#4547](https://github.com/wix/ricos/pull/4547) external buttons names

## 8.72.49 (Sep 1, 2022)

## :bug: Bug Fix

- `ricos-plugins`
  - [#4546](https://github.com/wix/ricos/pull/4546) external plugins label translation

## 8.72.48 (Sep 1, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4545](https://github.com/wix/ricos/pull/4545) fix prosemirror height

## 8.72.47 (Sep 1, 2022)

## :bug: Bug Fix

- `divider`
  - [#4539](https://github.com/wix/ricos/pull/4539) fix DoubleLine icon color and height
- `text-color`
  - [#4543](https://github.com/wix/ricos/pull/4543) text/highlight color current color
- `line-spacing`
  - [#4544](https://github.com/wix/ricos/pull/4544) line spacing indicator

## 8.72.46 (Sep 1, 2022)

## :bug: Bug Fix

- `tiptap-editor`
  - [#4522](https://github.com/wix/ricos/pull/4522) editor missing padding in mobile + remove image sizing handles on mobile

## 8.72.45 (Sep 1, 2022)

## :bug: Bug Fix

- `tiptap-extensions`
  - [#4501](https://github.com/wix/ricos/pull/4501) remove attrs & marks after update doc style
- `text-color`
  - [#4501](https://github.com/wix/ricos/pull/4501) text/highlight color close modal

## :house: Internal

- `ricos-editor`
  - [#4537](https://github.com/wix/ricos/pull/4537) remove footer placeholder when should create false
- `ricos-styles`
  - [#4536](https://github.com/wix/ricos/pull/4536) theme & document style update event

## 8.72.44 (Aug 31, 2022)

## :bug: Bug Fix

- `ricos-plugins/toolbars-ui`
  - [#4533](https://github.com/wix/ricos/pull/4533) fix a11y outline indicator
- `theme`
  - [#4534](https://github.com/wix/ricos/pull/4534) fix bizMgr disabled button theme

## 8.72.43 (Aug 31, 2022)

## :house: Internal

- `image`
  - [#4532](https://github.com/wix/ricos/pull/4532) @wix/image upgrade 1.40.0

## 8.72.42 (Aug 30, 2022)

## :bug: Bug Fix

- `mention`
  - [#4529](https://github.com/wix/ricos/pull/4529) fix backspace bug
- `mention`
  - [#4526](https://github.com/wix/ricos/pull/4526) fix triggerDecoration command
- `ricos-plugins`
  - [#4524](https://github.com/wix/ricos/pull/4524) fix size, alignment & separator buttons visibility on mobile
- `video`
  - [#4525](https://github.com/wix/ricos/pull/4525) add missing enableCustomUploadOnMobile prop

## 8.72.41 (Aug 30, 2022)

## :bug: Bug Fix

- `mention`
  - [#4523](https://github.com/wix/ricos/pull/4523) fix handleMentionClose callback
- `tiptap-style-extension`
  - [#4520](https://github.com/wix/ricos/pull/4520) fix original size
- `tiptap-textWrap`
  - [#4513](https://github.com/wix/ricos/pull/4513) consider textWrap api

## 8.72.40 (Aug 29, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4490](https://github.com/wix/ricos/pull/4490) footer toolbar modal buttons close modal on double click
- `gallery`
  - [#4491](https://github.com/wix/ricos/pull/4491) fix layout selector modal selected state

## 8.72.37 (Aug 25, 2022)

## :bug: Bug Fix

- `plugin-toolbar`
  - [#4468](https://github.com/wix/ricos/pull/4468) fix active icon colors
- `spoiler`
  - [#4467](https://github.com/wix/ricos/pull/4467) fix default description on tiptap
- `collapsible-list`
  - [#4465](https://github.com/wix/ricos/pull/4465) prevent dropping list items outside of lists (editor crash fix)
  - [#4478](https://github.com/wix/ricos/pull/4478) fix tiptap list dimensions and overflow
- `toolbars-ui`
  - [#4473](https://github.com/wix/ricos/pull/4473) fix pluginMenuButton gap
- `toolbars-ui`
  - [#4481](https://github.com/wix/ricos/pull/4481) fix plugin toolbar icon sizes
- `ricos-plugins`
  - [#4482](https://github.com/wix/ricos/pull/4482) fix external formatting toolbar buttons obj name
- `divider`
  - [#4483](https://github.com/wix/ricos/pull/4483) fix defaults on tiptap
- `divider`
  - [#4487](https://github.com/wix/ricos/pull/4487) fix disabled button & fullWidth when aligned
- `audio`
  - [#4489](https://github.com/wix/ricos/pull/4489) add tags on upload

## 8.72.36 (Aug 24, 2022)

- `divider/image`
  - [#4461](https://github.com/wix/ricos/pull/4461) fix divider size selection state & replaced image toolbar edit icon
- `ricos-plugins`
  - [#4462](https://github.com/wix/ricos/pull/4462) fix insert anchor command

## :house: Internal

- `storybook`
  - [#4460](https://github.com/wix/ricos/pull/4460) add tiptap inside container story
- `ricos-plugins`
  - [#4456](https://github.com/wix/ricos/pull/4456) external buttons modals open according to layout (drawer/popover/dialog)

## 8.72.35 (Aug 24, 2022)

## :bug: Bug Fix

- `ricos-styles`
  - [#4458](https://github.com/wix/ricos/pull/4458) bold decoration font weight string parse

## 8.72.34 (Aug 23, 2022)

## :bug: Bug Fix

- `ricos-common-plugins`
  - [#4449](https://github.com/wix/ricos/pull/4449) fix bold & italic toogles (command & bi)

## 8.72.33 (Aug 21, 2022)

## :bug: Bug Fix

- `ricos-plugins`
  - [#4442](https://github.com/wix/ricos/pull/4442) external formatting toolbar onClick
  - [#4447](https://github.com/wix/ricos/pull/4447) fix link toolbar button config
- `video`
  - [#4448](https://github.com/wix/ricos/pull/4448) resolve settings button visibility when there is no spoiler

## 8.72.32 (Aug 21, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4428](https://github.com/wix/ricos/pull/4428) remove fallback config from FloatingAddPluginMenu
- `modal-service`
  - [#4427](https://github.com/wix/ricos/pull/4427) modals re-renders on content changes
- `gallery`
  - [#4419](https://github.com/wix/ricos/pull/4419) add modal button option

## 8.72.31 (Aug 21, 2022)

## :bug: Bug Fix

- `ricos-editor`
  - [#4428](https://github.com/wix/ricos/pull/4428) remove fallback config from FloatingAddPluginMenu
- `ricos-editor`
  - [#4429](https://github.com/wix/ricos/pull/4429) updateBlock command fix
- `mentions`
  - [#4430](https://github.com/wix/ricos/pull/4430) fix mention crash & mismatch transaction error
- `tiptap-floating-panels`
  - [#4431](https://github.com/wix/ricos/pull/4431) fix floating panels zIndex
- `gallery/polls/toolbars-ui`
  - [#4433](https://github.com/wix/ricos/pull/4433) use new plugin toolbar icons

## 8.72.30 (Aug 21, 2022)

## :bug: Bug Fix

- `toolbars-v3`
  - [#4420](https://github.com/wix/ricos/pull/4420) wire footer-toolbar icon colors
- `ricos-schema`
  - [#4403](https://github.com/wix/ricos/pull/4403) support html `isAdsense` property

## 8.72.29 (Aug 18, 2022)

## :bug: Bug Fix

- `wix-image`
  - [#4416](https://github.com/wix/ricos/pull/4416) fix dimensions for an image file

## 8.72.28 (Aug 18, 2022)

## :bug: Bug Fix

- `font-size`
  - [#4413](https://github.com/wix/ricos/pull/4413) setFontSizeWithoutFocus missing command

## :house: Internal

- `font-size`
  - [#4369](https://github.com/wix/ricos/pull/4369) font size modal service registration (font size triggers button click bi)
- `ricos-common-plugins`
  - [#4413](https://github.com/wix/ricos/pull/4413) editor command insertDecoration with shouldFocus prop (mobile)
- `ricos-common-plugins`
  - [#4418](https://github.com/wix/ricos/pull/4418) title triggers button click bi
- `text-color`
  - [#4415](https://github.com/wix/ricos/pull/4415) text color modal in text buttons

## 8.72.27 (Aug 18, 2022)

## :bug: Bug Fix

- `mentions`
  - [#4411](https://github.com/wix/ricos/pull/4411) fix id attribute
- `link-preview`
  - [#4412](https://github.com/wix/ricos/pull/4412) fix links without preview bug

## 8.72.26 (Aug 17, 2022)

## :bug: Bug Fix

- `audio/html`

  - [#4406](https://github.com/wix/ricos/pull/4406) fix edit plugin-toolbar button (tiptap)

## :house: Internal

- `audio`
  - [#4409](https://github.com/wix/ricos/pull/4409) refactor audioSettings uploads

## 8.72.25 (Aug 17, 2022)

## :bug: Bug Fix

- `toolbars-v3`
  - [#4398](https://github.com/wix/ricos/pull/4398) (tiptap)
- `plugin-video`
  - [#4400](https://github.com/wix/ricos/pull/4400) close upload modal on custom upload
- `ricos-plugins`
  - [#4401](https://github.com/wix/ricos/pull/4401) alignment command does not override custom size

## :house: Internal

- `*`

  - [#4397](https://github.com/wix/ricos/pull/4397) remove prosemirror resolutions

## 8.72.24 (Aug 16, 2022)

## :bug: Bug Fix

- `toolbars-v3`
  - [#4386](https://github.com/wix/ricos/pull/4386) ((fix): toolbar static was hidden if container was floating
  - [#4384](https://github.com/wix/ricos/pull/4384) (fix): line spacing indicator in list
  - [#4379](https://github.com/wix/ricos/pull/4379) wire add plugin menu plus button
  - [#4383](https://github.com/wix/ricos/pull/4383) (fix): alignment/spacing resets each other
  - [#4390](https://github.com/wix/ricos/pull/4390) custom headings panel reset to default
- `audio/video`
  - [#4377](https://github.com/wix/ricos/pull/4377) fix nodId creation
- `tiptap-editor`
  - [#4387](https://github.com/wix/ricos/pull/4387) has inline style editor command
- `gallery`
  - [#4389](https://github.com/wix/ricos/pull/4389) fix gallery settings tiptap replace media index

## :house: Internal

- `social-polls`
  - [#4375](https://github.com/wix/ricos/pull/4375) fix tiptap image uploads
- `toolbars-ui`
  - [#4385](https://github.com/wix/ricos/pull/4385) add text & icon support to ToolbarButton

## 8.72.23 (Aug 14, 2022)

## :bug: Bug Fix

- `internal`
  - [#4368](https://github.com/wix/ricos/pull/4368) android enter fix
- `toolbars-v3`
  - [#4351](https://github.com/wix/ricos/pull/4351) opening modals triggers scrolling to top
  - [#4353](https://github.com/wix/ricos/pull/4353) fix mobile keyboard in modal buttons
- `wix-image`
  - [#4373](https://github.com/wix/ricos/pull/4373) log seoMode flag only on SSR or on debug mode

## :house: Internal

- `ricos-common`
  - [#4370](https://github.com/wix/ricos/pull/4370) UploadService events

## 8.72.22 (Aug 11, 2022)

## :bug: Bug Fix

- `toolbars-v3`
  - [#4350](https://github.com/wix/ricos/pull/4350) fix createToolbar condition
- `audio`
  - [#4352](https://github.com/wix/ricos/pull/4352) fix audio settings upload
- `divider`
  - [#4366](https://github.com/wix/ricos/pull/4366) fix size resolver
- `wix-image`
  - [#4363](https://github.com/wix/ricos/pull/4363) fix aspect ratio for Safari < 15 & remove placeholderTransition on seoMode

## :house: Internal

- `general`
  - [#4362](https://github.com/wix/ricos/pull/4364) font size in dropdown for header (#4362)
  - [#4364](https://github.com/wix/ricos/pull/4364) (fix): UI - toolbar respond faster (#4364)
  - [#4348](https://github.com/wix/ricos/pull/4348) debug-mode prop added to RicosEditor (tiptap)
- `gallery`
  - [#4346](https://github.com/wix/ricos/pull/4346) changling layout doesnt remove focus (tiptap)
- `link-preview`
  - [#4347](https://github.com/wix/ricos/pull/4347) social-embed toolbar buttons
- `plugin-commons`
  - [#4344](https://github.com/wix/ricos/pull/4344) fix custom `selectedNode` attribute resolver

## 8.72.21 (Aug 08, 2022)

## :bug: Bug Fix

- `toolbars-modals`
  - [#4345](https://github.com/wix/ricos/pull/4345) libs package.json entry

## 8.72.20 (Aug 05, 2022)

## :house: Internal

- `ricos-schema`
  - [#4289](https://github.com/wix/ricos/pull/4289) Tiptap modals UI html height button default values
- `ricos-modals`
  - [#4341](https://github.com/wix/ricos/pull/4341) fix ricos modals a111y behavior

## :bug: Bug Fix

- `toolbars-v3`
  - [#4328](https://github.com/wix/ricos/pull/4328) custom heading fonts fixes
  - [#4287](https://github.com/wix/ricos/pull/4287) focus on/off formatting toolbar shortcut (tiptap)
- `plugin-toolbar`
  - [#4336](https://github.com/wix/ricos/pull/4336) fix plugin toolbar a11y
- `mentions`
  - [#4329](https://github.com/wix/ricos/pull/4329) add id to schema

## :house: Internal

- `ricos-modals`
  - [#4325](https://github.com/wix/ricos/pull/4325) a11y close modals on esc click
- `ricos-plugins`
  - [#4331](https://github.com/wix/ricos/pull/4331) translate `pluginAddButton` tooltip
- `collapsible-list`
  - [#4317](https://github.com/wix/ricos/pull/4317) fix settings functionality tiptap
- `image`
  - [#4333](https://github.com/wix/ricos/pull/4333) fix tiptap `wixImage`
- `tiptap-extensions`
  - [#4335](https://github.com/wix/ricos/pull/4353) `dropcursor` extension theme wiring

## 8.72.19 (Aug 04, 2022)

## :bug: Bug Fix

- `toolbars-ui`
  - [#4284](https://github.com/wix/ricos/pull/4284) fix dropdown button selection state
- `ricos-modals`
  - [#4268](https://github.com/wix/ricos/pull/4268) fix insert & settings modals a11y on tiptap
- `toolbars-v3`

  - [#4314](https://github.com/wix/ricos/pull/4314) headings modal breaks with no focus in static toolbar

- `wix-image`
  - [#4326](https://github.com/wix/ricos/pull/4326) bump wow image version

## :house: Internal

- `orchestrator`
  - [#4321](https://github.com/wix/ricos/pull/4321) some BI callbacks subscribed to events
  - [#4321](https://github.com/wix/ricos/pull/4321) button click bi for formatting (inline,static,external,mobile) - no modal buttons yet
- `toolbars-v3`
  - [#4313](https://github.com/wix/ricos/pull/4313) Toolbars aggregate
  - [#4316](https://github.com/wix/ricos/pull/4316) External, Mobile & Inline Toolbars triggers buttonClick event
- `general`
  - [#4319](https://github.com/wix/ricos/pull/4319) insert all plugins with `insertBlockWithBlankLines`
- `file-upload`
  - [#4324](https://github.com/wix/ricos/pull/4324) merge `autoDownloadLinkRef` experiment

## 8.72.18 (Aug 03, 2022)

## :bug: Bug Fix

- `plugin-commons/ui-components`
  - [#4312](https://github.com/wix/ricos/pull/4312) add focus to colorPicker input & fix TextInput bizMgr styles

## :house: Internal

- `orchestrator`
  - [#4304](https://github.com/wix/ricos/pull/4304) Editor Entity
  - [#4300](https://github.com/wix/ricos/pull/4300) Event Source API
  - [#4311](https://github.com/wix/ricos/pull/4311) Editor Entity implements Event Source API

## 8.72.17 (Aug 01, 2022)

- `image-plugin`
  - [#4307](https://github.com/wix/ricos/pull/4307) wix-image cleanup console log

## 8.72.16 (Aug 01, 2022)

## :bug: Bug Fix

- `divider`
  - [#4297](https://github.com/wix/ricos/pull/4297) fix divider convertor & tiptap command toolbar commands

## :house: Internal

- `collapsible-list`
  - [#4276](https://github.com/wix/ricos/pull/4276) toolbar buttons and position

## 8.72.15 (Jul 31, 2022)

## :bug: Bug Fix

- `image-plugin`
  - [#4296](https://github.com/wix/ricos/pull/4296) pass isSeoBot prop to wixImage component

## :house: Internal

- `general`
  - [#4292](https://github.com/wix/ricos/pull/4292) general cleanup (redundant deps, tests, files)
  - [#4293](https://github.com/wix/ricos/pull/4293) RicosServices refactored
- `ricos-plugins`
  - [#4290](https://github.com/wix/ricos/pull/4290) fix plugin shortcuts

## 8.72.14 (Jul 27, 2022)

## :house: Internal

- `ricos-shortcuts`
  - [#4273](https://github.com/wix/ricos/pull/4273) platform-dependent shortcut keys

## 8.72.13 (Jul 27, 2022)

## :bug: Bug Fix

- `ricos-schema`
  - [#4249](https://github.com/wix/ricos/pull/4249) support blog legacy file data fields

## :house: Internal

- `ricos-plugins`
  - [#4270](https://github.com/wix/ricos/pull/4270) text buttons modal registration

## 8.72.12 (Jul 26, 2022)

## :bug: Bug Fix

- `theme`
  - [#4256](https://github.com/wix/ricos/pull/4256) add hover-state color type to themeTypes.tsx & some wiring fixes

## :house: Internal

- `ricos-content`
  - [#4224](https://github.com/wix/ricos/pull/4224) refined types for decorations

## 8.72.10 (Jul 25, 2022)

## :bug: Bug Fix

- `wix-image`
  - [#4248](https://github.com/wix/ricos/pull/4248) pass socialAttrs props

## 8.72.9 (Jul 25, 2022)

## :bug: Bug Fix

- `toolbars-v3`
  - [#4255](https://github.com/wix/ricos/pull/4255) libs entry

## 8.72.8 (Jul 25, 2022)

## :house: Internal

- `general`
  - [#4253](https://github.com/wix/ricos/pull/4253) formatting shortcuts in plugins

## 8.72.7 (Jul 25, 2022)

## :house: Internal

- `collapsibleList`
  - [#4099](https://github.com/wix/ricos/pull/4099) collapsibleList add settings button
- `common-plugins`
  - [#4214](https://github.com/wix/ricos/pull/4214) common-plugins package
- `ricos-plugins`
  - [#4238](https://github.com/wix/ricos/pull/4238) plugin toolbar delete command by id instead of selection
  - [#4241](https://github.com/wix/ricos/pull/4241) plugin toolbar separators and button order

## 8.72.6 (Jul 22, 2022)

## :bug: Bug Fix

- `tiptap-editor`
  - [#3d2d98ef83ab30620f9b7ed3d2166b44dad8caef](https://github.com/wix/ricos/commit/3d2d98ef83ab30620f9b7ed3d2166b44dad8caef) external toolbar button key

## 8.72.5 (Jul 21, 2022)

## :house: Internal

- `linkpreview`
  - [#4199](https://github.com/wix/ricos/pull/4199) add settings toolbar buttons

## 8.72.4 (Jul 21, 2022)

## :house: Internal

- `tiptap-extensions`
  - [#4196](https://github.com/wix/ricos/pull/4196) add `dropcursor` extension
  - [#4196](https://github.com/wix/ricos/pull/4196) add `custom-styles` to groups to exclude nodes from `style` extension
  - [#4229](https://github.com/wix/ricos/pull/4229) lists behavior like draft
- `collapsible-list`
  - [#4196](https://github.com/wix/ricos/pull/4196) improve collapsible styling and ui in tiptap

## 8.72.3 (Jul 20, 2022)

- `image`
  - [#4219](https://github.com/wix/ricos/pull/4219) @wix/image update & earlier initCustomElement

## 8.72.2 (Jul 20, 2022)

## :house: Internal

- `tiptap-editor`
  - [#4211](https://github.com/wix/ricos/pull/4211) warn about setNode & clearNodes tiptap commands usage
- `tiptap-extensions`
  - [#4218](https://github.com/wix/ricos/pull/4218) add translate to placeholder extension
  - [#4220](https://github.com/wix/ricos/pull/4220) remove `translationKey` and translate content directly in placeholder

## :bug: Bug Fix

- `ricos-content`
  - [#4215](https://github.com/wix/ricos/pull/4215) draft video data to ricos conversion

## 8.72.1 (Jul 19, 2022)

## :rocket: New Feature

- `image`
  - [#4144](https://github.com/wix/ricos/pull/4144) Use @wix/image renderer (FT)

## :bug: Bug Fix

- `tiptap-editor`
  - [#4200](https://github.com/wix/ricos/pull/4200) text node from/to transformer (fixed id's)

## 8.71.50 (Jul 19, 2022)

## :bug: Bug Fix

- `tiptap-extensions`

  - [#4204](https://github.com/wix/ricos/pull/4204) lists input rule with custom handler

- `ricos-styles`
  - [#4205](https://github.com/wix/ricos/pull/4205) document style set style merger

## :house: Internal

- `ricos-tiptap-types`

  - [#4198](https://github.com/wix/ricos/pull/4198) ricos-tiptap-types merged into ricos-types
  - [#4203](https://github.com/wix/ricos/pull/4203) overlay click triggers focus

- `collapsible-list`

  - [#4193](https://github.com/wix/ricos/pull/4193) fix selection on tiptap

- `audio`

  - [#4073](https://github.com/wix/ricos/pull/4073) add toolbar settings button

- `gallery/audio`

  - [#4206](https://github.com/wix/ricos/pull/4206) refactor getToolbarButtons.tsx

- `gallery/polls`
  - [#4195](https://github.com/wix/ricos/pull/4195) code refactor/cleanup in getToolbarButtons.tsx

## 8.71.49 (Jul 17, 2022)

## :house: Internal

- `ricos-context ricos-common`
  - [#4191](https://github.com/wix/ricos/pull/4191) refactor upload context and migration from `ricos-common` to `ricos-context`

## 8.71.48 (Jul 17, 2022)

## :bug: Bug Fix

- `toolbars-v2`
  - [#4189](https://github.com/wix/ricos/pull/4189) cleanup font-weight (firefox bug)

## :house: Internal

- `gallery`
  - [#4095](https://github.com/wix/ricos/pull/4095) add toolbar settings button

## 8.71.47 (Jul 14, 2022)

## :house: Internal

- `gallery`
  - [#4183](https://github.com/wix/ricos/pull/4183) refactor settings button dataHook & settings modal

## :bug: Bug Fix

- `shortcuts`
  - [#4186](https://github.com/wix/ricos/pull/4186) modal registration in aggregate rather component
- `tiptap-editor`
  - [#4173](https://github.com/wix/ricos/pull/4173) onLoad handler on tiptap editor create
- `ricos-editor`
  - [#4168](https://github.com/wix/ricos/pull/4168) insert plugins external toolbar api for tiptap (wip)
- `collapsible-list`
  - [#4182](https://github.com/wix/ricos/pull/4182) drag and drop of list items on tiptap

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
