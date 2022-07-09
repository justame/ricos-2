import type { EventRegistrar, EventSubscriptor } from 'ricos-types';

import { RicosModalService } from '../src/ModalService';

const events: EventRegistrar & EventSubscriptor = {
  register: jest.fn(),
  subscribe: jest.fn(),
  getAllTopics: jest.fn(),
};

// TODO: fully test openModal, closeModal
describe('Modal Service', () => {
  const modalService = new RicosModalService(events);
  const openCallback = jest.fn(() => {});
  const closeCallback = jest.fn(() => {});

  modalService.onModalOpened(openCallback);
  modalService.onModalClosed(closeCallback);

  it('should not close modal which is not open', () => {
    expect(modalService.closeModal('notExistModal')).toBe(false);
  });
});
