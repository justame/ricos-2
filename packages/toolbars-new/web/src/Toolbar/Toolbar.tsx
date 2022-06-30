/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './ToolbarNew.scss';
import toolbarButtonStyles from './ToolbarButtonNew.scss';
import { TOOLBAR_BUTTON_TYPES } from './consts';
import GroupButton from './ButtonComponents/GroupButton';
import DropdownButton from './ButtonComponents/DropdownButton';
import ModalButton from './ButtonComponents/ModalButton';
import ColorPickerButton from './ButtonComponents/ColorPickerButton';
import ToolbarButton from './ToolbarButton';
import ContextMenu from './ButtonComponents/ContextMenu';
import NestedMenu from './ButtonComponents/NestedMenu';
import type {
  RichContentTheme,
  TranslationFunction,
  DesktopTextButtons,
} from 'wix-rich-content-common';
import { ContextMenuIcon } from '../icons';

type formattingToolbarButtonsKeysType =
  | DesktopTextButtons
  | {
      ios: string[];
      android: string[];
    };

interface ToolbarProps {
  isMobile?: boolean;
  tabIndex?: number;
  t: TranslationFunction;
  vertical?: boolean;
  buttons: any;
  setKeepOpen?: (boolean) => void;
  afterClick?: () => void;
  nestedMenu?: boolean;
  theme?: RichContentTheme;
  onToolbarButtonClick?: any;
  getEditorContainer: () => Element;
  disabled?: boolean;
  dataHook?: string;
}

interface State {
  buttons: any;
  overflowCount: number;
}

class Toolbar extends Component<ToolbarProps, State> {
  theme: RichContentTheme;

  toolbarRef!: HTMLElement;

  firstButton!: HTMLElement | null;

  lastButton!: HTMLElement | null;

  constructor(props) {
    super(props);
    const buttonTheme = props.theme?.buttonStyles || {};
    const buttonStyles = {
      inlineToolbarButton_wrapper: buttonTheme.textToolbarButton_wrapper,
      inlineToolbarButton: buttonTheme.textToolbarButton,
      inlineToolbarButton_icon: buttonTheme.textToolbarButton_icon,
    };
    this.theme = { ...props.theme, buttonStyles };
    this.state = { buttons: props.buttons, overflowCount: 0 };
  }

