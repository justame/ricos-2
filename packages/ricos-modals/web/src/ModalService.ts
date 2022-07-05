import type {
  EventPublisher,
  EventRegistrar,
  EventSubscriptor,
  ModalConfig,
  ModalService,
  Modal,
} from 'ricos-types';

export class RicosModalService implements ModalService {
  private modals: ((ModalConfig | Modal) & { state: { isOpen: boolean } })[] = [];

  private openModalPublisher: EventPublisher<ModalConfig['id']>;

  private closeModalPublisher: EventPublisher<ModalConfig['id']>;

  eventSubscriptor: EventSubscriptor;

  constructor(events: EventRegistrar & EventSubscriptor) {
    this.modals = [];
    this.openModalPublisher = events.register<ModalConfig['id']>(
      'ricos.modals.functionality.modalOpened'
    );
    this.closeModalPublisher = events.register<ModalConfig['id']>(
      'ricos.modals.functionality.modalClosed'
    );
    this.eventSubscriptor = events as EventSubscriptor;
  }

  public register(modalConfig: ModalConfig) {
    const modal = this.modals.find(modal => modal.id === modalConfig.id);
    if (modal) {
      console.error(`${modalConfig.id} modal is already registered`);
    } else {
      this.modals.push({ ...modalConfig, state: { isOpen: false } });
    }
  }

  public unregister(id: string) {
    const modal = this.modals.find(modal => modal.id === id);
    if (!modal) {
      console.error(`${id} modal is not registered`);
    } else {
      this.modals = this.modals.filter(modal => modal.id !== id);
    }
  }

  public openModal(id, config) {
    const modal = this.modals.find(modal => modal.id === id);
    if (!modal) {
      console.error(`Fail to open modal: ${id} modal is not register to modal service`);
      return false;
    } else if (modal.state.isOpen) {
      console.error(`Attempt to open ${id} that's already open`);
      return false;
    } else {
      modal.state.isOpen = true;
      Object.keys(config).forEach(key => (modal[key] = config[key]));
      this.openModalPublisher.publish(id);
      return true;
    }
  }

  public closeModal(id: string) {
    const modal = this.modals.find(modal => modal.id === id);
    if (!modal) {
      console.error(`Fail to close modal: ${id} is not open`);
      return false;
    } else {
      this.modals.forEach(modal => modal.id === id && (modal.state.isOpen = false));
      this.closeModalPublisher.publish(id);
      return true;
    }
  }

  public getOpenModals() {
    return this.modals
      .filter(modal => modal.state.isOpen)
      .map(({ state, ...modal }) => modal as Modal);
  }

  public isModalOpen(id: string) {
    const modal = this.modals.find(modal => modal.id === id);
    if (!modal) {
      console.error(`Fail to get modal state: ${id} modal is not register to modal service`);
      return false;
    }
    return modal.state.isOpen;
  }

  public onModalOpened(onOpen: (id: string) => unknown) {
    return this.eventSubscriptor.subscribe(
      'ricos.modals.functionality.modalOpened',
      onOpen,
      'ricos-modal-service'
    );
  }

  public onModalClosed(onClose: (id: string) => unknown) {
    return this.eventSubscriptor.subscribe(
      'ricos.modals.functionality.modalClosed',
      onClose,
      'ricos-modal-service'
    );
  }

  destroy() {
    this.modals = [];
  }
}
