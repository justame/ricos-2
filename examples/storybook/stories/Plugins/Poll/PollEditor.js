import React from 'react';
import { RicosEditor } from 'ricos-editor';
import { pluginPoll } from 'wix-rich-content-plugin-social-polls';
import { pluginLink } from 'wix-rich-content-plugin-link';
import PropTypes from 'prop-types';

const PollEditor = ({ content }) => (
  <RicosEditor plugins={[pluginPoll(), pluginLink()]} content={content} />
);

PollEditor.propTypes = {
  content: PropTypes.object,
};

export default PollEditor;
