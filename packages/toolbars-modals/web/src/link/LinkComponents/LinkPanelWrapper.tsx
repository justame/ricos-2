import React, { Component } from 'react';
import type { AnchorTarget, RelValue, TranslationFunction } from 'wix-rich-content-common';
import {
  convertRelObjectToString,
  convertRelStringToObject,
  convertTargetStringToBoolean,
  convertTargetBooleanToString,
} from 'wix-rich-content-common';
import LinkPanel from './LinkPanel';
import { merge } from 'lodash';

interface LinkPanelWrapperProps {
  anchorTarget: AnchorTarget;
  relValue: RelValue;
  linkValues: { url?: string; rel?: string; target: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (changes: any) => void;
  t: TranslationFunction;
}

class LinkPanelWrapper extends Component<LinkPanelWrapperProps> {
  onChange = changes => {
    const { linkValues, relValue } = this.props;
    const { targetBlank, nofollow, sponsored, ...rest } = changes;
    const target = convertTargetBooleanToString(targetBlank);
    const relObject = merge(
      convertRelStringToObject(relValue),
      convertRelStringToObject(linkValues.rel),
      {
        nofollow,
        sponsored,
      }
    );
    const rel = convertRelObjectToString(relObject);
    const newLinkValues = { ...linkValues, target, rel, ...rest };
    this.props.onChange(newLinkValues);
  };

  render() {
    const { linkValues, relValue, anchorTarget } = this.props;
    const { rel = relValue, target = anchorTarget, url = '', ...rest } = linkValues;
    const { nofollow, sponsored } = convertRelStringToObject(rel) || {};
    const targetBlank = convertTargetStringToBoolean(target);
    const linkPanelValues = { ...rest, targetBlank, nofollow, sponsored, url };

    return <LinkPanel {...this.props} linkValues={linkPanelValues} onChange={this.onChange} />;
  }
}

export default LinkPanelWrapper;
