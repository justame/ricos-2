import {
  TOOLBARS,
  BUTTON_TYPES,
  decorateComponentWithProps,
  getModalStyles,
  getBottomToolbarModalStyles,
} from 'wix-rich-content-editor-common';
import { EventIcon, ProductIcon, BookingIcon } from '../icons';
import VerticalEmbedInputModal from './VerticalEmbedInputModal';
import { contentTypeMap, modalContentStyles } from '../constants';
import getModalCustomStyles from './ModalCustomStyles';
import type {
  AvailableExperiments,
  CreateInsertButtons,
  TranslationFunction,
} from 'wix-rich-content-common';
import type { VerticalEmbedPluginEditorConfig } from '../types';
import {
  DesktopFlyOutModalStyles,
  MOBILE_FULL_SCREEN_CUSTOM_STYLE,
  DesktopOverlayModalStyles,
} from 'wix-rich-content-ui-components';

const createInsertButtons: CreateInsertButtons = ({
  t,
  settings,
  isMobile,
  locale,
  experiments = {},
}: {
  t: TranslationFunction;
  settings: VerticalEmbedPluginEditorConfig;
  isMobile: boolean;
  locale: string;
  experiments?: AvailableExperiments;
}) => {
  const iconsMap = {
    product: ProductIcon,
    event: EventIcon,
    booking: BookingIcon,
  };
  const useNewModal = experiments?.newVideoVerticalAndSocialModals?.enabled;

  const newModalCustomStyles = isMobile
    ? MOBILE_FULL_SCREEN_CUSTOM_STYLE
    : { ...DesktopFlyOutModalStyles, content: modalContentStyles };

  const customStyles = useNewModal ? newModalCustomStyles : getModalCustomStyles(isMobile);

  const modalStylesFn = useNewModal
    ? ({ buttonRef, toolbarName }) => {
        return getBottomToolbarModalStyles(
          buttonRef,
          {
            customStyles,
          },
          toolbarName
        );
      }
    : undefined;

  const defaultModalStyles = getModalStyles({
    customStyles,
    fullScreen: !!useNewModal,
    isMobile,
  });

  const newModalStyles = isMobile ? defaultModalStyles : undefined;
  const modalStyles = useNewModal ? newModalStyles : defaultModalStyles;

  const { exposeEmbedButtons = [], getIsVisiblePromise } = settings;

  const buttonsBaseProps = type => {
    const contentType = contentTypeMap[type];
    return {
      type: BUTTON_TYPES.MODAL,
      name: `${contentType}_InsertButton`,
      tooltip: t(`${contentType}Plugin_InsertButton_Tooltip`),
      getIcon: () => iconsMap[type],
      Icon: iconsMap[type],
      section: 'BlockToolbar_Section_Embed_Wix',
      modalElement: decorateComponentWithProps(VerticalEmbedInputModal, {
        ...settings,
        locale,
        type,
        componentData: { type },
      }),
      isVisiblePromise: getIsVisiblePromise?.(type, locale),
      modalStylesFn,
    };
  };

  const toolbars = useNewModal
    ? [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE]
    : [TOOLBARS.INSERT_PLUGIN, TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE];

  let verticalEmbedButtons = exposeEmbedButtons.map((verticalType: string) => ({
    ...buttonsBaseProps(verticalType),
    toolbars,
    modalStyles,
  }));

  if (useNewModal) {
    const externalToolbarButtons = exposeEmbedButtons.map((verticalType: string) => ({
      ...buttonsBaseProps(verticalType),
      toolbars: [TOOLBARS.INSERT_PLUGIN],
      modalStyles: getModalStyles({
        customStyles: {
          ...customStyles,
          ...DesktopOverlayModalStyles,
        },
        fullScreen: isMobile,
        isMobile,
      }),
    }));

    verticalEmbedButtons = [...verticalEmbedButtons, ...externalToolbarButtons];
  }

  return verticalEmbedButtons;
};

export default createInsertButtons;
