import type { ComponentType } from 'react';
import type { Subscription } from './events';
import type { KeyboardShortcut } from './shortcuts';

export type Layout = 'popover' | 'drawer' | 'dialog' | 'fullscreen' | 'toolbar';
export type Placement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end';

type ModalPositioning = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  referenceElement?: any;
  placement?: Placement;
};

export interface ModalConfig {
  Component: ComponentType;
  id: string;
  shortcuts?: KeyboardShortcut[];
}

export type Modal = ModalConfig & {
  layout: Layout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentProps?: Record<string, any>;
  positioning?: ModalPositioning;
};

export interface ModalService {
  openModal: (
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: { layout: Layout; componentProps?: Record<string, any>; positioning?: ModalPositioning }
  ) => boolean;
  isModalOpen: (id: string) => boolean;
  register: (modalConfig: ModalConfig) => void;
  unregister: (id: string) => void;
  closeModal: (id: string) => boolean;
  getOpenModals: () => Modal[];
  onModalOpened: (onOpen: (id: string) => unknown) => Subscription;
  onModalClosed: (onClose: (id: string) => unknown) => Subscription;
  destroy: () => void;
}
