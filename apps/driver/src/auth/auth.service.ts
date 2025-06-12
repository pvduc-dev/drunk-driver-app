import { OtpLibService } from '@lib/otp-lib';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLibService } from '@lib/auth-lib';
import { Driver } from '@lib/db-lib';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginResponseDto } from './dto/login.dto';

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

  async login(phone: string, otpCode: string): Promise<LoginResponseDto> {
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
      user,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return;
  }

  generateToken(sub: string): string {
    return this.authLibService.generateAccessToken({
      sub: sub,
    });
  }

  async getMe(userId: string): Promise<Driver> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy tài khoản');
    }
    return user;
  }
}
