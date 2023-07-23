import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import { ValidatorOptions, validate as validateFunc } from 'class-validator';
import { BadRequestException, ValidationError } from '@nestjs/common';

/**
 * Get validation error message from nestjs ValidationError
 *
 * @param {(ValidationError | string)[]} validationErrors The nestjs ValidationErrors array
 * @returns {(string | null)}
 */
export function getValidationErrorMessage(
  validationErrors: (ValidationError | string)[],
): string {
  if (!validationErrors || !validationErrors.length) return '';
  if (typeof validationErrors[0] === 'string') {
    return validationErrors.join(', ');
  }

  const errorMessages: string[] = (
    validationErrors as ValidationError[]
  ).flatMap((e: ValidationError) => mapToStringErrors(e));
  return errorMessages.join(', ');
}

function mapToStringErrors(
  error: ValidationError,
  encomasingsPath = '',
): string[] {
  const thisPath = `${encomasingsPath}.${error.property}`;
  const childErrors = error.children.flatMap((c: ValidationError) =>
    mapToStringErrors(c, thisPath),
  );
  const localErrors = validationErrorToStrings(error, encomasingsPath);
  return [...localErrors, ...childErrors];
}

function validationErrorToStrings(
  error: ValidationError,
  encomasingsPath: string,
): string[] {
  return Object.values(error.constraints).map(
    (emsg: string) =>
      `${
        !encomasingsPath || encomasingsPath === '' ? '' : encomasingsPath + '.'
      }${error.property}: ${emsg}`,
  );
}

export interface TransformAndValidationOptions {
  transformOptions: ClassTransformOptions;
  validatorOptions: ValidatorOptions;
  errorFactory: (err: string) => Error;
}

const defaultOptions: TransformAndValidationOptions = {
  validatorOptions: {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: { target: false },
  },
  transformOptions: {
    excludeExtraneousValues: true,
  },
  errorFactory: (errs) => new BadRequestException(errs),
};

export function transform<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
  options: ClassTransformOptions,
): T[];
export function transform<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options: ClassTransformOptions,
): T;
export function transform<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options: ClassTransformOptions = {},
): T {
  const mergedConfig = { ...defaultOptions.transformOptions, ...options };
  return plainToClass(cls, plain, mergedConfig);
}

export async function validate<T extends []>(
  instance: T[],
  options: ValidatorOptions,
): Promise<ValidationError[]>;
export async function validate<T extends Record<string, any>>(
  instance: T,
  options: ValidatorOptions,
): Promise<ValidationError[]>;
export async function validate<T extends Record<string, any>>(
  instance: T | T[],
  options: ValidatorOptions = {},
): Promise<ValidationError[]> {
  const mergedConfig = { ...defaultOptions.validatorOptions, ...options };
  if (Array.isArray(instance)) {
    return (
      await Promise.all(instance.map((el) => validateFunc(el, mergedConfig)))
    ).flat();
  }
  return await validateFunc(instance, mergedConfig);
}

export async function transformAndValidate<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
  options?: Partial<TransformAndValidationOptions>,
): Promise<T[]>;
export async function transformAndValidate<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: Partial<TransformAndValidationOptions>,
): Promise<T>;
export async function transformAndValidate<T, V>(
  cls: ClassConstructor<T>,
  plain: V | V[],
  options: Partial<TransformAndValidationOptions> = {},
): Promise<T | T[]> {
  const mergedConfig = { ...defaultOptions, ...options };
  const instance: T | T[] = transform(
    cls,
    plain,
    mergedConfig.transformOptions,
  );
  const errs = await validate(instance, mergedConfig.validatorOptions);
  if (errs.length > 0) {
    throw mergedConfig.errorFactory(getValidationErrorMessage(errs));
  }

  return instance;
}
