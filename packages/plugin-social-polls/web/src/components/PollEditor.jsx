import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isPluginFocused } from 'wix-rich-content-editor-common';
import {
  WithEditorEventsProps,
  withEditorEvents,
} from 'wix-rich-content-editor-common/libs/EditorEventsContext';

import { Poll } from './Poll';
import { PollContextProvider } from './poll-context';
import { RCEHelpersContext } from './rce-helpers-context';
import { GlobalContext } from 'wix-rich-content-common';
import { normalizePoll as fixPollServerData } from 'wix-rich-content-common/libs/normalization';

class PollEditorComponent extends PureComponent {
  static propTypes = {
    componentData: PropTypes.shape({
      poll: PropTypes.object,
      pollId: PropTypes.string,
      layout: PropTypes.object,
      design: PropTypes.object,
    }).isRequired,

    block: PropTypes.object,

    selected: PropTypes.bool,
    setInPluginEditingMode: PropTypes.func.isRequired,
    settings: PropTypes.shape({
      siteToken: PropTypes.string,
      isWebView: PropTypes.bool,
      getSiteMembers: PropTypes.func,
    }),
    helpers: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    store: PropTypes.shape({
      set: PropTypes.func.isRequired,
      get: PropTypes.func.isRequired,
    }).isRequired,

    // TODO: should remove when change to proseMirror
    selection: PropTypes.object,

    ...WithEditorEventsProps,
  };

  static contextType = GlobalContext;

  shouldNormalizePoll() {
    const experiments = this.props.experiments || this.context.experiments;
    return experiments?.normalizePoll?.enabled;
  }

  fixPollServerData = poll => {
    if (!this.shouldNormalizePoll()) {
      return poll;
    }
    return fixPollServerData(poll);
  };

  setPoll = poll => {
    const { componentData, store } = this.props;

    store.set(
      'componentData',
      {
        ...componentData,
        poll: this.fixPollServerData(poll),
      },
      this.props.block.getKey()
    );
  };

  // TODO: should remove when change to proseMirror
  draft_isPluginFocused = () => isPluginFocused(this.props.block, this.props.selection);

  render() {
    const {
      setInPluginEditingMode,
      componentData,
      settings,
      helpers,
      t,
      theme,
      isMobile,
      editorEvents,
      selected,
    } = this.props;

    return (
      <RCEHelpersContext.Provider
        value={{
          isViewMode:
            settings.isWebView || typeof selected === 'boolean'
              ? !selected
              : !this.draft_isPluginFocused(),
          setInPluginEditingMode,
          layout: componentData.layout,
          design: componentData.design,
          preventVoting: true,
          isPreview: isMobile,
          helpers,
          theme,
          t,
          isMobile,
          ...settings,
        }}
      >
        <PollContextProvider
          editorEvents={editorEvents}
          settings={settings}
          poll={componentData.poll}
          setPoll={this.setPoll}
          t={t}
        >
          <Poll />
        </PollContextProvider>
      </RCEHelpersContext.Provider>
    );
  }
}

export const PollEditor = withEditorEvents(PollEditorComponent);
