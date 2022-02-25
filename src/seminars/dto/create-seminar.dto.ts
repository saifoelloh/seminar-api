import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateSeminarDto {
  @IsUUID('4')
  @IsOptional()
  readonly id?: string;

  @IsString()
  @Length(3, 25)
  readonly name: string;

  @IsDate()
  readonly date: Date;

  @IsInt()
  readonly quota: number;

  @IsUUID('4')
  readonly userId: string;
}
