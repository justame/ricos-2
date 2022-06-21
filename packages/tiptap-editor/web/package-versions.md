# Tiptap & ProseMirror Package Versions

## Motivation

Since tiptap is still actively developed beta, as a consumer we have to monitor changes and features. The beta patch version release sometimes introduces breaking changes. This doc manages the used packages list and versions, along with reason to upgrade.

Note: the tiptap package versions in package.json should be pinned, and updated manually, after sanity testing (manually, until we don't run tiptap e2e).

## Core packages

### @tiptap/core@2.0.0-beta.148

### @tiptap/react@2.0.0-beta.98

### prosemirror-state@^1.3.4

### prosemirror-transform@^1.3.3

## Extensions

These are versions of extensions our extensions are based on

### @tiptap/extension-blockquote@2.0.0-beta.26

- only paragraph allowed in content

### @tiptap/extension-bold@2.0.0-beta.25

### @tiptap/extension-bullet-list@2.0.0-beta.24

### @tiptap/extension-code-block@2.0.0-beta.30

### @tiptap/extension-document@2.0.0-beta.15

### @tiptap/extension-dropcursor@2.0.0-beta.25

### @tiptap/extension-gapcursor@2.0.0-beta.33

### @tiptap/extension-heading@2.0.0-beta.24

- HeadingData

### @tiptap/extension-highlight@2.0.0-beta.31

### @tiptap/extension-history@2.0.0-beta.21

### @tiptap/extension-italic@2.0.0-beta.25

### @tiptap/extension-list-item@2.0.0-beta.20

- only paragraph allowed in content

### @tiptap/extension-ordered-list@2.0.0-beta.25

### @tiptap/extension-paragraph@2.0.0-beta.23

- `div` rendered instead of `p`

### @tiptap/extension-text@2.0.0-beta.15

### @tiptap/extension-underline@2.0.0-beta.22

### @tiptap/extension-placeholder@2.0.0-beta.45

- `editor.isEmpty` returns false for draft-originated content

### @tiptap/extension-link@2.0.0-beta.38

- LinkData

## yarn resolutions in root package.json (currently not applied)

To make sure that each grand-dependency appears once, these can be added to the package.json resolutions section.

```json
"prosemirror-commands": "1.1.12",
"prosemirror-keymap": "1.1.5",
"prosemirror-dropcursor": "1.4.0",
"prosemirror-gapcursor": "1.2.0",
"prosemirror-schema-list": "1.1.6",
"prosemirror-history": "1.2.0",
"prosemirror-model": "1.15.0",
"prosemirror-state": "1.3.4",
"prosemirror-transform": "1.3.3",
"prosemirror-view": "1.23.3"

```
