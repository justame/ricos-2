import { LayoutGridIcon, LayoutListIcon } from '../assets/icons';
import CustomizeButton from './CustomizeButton';

export const layoutData = [
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
    component: CustomizeButton,
  },
];
