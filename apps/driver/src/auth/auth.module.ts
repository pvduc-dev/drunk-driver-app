import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpLibModule } from '@lib/otp-lib';
import { AuthLibModule } from '@lib/auth-lib';
import { DbLibModule } from '@lib/db-lib';
import { NotifyLibModule } from '@lib/notify-lib';

@Module({
  imports: [OtpLibModule, AuthLibModule, DbLibModule, NotifyLibModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
