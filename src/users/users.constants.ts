import { UserResponseDto } from '@users/dto/response';

type UserSearchFieldsType = Partial<keyof UserResponseDto>[];

export const USERS_DEFAULT_PAGE_SIZE = 10;
export const USERS_DEFAULT_PAGE = 1;
export const USERS_SEARCH_FIELDS: UserSearchFieldsType = [
  'name',
  'surname',
  'email',
  'description',
];
