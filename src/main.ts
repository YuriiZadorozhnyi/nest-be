import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const {
    port,
    validation,
    app: { name, description, version },
    mongooseDebug,
  } = config;

  mongoose.set('debug', mongooseDebug);

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useGlobalPipes(new ValidationPipe(validation));

  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  Logger.log(
    `Server started, port ${port}, swagger: http://localhost:${port}/api`,
  );
}
bootstrap();
