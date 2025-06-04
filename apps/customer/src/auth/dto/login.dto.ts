export class LoginRequestDto {
  phone: string;

  otpSecret: string;
}

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;
}
