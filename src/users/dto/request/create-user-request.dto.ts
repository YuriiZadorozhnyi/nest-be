import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User name',
    default: 'John',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User surname',
    default: 'Doe',
    required: false,
  })
  surname?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    default: 'password',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    default: 'user@email.com',
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User image url',
    default: 'https://example.com/image.png',
    required: false,
  })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User description',
    default: 'User description',
    required: false,
  })
  description?: string;
}
