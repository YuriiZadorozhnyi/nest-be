import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EventsListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
