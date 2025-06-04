import { OtpLibService } from '@lib/otp-lib';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLibService } from '@lib/auth-lib';
import { Driver } from '@lib/db-lib';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DriverDto } from './dto/driver.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpLibService: OtpLibService,
    private readonly authLibService: AuthLibService,
    @InjectModel(Driver.name) private readonly userModel: Model<Driver>,
  ) {}

  async generateOtp(phone: string): Promise<any> {
    await this.otpLibService.generate(phone);
    return {
      phone,
    };
  }

  async login(phone: string, otpCode: string): Promise<any> {
    const otp = await this.otpLibService.validate(phone, otpCode);
    if (!otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    const user = await this.userModel.findOneAndUpdate(
      { phone },
      { $setOnInsert: { phone } },
      { new: true, upsert: true },
    );
    return {
      token: this.generateToken(user.id as string),
      id: user.id,
    };
  }

  async logout(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return;
  }

  generateToken(sub: string): string {
    return this.authLibService.generateAccessToken({
      sub: sub,
    });
  }

  async getMe(userId: string): Promise<DriverDto> {
    const user = await this.userModel.findById(userId);
    return {
      id: user!.id,
      phone: user!.phone,
    };
  }
}
