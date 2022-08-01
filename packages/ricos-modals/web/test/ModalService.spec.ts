import { RicosModalService } from '../src/ModalService';

const publishers = {
  byTopic: () => ({
    publish: jest.fn(),
    publishSync: jest.fn(),
    publishOnce: jest.fn(),
    topic: 'ricos.modals.publishers.test' as const,
  }),
};

const subscriptors = {
  byTopic: () => ({
    subscribe: jest.fn(),
  }),
};

// TODO: fully test openModal, closeModal
describe('Modal Service', () => {
  const modalService = new RicosModalService();
  modalService.publishers = publishers;
  modalService.subscriptors = subscriptors;

  const openCallback = jest.fn(() => {});
  const closeCallback = jest.fn(() => {});

  modalService.onModalOpened(openCallback);
  modalService.onModalClosed(closeCallback);

  it('should not close modal which is not open', () => {
    expect(modalService.closeModal('notExistModal')).toBe(false);
  });
});
