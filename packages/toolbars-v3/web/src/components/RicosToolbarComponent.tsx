import React, { Component } from 'react';
import '../style.scss';
import ToolbarComponent from './Toolbar/Toolbar';
import type { Content } from '../Content';
import { RicosToolbar } from '../RicosToolbar';
import { ToolbarItemCreator } from '../ToolbarItemCreator';
import type { Node } from 'prosemirror-model';
import type { IToolbarItemConfigTiptap, IOnRequestToCloseMoreItemsModal } from 'ricos-types';
import type { OverflowedItemsPosition } from '../types';

interface RicosToolbarProps {
  content: Content<Node[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorCommands: any;
  toolbarItemsConfig: IToolbarItemConfigTiptap[];
  onLoad?: (toolbar: RicosToolbar) => void;
  isMobile: boolean;
  maxWidth?: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  toolbarItemsRenders: Record<string, Function>;
  overflowedItemsPosition?: OverflowedItemsPosition;
  onRequestToCloseMoreItemsModal?: IOnRequestToCloseMoreItemsModal;
}
interface RicosToolbarState {}

class RicosToolbarComponent extends Component<RicosToolbarProps, RicosToolbarState> {
  toolbar: RicosToolbar | null = null;

  createToolbar(toolbarItemsConfig) {
    const { content, editorCommands } = this.props;

    return RicosToolbar.create({
      toolbarItemCreators: toolbarItemsConfig.map(config => ToolbarItemCreator.create(config)),
      content,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editorCommands,
    });
  }

  componentDidMount() {
    const { toolbarItemsConfig, onLoad } = this.props;

    this.toolbar = this.createToolbar(toolbarItemsConfig);

    this.forceUpdate();
    onLoad?.(this.toolbar);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.editorCommands !== this.props.editorCommands) {
      this.toolbar?.setEditorCommands(nextProps.editorCommands);
    }
    if (
      JSON.stringify(nextProps.toolbarItemsConfig) !== JSON.stringify(this.props.toolbarItemsConfig)
    ) {
      this.toolbar = this.createToolbar(nextProps.toolbarItemsConfig);
    }
  }

  render() {
    const {
      isMobile = false,
      maxWidth,
      toolbarItemsRenders,
      overflowedItemsPosition,
      onRequestToCloseMoreItemsModal,
    } = this.props;
    return (
      <div>
        <div>
          {this.toolbar && (
            <ToolbarComponent
              toolbar={this.toolbar}
              toolbarItemsRenders={toolbarItemsRenders}
              isMobile={isMobile}
              maxWidth={maxWidth}
              overflowedItemsPosition={overflowedItemsPosition}
              onRequestToCloseMoreItemsModal={onRequestToCloseMoreItemsModal}
            />
          )}
        </div>
      </div>
    );
  }
}

export default RicosToolbarComponent;
