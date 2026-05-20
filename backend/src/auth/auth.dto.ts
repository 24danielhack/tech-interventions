import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsString()
  phone?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  access_token: string;
  refresh_token: string;
  expiresIn: number;
}

export class TokenPayloadDto {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}
