import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseListResponseDto } from '@types';
import {
  getSortDescriptors,
  partialTextSearch,
  transformAndValidate,
} from '@utils';
import { Event } from './entities/event.entity';
import {
  EVENTS_DEFAULT_PAGE,
  EVENTS_DEFAULT_PAGE_SIZE,
  EVENTS_SEARCH_FIELDS,
} from './events.constants';
import { CreateEventRequestDto } from './dto/request/create-event.request.dto';
import { UpdateEventRequestDto } from './dto/request/update-event.request.dto';
import { EventResponseDto } from './dto/response/event-response.dto';
import { EventsListQueryDto } from './dto/request/events-list-query.dto';
import { NewsService } from '../news/news.service';
import { NewsTypeEnum } from '../news/types/news.enums';

@Injectable()
export class EventsService {
  constructor(
    @Inject(forwardRef(() => NewsService))
    private readonly newsService: NewsService,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async create(
    createEventDto: CreateEventRequestDto,
  ): Promise<EventResponseDto> {
    const event = new this.eventModel(createEventDto);
    const eventCreated = await event.save();

    await this.newsService.createNews(
      eventCreated._id,
      NewsTypeEnum.Created,
      createEventDto,
    );

    return transformAndValidate(EventResponseDto, eventCreated);
  }

  async findAll(
    listQuery: EventsListQueryDto,
  ): Promise<BaseListResponseDto<EventResponseDto>> {
    const {
      search,
      page = EVENTS_DEFAULT_PAGE,
      pageSize = EVENTS_DEFAULT_PAGE_SIZE,
      sort,
    } = listQuery;

    const [total, events] = await Promise.all([
      this.eventModel.countDocuments(),
      this.eventModel
        .find(partialTextSearch(EVENTS_SEARCH_FIELDS, search))
        .sort(sort && getSortDescriptors(sort))
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
    ]);

    const response: BaseListResponseDto<EventResponseDto> = {
      items: await transformAndValidate(EventResponseDto, events),
      total: total,
    };

    return response;
  }

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.eventModel.findOne({ _id: id }).exec();
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return transformAndValidate(EventResponseDto, event);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventRequestDto,
  ): Promise<EventResponseDto> {
    const existingEvent = await this.eventModel
      .findOneAndUpdate({ _id: id }, { $set: updateEventDto }, { new: true })
      .exec();

    if (!existingEvent) {
      throw new NotFoundException(`Event #${id} not found`);
    }

    await this.newsService.createNews(id, NewsTypeEnum.Updated, updateEventDto);

    return transformAndValidate(EventResponseDto, existingEvent);
  }

  async remove(id: string): Promise<void> {
    await this.eventModel.deleteOne({ _id: id });
  }
}
