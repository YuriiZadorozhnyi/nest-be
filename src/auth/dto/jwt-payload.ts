import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class JwtPayload {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;
}
