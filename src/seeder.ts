import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { config } from './config';

import { User, UserSchema } from './users/entities/user.entity';
import { UsersSeeder } from './seeders/users.seeder';

const { dbConnection } = config;

seeder({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      dbConnection.replace(/mongodb:\/\/mongodb:/, 'mongodb://localhost:'),
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run([UsersSeeder]);
