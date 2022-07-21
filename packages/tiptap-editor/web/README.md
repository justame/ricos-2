# wix-tiptap-editor

## Developer Guidelines

These guidelines are written in blood of those who violate them.

### Extension Locations

The core extensions (i.e. those which provide some basic editor functionality) should reside in `wix-tiptap-extensions` package. The Ricos plugin adapters for tiptap should reside in appropriate plugin packages.

### Prose-mirror Plugins

Sometimes, it is necessary to implement a prose-mirror plugin as a part of extension. In this case, it is crucial to define `key` field (although it is not mandatory in prose-mirror Plugin API):

```
  new Plugin({

  ...

  key: new PluginKey('my-extension'),
  ...
  })
```

Missing keys potentially cause plugin key collisions in certain scenarios.

### Tiptap Extension Reuse

If you want to use an existing tiptap extension in ricos, the extension code should be copied from tiptap into ricos codebase and transformed to RicosExtension format. Never consume 3rd party extension as npm dependency.

### ricos/tiptap public types

All the tiptap-related public types should reside in `ricos-types` package. The `wix-tiptap-editor` or `wix-tiptap-extensions` should never be a dependency of ricos package. The tiptap-related public types should never be added to any `ricos-*` or `wix-rich-content-*` package.

### Extension Versions

See [package versions doc](./package-versions.md)
