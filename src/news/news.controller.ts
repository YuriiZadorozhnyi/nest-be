import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseListResponseDto } from '@types';
import { NewsService } from './news.service';
import { CreateNewsRequestDto } from './dto/request/create-news-request.dto';
import { NewsResponseDto } from './dto/response/news-response.dto';
import { NewsListQueryDto } from './dto/request/news-list-query.dto';

@ApiBearerAuth()
@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(
    @Body() createNewsDto: CreateNewsRequestDto,
  ): Promise<NewsResponseDto> {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  findAll(
    @Query() listQuery: NewsListQueryDto,
  ): Promise<BaseListResponseDto<NewsResponseDto>> {
    return this.newsService.findAll(listQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<NewsResponseDto> {
    return this.newsService.findOne(id);
  }
}
