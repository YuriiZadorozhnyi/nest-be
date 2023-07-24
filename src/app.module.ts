import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ENV_CONFIG } from './config/env.config';
import { config } from './config';
const { dbConnection } = config;

import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(ENV_CONFIG),
    MongooseModule.forRoot(dbConnection, {}),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
