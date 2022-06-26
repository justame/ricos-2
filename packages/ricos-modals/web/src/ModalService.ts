import type {
  EventPublisher,
  EventRegistrar,
  EventSubscriptor,
  ModalConfig,
  ModalService,
} from 'ricos-types';

type IModal = ModalConfig;

export class RicosModalService implements ModalService {
  private modals: IModal[] = [];

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

  public register(modalConfig: ModalConfig) {}

  public unregister(id: string) {}

  public openModal(modalConfig: ModalConfig) {
    const modal = this.getModal(modalConfig.id);
    if (modal) {
      console.error(`Attempt to open ${modalConfig.id} that's already open`);
      return false;
    } else {
      this.modals.push(modalConfig);
      this.openModalPublisher.publish(modalConfig.id);
      return true;
    }
  }

  public closeModal(id: string) {
    const modal = this.getModal(id);
    if (modal) {
      this.modals = this.modals.filter(modal => modal.id !== id);
      this.closeModalPublisher.publish(id);
      return true;
    } else {
      console.error(`Fail to close modal: ${id} is not open`);
      return false;
    }
  }

  public getOpenModals() {
    return this.modals;
  }

  private getModal(id: string) {
    return this.modals.find(modal => modal.id === id);
  }

  public onModalOpened(onOpen: (id: string) => unknown) {
    this.eventSubscriptor.subscribe(
      'ricos.modals.functionality.modalOpened',
      onOpen,
      'ricos-modal-service'
    );
  }

  public onModalClosed(onClose: (id: string) => unknown) {
    this.eventSubscriptor.subscribe(
      'ricos.modals.functionality.modalClosed',
      onClose,
      'ricos-modal-service'
    );
  }
}
