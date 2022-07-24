import type { FC, ReactChild } from 'react';
import React, { useContext, useEffect, useRef } from 'react';
import { configure, HotKeys } from 'react-hotkeys';
import { EditorContext, ModalContext, RicosContext, ShortcutsContext } from 'ricos-context';
import type { KeyboardShortcut, ModalService } from 'ricos-types';
import type { Shortcuts as ShortcutManager } from './models/shortcuts';

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

export const Shortcuts: FC<ShortcutsProps> = (props: ShortcutsProps) => {
  const modalService: ModalService = useContext(ModalContext);

  const helpShortcut: KeyboardShortcut = {
    name: 'Keyboard Shortcuts',
    description: 'Displays available shortcuts',
    group: 'global',
    command() {
      modalService.openModal('shortcuts-help', {
        positioning: { placement: 'right' },
        layout: 'drawer',
      });
    },
    keys: 'Meta+/',
    enabled: true,
  };

  const { group, root, children } = { ...defaultProps, ...props };

  const shortcuts = useContext(ShortcutsContext) as ShortcutManager;
  if (root && shortcuts.asArray().filter(s => s.getName() === 'Keyboard Shortcuts').length === 0) {
    shortcuts.register(helpShortcut);
  }

  const { t } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const commands = getEditorCommands();
  const { handlers, keyMap } = shortcuts.getHotKeysProps(group, commands, t);

  useComponentWillMount(() => {
    if (root) {
      configure({
        ignoreTags: [],
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
