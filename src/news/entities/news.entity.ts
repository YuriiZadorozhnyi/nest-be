import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { Event } from '../../events/entities/event.entity';
import { NewsTypeEnum } from '../types/news.enums';

@Schema({
  timestamps: true,
})
export class News extends mongoose.Document {
  @Factory((faker) =>
    faker.random.arrayElement([
      '60b693d43c3ef374540bf994',
      '60de226454504d13e845d06c',
    ]),
  )
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    required: true,
  })
  eventId: mongoose.Types.ObjectId;

  @Factory((faker) => faker.random.objectElement(NewsTypeEnum))
  @Prop()
  type: NewsTypeEnum;

  @Factory((faker) =>
    faker.random.arrayElement(['title', 'description', 'location']),
  )
  @Prop()
  property: string;

  @Factory((faker) => faker.lorem.word(10) + faker.lorem.sentence(11, 90))
  @Prop()
  value: mongoose.Schema.Types.Mixed;
}

export const NewsSchema = SchemaFactory.createForClass(News);
