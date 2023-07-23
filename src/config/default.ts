import * as dotenv from 'dotenv';
dotenv.config();
import { readFileSync } from 'fs';
import { startCase } from 'lodash';

import { Config } from './config.interface';

const { name, description, version } = JSON.parse(
  readFileSync('package.json', { encoding: 'utf-8' }),
);
const appNameStartCase = startCase(name);

export const baseConfig: Partial<Config> = {
  app: {
    name: appNameStartCase,
    description,
    version,
  },
  port: 3000,
  validation: {
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  },
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
};
