import { Module } from '@nestjs/common';
import { OtpsController } from './otps.controller';
import { OtpLibModule } from '@lib/otp-lib';

@Module({
  imports: [OtpLibModule],
  controllers: [OtpsController],
})
export class OtpsModule {}
