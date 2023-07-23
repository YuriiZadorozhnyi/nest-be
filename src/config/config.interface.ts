import { ValidationPipeOptions } from '@nestjs/common';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export interface Config {
  app: {
    name: string;
    description: string;
    version: string;
  };
  port: number;
  environment: Environment;
  validation: ValidationPipeOptions;
  dbConnection: string;
  jwtSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  mongooseDebug: boolean;
}
