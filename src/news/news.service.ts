import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseListResponseDto } from '@types';
import { getSortDescriptors, transformAndValidate } from '@utils';
import { CreateNewsRequestDto } from './dto/request/create-news-request.dto';
import { NewsResponseDto } from './dto/response/news-response.dto';
import { News } from './entities/news.entity';
import { NewsTypeEnum } from './types/news.enums';
import { UpdateEventRequestDto } from '../events/dto/request/update-event.request.dto';
import { NewsListQueryDto } from './dto/request/news-list-query.dto';
import { NEWS_DEFAULT_PAGE, NEWS_DEFAULT_PAGE_SIZE } from './news.constants';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
  ) {}

  async create(createNewsDto: CreateNewsRequestDto): Promise<NewsResponseDto> {
    const news = new this.newsModel(createNewsDto);
    const newsCreated = await news.save();
    return transformAndValidate(NewsResponseDto, newsCreated);
  }

  async findAll(
    listQuery: NewsListQueryDto,
  ): Promise<BaseListResponseDto<NewsResponseDto>> {
    const {
      eventId,
      page = NEWS_DEFAULT_PAGE,
      pageSize = NEWS_DEFAULT_PAGE_SIZE,
      sort,
    } = listQuery;

    const [total, news] = await Promise.all([
      this.newsModel.countDocuments(),
      this.newsModel
        .find(eventId ? { eventId: eventId } : {})
        .sort(sort && getSortDescriptors(sort))
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
    ]);

    const response: BaseListResponseDto<NewsResponseDto> = {
      items: await transformAndValidate(NewsResponseDto, news),
      total: total,
    };

    return response;
  }

  async findOne(id: string): Promise<NewsResponseDto> {
    const news = await this.newsModel.findOne({ _id: id }).exec();
    if (!news) {
      throw new NotFoundException(`News with event id ${id} not found`);
    }
    return transformAndValidate(NewsResponseDto, news);
  }

  async createNews(
    eventId: string,
    type: NewsTypeEnum,
    updateEventDto: UpdateEventRequestDto,
  ): Promise<void> {
    const newsPayload: CreateNewsRequestDto[] = Object.entries(updateEventDto)
      .filter(([key, _]) => !['createdAt', 'updatedAt'].includes(key))
      .map(([key, value]: [string, any]) => ({
        eventId,
        type,
        property: key,
        value: value,
      }));

    await Promise.all(
      newsPayload.map((pl: CreateNewsRequestDto) => this.create(pl)),
    );
  }
}
