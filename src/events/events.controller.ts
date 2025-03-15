import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseListResponseDto } from '@types';
import { EventsService } from './events.service';
import { CreateEventRequestDto } from './dto/request/create-event.request.dto';
import { UpdateEventRequestDto } from './dto/request/update-event.request.dto';
import { EventsListQueryDto } from './dto/request/events-list-query.dto';
import { EventResponseDto } from './dto/response/event-response.dto';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @Body() createEventDto: CreateEventRequestDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(
    @Query() listQuery: EventsListQueryDto,
  ): Promise<BaseListResponseDto<EventResponseDto>> {
    return this.eventsService.findAll(listQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventRequestDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }
}
