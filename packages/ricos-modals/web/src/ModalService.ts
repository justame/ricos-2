/* eslint-disable brace-style */
import type {
  EventData,
  EventSource,
  Modal,
  ModalConfig,
  ModalService,
  PolicySubscriber,
  PublisherProvider,
  SubscriptorProvider,
  TopicDescriptor,
} from 'ricos-types';

type Topics = ['ricos.modals.functionality.modalOpened', 'ricos.modals.functionality.modalClosed'];

const TOPICS: Topics = [
  'ricos.modals.functionality.modalOpened',
  'ricos.modals.functionality.modalClosed',
];

export class RicosModalService
  implements ModalService, PolicySubscriber<Topics>, EventSource<Topics>
{
  private modals: ((ModalConfig | Modal) & { state: { isOpen: boolean } })[] = [];

  constructor() {
    this.modals = [];
  }

  id = 'ricos-modal-service';

  topicsToPublish = TOPICS;

  topicsToSubscribe = TOPICS;

  publishers!: PublisherProvider<
    ['ricos.modals.functionality.modalOpened', 'ricos.modals.functionality.modalClosed']
  >;

  subscriptors!: SubscriptorProvider<
    ['ricos.modals.functionality.modalOpened', 'ricos.modals.functionality.modalClosed']
  >;

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
      this.publishers.byTopic('ricos.modals.functionality.modalOpened').publish({ id });
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
      this.publishers.byTopic('ricos.modals.functionality.modalClosed').publish({ id });
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
    const subscriber = (_topic: TopicDescriptor, data: EventData) => {
      onOpen(data.id);
    };
    return this.subscriptors
      .byTopic('ricos.modals.functionality.modalOpened')
      .subscribe(subscriber);
  }

  public onModalClosed(onClose: (id: string) => unknown) {
    const subscriber = (_topic: TopicDescriptor, data: EventData) => {
      onClose(data.id);
    };
    return this.subscriptors
      .byTopic('ricos.modals.functionality.modalClosed')
      .subscribe(subscriber);
  }

  public getModal(id: string) {
    return this.modals.find(modal => modal.id === id);
  }

  destroy() {
    this.modals = [];
  }
}
