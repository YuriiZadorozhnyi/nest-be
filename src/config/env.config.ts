import * as Joi from 'joi';

export const ENV_CONFIG = {
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production'),
    DATABASE_URL: Joi.string(),
    DATABASE_URL_PROD: Joi.string(),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  }),
};
