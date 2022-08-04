import type { TopicDescriptor } from 'ricos-types';

// TODO: could be distributed among entities and exported under declared module?
export const EditorEvents: TopicDescriptor[] = [
  'ricos.editor.instance.loaded',
  'ricos.editor.instance.error',
  'ricos.editor.functionality.firstEdit',
  'ricos.editor.content.saved',
  'ricos.shortcuts.functionality.applied',
  'ricos.modals.functionality.modalOpened',
  'ricos.modals.functionality.modalClosed',
  'ricos.toolbars.functionality.buttonClick',
  'ricos.toolbars.functionality.search',
];
