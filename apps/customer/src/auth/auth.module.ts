import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLibModule } from '@lib/auth-lib';
import { DbLibModule } from '@lib/db-lib';
import { OtpLibModule } from '@lib/otp-lib';
import { NotifyLibModule } from '@lib/notify-lib';

@Module({
  imports: [DbLibModule, AuthLibModule, OtpLibModule, NotifyLibModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
