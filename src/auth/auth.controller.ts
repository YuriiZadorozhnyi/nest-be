import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LoginRequestDto } from './dto/request/login-request.dto';
import { GetAccessTokenRequestDto } from './dto/request/get-access-token-request.dto';
import { DeleteAccessTokenRequestDto } from './dto/request/delete-access-token-request.dto';
import { AuthService } from './service/auth.service';
import { LoginResponseDto } from './dto/response/login-response.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(login);
  }

  @Put('token')
  @HttpCode(HttpStatus.OK)
  async getAccessToken(
    @Body() token: GetAccessTokenRequestDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.getAccessToken(token.refreshToken);
  }

  @Delete('token')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteToken(@Body() token: DeleteAccessTokenRequestDto): Promise<void> {
    return this.authService.deleteToken(token.refreshToken);
  }
}
