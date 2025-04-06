import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { CreateNewsRequestDto } from './dto/request/create-news-request.dto';
import { NewsTypeEnum } from './types/news.enums';
import { NotFoundException } from '@nestjs/common';

describe('NewsService', () => {
  let service: NewsService;
  let model: Model<News>;

  const mockNews = {
    _id: 'test-id',
    id: 'test-id',
    eventId: 'event-id',
    type: NewsTypeEnum.Created,
    property: 'title' as const,
    value: 'Test Value',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  class MockNewsModel {
    constructor(data: any) {
      return {
        ...mockNews,
        ...data,
        save: jest.fn().mockResolvedValue(mockNews),
      };
    }
    static find = jest.fn();
    static findOne = jest.fn();
    static countDocuments = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getModelToken(News.name),
          useValue: MockNewsModel,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    model = module.get<Model<News>>(getModelToken(News.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a news item', async () => {
      const createNewsDto: CreateNewsRequestDto = {
        eventId: 'event-id',
        type: NewsTypeEnum.Created,
        property: 'title',
        value: 'Test Value',
      };

      const result = await service.create(createNewsDto);

      expect(result).toEqual(
        expect.objectContaining({
          eventId: createNewsDto.eventId,
          type: createNewsDto.type,
          property: createNewsDto.property,
          value: createNewsDto.value,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of news with pagination', async () => {
      const mockNewsList = [mockNews];
      const mockCount = 1;

      jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(mockCount);
      jest.spyOn(model, 'find').mockReturnValue({
        sort: () => ({
          skip: () => ({
            limit: () => ({
              exec: () => Promise.resolve(mockNewsList),
            }),
          }),
        }),
      } as any);

      const result = await service.findAll({
        page: 1,
        pageSize: 10,
      });

      expect(result.total).toBe(mockCount);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(
        expect.objectContaining({
          eventId: mockNews.eventId,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single news item', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: () => Promise.resolve(mockNews),
      } as any);

      const result = await service.findOne('test-id');

      expect(result).toEqual(
        expect.objectContaining({
          eventId: mockNews.eventId,
        }),
      );
    });

    it('should throw NotFoundException when news not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: () => Promise.resolve(null),
      } as any);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createNews', () => {
    it('should create multiple news items from event update', async () => {
      const createSpy = jest.spyOn(service, 'create').mockResolvedValue({
        id: 'test-id',
        ...mockNews,
      });

      const updateEventDto = {
        title: 'New Title',
        description: 'New Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await service.createNews(
        'event-id',
        NewsTypeEnum.Updated,
        updateEventDto,
      );

      // Should create news for title and description, but not for createdAt and updatedAt
      expect(createSpy).toHaveBeenCalledTimes(2);
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'event-id',
          type: NewsTypeEnum.Updated,
        }),
      );
    });
  });
});
