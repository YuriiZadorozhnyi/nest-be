import { IsEnum, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

import { NewsTypeEnum } from '../../types/news.enums';
import {
  EventPropertyType,
  EventValueType,
} from '../../../events/entities/event.entity';

export class NewsResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @Expose()
  eventId: string;

  @IsEnum(NewsTypeEnum)
  @IsNotEmpty()
  @Expose()
  type: NewsTypeEnum;

  @IsString()
  @IsNotEmpty()
  @Expose()
  property: EventPropertyType;

  @IsNotEmpty()
  @Expose()
  value: EventValueType;

  @IsISO8601()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toISOString() ?? value)
  @Expose()
  createdAt: Date;

  @IsISO8601()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toISOString() ?? value)
  @Expose()
  updatedAt: Date;
}
