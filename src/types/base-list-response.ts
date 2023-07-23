export interface SortDescriptionResponseDto {
  fieldName: string;
  desc: boolean;
}

export interface BaseListResponseDto<T> {
  sort?: SortDescriptionResponseDto[];
  limit?: number;
  skip?: number;
  total?: number;
  items: Array<T>;
}
