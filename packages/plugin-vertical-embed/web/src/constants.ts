import { Node_Type } from 'ricos-types';

export const verticalEmbedProviders = { event: 'event', booking: 'booking', product: 'product' };

export const contentTypeMap = {
  event: 'Events',
  booking: 'Bookings',
  product: 'Stores',
};

export const modalContentStyles: React.CSSProperties = {
  width: 440,
  height: 522,
  padding: 20,
  boxSizing: 'border-box',
  border: 'solid 1px rgba(51, 51, 51, 0.1)',
  borderRadius: 'var(--ricos-settings-whitebox-border-radius, 2px)',
  boxShadow: 'var(--ricos-settings-whitebox-box-shadow, 0 0 10px 0 rgba(0, 0, 0, 0.06))',
};

export const verticalEmbedModals = {
  insertBooking: `${Node_Type.APP_EMBED}.insertBooking`,
  insertProduct: `${Node_Type.APP_EMBED}.insertProduct`,
  insertEvent: `${Node_Type.APP_EMBED}.insertEvent`,
  replace: `${Node_Type.APP_EMBED}.replace`,
};
