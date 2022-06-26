import type { TopicDescriptor } from 'ricos-types';
import { dbLogger } from './db-event-logger';
import type { RicosEventData } from './event-data';
import type { EventSubscriber } from './ricos-event';

export type SubscriberSyncProcessing = {
  subscriberId: EventSubscriber<RicosEventData>['id'];
  duration: number;
};

type PublishingMetadata = {
  topic: TopicDescriptor;
  eventId: number;
  data: RicosEventData;
  duration: number;
  timestamp: Date;
};

export type AsyncPublishingMetadata = PublishingMetadata & {
  isAsync: true;
};

export type SyncPublishingMetadata = PublishingMetadata & {
  isAsync: false;
  processings: SubscriberSyncProcessing[];
};

export interface EventLogger {
  log: (metadata: AsyncPublishingMetadata | SyncPublishingMetadata) => void;
}

export const getEventLogger = (): EventLogger => {
  if (typeof window === 'undefined') {
    return { log: () => {} };
  }
  if (/eventLogger=db/i.test(window.location.search) && window.indexedDB) {
    const initLogger = dbLogger();
    return {
      log: m => {
        initLogger.then(db => db.log(m));
      },
    };
  } else if (/eventLogger=console/i.test(window.location.search)) {
    return {
      // eslint-disable-next-line no-console
      log: (metadata: SyncPublishingMetadata | AsyncPublishingMetadata) => console.debug(metadata),
    };
  }
  return { log: () => {} };
};
