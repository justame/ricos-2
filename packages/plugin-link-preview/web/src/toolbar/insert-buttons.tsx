import { DEFAULTS } from '../defaults';
import {
  getModalStyles,
  TOOLBARS,
  BUTTON_TYPES,
  decorateComponentWithProps,
  getBottomToolbarModalStyles,
} from 'wix-rich-content-editor-common';
import {
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  PinterestIcon,
  YoutubeIcon,
} from '../icons';
import EmbedURLInputModal from './embedURLInputModal';
import type {
  CreateInsertButtons,
  TranslationFunction,
  AvailableExperiments,
} from 'wix-rich-content-common';
import type { LinkPreviewPluginEditorConfig } from '../types';
import {
  DesktopFlyOutModalStyles,
  MOBILE_FULL_SCREEN_CUSTOM_STYLE,
  DesktopOverlayModalStyles,
} from 'wix-rich-content-ui-components';
import { modalContentStyles } from '../consts';

const createInsertButtons: CreateInsertButtons = ({
  t,
  settings,
  isMobile,
  experiments = {},
}: {
  t: TranslationFunction;
  settings: LinkPreviewPluginEditorConfig;
  isMobile: boolean;
  experiments: AvailableExperiments;
}) => {
  const { newVideoVerticalAndSocialModals } = experiments;
  const useNewModal = newVideoVerticalAndSocialModals?.enabled;
  const content = isMobile
    ? {
        maxWidth: 580,
        minHeight: '100%',
        minWidth: '100%',
        margin: 0,
        alignContent: 'center',
        top: 0,
        transform: 'none',
      }
    : { maxWidth: 580, minHeight: 348 };

  const newModalCustomStyles = isMobile
    ? MOBILE_FULL_SCREEN_CUSTOM_STYLE
    : { ...DesktopFlyOutModalStyles, content: modalContentStyles };

  const customStyles = useNewModal ? newModalCustomStyles : { content };

  const defaultModalStyles = getModalStyles({
    customStyles,
    fullScreen: !!useNewModal,
    isMobile,
  });

  const newModalStyles = isMobile ? defaultModalStyles : undefined;
  const modalStyles = useNewModal ? newModalStyles : defaultModalStyles;
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

  const { exposeEmbedButtons = [] } = settings;
  const socialIconsMap = {
    Instagram: InstagramIcon,
    Twitter: TwitterIcon,
    Facebook: FacebookIcon,
    TikTok: TikTokIcon,
    Pinterest: PinterestIcon,
    YouTube: YoutubeIcon,
  };

  const baseButtonsProps = socialType => ({
    type: BUTTON_TYPES.MODAL,
    modalStylesFn,
    section: 'BlockToolbar_Section_Embed_Anywhere',
    componentData: DEFAULTS,
    name: `${socialType}_InsertButton`,
    tooltip: t(`${socialType}Plugin_InsertButton_Tooltip`),
    getIcon: () => socialIconsMap[socialType],
    modalElement: decorateComponentWithProps(EmbedURLInputModal, {
      fetchData: settings.fetchData,
      socialType,
    }),
  });

  const toolbars = useNewModal
    ? [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE]
    : [TOOLBARS.INSERT_PLUGIN, TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE];

  let socialButtons = exposeEmbedButtons.map(socialType => ({
    ...baseButtonsProps(socialType),
    toolbars,
    modalStyles,
  }));

  if (useNewModal) {
    const externalToolbarButtons = exposeEmbedButtons.map(socialType => ({
      ...baseButtonsProps(socialType),
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

    socialButtons = [...socialButtons, ...externalToolbarButtons];
  }

  return socialButtons;
};

export default createInsertButtons;
