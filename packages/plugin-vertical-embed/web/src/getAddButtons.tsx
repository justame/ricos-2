import {
  INSERT_PLUGIN_BUTTONS,
  decorateComponentWithProps,
  TOOLBARS,
} from 'wix-rich-content-editor-common';
import type { AddButton } from 'ricos-types';
import { EventIcon, ProductIcon, BookingIcon } from './icons';
import { verticalEmbedModals } from './constants';
import InsertModal from './modals/InsertModal';

export const getAddButtons = (config): AddButton[] => {
  const { exposeEmbedButtons = [] } = config || {};
  const buttonsMap: Record<string, AddButton> = {
    event: {
      id: 'event',
      label: INSERT_PLUGIN_BUTTONS.EVENTS,
      dataHook: INSERT_PLUGIN_BUTTONS.EVENTS,
      icon: EventIcon,
      tooltip: 'EventsPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: verticalEmbedModals.insertEvent,
        Component: decorateComponentWithProps(InsertModal, {
          verticalsApi: config?.verticalsApi,
          componentData: { type: 'event' },
          modalId: verticalEmbedModals.insertEvent,
        }),
      },
      menuConfig: {
        tags: 'Events_plugin_search_tags',
        group: 'embed_wix',
      },
    },
    booking: {
      id: 'booking',
      label: INSERT_PLUGIN_BUTTONS.BOOKINGS,
      dataHook: INSERT_PLUGIN_BUTTONS.BOOKINGS,
      icon: BookingIcon,
      tooltip: 'BookingsPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: verticalEmbedModals.insertBooking,
        Component: decorateComponentWithProps(InsertModal, {
          ...config,
          componentData: { type: 'booking' },
          modalId: verticalEmbedModals.insertBooking,
        }),
      },
      menuConfig: {
        tags: 'Bookings_plugin_search_tags',
        group: 'embed_wix',
      },
    },
    product: {
      id: 'product',
      label: INSERT_PLUGIN_BUTTONS.STORES,
      dataHook: INSERT_PLUGIN_BUTTONS.STORES,
      icon: ProductIcon,
      tooltip: 'StoresPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: verticalEmbedModals.insertProduct,
        Component: decorateComponentWithProps(InsertModal, {
          ...config,
          componentData: { type: 'product' },
          modalId: verticalEmbedModals.insertProduct,
        }),
      },
      menuConfig: {
        tags: 'Stores_plugin_search_tags',
        group: 'embed_wix',
      },
    },
  };

  return exposeEmbedButtons.map(buttonType => buttonsMap[buttonType]);
};
