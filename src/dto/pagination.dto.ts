import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsObject, IsString, Max, Min } from 'class-validator';

enum SortBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto<T> {
  @IsInt()
  @Type(() => Number)
  @Min(5)
  @Max(100)
  show = 5;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  page = 0;

  @IsString()
  orderBy: keyof T | string = 'id';

  @IsEnum(SortBy)
  sortBy: SortBy = SortBy.ASC;
}

export class OptionsDto {
  @IsObject()
  @Type(() => Object)
  where = {};
}
