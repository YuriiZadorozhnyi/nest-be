import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './entities/event.entity';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    forwardRef(() => NewsModule),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [MongooseModule],
})
export class EventsModule {}
