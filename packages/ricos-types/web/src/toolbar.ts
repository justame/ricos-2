export type ICloseMoreItemsModalReason = 'clickOutside' | 'toggleButtonClick';

export type IOnRequestToCloseMoreItemsModal = (reason: ICloseMoreItemsModalReason) => boolean;
