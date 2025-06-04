import { Controller } from '@nestjs/common';
import { OtpLibService } from '@lib/otp-lib';

@Controller('otps')
export class OtpsController {
  constructor(private readonly otpLibService: OtpLibService) {}
}
