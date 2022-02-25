import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsUUID('4')
  @IsOptional()
  readonly id?: string;

  @IsString()
  @Length(6, 15)
  readonly name: string;

  @IsString()
  @IsEmail()
  @Length(8, 20)
  readonly email: string;

  @IsString()
  readonly password: string;
}
