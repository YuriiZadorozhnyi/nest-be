import { merge } from 'lodash';
import { Config, Environment } from './config.interface';
import { baseConfig } from './default';
import { developmentConfig } from './development';
import { productionConfig } from './production';

const environmentConfig: Record<Environment, Partial<Config>> = {
  development: developmentConfig,
  production: productionConfig,
};

export const config: Config = merge(
  baseConfig,
  environmentConfig[process.env.NODE_ENV || Environment.Development],
);
