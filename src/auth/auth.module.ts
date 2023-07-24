import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { config } from '../config';
import { UsersModule } from '@users/users.module';
import { AuthGuard } from './guard/auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';

const { jwtSecret } = config;

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
