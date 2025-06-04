export class VerifyOtpRequestDto {
  phone: string;
  otpCode: string;
  verificationId: string;
}

export class VerifyOtpResponseDto {
  phone: string;
  secret: string;
}
