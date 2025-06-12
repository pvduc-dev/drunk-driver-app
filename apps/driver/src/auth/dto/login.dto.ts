import { Driver } from '@lib/db-lib';

export class LoginRequestDto {
  phone: string;
  otpCode: string;
}

export class LoginResponseDto {
  token: string;
  user: Driver;
}
