import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsISO8601,
  IsMongoId,
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
import { Expose, Transform, Type } from 'class-transformer';
import { EventTypeEnum } from '../../types/events.enums';

export class EventResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @MinLength(10, {
    message: (args: ValidationArguments) =>
      `Title is too short. Minimal length is ${args.constraints[0]} characters, but actual is ${args.value.length}`,
  })
  @MaxLength(200, {
    message: (args: ValidationArguments) =>
      `Title is too long. Maximal length is ${args.constraints[0]} characters, but actual is ${args.value.length}`,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @Length(10, 500)
  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

  @Length(5, 100)
  @IsString()
  @IsNotEmpty()
  @Expose()
  location: string;

  @IsInt()
  @Min(2)
  @Max(20)
  @IsOptional()
  @Expose()
  maxPeople?: number;

  @IsString({ each: true })
  @IsMongoId({ each: true })
  @Type(() => String)
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @Expose()
  participants: string[];

  @IsOptional()
  @IsString()
  @Expose()
  photo?: string;

  @IsISO8601()
  @IsNotEmpty()
  @Expose()
  date: string;

  @IsEnum(EventTypeEnum)
  @Expose()
  type: EventTypeEnum;

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
