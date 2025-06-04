import { Module } from '@nestjs/common';
import { OtpLibService } from './otp-lib.service';
import { DbLibModule } from '@lib/db-lib';
import { SmsLibModule } from '@lib/sms-lib';

@Module({
  imports: [DbLibModule, SmsLibModule],
  providers: [OtpLibService],
  exports: [OtpLibService],
})
export class OtpLibModule {}
