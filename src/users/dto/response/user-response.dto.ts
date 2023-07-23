import {
  IsISO8601,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsOptional()
  @IsString()
  @Expose()
  surname?: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsOptional()
  @IsString()
  @Expose()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsISO8601()
  @IsNotEmpty()
  @Expose()
  @Transform(({ value }) => value?.toISOString() ?? value)
  createdAt: string;

  @IsISO8601()
  @IsNotEmpty()
  @Expose()
  @Transform(({ value }) => value?.toISOString() ?? value)
  updatedAt: string;
}
