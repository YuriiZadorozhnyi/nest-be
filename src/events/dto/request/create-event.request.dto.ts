import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { EventTypeEnum } from '../../types/events.enums';

export class CreateEventRequestDto {
  @MinLength(10, {
    message: (args: ValidationArguments) =>
      `Title is too short. Minimal length is ${args.constraints[0]} characters, but actual is ${args.value?.length}`,
  })
  @MaxLength(200, {
    message: (args: ValidationArguments) =>
      `Title is too long. Maximal length is ${args.constraints[0]} characters, but actual is ${args.value?.length}`,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Length(10, 500)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Length(5, 100)
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @Min(2)
  @Max(20)
  @IsOptional()
  maxPeople?: number;

  @IsString({ each: true })
  @Type(() => String)
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @IsNotEmpty()
  participants: mongoose.Types.ObjectId[];

  @IsOptional()
  @IsString()
  photo?: string;

  @IsISO8601()
  @IsNotEmpty()
  date: string;

  @IsEnum(EventTypeEnum)
  @IsNotEmpty()
  type: EventTypeEnum;
}
