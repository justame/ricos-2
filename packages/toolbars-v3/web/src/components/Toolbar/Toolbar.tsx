/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component, createRef } from 'react';
import type { RefObject } from 'react';
import { SizeMe } from 'react-sizeme';
import { isSSR } from 'wix-rich-content-common';
import cx from 'classnames';
import type { ToolbarSpec, OverflowedItemsPosition } from '../../types';
import styles from './Toolbar.scss';
import { RicosToolbar } from '../../RicosToolbar';
import { SizeCalculator } from '../SizeCalculator';
import { ClickOutside } from '../Clickoutside/ClickOutside';
import { MoreButton } from '../buttons';
import { ToolbarButton, ToolbarButtons } from '../../models';
import { handleCircularFocus } from './utils';
import type { IOnRequestToCloseMoreItemsModal, ICloseMoreItemsModalReason } from 'ricos-types';

type ToolbarProps = {
  toolbar: RicosToolbar;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbarItemsRenders: any;
  isMobile: boolean;
  maxWidth?: number;
  overflowedItemsPosition?: OverflowedItemsPosition;
  onRequestToCloseMoreItemsModal?: IOnRequestToCloseMoreItemsModal;
};

const visibleOnlySpec: ToolbarSpec = attributes => attributes.visible === true;

class ToolbarComponent extends Component<ToolbarProps, Record<string, unknown>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Record<string, any> = {};

  moreButtonWrapperRef: RefObject<HTMLDivElement>;

  state = {
    dummyUpdate: 1,
    showMore: false,
  };

  constructor(props) {
    super(props);

    this.moreButtonWrapperRef = createRef<HTMLDivElement>();

    props.toolbar.on(RicosToolbar.EVENTS.UPDATED, () => {
      // force update
      this.setState({ dummyUpdate: this.state.dummyUpdate + 1 });
    });
  }

  onCloseMoreItemsModal = (reason: ICloseMoreItemsModalReason) => {
    const { onRequestToCloseMoreItemsModal } = this.props;

    if (onRequestToCloseMoreItemsModal) {
      const shouldClose = onRequestToCloseMoreItemsModal(reason);

      this.setState({ showMore: !shouldClose });
    } else {
      this.setState({ showMore: false });
    }
  };

  onClickOutside = () => {
    if (this.state.showMore) {
      this.onCloseMoreItemsModal('clickOutside');
    }
  };

  toggleMoreItems = () => {
    const { showMore } = this.state;
    if (!showMore === false) {
      this.onCloseMoreItemsModal('toggleButtonClick');
    } else {
      this.setState({ showMore: true });
    }
  };

  render() {
    const { showMore } = this.state;
    const { toolbarItemsRenders, toolbar, isMobile, maxWidth, overflowedItemsPosition } =
      this.props;
    const toolbarItems = toolbar.getToolbarItemsBy(visibleOnlySpec);

    const toolbarButtonArray: ToolbarButton[] = toolbarItems.map(toolbarButton => {
      const toolbarItemRender = toolbarItemsRenders[toolbarButton.id];
      if (!toolbarItemRender) {
        throw `Toolbar: missing toolbar item renderer for '${toolbarButton.id}'`;
      }
      const toolbarItemRenderElement = toolbarItemRender(toolbarButton);
      return new ToolbarButton(toolbarButton, toolbarItemRenderElement);
    });

    const toolbarButtons = new ToolbarButtons(toolbarButtonArray);

    return !isMobile ? (
      // https://github.com/ctrlplusb/react-sizeme#server-side-rendering
      <SizeMe refreshRate={100} noPlaceholder={!!isSSR}>
        {({ size }) => {
          if (!size.width) {
            return <div style={{ width: '100%' }}>.</div>;
          }

          const width = maxWidth || size.width;
          const showMoreAbove = overflowedItemsPosition === 'top';

          return (
            <div dir="ltr" data-hook="toolbar-v3" className={styles.toolbar}>
              <ClickOutside onClickOutside={this.onClickOutside} wrapper="div">
                <SizeCalculator width={width} toolbarButtons={toolbarButtons}>
                  {({ visibleButtons, overflowedButtons }) => {
                    const overflowedButtonsRenders = showMore && overflowedButtons && (
                      <div
                        className={cx(
                          styles.moreItems,
                          overflowedItemsPosition === 'top' ? styles.moreButtonTop : '',
                          { [styles.showMoreAbove]: showMoreAbove }
                        )}
                      >
                        <div className={styles.overflowedItems}>
                          {overflowedButtons.getButtonsElementsWithDataHook()}
                        </div>
                      </div>
                    );
                    return (
                      <div
                        className={styles.toolbarVisible}
                        data-hook="toolbar-v3-visible"
                        onKeyDown={e =>
                          handleCircularFocus({
                            e,
                            firstButtonDataHook: visibleButtons.getFirstButtonDataHook(),
                            lastButtonDataHook: visibleButtons.getLastButtonDataHook(),
                            moreButtonWrapperRef: this.moreButtonWrapperRef.current,
                            isMoreModalOpen: showMore,
                            moreModalLastButtonDataHook: overflowedButtons.getLastButtonDataHook(),
                          })
                        }
                      >
                        {showMoreAbove && overflowedButtonsRenders}
                        {!visibleButtons.isEmpty() && (
                          <div className={styles.visibleItems}>
                            {visibleButtons.getButtonsElementsWithDataHook()}
                            {!overflowedButtons.isEmpty() && (
                              <div ref={this.moreButtonWrapperRef}>
                                <MoreButton
                                  key={'more-button'}
                                  onClick={this.toggleMoreItems}
                                  showMore={showMore}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {!showMoreAbove && overflowedButtonsRenders}
                      </div>
                    );
                  }}
                </SizeCalculator>
              </ClickOutside>
            </div>
          );
        }}
      </SizeMe>
    ) : (
      <div dir="ltr" data-hook="toolbar-v3" className={cx(styles.toolbar, styles.mobileToolbar)}>
        <div className={styles.visibleItems}>{toolbarButtons.getButtonsElementsWithDataHook()}</div>
      </div>
    );
  }
}

export default ToolbarComponent;
