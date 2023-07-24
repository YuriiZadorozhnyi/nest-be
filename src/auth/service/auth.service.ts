import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { config } from '@config';
import { RequestExtended } from '@types';
import { User } from '@users/entities/user.entity';
import { JwtPayload } from '../dto/jwt-payload';
import { LoginRequestDto } from '../dto/request/login-request.dto';
import { LoginResponseDto } from '../dto/response/login-response.dto';

const { jwtSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = config;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password: loginPassword } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with ${email} email not found!`);
    }

    const match = await bcrypt.compare(loginPassword, user.password);
    if (!match) {
      throw new UnauthorizedException(`Invalid credentials!`);
    }

    const payload: JwtPayload = { id: user.id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: accessTokenExpiresIn }),
      this.jwtService.signAsync(payload, { expiresIn: refreshTokenExpiresIn }),
    ]);

    await this.userModel.updateOne(
      { _id: user.id },
      { refreshToken: refreshToken },
    );

    return { accessToken, refreshToken };
  }

  async getAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    let jwtData: JwtPayload;

    try {
      jwtData = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtSecret,
      });
    } catch (e) {
      throw new ForbiddenException(e);
    }

    const accessToken = await this.jwtService.signAsync(
      { id: jwtData.id },
      { expiresIn: accessTokenExpiresIn },
    );

    return { accessToken };
  }

  async deleteToken(refreshToken: string): Promise<void> {
    await this.userModel
      .findOneAndUpdate({ refreshToken }, { $set: { refreshToken: null } })
      .exec();
  }

  async validateRequest(request: RequestExtended): Promise<boolean> {
    if (this.isCreateUserRequest(request) || this.isLoginRequest(request)) {
      return true;
    }

    let jwtData: JwtPayload;
    const token = request?.headers?.authorization?.split(' ')?.[1];
    if (!token) {
      throw new BadRequestException(`Authorization token is not provided!`);
    }

    try {
      jwtData = await this.jwtService.verifyAsync(token, { secret: jwtSecret });
    } catch (e) {
      throw new ForbiddenException(e);
    }

    const user = await this.userModel
      .findOne({ _id: jwtData.id })
      .select('refreshToken')
      .lean();

    if (!user?.refreshToken) {
      throw new ForbiddenException('You need to login first!');
    }

    request.user = jwtData;
    return true;
  }

  private isCreateUserRequest(request: Request): boolean {
    const { originalUrl, method } = request;
    return originalUrl === '/users' && method === 'POST';
  }

  private isLoginRequest(request: Request): boolean {
    const { originalUrl, method } = request;
    return originalUrl === '/auth/login' && method === 'POST';
  }
}
