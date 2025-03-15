import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { EventTypeEnum } from '../types/events.enums';
import { User } from '@users/entities/user.entity';
import { ValueOf } from '@types';

export interface IEvent {
  title: string;
  description: string;
  location: string;
  maxPeople?: number;
  participants: mongoose.Types.ObjectId[];
  photo?: string;
  date: string;
  type: EventTypeEnum;
}

export type EventPropertyType = keyof IEvent;

export type EventValueType = ValueOf<IEvent>;

@Schema({
  timestamps: true,
})
export class Event extends mongoose.Document implements IEvent {
  @Factory((faker) => faker.name.title())
  @Prop()
  title: string;

  @Factory((faker) => faker.lorem.sentence(20, 500))
  @Prop()
  description: string;

  @Factory((faker) => faker.address.city())
  @Prop()
  location: string;

  @Factory((faker) => faker.random.number(18) + 2)
  @Prop()
  maxPeople?: number;

  @Factory(['60b693d43c3ef374540bf994', '60b693d43c3ef374540bf995'])
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: User.name }] })
  participants: mongoose.Types.ObjectId[];

  @Factory((faker) => faker.image.avatar())
  @Prop()
  photo?: string;

  @Factory((faker) => faker.date.future().toISOString())
  @Prop()
  date: string;

  @Factory((faker) => faker.random.objectElement(EventTypeEnum))
  @Prop()
  type: EventTypeEnum;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
});
