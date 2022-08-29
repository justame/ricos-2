import { merge } from 'lodash';
import type { ReactElement } from 'react';
import React, {
  FunctionComponent,
  useContext,
  Children,
  Component,
  Fragment,
  Suspense,
} from 'react';
import ReactDOM from 'react-dom';
import type { ModalSettings } from 'ricos-common';
import type {
  AvailableExperiments,
  EditorCommands,
  ModalsMap,
  ModalStyles,
} from 'wix-rich-content-common';
import mergeModalStyles from './mergeModalStyles';
import RicosPortal from './RicosPortal';
import { ZIndexContext } from 'ricos-context';

interface Props {
  children: ReactElement;
  ModalsMap: ModalsMap;
  theme: Record<string, unknown>;
  locale: string;
  ariaHiddenId?: ModalSettings['ariaHiddenId'];
  container?: HTMLElement;
  experiments?: AvailableExperiments;
  onModalOpen: (modalProps: Record<string, unknown>) => void;
  onModalClose: () => void;
  editorCommands: EditorCommands;
  parentClass?: string;
}

type ModalProps = {
  onRequestClose: ReactModal.Props['onRequestClose'];
  modalStyles?: ModalStyles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
};

interface State {
  showModal: boolean;
  modalProps?: ModalProps;
  modalStyles?: ModalStyles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorModal?: any;
  editorModalId: string;
}

export default class EditorModalProvider extends Component<Props, State> {
  modalHandlers: { helpers: ModalSettings };

  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      editorModalId: `EditorModal-${new Date().getTime()}`,
    };
    this.modalHandlers = {
      helpers: {
        openModal: this.openModal,
        closeModal: this.closeModal,
      },
    };
  }

  componentDidMount() {
    this.loadEditorModalAfterLocaleResourceIsLoadedToPreventRemountHackFromBreakingModal();
  }

  loadEditorModalAfterLocaleResourceIsLoadedToPreventRemountHackFromBreakingModal() {
    const { locale, localeResource } = this.props.children.props;
    if (locale === 'en' || localeResource) {
      const EditorModal = React.lazy(
        () => import(/* webpackChunkName: "RicosEditorModal"  */ './EditorModal')
      );
      this.setState({ EditorModal });
    }
  }

  openModal = (data: ModalProps) => {
    const { modalStyles, ...modalProps } = data;
    this.props.onModalOpen?.(modalProps);
    this.setState({
      showModal: true,
      modalProps,
      modalStyles: merge(modalStyles, { overlay: { position: 'fixed' } }),
    });
  };

  closeModal = () => {
    this.props.onModalClose?.();
    this.setState({
      showModal: false,
      modalProps: undefined,
      modalStyles: undefined,
    });
  };

  render() {
    const { EditorModal, showModal, modalProps, modalStyles, editorModalId } = this.state;
    const {
      children,
      ModalsMap,
      locale,
      theme,
      ariaHiddenId,
      container,
      experiments = {},
      editorCommands,
      parentClass,
    } = this.props;
    const childProps = merge(children.props, this.modalHandlers);
    return (
      <Fragment>
        {Children.only(React.cloneElement(children, childProps))}
        <RicosPortal className={parentClass} container={container}>
          <div className="ricos-editor-modal">
            <div id={editorModalId} />
            {EditorModal && (
              <Suspense fallback={<div />}>
                <EditorModal
                  ariaHiddenId={ariaHiddenId}
                  dataHook={'RicosEditorModal'}
                  contentLabel={'RicosModal'}
                  isOpen={showModal}
                  style={mergeModalStyles(modalStyles, theme, modalProps?.fullHeight)}
                  role="dialog"
                  onRequestClose={modalProps?.onRequestClose || this.closeModal}
                  modalsMap={ModalsMap}
                  locale={locale}
                  target={editorModalId}
                  experiments={experiments}
                  editorCommands={editorCommands}
                  {...modalProps}
                />
              </Suspense>
            )}
          </div>
        </RicosPortal>
      </Fragment>
    );
  }
}
