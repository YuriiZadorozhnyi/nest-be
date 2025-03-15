import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { NewsTypeEnum } from '../../types/news.enums';

export class CreateNewsRequestDto {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  eventId: string;

  @IsEnum(NewsTypeEnum)
  @IsNotEmpty()
  type: NewsTypeEnum;

  @IsString()
  @IsNotEmpty()
  property: string;

  @IsNotEmpty()
  value: any;
}
