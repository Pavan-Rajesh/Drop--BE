// src/user/dto/create-user.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;
}
