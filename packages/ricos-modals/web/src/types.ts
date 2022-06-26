import type { ModalConfig } from 'ricos-types';

export interface ModalService {
  openModal: (modalConfig: ModalConfig) => boolean;
  register: (modalConfig: ModalConfig) => void;
  closeModal: (id: string) => boolean;
  getOpenModals: () => ModalConfig[];
  onModalOpened: (onOpen: (id: string) => unknown) => void;
  onModalClosed: (onClose: (id: string) => unknown) => void;
}
