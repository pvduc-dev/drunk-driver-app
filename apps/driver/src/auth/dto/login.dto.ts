export class LoginRequestDto {
  phone: string;
  otpCode: string;
}

export class LoginResponseDto {
  token: string;
  id: string;
}
