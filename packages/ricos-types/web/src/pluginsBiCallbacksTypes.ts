import type { BICallbackParams } from './biCallbacksTypes';
import type {
  TableEventsName,
  TableBiCallbacksParams,
  TableEventsParamsMappers,
} from './tableBiCallbacksTypes';
import type { AddLinkData } from './commonTypes';

export type GenericEventsName = 'addPluginLink';
export type EventName = TableEventsName | GenericEventsName;
export type PluginEventParams = TableBiCallbacksParams;

export interface PluginsActionGenericParams extends BICallbackParams {
  plugin_id: string;
}
export interface AddPluginLinkParams extends PluginsActionGenericParams {
  params: {
    category: string;
    link?: string;
    nofollow?: boolean;
    newTab?: boolean;
    anchor?: string;
  };
}

export interface SearchInsidePluginParams extends PluginsActionGenericParams {
  searchTerm: string;
}

export interface GenericParamsMappers {
  addPluginLink: AddPluginLinkParams;
  searchInsideThePlugin: SearchInsidePluginParams;
}

interface EventsParamsMappers extends TableEventsParamsMappers, GenericParamsMappers {}

export type OnPluginAction = <K extends keyof EventsParamsMappers>(
  eventName: K,
  params: EventsParamsMappers[K]
) => void;

export type OnAddPluginLink = (
  data: AddLinkData,
  triggeredBy: 'TEXT' | 'IMAGE' | 'UNSUPPORTED'
) => void;
