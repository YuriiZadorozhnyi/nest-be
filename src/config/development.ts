import * as dotenv from 'dotenv';
dotenv.config();
import { Config, Environment } from './config.interface';

export const developmentConfig: Partial<Config> = {
  environment: Environment.Development,
  dbConnection: process.env.DATABASE_URL,
  mongooseDebug: true,
};
