import * as dotenv from 'dotenv';
dotenv.config();
import { Config, Environment } from './config.interface';

export const productionConfig: Partial<Config> = {
  environment: Environment.Production,
  dbConnection: process.env.DATABASE_URL_PROD,
  mongooseDebug: false,
};
