import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { Seeder, DataFactory } from 'nestjs-seeder';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    // Generate 5 users.
    const users = DataFactory.createForClass(User).generate(5);

    // Insert into the database.
    // TODO: remove as any
    // after issue will be fixed - https://github.com/edwardanthony/nestjs-seeder/issues/12
    return this.userModel.insertMany(users as any);
  }

  async drop(): Promise<any> {
    return this.userModel.deleteMany({});
  }
}
