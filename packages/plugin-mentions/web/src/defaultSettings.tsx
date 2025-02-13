import React from 'react';
import type { Mention } from './createMentionsPlugin';

export const DEFAULT_SETTINGS = {
  mentionPrefix: '@',
  mentionTrigger: '@',
  getMentionLink: () => '#',
  repositionSuggestions: true,
  entryHeight: 34,
  additionalHeight: 17,

  visibleItemsBeforeOverflow: 5,
  popoverComponent: <div />,
  onMentionClick: (mention: Mention) => mention,
  getMentions: (searchQuery: string) =>
    new Promise<Mention[]>(resolve =>
      setTimeout(
        () =>
          resolve(
            [
              { name: 'Test One', slug: 'testone' },
              { name: 'Test One.1', slug: 'testone1' },
              { name: 'Test One.2', slug: 'testone2' },
              { name: 'Test One.3', slug: 'testone3' },
              { name: 'Test One.4', slug: 'testone4' },
              { name: 'Test One.5', slug: 'testone5' },
              { name: 'Test One.6', slug: 'testone6' },
              { name: 'Test One.7', slug: 'testone7' },
              { name: 'Test One.8', slug: 'testone8' },
              {
                name: 'Test Two',
                slug: 'testwo',
                avatar: 'https://via.placeholder.com/100x100?text=Image=50',
              },
            ].filter(({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        250
      )
    ),
};

export const DEFAULTS = {
  config: { ...DEFAULT_SETTINGS },
};
