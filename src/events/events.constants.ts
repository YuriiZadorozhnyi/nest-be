import { EventResponseDto } from './dto/response/event-response.dto';

export const EVENTS_DEFAULT_PAGE = 1;
export const EVENTS_DEFAULT_PAGE_SIZE = 10;

type EventsSearchFieldsType = Partial<keyof EventResponseDto>[];

export const EVENTS_SEARCH_FIELDS: EventsSearchFieldsType = [
  'title',
  'description',
  'location',
];
