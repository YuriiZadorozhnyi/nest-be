import { IsNotEmpty, IsString } from 'class-validator';

export class GetAccessTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
