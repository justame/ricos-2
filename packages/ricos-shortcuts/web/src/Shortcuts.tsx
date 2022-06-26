import type { FC, ReactChild } from 'react';
import React, { useContext, useEffect, useRef } from 'react';
import { configure, HotKeys } from 'react-hotkeys';
import { ModalContext, RicosContext, EditorContext, EventsContext } from 'ricos-context';
import type { EventRegistrar, KeyboardShortcut, ModalConfig } from 'ricos-types';
import { ShortcutsContext } from './ShortcutsContext';
import { ShortcutsDialog } from './ShortcutsDialog';

export type ShortcutsProps = {
  group: string;
  root?: boolean;
  children: ReactChild;
};

const defaultProps = {
  group: 'global',
  root: false,
  children: null,
  plugins: [],
};

// TODO: move to utils
const useComponentWillMount = (callback: () => void) => {
  const mounted = useRef(false);
  if (!mounted.current) callback();

  useEffect(() => {
    mounted.current = true;
  }, []);
};

const helpModal: ModalConfig = {
  id: 'shortcuts-help',
  Component: ShortcutsDialog,
  layout: 'drawer',
  positioning: { placement: 'right' },
};

export const Shortcuts: FC<ShortcutsProps> = (props: ShortcutsProps) => {
  const modalService = useContext(ModalContext);

  const helpShortcut: KeyboardShortcut = {
    name: 'Keyboard Shortcuts',
    description: 'Displays available shortcuts',
    group: 'global',
    command() {
      modalService.openModal(helpModal);
    },
    keys: 'Meta+/',
    enabled: true,
  };

  const { group, root, children } = { ...defaultProps, ...props };

  const { shortcuts } = useContext(ShortcutsContext);
  if (root && shortcuts.filter(s => s.getName() === 'Keyboard Shortcuts').asArray().length === 0) {
    shortcuts.register(helpShortcut);
  }

  const { t } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const eventRegistrar: EventRegistrar = useContext(EventsContext);
  const commands = getEditorCommands();
  const shortutEventPublisher = eventRegistrar.register(
    'ricos.shortcuts.functionality.shortcutApplied'
  );
  const { handlers, keyMap } = shortcuts.getHotKeysProps(group, commands, t, shortutEventPublisher);

  useComponentWillMount(() => {
    if (root) {
      configure({
        ignoreKeymapAndHandlerChangesByDefault: false,
        ignoreTags: [],
        simulateMissingKeyPressEvents: false,
        ignoreEventsCondition: () => false,
        logLevel: 'warn',
      });
    }
  });

  return (
    <>
      <HotKeys root={root} handlers={handlers} keyMap={keyMap}>
        {children}
      </HotKeys>
    </>
  );
};
