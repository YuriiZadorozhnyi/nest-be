import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UsersListQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Search query',
    required: false,
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiProperty({
    description: 'Page number',
    required: false,
  })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiProperty({
    description: 'Page size',
    required: false,
  })
  pageSize?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sort descriptor',
    required: false,
  })
  sort?: string;
}
