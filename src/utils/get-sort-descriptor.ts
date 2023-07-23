import { SortDescriptor } from '../users/types/users.enums';
import { BadRequestException } from '@nestjs/common';
import { isEnumValue } from './is-enum-value';
import { SortOrder } from 'mongoose';

const validateSortDescriptor = (descriptor: unknown): void | never => {
  if (descriptor && !isEnumValue(SortDescriptor)(descriptor)) {
    throw new BadRequestException(
      `Sort descriptor '${descriptor}' is not valid, it should be 'asc' or 'desc'`,
    );
  }
};

export function getSortDescriptors(sortQuery: string): [string, SortOrder][] {
  const sortDescriptor = (sortQuery || '')
    .split(',')
    .map((s: string): [string, SortOrder] => {
      const [fieldName, sortDescriptor] = s.split(':');
      validateSortDescriptor(sortDescriptor);
      return [fieldName, sortDescriptor === SortDescriptor.DESC ? -1 : 1];
    });
  return sortDescriptor;
}
