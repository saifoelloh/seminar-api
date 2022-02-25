import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsUUID('4')
  @IsOptional()
  readonly id?: string;

  @IsString()
  @Length(3, 30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @Length(5, 25)
  readonly email: string;

  @IsString()
  readonly password: string;
}
