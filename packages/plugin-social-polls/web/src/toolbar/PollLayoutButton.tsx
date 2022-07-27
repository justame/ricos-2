import React, { useContext } from 'react';
import type { FC } from 'react';
import { ModalContext, RicosContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { DropdownButton, ListItemSelect } from 'wix-rich-content-toolbars-ui';
import { LayoutGridIcon, LayoutListIcon } from '../assets/icons';
import styles from '../../statics/styles/customize-toolbar-button.scss';
import { pollModals } from '../consts';
import { TABS } from '../components/settings/constants';

type Props = {
  toolbarItem: IToolbarItem;
  children?: React.ReactElement;
};

const CustomizeButton = ({ onClick, text }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div className={styles.customize_button} role="button" tabIndex={0} onClick={onClick}>
    {text}
  </div>
);

const layoutData = [
  {
    text: 'Poll_PollSettings_Tab_Layout_Section_Answers_Layout_Grid',
    commandKey: 'GRID',
    icon: LayoutGridIcon,
    dataHook: 'poll_grid',
  },
  {
    text: 'Poll_PollSettings_Tab_Layout_Section_Answers_Layout_List',
    commandKey: 'LIST',
    icon: LayoutListIcon,
    dataHook: 'poll_list',
  },
  {
    text: 'Poll_Mobile_Editor_Toolbar_Customize',
    commandKey: 'LAYOUT',
    dataHook: 'poll_layout',
    onClick: (toolbarItem, modalService, isMobile) =>
      modalService?.openModal(pollModals.settings, {
        componentProps: {
          nodeId: toolbarItem.attributes.selectedNode.attrs.id,
          activeTab: TABS.LAYOUT,
        },
        positioning: { placement: 'right' },
        layout: isMobile ? 'fullscreen' : 'drawer',
      }),
    component: CustomizeButton,
  },
];

export const PollLayoutButton: FC<Props> = ({ toolbarItem }) => {
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext) || {};
  const nodeStyle = toolbarItem?.attributes.layout;
  const selectedLayout = (nodeStyle as string) || 'GRID';

  const SelectedLayoutIcon = () => {
    const currentLayoutData = layoutData.find(({ commandKey }) => commandKey === selectedLayout);
    const Icon = currentLayoutData?.icon || LayoutGridIcon;
    const text =
      currentLayoutData?.text || 'Poll_PollSettings_Tab_Layout_Section_Answers_Layout_Grid';
    return (
      <>
        <Icon width={'15px'} />
        <div>{t(text)}</div>
      </>
    );
  };
  return (
    <DropdownButton
      dataHook="baseToolbarButton_layout"
      id="poll_layout"
      options={layoutData.map(
        ({ dataHook, icon: Icon, commandKey, text, onClick, component: Component }) =>
          Component ? (
            <Component
              text={t(text)}
              onClick={() => onClick(toolbarItem, modalService, isMobile)}
            />
          ) : (
            <ListItemSelect
              key={commandKey}
              title={t(text)}
              dataHook={dataHook}
              prefix={<Icon width={'15px'} />}
              selected={commandKey === selectedLayout}
              onClick={() => toolbarItem.commands?.click({ layout: commandKey })}
            />
          )
      )}
      Icon={SelectedLayoutIcon}
      tooltip={t('Poll_PollSettings_Tab_Layout_TabName')}
    />
  );
};
