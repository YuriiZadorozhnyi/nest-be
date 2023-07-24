import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccessTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