  componentDidUpdate(prevProps) {
    if (this.props.buttons !== prevProps.buttons) {
      const { overflowCount } = this.state;
      const { isMobile, nestedMenu } = this.props;
      let { buttons } = this.props;
      if (!isMobile && this.toolbarRef && !nestedMenu && overflowCount > 0) {
        buttons = this.updateToolbarOverflow();
      }
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ buttons });
    }
  }

  componentDidMount() {
    const { isMobile, nestedMenu } = this.props;
    let { buttons } = this.state;
    if (!isMobile && this.toolbarRef && !nestedMenu) {
      buttons = this.setToolbarOverflow();
    }
    this.setState({ buttons }, this.setFirstAndLastButtons);
  }

  setFirstAndLastButtons = () => {
    const firstChild = this.toolbarRef?.firstChild as HTMLElement;
    this.firstButton = firstChild?.querySelector?.('button');
    const lastChild = this.toolbarRef?.lastChild as HTMLElement;
    this.lastButton = lastChild?.querySelector?.('button');
  };

  updateToolbarOverflow = () => {
    const { buttons } = this.props;
    const { overflowCount } = this.state;
    const newButtons = [...buttons];
    const overflowedButtons = newButtons.splice(-overflowCount);
    newButtons.push({
      name: 'overflow',
      type: TOOLBAR_BUTTON_TYPES.NESTED_MENU,
      getIcon: () => ContextMenuIcon,
      buttonList: overflowedButtons,
    });
    return newButtons;
  };

  setToolbarOverflow = () => {
    const { buttons } = this.props;
    let difference = this.toolbarOverflowWithContainerWidth();
    const newButtons = [...buttons];
    const overflowedButtons: any[] = [];
    if (difference < 0) {
      const buttonsAsElements = this.toolbarRef.children;
      let index = buttonsAsElements.length - 1;
      // eslint-disable-next-line fp/no-loops
      while (difference < 0) {
        const currentOverflowedButton = newButtons.splice(-1);
        overflowedButtons.unshift(...currentOverflowedButton);
        const lastButtonElement = buttonsAsElements[index] as HTMLElement;
        difference += lastButtonElement?.clientWidth + 4;
        index--;
      }
      if (newButtons[newButtons.length - 1].name !== 'Separator') {
        const currentOverflowedButton = newButtons.splice(-1);
        overflowedButtons.unshift(...currentOverflowedButton);
      }
      newButtons.push({
        name: 'overflow',
        type: TOOLBAR_BUTTON_TYPES.NESTED_MENU,
        getIcon: () => ContextMenuIcon,
        buttonList: overflowedButtons,
      });
      this.setState({ overflowCount: overflowedButtons.length });
      return newButtons;
    } else {
      return buttons;
    }
  };

  toolbarOverflowWithContainerWidth = () => {
    const { getEditorContainer } = this.props;
    const editorContainer = getEditorContainer?.();
    const providedStaticToolbarContainer = document.querySelector(
      `[data-hook=provided-container-toolbar]`
    );
    const containerToCheckToolbarOverflow = providedStaticToolbarContainer || editorContainer;
    return containerToCheckToolbarOverflow?.clientWidth - this.toolbarRef?.clientWidth;
  };

  renderButton = buttonProps => {
    const {
      onClick,
      getIcon,
      dataHook,
      isDisabled,
      isActive,
      tooltip,
      name,
      iconInActionColor,
      plugin,
    } = buttonProps;
    return (
      <ToolbarButton
        onClick={onClick}
        isActive={isActive()}
        theme={this.theme}
        dataHook={dataHook}
        isMobile={this.props.isMobile}
        tooltipText={tooltip}
        icon={getIcon()}
        disabled={isDisabled()}
        onToolbarButtonClick={() => this.props.onToolbarButtonClick?.(name, isActive(), plugin)}
        iconInActionColor={iconInActionColor}
      />
    );
  };

  renderSeparator = () => (
    <div
      data-hook="toolbar-separator"
      className={classNames(styles.separator, { [styles.mobileSeparator]: this.props.isMobile })}
    />
  );

  // handleDropDownClick = onClick => () => {
  //   if (this.buttonRef) {
  //     onClick(this.buttonRef);
  //   }
  // };

  renderDropDown = buttonProps => {
    const { isMobile, tabIndex, setKeepOpen } = this.props;
    const dropDownProps = {
      tabIndex,
      isMobile,
      theme: this.theme,
      setKeepOpen,
      ...buttonProps,
    };
    return <DropdownButton {...dropDownProps} />;
  };

  renderButtonGroup = ({ buttonList, tooltip, ...rest }) => {
    const { theme, isMobile, tabIndex } = this.props;
    const dropDownProps = {
      tabIndex,
      isMobile,
      tooltip,
      ...rest,
    };
    return <GroupButton buttons={Object.values(buttonList)} theme={theme} {...dropDownProps} />;
  };

  renderColorPicker = buttonProps => {
    const { t, isMobile, afterClick, nestedMenu, setKeepOpen } = this.props;
    const {
      getCurrentColor,
      onColorAdded,
      onChange,
      settings,
      defaultPalette,
      getUserColors,
      getDefaultColors,
      onResetColor,
      ...rest
    } = buttonProps;
    return (
      <ColorPickerButton
        getCurrentColor={getCurrentColor}
        onColorAdded={onColorAdded}
        onChange={onChange}
        settings={settings}
        t={t}
        isMobile={isMobile}
        nestedMenu={nestedMenu}
        afterClick={afterClick}
        defaultPalette={defaultPalette}
        getUserColors={getUserColors}
        getDefaultColors={getDefaultColors}
        dropDownProps={rest}
        theme={this.theme}
        onResetColor={onResetColor}
        setKeepOpen={setKeepOpen}
        onToolbarButtonClick={() =>
          this.props.onToolbarButtonClick?.(buttonProps.name, undefined, buttonProps.plugin)
        }
      />
    );
  };

  renderTextButton = buttonProps => {
    const { onClick, dataHook, text, tooltip, isDisabled, asLink } = buttonProps;
    return (
      <ToolbarButton
        onClick={onClick}
        theme={this.theme}
        dataHook={dataHook}
        isMobile={this.props.isMobile}
        buttonContent={text}
        tooltipText={tooltip}
        disabled={isDisabled?.()}
        asLink={asLink}
      />
    );
  };

  renderModal = buttonProps => {
    const { theme, isMobile, tabIndex, t, setKeepOpen, getEditorContainer } = this.props;
    const dropDownProps = {
      tabIndex,
      isMobile,
      ...buttonProps,
    };
    return (
      <ModalButton
        theme={theme}
        modal={buttonProps.modal}
        onSelect={buttonProps.onSelect}
        onSave={buttonProps.onSave}
        onDone={buttonProps.onDone}
        dropDownProps={dropDownProps}
        t={t}
        isMobile={isMobile}
        setKeepOpen={setKeepOpen}
        onToolbarButtonClick={value =>
          this.props.onToolbarButtonClick?.(buttonProps.name, value, buttonProps.plugin)
        }
        getEditorContainer={getEditorContainer}
      />
    );
  };

  preventDefault = event => event.preventDefault();

  renderComponent = buttonProps => {
    const { Component } = buttonProps;
    return (
      Component && (
        <div className={toolbarButtonStyles.toolbarButton_wrapper}>
          <button className={toolbarButtonStyles.toolbarButton} onMouseDown={this.preventDefault}>
            <Component />
          </button>
        </div>
      )
    );
  };

  renderNestedMenu = buttonProps => {
    const { isMobile, tabIndex, t, theme, getEditorContainer } = this.props;
    const dropDownProps = {
      tabIndex,
      isMobile,
      t,
      ...buttonProps,
    };
    return (
      <NestedMenu
        dropDownProps={dropDownProps}
        theme={theme}
        getEditorContainer={getEditorContainer}
      />
    );
  };

  renderContextMenu = buttonProps => {
    const { isMobile, tabIndex, t, getEditorContainer } = this.props;
    const dropDownProps = {
      tabIndex,
      isMobile,
      t,
      theme: this.theme,
      ...buttonProps,
    };
    return <ContextMenu {...dropDownProps} getEditorContainer={getEditorContainer} />;
  };

  buttonMap = {
    [TOOLBAR_BUTTON_TYPES.BUTTON]: this.renderButton,
    [TOOLBAR_BUTTON_TYPES.TOGGLE]: this.renderButton,
    [TOOLBAR_BUTTON_TYPES.SEPARATOR]: this.renderSeparator,
    [TOOLBAR_BUTTON_TYPES.DROPDOWN]: this.renderDropDown,
    [TOOLBAR_BUTTON_TYPES.GROUP]: this.renderButtonGroup,
    [TOOLBAR_BUTTON_TYPES.TEXT]: this.renderTextButton,
    [TOOLBAR_BUTTON_TYPES.COLOR_PICKER]: this.renderColorPicker,
    [TOOLBAR_BUTTON_TYPES.MODAL]: this.renderModal,
    [TOOLBAR_BUTTON_TYPES.COMPONENT]: this.renderComponent,
    [TOOLBAR_BUTTON_TYPES.CONTEXT_MENU]: this.renderContextMenu,
    [TOOLBAR_BUTTON_TYPES.NESTED_MENU]: this.renderNestedMenu,
  };

  onKeyDown = e => {
    if (e.shiftKey && e.keyCode === 9) {
      if (document.activeElement === this.firstButton) {
        this.lastButton?.focus();
        e.preventDefault();
      }
    } else if (e.keyCode === 9) {
      if (document.activeElement === this.lastButton) {
        this.firstButton?.focus();
        e.preventDefault();
      }
    }
  };

  setToolbarRef = ref => (this.toolbarRef = ref);

  render() {
    const { vertical, disabled, dataHook } = this.props;
    const { buttons } = this.state;

    // return buttons.map((buttonsWithoutGaps, index) => {
    return (
      <div
        data-hook={dataHook || 'toolbar'}
        onKeyDown={this.onKeyDown}
        ref={this.setToolbarRef}
        className={classNames(styles.toolbar, {
          [styles.vertical]: vertical,
          [styles.disabled]: disabled,
        })}
      >
        {buttons.map((buttonProps, i) => {
          const Button = this.buttonMap[buttonProps.type];
          const isDisabled = disabled ? () => true : buttonProps.isDisabled;
          return <Button {...buttonProps} isDisabled={isDisabled} key={i} />;
        })}
      </div>
    );
    // });
  }
}

export default Toolbar;
