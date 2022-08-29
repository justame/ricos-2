import { Editor } from '@tiptap/react';
import type { RicosEditorProps } from 'ricos-common';
import { draftToTiptap } from 'ricos-converters';
import type { ExtensionProps, RicosServices } from 'ricos-types';
import { getEmptyDraftContent } from 'wix-rich-content-editor-common';
import { RichContentAdapter } from './components/RichContentAdapter/RichContentAdapter';
import { applyDevTools } from './components/RicosTiptapEditor/apply-dev-tools';
import { coreConfigs } from './components/RicosTiptapEditor/core-configs';
import { Extensions } from './models/Extensions';
import { patchExtensions } from './patch-extensions';

export type TiptapAdapterServices = Omit<RicosServices, 'editor' | 'zIndexService'>;

const extractExtensionProps = (props: RicosEditorProps): ExtensionProps => {
  const { placeholder, textAlignment, iframeSandboxDomain, textWrap, maxTextLength, linkSettings } =
    props;

  const { anchorTarget, rel, relValue } = linkSettings || {};

  return {
    placeholder,
    textAlignment,
    iframeSandboxDomain,
    isTextWrap: textWrap,
    maxTextLength,
    anchorTarget,
    rel,
    relValue,
  };
};

const extractExtensions = (
  services: TiptapAdapterServices,
  props: RicosEditorProps
): Extensions => {
  const extensions = services.plugins.getTiptapExtensions();
  return Extensions.of(extensions, extractExtensionProps(props), services);
};

export const initializeTiptapAdapter = (
  ricosEditorProps: RicosEditorProps,
  services: TiptapAdapterServices,
  isDebugMode = false
) => {
  const content =
    ricosEditorProps.injectedContent || ricosEditorProps.content || getEmptyDraftContent();
  const tiptapContent = draftToTiptap(content);
  const extensions = extractExtensions(services, ricosEditorProps);
  const allExtensions = extensions.concat(coreConfigs);
  const patchedExtensions = patchExtensions(tiptapContent, allExtensions);
  const tiptapExtensions = patchedExtensions.getTiptapExtensions();

  console.debug({ tiptapExtensions, tiptapContent }); // eslint-disable-line no-console

  const editor = new Editor({
    extensions: tiptapExtensions,
    content: tiptapContent,
    injectCSS: true,
  });

  applyDevTools(editor, isDebugMode);

  return new RichContentAdapter(editor, ricosEditorProps, services);
};
