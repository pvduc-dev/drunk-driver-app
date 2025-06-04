export class GenerateOtpRequestDto {
  phone: string;
}

export class GenerateOtpResponseDto {
  verificationId: string;
  expirationTime: Date;
}
